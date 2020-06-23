DROP TABLE IF EXISTS signatures CASCADE;

CREATE TABLE signatures (
    signature_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    sig TEXT NOT NULL CHECK (sig != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    user_id SERIAL primary key,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM signatures;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles(
    profile_id SERIAL PRIMARY KEY,
    age INT,
    city VARCHAR(255),
    url VARCHAR(255),
    user_id INT NOT NULL UNIQUE REFERENCES users(user_id)
);