const sqlite3 = require("sqlite3").verbose();
const mkdirp = require("mkdirp");
const crypto = require("crypto");

mkdirp.sync("./var/db");

let db = new sqlite3.Database("./var/db/uploaders.db", (err) => {
  if (err) {
    return console.log(err.message);
  }
  console.log("Connected to the in-memory SQlite database.");
});

db.serialize(() => {
  // create the database schema for the todos app
  db.run(
    "CREATE TABLE IF NOT EXISTS users ( \
    id INTEGER PRIMARY KEY, \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB \
  )"
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS todos ( \
      id INTEGER PRIMARY KEY, \
      owner_id INTEGER NOT NULL, \
      title TEXT NOT NULL, \
      completed INTEGER \
    )"
  );

  // create an initial user (username: admin, password: password)
  var salt = crypto.randomBytes(16);
  db.run(
    "INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)",
    ["admin", bcrypt.pbkdf2Sync("password", salt, 310000, 32, "sha256"), salt]
  );
});

db.close((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("Close the database connection.");
});

module.exports = db;
