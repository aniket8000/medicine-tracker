// Medicines.jsx
// Lists all medicines across pharmacies, with search and animated UI

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/global.css";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/pharmacies");
        const data = res.data;

        // Extract all medicines from pharmacies
        const allMedicines = [];
        data.forEach((pharmacy) => {
          pharmacy.medicines.forEach((m) => {
            allMedicines.push({
              ...m,
              pharmacyName: pharmacy.name,
              contact: pharmacy.contact,
              address: pharmacy.address,
            });
          });
        });

        setMedicines(allMedicines);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  // Filter medicines based on search input
  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="medicines-page fade-in">
      {/* ===== Header Section ===== */}
      <header className="page-header slide-down">
        <h1>💊 Medicines Directory</h1>
        <p>
          Search and view all available medicines with their stock and prices across pharmacies.
        </p>
      </header>

      {/* ===== Search Section ===== */}
      <div className="search-section fade-up">
        <input
          type="text"
          placeholder="🔍 Search medicine by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
      </div>

      {/* ===== Loading State ===== */}
      {loading && <p className="loading-text">Loading medicines...</p>}

      {/* ===== Medicines List ===== */}
      <section className="medicines-grid fade-up">
        {filtered.length === 0 && !loading ? (
          <p className="no-results">No medicines found.</p>
        ) : (
          filtered.map((med, index) => (
            <div key={index} className="medicine-card">
              <h3>{med.name}</h3>
              <p>
                <strong>Pharmacy:</strong> {med.pharmacyName}
              </p>
              <p>
                <strong>Qty:</strong> {med.quantity} | <strong>Price:</strong> ₹{med.price}
              </p>
              <p>
                <strong>Contact:</strong> {med.contact}
              </p>
              <p className="address">{med.address}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Medicines;
