import React, { useState } from "react";
import AddPharmacy from "../components/AddPharmacy";
import PharmacyList from "../components/PharmacyList";
import { useAuth } from "../context/AuthContext";
import "../styles/global.css";

const Pharmacies = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshData = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="pharmacies-page fade-in">
      <header className="page-header slide-down">
        <h1>🏪 Manage Pharmacies</h1>
        <p>View all registered pharmacies and their medicine stock details.</p>
      </header>

      {/* Show AddPharmacy only for Admins */}
      {user?.role === "admin" && (
        <section className="add-section fade-up">
          <h2>Add New Pharmacy</h2>
          <p className="section-subtitle">
            Fill in the details below to register a new pharmacy.
          </p>
          <AddPharmacy onAddSuccess={refreshData} />
        </section>
      )}

      <section className="list-section fade-up">
        <h2>Available Pharmacies</h2>
        <PharmacyList refreshKey={refreshKey} onUpdate={refreshData} />
      </section>
    </div>
  );
};

export default Pharmacies;
