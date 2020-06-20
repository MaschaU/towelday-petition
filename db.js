const spicedPg = require("spiced-pg");
const { dbUser, dbPass } = require("./secrets.json");

//signature table
const db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/petition`);

exports.addSigner = (firstname, lastname, sig) => {
    return db.query(
        `INSERT INTO signatures (firstname, lastname, sig) VALUES ($1, $2, $3) RETURNING user_id`,
        [firstname, lastname, sig]
    );
};

exports.getMyData = (user_id) => {
    return db.query(
        `SELECT firstname, lastname, sig FROM signatures
        WHERE user_id = $1`,
        [user_id]
    );
};

exports.getSigners = () => {
    return db.query(`SELECT firstname, lastname FROM signatures`);
};


