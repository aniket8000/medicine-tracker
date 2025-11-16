// Medicines.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Fuse from "fuse.js";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import AddToCartModal from "../components/AddToCartModal";
import "../styles/global.css";

const Medicines = () => {
  const [allMedicines, setAllMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    pharmacy: "",
    priceRange: "all",
    inStockOnly: false,
  });
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // NEW → For Delete Modal
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    medName: "",
    pharmacyId: "",
  });

  const { addToCart } = useCart();
  const { user } = useAuth();

  // Fetch medicines
  const fetchMedicines = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pharmacies");
      const data = res.data;

      const all = [];
      data.forEach((pharmacy) => {
        pharmacy.medicines.forEach((m) => {
          all.push({
            ...m,
            pharmacyId: pharmacy._id,
            pharmacyName: pharmacy.name,
            contact: pharmacy.contact,
            address: pharmacy.address,
          });
        });
      });

      setAllMedicines(all);
      setFilteredMedicines(all);
    } catch (err) {
      console.error("Error fetching medicines:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Fuzzy Search
  const fuse = useMemo(
    () =>
      new Fuse(allMedicines, {
        keys: ["name", "pharmacyName"],
        threshold: 0.3,
      }),
    [allMedicines]
  );

  useEffect(() => {
    let results = [...allMedicines];

    if (search.trim() !== "") results = fuse.search(search).map((r) => r.item);

    if (filters.pharmacy)
      results = results.filter(
        (m) => m.pharmacyName.toLowerCase() === filters.pharmacy.toLowerCase()
      );

    if (filters.priceRange !== "all") {
      if (filters.priceRange === "low") results = results.filter((m) => m.price < 100);
      else if (filters.priceRange === "medium")
        results = results.filter((m) => m.price >= 100 && m.price <= 500);
      else if (filters.priceRange === "high")
        results = results.filter((m) => m.price > 500);
    }

    if (filters.inStockOnly) results = results.filter((m) => m.quantity > 0);

    setFilteredMedicines(results);
  }, [search, filters, allMedicines]);

  // Customer Add to Cart
  const handleConfirmAdd = (medicine) => {
    const selectedQuantity = medicine.selectedQty || 1;

    addToCart({
      ...medicine,
      quantity: selectedQuantity,
      totalPrice: medicine.price * selectedQuantity,
    });

    setSelectedMedicine(null);
  };

  // Admin Delete Medicine -> Using Modal (NO window.confirm)
  const confirmDelete = async () => {
    try {
      const { pharmacyId, medName } = deleteModal;

      await axios.delete(
        `http://localhost:5000/api/pharmacies/${pharmacyId}/medicine/${medName}`
      );

      setDeleteModal({ visible: false, medName: "", pharmacyId: "" });

      fetchMedicines();
    } catch (error) {
      alert("Failed to delete medicine");
      console.error(error);
    }
  };

  return (
    <div className="medicines-page fade-in">
      <header className="page-header slide-down">
        <h1>💊 Smart Medicine Finder</h1>
        <p>Browse all medicines, filter by price, pharmacy, or stock.</p>
      </header>

      {/* Filters */}
      <div className="filter-bar fade-up">
        <input
          type="text"
          placeholder="🔍 Search medicine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />

        <select
          value={filters.pharmacy}
          onChange={(e) => setFilters({ ...filters, pharmacy: e.target.value })}
        >
          <option value="">All Pharmacies</option>
          {[...new Set(allMedicines.map((m) => m.pharmacyName))].map((name, i) => (
            <option key={i} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={filters.priceRange}
          onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
        >
          <option value="all">All Prices</option>
          <option value="low">Below ₹100</option>
          <option value="medium">₹100 - ₹500</option>
          <option value="high">Above ₹500</option>
        </select>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              setFilters({ ...filters, inStockOnly: e.target.checked })
            }
          />
          In Stock Only
        </label>
      </div>

      {/* Medicine Cards */}
      {loading ? (
        <p className="loading-text">Loading medicines...</p>
      ) : filteredMedicines.length === 0 ? (
        <p className="no-results">No medicines found.</p>
      ) : (
        <section className="medicines-grid fade-up">
          {filteredMedicines.map((med, index) => (
            <div key={index} className="medicine-card">
              <h3>{med.name}</h3>

              <p><strong>Pharmacy:</strong> {med.pharmacyName}</p>
              <p><strong>Price:</strong> ₹{med.price}</p>
              <p><strong>Available Qty:</strong> {med.quantity}</p>
              <p className="address">{med.address}</p>

              {/* CUSTOMER BUTTON */}
              {user?.role === "customer" && (
                <button
                  className="add-cart-btn"
                  onClick={() => setSelectedMedicine(med)}
                  disabled={med.quantity <= 0}
                >
                  🛒 Add to Cart
                </button>
              )}

              {/* ADMIN DELETE BUTTON */}
              {user?.role === "admin" && (
                <button
                  className="delete-btn"
                  onClick={() =>
                    setDeleteModal({
                      visible: true,
                      medName: med.name,
                      pharmacyId: med.pharmacyId,
                    })
                  }
                >
                  ❌ Delete
                </button>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Add to Cart Modal */}
      {selectedMedicine && (
        <AddToCartModal
          medicine={selectedMedicine}
          onConfirm={handleConfirmAdd}
          onClose={() => setSelectedMedicine(null)}
        />
      )}

      {/* DELETE MEDICINE MODAL */}
      {deleteModal.visible && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 5000,
          }}
        >
          <div
            className="modal-content"
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h3>Delete Medicine?</h3>
            <p>{deleteModal.medName}</p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() =>
                  setDeleteModal({ visible: false, medName: "", pharmacyId: "" })
                }
                style={{
                  padding: "6px 12px",
                  background: "gray",
                  color: "white",
                  borderRadius: "6px",
                }}
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                style={{
                  padding: "6px 12px",
                  background: "#d11a2a",
                  color: "white",
                  borderRadius: "6px",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medicines;
