DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
   user_id SERIAL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL CHECK (firstname != ''),
    lastname VARCHAR(50) NOT NULL CHECK (lastname != ''),
    sig TEXT NOT NULL CHECK (sig != ''),
    created_at TIMESTAMP DEFAULT(CURRENT_TIMESTAMP)
);


--CREATE TABLE users (
--    id SERIAL primary key,
--    first VARCHAR(255) NOT NULL,
--    last VARCHAR(255) NOT NULL,
--    email VARCHAR(255) NOT NULL UNIQUE,
--    password VARCHAR(100) NOT NULL,
--      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
--);

SELECT * FROM signatures;
