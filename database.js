const sqlite3 = require('sqlite3').verbose();

// Create an in-memory database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");

  const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
  stmt.run("admin", "supersecret123"); // Hardcoded admin
  stmt.run("user", "password123");
  stmt.finalize();
});

module.exports = db;
