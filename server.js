const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Aseta SQLite-tietokanta
//const db = new sqlite3.Database(':memory:'); // Tallentaa tietokannan vain muistiin

// Luo tietokanta tiedostoon nimeltä "TESTDB.db"
const db = new sqlite3.Database('./TESTDB.db');

// Luo taulut
db.serialize(() => {
  db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, firstName TEXT, lastName TEXT)');
  db.run('CREATE TABLE tasks (id INTEGER PRIMARY KEY, task TEXT, dueDate TEXT, assignedUser INTEGER, FOREIGN KEY(assignedUser) REFERENCES users(id))');
});

app.use(bodyParser.json());
app.use(express.static('public')); // Palvelee staattisia tiedostoja kuten HTML, CSS ja JS

// Hae kaikki tehtävät
app.get('/tasks', (req, res) => {
  db.all('SELECT tasks.*, users.firstName || " " || users.lastName as userName FROM tasks JOIN users ON tasks.assignedUser = users.id', [], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(rows);
  });
});

// Lisää uusi tehtävä
app.post('/tasks', (req, res) => {
  const { task, dueDate, assignedUser } = req.body;
  db.run('INSERT INTO tasks (task, dueDate, assignedUser) VALUES (?, ?, ?)', [task, dueDate, assignedUser], function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(201).send({ id: this.lastID });
  });
});

// Hae kaikki käyttäjät
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(rows);
  });
});

// Lisää uusi käyttäjä
app.post('/users', (req, res) => {
  const { firstName, lastName } = req.body;
  db.run('INSERT INTO users (firstName, lastName) VALUES (?, ?)', [firstName, lastName], function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(201).send({ id: this.lastID });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
