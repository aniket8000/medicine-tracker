import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/global.css";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/pharmacies");
        const all = [];
        res.data.forEach((pharmacy) => {
          pharmacy.medicines.forEach((m) => {
            all.push({
              ...m,
              pharmacyName: pharmacy.name,
              contact: pharmacy.contact,
              address: pharmacy.address,
            });
          });
        });
        setMedicines(all);
      } catch (err) {
        console.error("Error fetching medicines:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="medicines-page fade-in">
      <header className="page-header slide-down">
        <h1>💊 Medicines Directory</h1>
        <p>Browse available medicines with prices and pharmacy details.</p>
      </header>

      <div className="search-section fade-up">
        <input
          type="text"
          placeholder="🔍 Search medicine by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
      </div>

      {loading && <p className="loading-text">Loading medicines...</p>}

      <section className="medicines-grid fade-up">
        {filtered.length === 0 && !loading ? (
          <p className="no-results">No medicines found.</p>
        ) : (
          filtered.map((med, index) => (
            <div key={index} className="medicine-card">
              <h3>{med.name}</h3>
              <p><strong>Pharmacy:</strong> {med.pharmacyName}</p>
              <p><strong>Qty:</strong> {med.quantity} | <strong>Price:</strong> ₹{med.price}</p>
              <p><strong>Contact:</strong> {med.contact}</p>
              <p className="address">{med.address}</p>

              {/* Add to Cart visible only for customers */}
              {user?.role === "customer" && (
                <button
                  className="add-cart-btn"
                  onClick={() => addToCart(med)}
                >
                  🛒 Add to Cart
                </button>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Medicines;
