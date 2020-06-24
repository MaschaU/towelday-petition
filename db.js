//modules
const spicedPg = require("spiced-pg");



//heroku setup
let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const {dbUser, dbPass} = require("./secrets");
    db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/petition`);
}



//signature table
exports.addSigner = (sig, user_id) => {
    return db.query(
        `INSERT INTO signatures (sig, user_id) VALUES ($1, $2) RETURNING signature_id`,
        [sig, user_id]
    );
};

exports.addUserIdToSignature = (signature_id, user_id) => {
    return db.query (`UPDATE signatures SET user_id=$2 WHERE signature_id=$1`, [signature_id, user_id]);
};

exports.getMySignature = (user_id) => {
    return db.query(
        `SELECT sig FROM signatures
        WHERE user_id = $1`,
        [user_id]
    );
};

exports.getSigners = () => {
    return db.query(`SELECT profiles.city, users.firstname, users.lastname FROM signatures JOIN users ON users.user_id=signatures.user_id JOIN profiles on profiles.user_id=signatures.user_id`);
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
    return db.query(`SELECT password_hash, user_id FROM users WHERE email = $1`, [email]);
};

exports.getUserPetitionSignatureImage = function (user_id) {
    return db.query(
        `SELECT sig FROM signatures WHERE user_id = $1`, [user_id]
    );

};

exports.getUserData = function (user_id) {
    return db.query(`SELECT * FROM users WHERE user_id = $1`, [user_id]);
};

//profile table

exports.updateUsersProfiles = (age, city, webpage, user_id) => {
    return db.query(
        `INSERT INTO profiles (age, city, url, user_id) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO UPDATE SET age=$1, city=$2, url=$3 WHERE profiles.user_id=$4 `, 
        [age, city, webpage, user_id]);
};

exports.getSignersByCity = (city) => {
    return db.query(
        `SELECT profiles.city, users.firstname, users.lastname FROM profiles JOIN users ON profiles.user_id = users.user_id WHERE LOWER(city) = LOWER($1)`,
        [city]
    );
};

//getting a profile from user id

exports.getProfileFromUserId = (user_id) => {
    return db.query(
        `SELECT * FROM profiles WHERE user_id=$1`,
        [user_id]
    );
};

 


