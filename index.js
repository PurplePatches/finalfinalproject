const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const compression = require("compression");
const db = require("./utils/db");
const bodyParser = require("body-parser");
const csurf = require("csurf");
const bc = require("./utils/bcrypt");
const uidSafe = require("uid-safe");
const multer = require("multer");
const path = require("path");
const config = require("./config.json");
const s3 = require("./s3");
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: "It's social network time!",
    maxAge: 1000 * 60 * 60 * 24 * 7 * 14
});

app.use(compression());
app.use(express.static("./public"));
app.use(cookieSessionMiddleware);
app.use(bodyParser.json());
app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
//
app.post("/registration", (req, res) => {
    bc.hashPassword(req.body.password).then(hash => {
        // console.log("show me req.body: ", req.body);
        return db
            .register(
                // req.body.id,
                req.body.first_name,
                req.body.last_name,
                req.body.email,
                req.body.code,
                hash
            )
            .then(data => {
                req.session.userId = data.rows[0].id;
                res.json({
                    success: true
                });
                console.log(req.session.userId);
            })
            .catch(err => {
                res.json({ success: false });
                console.log("Please try again", err);
            });
    });
});

app.post("/login", (req, res) => {
    db.login(req.body.email).then(user => {
        if (user.rows.length === 1) {
            bc.checkPassword(req.body.password, user.rows[0].password)
                .then(isAuthorized => {
                    req.session.userId = user.rows[0].id;
                    req.session.firstName = user.rows[0].first_name;
                    req.session.lastName = user.rows[0].last_name;
                    req.session.image = user.rows[0].image;
                    req.session.bio = user.rows[0].bio;
                    req.session.account = user.rows[0].account;
                    if (isAuthorized == true) {
                        res.json({
                            success: true
                        });
                    } else {
                        res.json({
                            err: true
                        });
                    }
                })
                .catch(err => {
                    req.session.userId = null;
                    res.json({
                        err: true
                    });
                    console.log("err, reason", err);
                });
        } else {
            res.json({
                err: "Invalid email"
            });
        }
    });
});
//
app.get("/user", (req, res) => {
    // console.log("POST/user session: ", req.body);
    db.getUserInfo(req.session.userId).then(results => {
        if (results) {
            // console.log("results", results);
            db.getAccountforUser(req.session.userId).then(code => {
                let data = results.rows[0];
                data.code = code.rows[0].code;
                res.json(data);
            });
        } else {
            res.json({ success: false });
        }
    });
});

app.post("/invitation", (req, res) => {
    const code = Math.floor(Math.random() * Math.floor(99999));
    db.saveInvitation(req.session.userId, code);
    res.json({
        code: code
    });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const image = config.s3Url + req.file.filename;
    db.uploadImage(image, req.session.userId)
        .then(results => {
            if (results.rowCount == 1) {
                res.json({
                    success: true,
                    url: image
                });
            } else {
                res.json(req.session.firstName);
            }
        })
        .catch(err => {
            console.log("error in server upload", err);
        });
});

app.post("/bio", (req, res) => {
    const bio = req.body.bio;
    // console.log("show me req.body: ", req.session, req.body);
    db.uploadBio(bio, req.session.userId)
        .then(results => {
            if (results.rowCount == 1) {
                res.json({
                    success: true,
                    bio: bio
                });
            } else {
                res.json({ err: true });
            }
        })
        .catch(err => {
            console.log("error in server upload", err);
        });
});

app.post("/mirror", (req, res) => {
    // console.log("req.session drawing", req.body);
    db.getAccountforUser(req.session.userId).then(code => {
        return db
            .addDrawing(req.body.drawing, code.rows[0].account)
            .then(result => {
                // console.log("data for drawing", result);
                req.session.drawing_id = result.rows[0].id;
                // req.session.account = data.rows[0].account;
            })
            .catch(err => {
                console.log("error in server upload", err);
            });
    });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

app.get("/", (req, res) => {
    if (req.session.userId) {
        res.sendFile(__dirname + "/index.html");
    } else {
        res.redirect("/welcome");
    }
});

app.get("*", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(process.env.PORT || 8080, () => console.log("I'm listening"));

let onlineUsers = [];
var line_history = [];

io.on("connection", socket => {
    console.log(line_history);
    for (var i in line_history) {
        console.log("line_history: ", line_history[i]);
        io.sockets.emit("draw_line", { line: line_history[i] });
    }

    // add handler for message type "draw_line".
    socket.on("draw_line", function(data) {
        // add received line to history
        line_history.push(data.line);
        // send line to all clients
        io.sockets.emit("draw_line", { line: data.line });
    });
    // console.log(`socket with the id ${socket.id} is now connected`);
    let userId = socket.request.session.userId;
    let counter = 1;
    db.getChatMessages().then(rows => {
        // console.log("rows for getChatMessages: ", rows);
        counter = rows.rows[rows.rows.length - 1].id;
        io.sockets.emit("getChatMessages", rows.rows);
    });

    socket.on("chatMessages", newMessage => {
        // console.log("newMessage: ", newMessage);
        db.getUserInfo(socket.request.session.userId).then(user => {
            // console.log("user: ", user.rows[0]);
            counter++;
            let newMessageObj = {
                first_name: user.rows[0].first_name,
                last_name: user.rows[0].last_name,
                image: user.rows[0].image,
                chat: newMessage,
                id: counter,
                sent: new Date()
            };
            io.sockets.emit("chatMessages", newMessageObj);
            // console.log("newMessageObj: ", newMessageObj);

            db.saveMessage(socket.request.session.userId, newMessage)
                .then(rows => {
                    // console.log("rows for saveMessage: ", rows);
                })
                .catch(err => {
                    console.log("error in server upload", err);
                });
        });
        // console.log("newMessages: ", newMessage);
    });

    // socket.on("getChatMessages", chats => {
    //     // console.log("chats: ", chats);
    // });

    // console.log("onlineUsers: ", onlineUsers);
    onlineUsers.push({ userId: userId, socketid: socket.id });

    // let arrayOfIds = onlineUsers.map(user => {
    //     return Number(user.userId);
    // });
    // console.log("array of ids", arrayOfIds);
    // db.getUsersByIds(arrayOfIds)
    //     .then(results => {
    //         // console.log("reuslts for array", results);
    //         socket.emit("onlineUsers", results.rows);
    //     })
    //     .catch(err => {
    //         console.log("error in server upload", err);
    //     });

    socket.on("disconnect", socket => {
        // console.log(`socket with the id ${socket.id} is now disconnected`);
        onlineUsers[socket.id] = null;
    });
});

// console.log("log for sockets: ", io.sockets.sockets);
// socket.broadcast("chatMsgForRedux", myNewChat => {
//     store.dispatch(chatMsgForRedux(data));
// });
