var spicedPg = require("spiced-pg");
var db =
    process.env.DATABASE_URL ||
    spicedPg("postgres:postgres:postgres@localhost:5432/finalproject");
// var db = spicedPg(dbUrl);

exports.register = function(first_name, last_name, email, code, password) {
    console.log("code in db: ", code);
    if (code) {
        let q = `SELECT * FROM accounts
        WHERE code = $1;`;
        return db.query(q, [code]).then(account => {
            return exports.createUser(
                first_name,
                last_name,
                email,
                password,
                account.rows[0].id
            );
        });
    } else {
        let q = `INSERT INTO accounts DEFAULT VALUES
        RETURNING id`;
        console.log("adding account");
        return db.query(q).then(account => {
            return exports.createUser(
                first_name,
                last_name,
                email,
                password,
                account.rows[0].id
            );
        });
    }
};

exports.createUser = function(first_name, last_name, email, password, account) {
    let q = `INSERT INTO users (first_name, last_name, email, password, account)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, first_name, last_name, email, password, account`;
    let params = [first_name, last_name, email, password, account];
    return db.query(q, params);
};

exports.login = function(email) {
    let q = `SELECT * FROM users
    WHERE email = $1;`;
    return db.query(q, [email]);
};

exports.getUserInfo = function(id) {
    let q = `SELECT * FROM users
    WHERE id = $1`;
    return db.query(q, [id]);
};

exports.saveInvitation = function(creator_id, code) {
    let q = `UPDATE accounts SET code = $2 FROM (SELECT account FROM users WHERE id = $1) AS ACCOUNT WHERE id = ACCOUNT.account;`;
    let params = [creator_id, code];
    return db.query(q, params);
};

exports.uploadImage = function(image, id) {
    let q = `UPDATE users SET image = $1
    WHERE id = $2`;
    let params = [image, id];
    return db.query(q, params);
};

exports.uploadBio = function(bio, id) {
    let q = `UPDATE users SET bio = $1
    WHERE id = $2`;
    let params = [bio, id];
    return db.query(q, params);
};

exports.getAccountforUser = function(id) {
    let q = `SELECT * FROM accounts, users WHERE accounts.id = users.account AND users.id = $1`;
    return db.query(q, [id]);
};

exports.addDrawing = function(drawing, accountID) {
    let q = `INSERT INTO accounts (drawing, account_id)
            VALUES ($1, $2)
            RETURNING drawing, account_id`;
    let params = [drawing, accountID];
    return db.query(q, params);
};

exports.saveMessage = function(sender_id, chat) {
    let q = `INSERT INTO chats (sender_id, chat)
    VALUES ($1, $2)
    RETURNING sender_id, chat`;
    let params = [sender_id, chat];
    return db.query(q, params);
};

exports.getChatMessages = function() {
    let q = `SELECT users.id, chats.id, first_name, image, chat, sent FROM chats
    JOIN users ON sender_id = users.id`;
    return db.query(q);
};

// exports.showBothUsers = function(account, id) {
//     let q = `SELECT * FROM users
//     WHERE account = $1 AND id IS NOT $2;`;
//     let params = [account, id];
//     return db.query(q, params);
// };

// exports.getStatus = function(viewer, owner) {
//     console.log("viewer, owner: ", viewer, owner);
//     let q = `SELECT * FROM friendships
//     WHERE (recip_id = $1 AND sender_id = $2)
//     OR (recip_id = $2 AND sender_id = $1);`;
//     let params = [viewer, owner];
//     return db.query(q, params);
// };

// exports.sendRequest = function(viewer, owner) {
//     let q = `INSERT INTO friendships (sender_id, recip_id, accepted)
//     VALUES ($1, $2, false)
//     RETURNING sender_id, recip_id, accepted`;
//     let params = [viewer, owner];
//     return db.query(q, params);
// };
//
// exports.acceptRequest = function(viewer, owner) {
//     let q = `UPDATE friendships SET accepted = true
//     WHERE (recip_id = $1 AND sender_id = $2)
//     OR (recip_id = $2 AND sender_id = $1);`;
//     let params = [viewer, owner];
//     return db.query(q, params);
// };
//
// exports.endFriendship = function(viewer, owner) {
//     let q = `DELETE FROM friendships
//     WHERE (recip_id = $1 AND sender_id = $2)
//     OR (recip_id = $2 AND sender_id = $1);`;
//     let params = [viewer, owner];
//     return db.query(q, params);
// };
//
// exports.showFriends = function(id) {
//     let q = `SELECT users.id, first_name, last_name, image, accepted
//     FROM friendships
//     JOIN users
//     ON (accepted = false AND recip_id = $1 AND sender_id = users.id)
//     OR (accepted = true AND recip_id = $1 AND sender_id = users.id)
//     OR (accepted = true AND sender_id = $1 AND recip_id = users.id)`;
//     return db.query(q, [id]);
// };

// exports.getUsersByIds = function(arrayOfIds) {
//     console.log("array of ids, db", arrayOfIds);
//     let q = `SELECT id, first_name, last_name, image FROM users WHERE id = ANY($1)`;
//     return db.query(q, [arrayOfIds]);
// };
