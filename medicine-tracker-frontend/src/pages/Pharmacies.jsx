// Pharmacies.jsx
// Main page to manage and display pharmacies
// Uses PharmacyList and AddPharmacy with modern UI

import React, { useState } from "react";
import AddPharmacy from "../components/AddPharmacy";
import PharmacyList from "../components/PharmacyList";
import "../styles/global.css";

const Pharmacies = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="pharmacies-page fade-in">
      {/* ===== Page Header ===== */}
      <header className="page-header slide-down">
        <h1>🏪 Manage Pharmacies</h1>
        <p>
          Add new pharmacies, update details, and keep track of medicine stock
          in one place.
        </p>
      </header>

      {/* ===== Add Pharmacy Section ===== */}
      <section className="add-section fade-up">
        <h2>Add New Pharmacy</h2>
        <p className="section-subtitle">
          Fill in the details below to register a new pharmacy and add its
          medicines.
        </p>
        <AddPharmacy onAddSuccess={refreshData} />
      </section>

      {/* ===== Pharmacy List Section ===== */}
      <section className="list-section fade-up">
        <h2>Available Pharmacies</h2>
        <PharmacyList refreshKey={refreshKey} onUpdate={refreshData} />
      </section>
    </div>
  );
};

export default Pharmacies;
