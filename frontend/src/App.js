import { useRef, useState, useEffect } from "react";
import Header from "./components/Header";
import ProductTable from "./components/ProductTable";
import AddProductModal from "./components/AddProductModal";
import axios from "axios";
import "./styles.css";

function App() {
  const tableRef = useRef();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchProducts = async () => {
    const response = await axios.get("http://localhost:5000/api/products");
    setProducts(response.data);
  };

  const handleSearch = (value, isCategory = false) => {
    tableRef.current.searchProducts(value, isCategory);
  };

  const handleRefresh = () => {
    tableRef.current.fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container">
      <Header
        products={products}
        onSearch={handleSearch}
        onAddProduct={() => setShowModal(true)}
        onImportSuccess={handleRefresh}
      />

      <ProductTable ref={tableRef} setProducts={setProducts} />

      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}

export default App;
