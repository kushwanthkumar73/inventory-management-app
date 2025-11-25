import axios from "axios";

export default function Header({ products, onSearch, onAddProduct, onImportSuccess }) {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    await axios.post("http://localhost:5000/api/products/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("CSV Imported Successfully 🎉");
    onImportSuccess();
  };

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
      <div style={{ display: "flex", gap: 10 }}>
        <input
          placeholder="Search..."
          className="search-box"
          onChange={(e) => onSearch(e.target.value, false)}
        />

        <select className="dropdown" onChange={(e) => onSearch(e.target.value, true)}>
          <option value="">All Categories</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <button onClick={onAddProduct} className="btn btn-blue">
          + Add Product
        </button>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-gray" onClick={() => document.getElementById("fileInput").click()}>
          Import CSV
        </button>

        <input id="fileInput" type="file" accept=".csv" style={{ display: "none" }} onChange={handleFileUpload} />

        <button
          className="btn btn-gray"
          onClick={() => window.open("http://localhost:5000/api/products/export", "_blank")}
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}

