const express = require("express");
const cors = require("cors");
const db = require("./db");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Get products
app.get("/api/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database failure" });
    res.json(rows);
  });
});

// Search by name
app.get("/api/products/search", (req, res) => {
  const { name } = req.query;
  db.all(
    "SELECT * FROM products WHERE LOWER(name) LIKE ?",
    [`%${name.toLowerCase()}%`],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Search failed" });
      res.json(rows);
    }
  );
});

// FILTER BY CATEGORY
app.get("/api/products/filter", (req, res) => {
  const { category } = req.query;

  if (!category || category === "") {
    return db.all("SELECT * FROM products", [], (err, rows) => res.json(rows));
  }

  db.all(
    "SELECT * FROM products WHERE LOWER(category)=LOWER(?)",
    [category],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Filter failed" });
      res.json(rows);
    }
  );
});

// Add Product
app.post("/api/products", (req, res) => {
  const { name, unit, category, brand, stock, status, image } = req.body;

  if (!name || !unit || !category || !brand || stock === undefined || !status)
    return res.status(400).json({ error: "All fields required" });

  db.run(
    `INSERT INTO products (name,unit,category,brand,stock,status,image)
     VALUES(?,?,?,?,?,?,?)`,
    [name, unit, category, brand, Number(stock), status, image || null],
    function (err) {
      if (err) return res.status(500).json({ error: "Insert failed" });
      res.json({ message: "Product added", id: this.lastID });
    }
  );
});

// Update
app.put("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const { name, unit, category, brand, stock, status, image } = req.body;

  db.get("SELECT stock FROM products WHERE id=?", [id], (err, prod) => {
    if (!prod) return res.status(404).json({ error: "Not found" });

    db.run(
      `UPDATE products SET name=?,unit=?,category=?,brand=?,stock=?,status=?,image=? WHERE id=?`,
      [name, unit, category, brand, stock, status, image, id],
      () => res.json({ message: "Updated" })
    );
  });
});

// Delete
app.delete("/api/products/:id", (req, res) =>
  db.run("DELETE FROM products WHERE id=?", [req.params.id], () =>
    res.json({ message: "Product deleted" })
  )
);

// Import CSV
app.post("/api/products/import", upload.single("file"), (req, res) => {
  const results = [];
  let added = 0;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => results.push(row))
    .on("end", () => {
      results.forEach((p) =>
        db.run(
          `INSERT INTO products (name,unit,category,brand,stock,status,image) VALUES (?,?,?,?,?,?,?)`,
          [p.name, p.unit, p.category, p.brand, Number(p.stock), p.status, p.image],
          () => (added = added + 1)
        )
      );
      res.json({ added });
    });
});

// Export CSV
app.get("/api/products/export", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    let csv =
      "name,unit,category,brand,stock,status,image\n" +
      rows.map((p) => `${p.name},${p.unit},${p.category},${p.brand},${p.stock},${p.status},${p.image}`).join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=products.csv");
    res.send(csv);
  });
});

app.listen(PORT, () => console.log(`🚀 Server http://localhost:${PORT}`));

