DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
    signature_id SERIAL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL CHECK (firstname != ''),
    lastname VARCHAR(50) NOT NULL CHECK (lastname != ''),
    sig TEXT NOT NULL CHECK (sig != ''),
    created_at TIMESTAMP DEFAULT(CURRENT_TIMESTAMP)
);


CREATE TABLE users (
    user_id SERIAL primary key,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM signatures;
