DROP TABLE IF EXISTS users;

CREATE TABLE users
(
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(250) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    roles VARCHAR(50) NOT NULL
);

INSERT INTO users (username, password, first_name, last_name, email, roles)
VALUES ('bob', '$2a$10$3sEgZodNVJSY6tXSKGY4kuYJXE/QV.1VooXbtBFi8NzkVhH4HlsHW', 'Bob', 'Doe', 'cbob@does.com', 'user');

INSERT INTO users (username, password, first_name, last_name, email, roles)
VALUES ('alice', '$2a$10$3sEgZodNVJSY6tXSKGY4kuYJXE/QV.1VooXbtBFi8NzkVhH4HlsHW', 'Alice', 'Doe', 'alcie@does.com', 'admin');

COMMIT;
