import Header from "../components/Header";
import ProductTable from "../components/ProductTable";
import AddProductModal from "../components/AddProductModal";
import { useRef, useState } from "react";

export default function InventoryPage() {
  const tableRef = useRef(null);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <Header
        onAddProduct={() => setShowAddModal(true)}
        onImportSuccess={() => tableRef.current.fetchProducts()}
        onSearch={(val) => tableRef.current.searchProducts(val)}
      />

      <ProductTable ref={tableRef} />

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => tableRef.current.fetchProducts()}
        />
      )}
    </div>
  );
}

