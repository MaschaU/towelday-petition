CREATE TABLE signatures (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL CHECK (first_name != ''),
    last_name VARCHAR(50) NOT NULL CHECK (last_name != ''),
    signature_image TEXT NOT NULL CHECK (signature_image != ''),
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
