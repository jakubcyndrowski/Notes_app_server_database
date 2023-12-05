CREATE DATABASE loveSport_app;  
USE loveSport_app;

CREATE TABLE notes(
    id integer PRIMARY KEY AUTO_INCREMENT,
    login VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO notes (login, password)
VALUES
('piesek123', 'kuba123'),
('kot321', 'kasia321');