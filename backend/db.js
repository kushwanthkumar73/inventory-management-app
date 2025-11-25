const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
  path.join(__dirname, "inventory.db"),
  (err) => {
    if (err) console.error("❌ DB Error:", err);
    else console.log("✅ SQLite connected");
  }
);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      unit TEXT NOT NULL,
      category TEXT NOT NULL,
      brand TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL,
      image TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS inventory_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL,
      oldStock INTEGER NOT NULL,
      newStock INTEGER NOT NULL,
      changedBy TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (productId) REFERENCES products(id)
    );
  `);
});

module.exports = db;
