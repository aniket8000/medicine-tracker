import React from "react";
import "../styles/global.css"; // ensure global.css is imported

const Dashboard = () => {
  return (
    <div className="dashboard-container fade-in">
      {/* ======= Header Section ======= */}
      <section className="hero-section slide-down">
        <h1>Welcome to <span className="highlight">Medicine Tracker</span></h1>
        <p>
          Manage pharmacies, medicines, and availability — all in one simple dashboard.
        </p>
        <button className="hero-btn">Get Started</button>
      </section>

      {/* ======= Stats Cards Section ======= */}
      <section className="stats-section fade-up">
        <div className="stat-card">
          <h3>🏪 Pharmacies</h3>
          <p>Manage all registered pharmacies and their stock levels.</p>
        </div>

        <div className="stat-card">
          <h3>💊 Medicines</h3>
          <p>Track and update medicine data across multiple stores.</p>
        </div>

        <div className="stat-card">
          <h3>🔍 Search</h3>
          <p>Find which pharmacy has your needed medicine instantly.</p>
        </div>
      </section>

      {/* ======= Info Section ======= */}
      <section className="info-section fade-up">
        <h2>📍 Quick Overview</h2>
        <p>
          Add new pharmacies, manage medicine inventory, and help users locate medicines faster.
        </p>
      </section>
    </div>
  );
};

export default Dashboard;
