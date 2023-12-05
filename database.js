import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config(); //a wczesniej zainstaluj to npm i dotenv

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASED,
  })
  .promise();

export async function getNotes() {
  const [rows] = await pool.query("SELECT * FROM notes"); //przechowujemy wynik zapytania [result] oznacza, że chcesz wyjąć pierwszy element z tablicy i przypisać go do zmiennej result.
  return rows;
}

export async function getNote(id) {
  const [rows] = await pool.query(`SELECT * FROM notes WHERE id = ?`, [id]); //przechowujemy wynik zapytania [result] oznacza, że chcesz wyjąć pierwszy element z tablicy i przypisać go do zmiennej result.
  return rows[0]; //? to jest id robimy to tak aby zabezpieczyć dane!
}

export async function checkLogin(login, password) {
  const [rows] = await pool.query(`SELECT * FROM notes WHERE login = ?`, [
    login,
  ]);
  return rows.length > 0; // Zwraca użytkownika, jeśli istnieje, w przeciwnym razie undefined
}

export async function createUser(login, password) {
  const [result] = await pool.query(
    `INSERT INTO notes (login, password) VALUES(?, ?)`,
    [login, password]
  );
  const id = result.insertId;
  return getNote(id);
}

export async function takeText(login) {
  const [rows] = await pool.query(`SELECT text FROM notes WHERE login = ?`, [
    login,
  ]);
  return rows[0].text;
}

export async function updateText(login, text) {
  const query = "UPDATE notes SET text = ? WHERE login = ?";
  const values = [text, login];
  await pool.query(query, values);
}

export async function deleteUser(login, password) {
  console.log(`Delete ${login} ${password}`);
  const [result] = await pool.query(
    `DELETE FROM notes WHERE login = ? AND password = ?`,
    [login, password]
  );
  console.log("Delete result", result);
}
// const notes = await getNotes(); //await zostanie wywołana po kolei, a kolejne operacje nie rozpoczną się, dopóki poprzednia nie zostanie zakończona.
// console.log(notes);

// const note = await getNote(1);
// console.log(note);

// const result = await delateNote("test", "test");
// console.log(result);
