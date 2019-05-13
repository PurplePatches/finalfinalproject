const express = require("express");
const app = express();
const server = require("http").Server(app);
// const io = require("socket.io")(server, { origins: "localhost:8080" });
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
// io.use(function(socket, next) {
//     cookieSessionMiddleware(socket.request, socket.request.res, next);
// });

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
//
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

app.post("/invitation", (req, res) => {
    const code = Math.floor(Math.random() * Math.floor(99999));
    db.saveInvitation(req.session.userId, code);
    res.json({
        code: code
    });
});
//
// app.post("/bio", (req, res) => {
//     const bio = req.body.bio;
//     // console.log("show me req.body: ", req.session, req.body);
//     db.uploadBio(bio, req.session.userId)
//         .then(results => {
//             if (results.rowCount == 1) {
//                 res.json({
//                     success: true,
//                     bio: bio
//                 });
//             } else {
//                 res.json({ err: true });
//             }
//         })
//         .catch(err => {
//             console.log("error in server upload", err);
//         });
// });
//
// app.get("/api/user/:id", (req, res) => {
//     db.getUserInfo(req.params.id)
//         .then(({ rows }) => {
//             // console.log("now we're here at GET/user:id", rows);
//             if (req.params.id == req.session.userId) {
//                 res.json({
//                     redirect: true
//                 });
//             } else {
//                 res.json(rows);
//             }
//         })
//         .catch(err => {
//             console.log("error in server upload", err);
//         });
// });
//
// app.get("/friendshipbutton/:viewer", (req, res) => {
//     db.getStatus(req.session.userId, req.params.viewer)
//         .then(data => {
//             // console.log("data from index: ", data);
//             if (data.rows[0]) {
//                 // console.log("show me data.rows[0]:", data.rows[0]);
//                 if (data.rows[0].accepted == true) {
//                     res.json({ buttonText: "Sever Heartline" });
//                 } else if (req.session.userId == data.rows[0].sender_id) {
//                     res.json({ buttonText: "Revoke Heartline" });
//                 } else {
//                     res.json({ buttonText: "Accept Heartline" });
//                 }
//             } else {
//                 res.json({ buttonText: "Extend Heartline" });
//             }
//         })
//         .catch(err => {
//             console.log("error in GET/friendshipbutton", err);
//         });
// });
//
// app.post("/friendshipbutton/:viewer", (req, res) => {
//     // console.log("are we there yet?", req.body);
//     if (req.body.buttonText == "Extend Heartline") {
//         // console.log("about to ADD friend");
//         db.sendRequest(req.session.userId, req.params.viewer).then(
//             ({ data }) => {
//                 res.json({ buttonText: "Revoke Heartline", accepted: false });
//             }
//         );
//     } else if (req.body.buttonText == "Accept Heartline") {
//         // console.log("about to ACCEPT friend");
//         // console.log("req.params/Accept Request: ", req.params);
//         db.acceptRequest(req.session.userId, req.params.viewer).then(
//             ({ data }) => {
//                 res.json({ buttonText: "Sever Heartline", accepted: true });
//             }
//         );
//     } else if (req.body.buttonText == "Revoke Heartline") {
//         // console.log("about to REVOKE request");
//         db.endFriendship(req.session.userId, req.params.viewer).then(
//             ({ data }) => {
//                 res.json({ buttonText: "Extend Heartline", accepted: false });
//             }
//         );
//     } else if (req.body.buttonText == "Sever Heartline") {
//         // console.log("about to DELETE friend");
//         db.endFriendship(req.session.userId, req.params.viewer).then(
//             ({ data }) => {
//                 res.json({ buttonText: "Extend Heartline", accepted: false });
//             }
//         );
//     }
// });
//
// app.get("/showFriends", (req, res) => {
//     db.showFriends(req.session.userId, req.params.id).then(data => {
//         // console.log("data.rows[0]: ", data.rows);
//         res.json(data.rows);
//     });
// });
//
// app.post("/friends/accept/:id", (req, res) => {
//     db.acceptRequest(req.session.userId, req.params.id).then(data => {
//         console.log("data for friends/accept", data);
//         res.json(data.rows);
//     });
// });
//
// app.post("/friends/reject/:id", (req, res) => {
//     db.endFriendship(req.session.userId, req.params.id).then(data => {
//         console.log("data for friends/reject", data);
//         res.json(data.rows);
//     });
// });

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

// let onlineUsers = [];
//
// io.on("connection", socket => {
//     console.log(`socket with the id ${socket.id} is now connected`);
//     let userId = socket.request.session.userId;
//
//     console.log("onlineUsers: ", onlineUsers);
//     onlineUsers.push({ userId: userId, socketid: socket.id });
//
//     let arrayOfIds = onlineUsers.map(user => {
//         return Number(user.userId);
//     });
//     console.log("array of ids", arrayOfIds);
//     db.getUsersByIds(arrayOfIds)
//         .then(results => {
//             // console.log("reuslts for array", results);
//             socket.emit("onlineUsers", results.rows);
//         })
//         .catch(err => {
//             console.log("error in server upload", err);
//         });
//
//     socket.on("disconnect", () => {
//         console.log(`socket with the id ${socket.id} is now disconnected`);
//         onlineUsers[socket.id] = null;
//     });
// });
//
// console.log("log for sockets: ", io.sockets.sockets);

// listen for new chat messages coming in:
// socket.on("chatMessages", data => {
//     //if using db method, insert chat and userId;
//     //if using array method, push chat into chats array
//     //either way: have to do a db query to get user info:
//     //first, last, image, timestamp(if wanted): use query from part3
//     //(getUserInfo)
//     //next step: get user's first, last, image + chat into redux
//     //object that looks the same as object used for chats array:
//     // let myNewChat = {
//     //     first: results.rows[0].first,
//     //     last: results.rows[0].lastName,
//     //     chat: data,
//     //     id: socket.request.session.userId,
//     //     timestamp: results.rows[0].timestamp
//     // }
//     //need to send the above info back to the front:
// });
// socket.broadcast("chatMsgForRedux", myNewChat => {
//     store.dispatch(chatMsgForRedux(data));
// });
//
