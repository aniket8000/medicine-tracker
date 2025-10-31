import React, { useState } from "react";
import AddPharmacy from "./components/AddPharmacy";
import PharmacyList from "./components/PharmacyList";
import "./index.css";

// Main App component that connects add and list sections
function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshData = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="app-container">
      <h1>💊 Medicine Tracker Dashboard</h1>
      <p style={{ textAlign: "center", color: "#555" }}>
        Manage pharmacies and their medicine stocks in one place
      </p>

      <div className="card" style={{ marginTop: "30px" }}>
        <AddPharmacy onAddSuccess={refreshData} />
      </div>

      <PharmacyList refreshKey={refreshKey} onUpdate={refreshData} />
    </div>
  );
}

export default App;
