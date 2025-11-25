import { useState } from "react";
import axios from "axios";

export default function AddProductModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "", category: "", brand: "", unit: "", stock: 0,
    status: "In Stock"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/products", form);
    alert("Product Added Successfully 🎉");
    onSuccess();
    onClose();
  };

  return (
    <div className="modal-bg">
      <div className="modal">
        <h2>Add Product</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input placeholder="Name" required onChange={(e) => setForm({ ...form, name: e.target.value })}/>
          <input placeholder="Category" required onChange={(e) => setForm({ ...form, category: e.target.value })}/>
          <input placeholder="Brand" required onChange={(e) => setForm({ ...form, brand: e.target.value })}/>
          <input placeholder="Unit" required onChange={(e) => setForm({ ...form, unit: e.target.value })}/>
          <input type="number" placeholder="Stock" required onChange={(e) =>
            setForm({ ...form, stock: e.target.value, status: e.target.value === "0" ? "Out of Stock" : "In Stock" })}/>

          <button className="btn btn-blue" type="submit">Add</button>
          <button className="btn btn-gray" type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

