import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import {
  checkLogin,
  updateText,
  createUser,
  deleteUser,
  takeText,
} from "./database.js";

const app = express();

app.set("view engine", "ejs");

app.use(
  session({
    secret: "secret-key", // Sekret do podpisu ciasteczek sesji, wymagany
    resave: false,
    saveUninitialized: false,
  })
);

// Dodaj middleware do obsługi danych w formularzach
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/panel", async (req, res) => {
  const login = req.query.login; // Odczytaj parametr login z zapytania
  const text = await takeText(login);

  res.render("panel.ejs", { login, text }); // Przekazuj login do panel.ejs
});

// Route for the register page
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/delete", (req, res) => {
  const login = req.query.login;
  res.render("delete.ejs", { login });
});

// Dodaj endpoint do przetwarzania logowania
app.post("/login", async (req, res) => {
  const { login, password } = req.body;
  // Sprawdź dane logowania w bazie danych

  const user = await checkLogin(login, password);
  if (user) {
    // Jeśli użytkownik istnieje, przekieruj na stronę panelu
    res.redirect(`/panel?login=${login}`);
  } else {
    // Jeśli dane logowania są nieprawidłowe, można przekierować gdzieś indziej lub wyświetlić komunikat błędu
    res.send("Błędne dane logowania");
  }
});
// Endpoint do przetwarzania rejestracji
app.post("/register", async (req, res) => {
  const { login, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    res.send("Passwords do not match");
    return;
  }

  const userExist = await checkLogin(login);

  if (userExist) {
    res.send("User already exist");
  } else {
    await createUser(login, password);
    res.redirect("/");
  }
});

app.use((req, res, next) => {
  // Wyłącz cachowanie dla wszystkich odpowiedzi serwera
  res.header("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.header("Pragma", "no-cache");
  res.header("Expires", "-1");
  next();
});

app.post("/text", async (req, res) => {
  const { text, login } = req.body;
  await updateText(login, text);
  res.redirect(`/panel?login=${login}`);
});

app.post("/wyloguj", async (req, res) => {
  // Zakończ sesję (usuń sesję)
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    // Redirect the user to the homepage with a random parameter
    res.status(303).redirect("/");
  });
});
app.post("/delete", async (req, res) => {
  const { login, password } = req.body;

  console.log(`Delete ${login} ${password}`);
  await deleteUser(login, password);
  res.status(303).redirect("/");
});

app.use(express.static("public"));

const port = 8080;
app.listen(port, () => {
  //port jest używany gyd aplikacja nasłuchuje odpowiedzi http
  console.log(`Example app listening at http://localhost:${port}`);
});
