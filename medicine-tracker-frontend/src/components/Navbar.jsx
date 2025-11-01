// Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [results, setResults] = useState([]);
  const searchRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Fetch pharmacy + medicine data once for search
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/pharmacies");
        const allMedicines = [];
        res.data.forEach((pharmacy) => {
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
      }
    };
    fetchData();
  }, []);

  // Filter medicines dynamically
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }
    const filtered = medicines.filter((m) =>
      m.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query, medicines]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
        setQuery("");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="logo">💊 Medicine Tracker</span>
      </div>

      <div className="nav-right" ref={searchRef}>
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Dashboard
        </Link>
        <Link
          to="/pharmacies"
          className={location.pathname === "/pharmacies" ? "active" : ""}
        >
          Pharmacies
        </Link>
        <Link
          to="/medicines"
          className={location.pathname === "/medicines" ? "active" : ""}
        >
          Medicines
        </Link>

        {/* 🔍 Search icon toggle */}
        {!showSearch && (
          <button
            className="search-icon-btn"
            onClick={() => setShowSearch(true)}
          >
            🔍
          </button>
        )}

        {/* Search input inline */}
        {showSearch && (
          <div className="inline-search fade-in">
            <input
              type="text"
              placeholder="Search medicine..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button onClick={() => setShowSearch(false)} className="close-icon">
              ✖
            </button>

            {/* Dropdown Results */}
            {results.length > 0 && (
              <div className="search-dropdown">
                {results.slice(0, 5).map((r, i) => (
                  <div key={i} className="search-item">
                    <strong>{r.name}</strong>
                    <p>
                      {r.pharmacyName} — ₹{r.price} | Qty: {r.quantity}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
