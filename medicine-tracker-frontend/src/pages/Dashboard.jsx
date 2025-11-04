import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container fade-in">
      {/* ======= Hero Section ======= */}
      <section className="hero-section slide-down">
        <h1>
          Welcome to <span className="highlight">Medicine Tracker</span>
        </h1>
        <p>
          Manage pharmacies, medicines, and availability — all in one simple dashboard.
        </p>
        <button className="hero-btn" onClick={() => navigate("/pharmacies")}>
          Get Started
        </button>
      </section>

      {/* ======= Feature Cards ======= */}
      <section className="stats-section fade-up">
        <div
          className="stat-card clickable"
          onClick={() => navigate("/pharmacies")}
        >
          <h3>🏪 Pharmacies</h3>
          <p>Manage all registered pharmacies and their stock levels.</p>
        </div>

        <div
          className="stat-card clickable"
          onClick={() => navigate("/medicines")}
        >
          <h3>💊 Medicines</h3>
          <p>Track and update medicine data across multiple stores.</p>
        </div>
      </section>

      {/* ======= About Section ======= */}
      <section className="info-section fade-up">
        <h2>💡 About Us</h2>
        <p>
          Medicine Tracker is a simple web app that helps users find medicines
          quickly and lets pharmacy owners manage inventory easily. Our goal is
          to make healthcare access faster, smarter, and more organized.
        </p>
      </section>
    </div>
  );
};

export default Dashboard;
