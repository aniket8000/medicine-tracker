import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Fuse from "fuse.js";
import { useCart } from "../context/CartContext";
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
  const { addToCart } = useCart();

  // Fetch all medicines on mount
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/pharmacies");
        const data = res.data;

        const all = [];
        data.forEach((pharmacy) => {
          pharmacy.medicines.forEach((m) => {
            all.push({
              ...m,
              pharmacyName: pharmacy.name,
              contact: pharmacy.contact,
              address: pharmacy.address,
            });
          });
        });

        setAllMedicines(all);
        setFilteredMedicines(all); // ✅ show all by default
      } catch (err) {
        console.error("Error fetching medicines:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  // Setup Fuse.js for fuzzy search
  const fuse = useMemo(
    () =>
      new Fuse(allMedicines, {
        keys: ["name", "pharmacyName"],
        threshold: 0.3,
      }),
    [allMedicines]
  );

  // Apply filters & fuzzy search
  useEffect(() => {
    let results = [...allMedicines];

    // Fuzzy search only if user typed something
    if (search.trim() !== "") {
      results = fuse.search(search).map((r) => r.item);
    }

    // Filter by pharmacy
    if (filters.pharmacy)
      results = results.filter(
        (m) =>
          m.pharmacyName.toLowerCase() === filters.pharmacy.toLowerCase()
      );

    // Filter by price
    if (filters.priceRange !== "all") {
      if (filters.priceRange === "low") results = results.filter((m) => m.price < 100);
      else if (filters.priceRange === "medium")
        results = results.filter((m) => m.price >= 100 && m.price <= 500);
      else if (filters.priceRange === "high")
        results = results.filter((m) => m.price > 500);
    }

    // In-stock filter
    if (filters.inStockOnly) results = results.filter((m) => m.quantity > 0);

    setFilteredMedicines(results);
  }, [search, filters, allMedicines]);

  return (
    <div className="medicines-page fade-in">
      <header className="page-header slide-down">
        <h1>💊 Smart Medicine Finder</h1>
        <p>
          Browse all medicines, filter by price, pharmacy, or stock, and add to cart instantly.
        </p>
      </header>

      {/* ===== Filters ===== */}
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
          {[...new Set(allMedicines.map((m) => m.pharmacyName))].map(
            (name, i) => (
              <option key={i} value={name}>
                {name}
              </option>
            )
          )}
        </select>

        <select
          value={filters.priceRange}
          onChange={(e) =>
            setFilters({ ...filters, priceRange: e.target.value })
          }
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

      {/* ===== Medicines Display ===== */}
      {loading ? (
        <p className="loading-text">Loading medicines...</p>
      ) : filteredMedicines.length === 0 ? (
        <p className="no-results">No medicines found.</p>
      ) : (
        <section className="medicines-grid fade-up">
          {filteredMedicines.map((med, index) => (
            <div
              key={index}
              className={`medicine-card ${
                med.quantity <= 0 ? "out-of-stock" : ""
              }`}
            >
              <h3>
                {med.name}{" "}
                {med.quantity <= 0 && (
                  <span className="stock-label">Out of Stock</span>
                )}
              </h3>
              <p>
                <strong>Pharmacy:</strong> {med.pharmacyName}
              </p>
              <p>
                <strong>Price:</strong> ₹{med.price}
              </p>
              <p>
                <strong>Quantity:</strong> {med.quantity}
              </p>
              <p className="address">{med.address}</p>
              <button
                className="add-cart-btn"
                onClick={() => addToCart(med)}
                disabled={med.quantity <= 0}
              >
                🛒 {med.quantity <= 0 ? "Unavailable" : "Add to Cart"}
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default Medicines;
