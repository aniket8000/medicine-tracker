// Medicines.jsx
import React, { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import Fuse from "fuse.js";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import AddToCartModal from "../components/AddToCartModal";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import "../styles/global.css";

const PAGE_SIZE = 12;

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
  const [page, setPage] = useState(1);

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
      const res = await api.get("/pharmacies");
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
    setPage(1);
  }, [search, filters, allMedicines]);

  // Customer Add to Cart
  const handleConfirmAdd = (medicine) => {
    const selectedQuantity = medicine.selectedQty || 1;

    addToCart({
      ...medicine,
      stock: medicine.quantity, // `quantity` below becomes the cart quantity
      quantity: selectedQuantity,
      totalPrice: medicine.price * selectedQuantity,
    });

    setSelectedMedicine(null);
  };

  // Admin Delete Medicine -> Using Modal (NO window.confirm)
  const confirmDelete = async () => {
    try {
      const { pharmacyId, medName } = deleteModal;

      await api.delete(
        `/pharmacies/${pharmacyId}/medicine/${encodeURIComponent(medName)}`
      );

      setDeleteModal({ visible: false, medName: "", pharmacyId: "" });

      fetchMedicines();
    } catch (error) {
      alert("Failed to delete medicine");
      console.error(error);
    }
  };

  const totalPages = Math.ceil(filteredMedicines.length / PAGE_SIZE);
  const paginatedMedicines = filteredMedicines.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

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
          className="meds-search-input"
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
        <div className="empty-state fade-up">
          <div className="empty-icon">💊</div>
          <h3>No medicines found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
        <section className="medicines-grid fade-up">
          {paginatedMedicines.map((med, index) => (
            <div key={`${med.pharmacyId}-${med.name}-${index}`} className="medicine-card">
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
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
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
        <Modal
          onClose={() => setDeleteModal({ visible: false, medName: "", pharmacyId: "" })}
          contentStyle={{ width: "300px", textAlign: "center" }}
        >
          <h3>Delete Medicine?</h3>
          <p>{deleteModal.medName}</p>

          <div className="modal-actions" style={{ justifyContent: "space-around" }}>
            <button
              onClick={() =>
                setDeleteModal({ visible: false, medName: "", pharmacyId: "" })
              }
              className="secondary-btn"
            >
              Cancel
            </button>

            <button onClick={confirmDelete} className="delete-btn">
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Medicines;
