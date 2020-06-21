const spicedPg = require("spiced-pg");
const { dbUser, dbPass } = require("./secrets.json");

//signature table
const db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/petition`);

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


