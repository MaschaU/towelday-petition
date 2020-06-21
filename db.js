//modules
const spicedPg = require("spiced-pg");
const { dbUser, dbPass } = require("./secrets.json");
const db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/petition`);


//signature table
exports.addSigner = (firstname, lastname, sig) => {
    return db.query(
        `INSERT INTO signatures (firstname, lastname, sig) VALUES ($1, $2, $3) RETURNING signature_id`,
        [firstname, lastname, sig]
    );
};

exports.getMyData = (signature_id) => {
    return db.query(
        `SELECT firstname, lastname, sig FROM signatures
        WHERE signature_id = $1`,
        [signature_id]
    );
};

exports.getSigners = () => {
    return db.query(`SELECT firstname, lastname FROM signatures`);
};

//users table
exports.newUser = function (firstname, lastname, email, hashPass) {
    return db.query(
        `INSERT INTO users (firstname, lastname, email, password_hash)
        VALUES ($1, $2, $3, $4) RETURNING user_id`,
        [firstname, lastname, email, hashPass]
    );
};

exports.insertSignature = function (signature_id, sig) {
    return db.query(
        `INSERT INTO signatures (signature_id, signature) 
        VALUES ($1, $2)`,
        [signature_id, sig]
    );
};

exports.getHashedPass = function (email) {
    return db.query(`SELECT password, user_id FROM users WHERE email = $1`, [email]);
};



