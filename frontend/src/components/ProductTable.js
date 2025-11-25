import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import axios from "axios";
import "./styles.css";

const ProductTable = forwardRef(({ setProducts }, ref) => {
  const [products, setLocalProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [editRowId, setEditRowId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchProducts = async () => {
    const response = await axios.get("http://localhost:5000/api/products");
    setLocalProducts(response.data);
    setProducts(response.data);
  };

  const fetchHistory = async (id) => {
    const response = await axios.get(`http://localhost:5000/api/products/${id}/history`);
    setHistory(response.data);
    setShowHistory(true);
  };

  const searchProducts = async (value, isCategory = false) => {
    if (!value) return fetchProducts();
    const url = isCategory
      ? `http://localhost:5000/api/products/filter?category=${value}`
      : `http://localhost:5000/api/products/search?name=${value}`;
    const response = await axios.get(url);
    setLocalProducts(response.data);
  };

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    alert("Deleted Successfully");
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditRowId(product.id);
    setEditForm({ ...product });
  };

  const handleCancel = () => {
    setEditRowId(null);
  };

  const handleSave = async () => {
    await axios.put(`http://localhost:5000/api/products/${editRowId}`, editForm);
    alert("Updated Successfully");
    setEditRowId(null);
    fetchProducts();
  };

  useImperativeHandle(ref, () => ({
    fetchProducts,
    searchProducts,
  }));

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      {/* TABLE */}
      <table className="table" style={{ width: showHistory ? "70%" : "100%" }}>
        <thead>
          <tr>
            <th>Name</th><th>Category</th><th>Brand</th><th>Unit</th><th>Stock</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 && (
            <tr><td colSpan="7" style={{ textAlign: "center", padding: 20 }}>No Products Found</td></tr>
          )}

          {products.map((p) => (
            <tr key={p.id} onClick={() => { setSelectedProduct(p); fetchHistory(p.id); }} style={{ cursor: "pointer" }}>
              <td>
                {editRowId === p.id ? (
                  <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                ) : p.name}
              </td>

              <td>{editRowId === p.id ? (
                <input value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} />
              ) : p.category}</td>

              <td>{editRowId === p.id ? (
                <input value={editForm.brand} onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })} />
              ) : p.brand}</td>

              <td>{editRowId === p.id ? (
                <input value={editForm.unit} onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })} />
              ) : p.unit}</td>

              <td>{editRowId === p.id ? (
                <input type="number" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} />
              ) : p.stock}</td>

              <td>
                <span className={p.stock === 0 ? "status-red" : "status-green"}>
                  {p.stock === 0 ? "Out Of Stock" : "In Stock"}
                </span>
              </td>

              <td style={{ display: "flex", gap: "10px" }}>
                {editRowId === p.id ? (
                  <>
                    <button className="btn modern-blue" onClick={handleSave}>💾 Save</button>
                    <button className="btn modern-gray" onClick={handleCancel}>❌ Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn modern-green" onClick={(e) => { e.stopPropagation(); handleEdit(p); }}>✏️ Edit</button>
                    <button className="btn modern-red" onClick={(e) => { e.stopPropagation(); deleteProduct(p.id); }}>🗑 Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* HISTORY PANEL */}
      {showHistory && (
        <div style={{
          width: "30%", background: "#fff",
          marginLeft: 20, borderRadius: 10, padding: 15,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginBottom: 10 }}>📦 Inventory History</h3>
          <hr />

          {history.length === 0 && <p>No history found</p>}

          {history.map((h) => (
            <div key={h.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
              <p><b>Old:</b> {h.oldStock} → <b>New:</b> {h.newStock}</p>
              <p><b>Changed By:</b> {h.changedBy}</p>
              <p style={{ fontSize: 12, color: "#666" }}>{h.timestamp}</p>
            </div>
          ))}

          <button className="btn modern-gray" onClick={() => setShowHistory(false)} style={{ marginTop: 10 }}>Close</button>
        </div>
      )}
    </div>
  );
});

export default ProductTable;






