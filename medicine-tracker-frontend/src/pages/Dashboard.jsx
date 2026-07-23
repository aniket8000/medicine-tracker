import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/global.css";

const FEATURES = [
  {
    icon: "🔎",
    title: "Real-Time Availability",
    desc: "See live stock levels for every medicine before you travel to a pharmacy.",
  },
  {
    icon: "💰",
    title: "Transparent Pricing",
    desc: "Compare prices for the same medicine across multiple nearby pharmacies.",
  },
  {
    icon: "🗺️",
    title: "Nearby Discovery",
    desc: "Find pharmacies close to you using live map search powered by OpenStreetMap.",
  },
  {
    icon: "🛒",
    title: "Simple Ordering",
    desc: "Add medicines to your cart and check out in a few clicks — no phone calls needed.",
  },
  {
    icon: "🏪",
    title: "Pharmacy Management",
    desc: "Pharmacy admins can list stock, update quantities, and manage listings in real time.",
  },
  {
    icon: "🔐",
    title: "Secure Accounts",
    desc: "Role-based access keeps customer and admin actions safely separated.",
  },
];

const STEPS = [
  {
    title: "Search",
    desc: "Look up the medicine you need by name, category, or nearby pharmacy.",
  },
  {
    title: "Compare",
    desc: "Check price, stock, and distance across all listed pharmacies instantly.",
  },
  {
    title: "Get It",
    desc: "Add to cart, checkout, or get directions straight to the pharmacy.",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get("/pharmacies");
        const pharmacies = res.data;

        const uniqueMedicines = new Set();
        const uniqueAreas = new Set();

        pharmacies.forEach((p) => {
          p.medicines?.forEach((m) => uniqueMedicines.add(m.name));
          const area = p.address?.split(",")[1]?.trim();
          if (area) uniqueAreas.add(area);
        });

        setStats({
          pharmacyCount: pharmacies.length,
          medicineCount: uniqueMedicines.size,
          areaCount: uniqueAreas.size,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      }
    };

    loadStats();
  }, []);

  const STATS = [
    { number: stats ? `${stats.pharmacyCount}` : "—", label: "Pharmacies Listed" },
    { number: stats ? `${stats.medicineCount}` : "—", label: "Medicines Tracked" },
    { number: stats ? `${stats.areaCount}` : "—", label: "Areas Covered" },
    { number: "24/7", label: "Live Availability" },
  ];

  return (
    <div className="dashboard-container fade-in">
      {/* ======= Hero Section ======= */}
      <section className="hero-section slide-down">
        <h1>
          Welcome to <span className="highlight">MedFinder</span>
        </h1>
        <p>
          Find the medicine you need at a pharmacy near you — with real
          stock, real prices, and zero guesswork.
        </p>
        <button className="hero-btn" onClick={() => navigate("/medicines")}>
          Get Started
        </button>
      </section>

      {/* ======= Stats Banner ======= */}
      <section className="stats-banner fade-up">
        {STATS.map((s, i) => (
          <div className="stat-block" key={i}>
            <span className="stat-number">{s.number}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ======= Feature Cards ======= */}
      <section className="fade-up">
        <div className="section-heading">
          <h2>Everything you need, in one place</h2>
          <p>
            MedFinder brings pharmacies, medicine stock, and pricing together
            so you never have to call around town again.
          </p>
        </div>

        <div className="features-section">
          {FEATURES.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ======= How It Works ======= */}
      <section className="fade-up">
        <div className="section-heading">
          <h2>How MedFinder Works</h2>
          <p>Three simple steps between you and the medicine you need.</p>
        </div>

        <div className="steps-section">
          {STEPS.map((s, i) => (
            <div className="step-card" key={i}>
              <div className="step-number">{i + 1}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ======= Quick Links ======= */}
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

        <div className="stat-card clickable" onClick={() => navigate("/map")}>
          <h3>🗺️ Map Search</h3>
          <p>Locate nearby pharmacies directly through an interactive map.</p>
        </div>
      </section>

      {/* ======= About Section ======= */}
      <section className="info-section fade-up">
        <h2>💡 About Us</h2>
        <p>
          MedFinder helps users find medicines quickly and lets pharmacy
          owners manage inventory easily. Our goal is to make healthcare
          access faster, smarter, and more organized — starting with
          knowing exactly where to go before you leave the house.
        </p>
      </section>

      {/* ======= CTA Banner ======= */}
      <section className="cta-banner fade-up">
        <h2>Ready to find your medicine?</h2>
        <p>Search live stock across nearby pharmacies in seconds.</p>
        <button className="primary-btn" onClick={() => navigate("/medicines")}>
          Browse Medicines
        </button>
      </section>
    </div>
  );
};

export default Dashboard;
