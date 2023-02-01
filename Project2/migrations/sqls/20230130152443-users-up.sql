CREATE TABLE users (
    id SERIAL PRIMARY  KEY,
    lastname VARCHAR(150),
    firstname VARCHAR(150),
    password_digest VARCHAR
);