import React, { useState } from "react";
import axios from "axios";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const res = await axios.get("http://localhost:5000/api/pharmacies");
      const filtered = res.data.filter((p) =>
        p.medicines.some((m) =>
          m.name.toLowerCase().includes(query.toLowerCase())
        )
      );
      setResults(filtered);
    } catch {
      setResults([]);
    }
  };

  return (
    <div className="page fade-in">
      <h2>Find a Medicine</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search medicine name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="results-grid">
        {results.length === 0 ? (
          <p className="no-results">No results found.</p>
        ) : (
          results.map((p) => (
            <div key={p._id} className="pharmacy-card fade-up">
              <h3>{p.name}</h3>
              <p>
                <b>Address:</b> {p.address}
              </p>
              <p>
                <b>Contact:</b> {p.contact}
              </p>
              <p>
                <b>Medicines:</b>
              </p>
              <ul>
                {p.medicines.map((m, i) => (
                  <li key={i}>
                    {m.name} (Qty: {m.quantity}, ₹{m.price})
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Search;
