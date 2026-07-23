import React, { useState } from "react";
import AddPharmacy from "../components/AddPharmacy";
import PharmacyList from "../components/PharmacyList";
import { useAuth } from "../context/AuthContext";
import { useMapData } from "../context/MapContext";
import "../styles/global.css";

const Pharmacies = () => {
  const { user } = useAuth();
  const { nearbyPharmacies, userLocation } = useMapData(); // ✅ Now fetches from map context
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshData = () => setRefreshKey((prev) => prev + 1);

  const directionsUrl = (p) => {
    const params = new URLSearchParams({
      api: "1",
      destination: `${p.lat},${p.lon}`,
    });
    if (userLocation) params.set("origin", `${userLocation[0]},${userLocation[1]}`);
    return `https://www.google.com/maps/dir/?${params.toString()}`;
  };

  return (
    <div className="pharmacies-page fade-in">
      <header className="page-header slide-down">
        <h1>🏪 Manage Pharmacies</h1>
        <p>View all registered and nearby pharmacies with location details.</p>
      </header>

      {/* Admin-only add pharmacy */}
      {user?.role === "admin" && (
        <section className="add-section fade-up">
          <h2>Add New Pharmacy</h2>
          <p className="section-subtitle">
            Fill in the details below to register a new pharmacy.
          </p>
          <AddPharmacy onAddSuccess={refreshData} />
        </section>
      )}

      {/* Existing System Pharmacies */}
      <section className="list-section fade-up">
        <h2>Available Pharmacies</h2>
        <PharmacyList refreshKey={refreshKey} onUpdate={refreshData} />
      </section>

      {/* Nearby Pharmacies from Map */}
      {nearbyPharmacies?.length > 0 && (
        <section className="list-section fade-up">
          <h2>Nearby Pharmacies (Detected from Map)</h2>
          <div className="pharmacy-cards">
            {nearbyPharmacies.map((p) => (
              <div key={p.id} className="pharmacy-card fade-up">
                <h4>{p.name}</h4>
                <p><strong>Address:</strong> {p.address}</p>
                <a
                  href={directionsUrl(p)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="directions-btn"
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    background: "#2563eb",
                    color: "white",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  📍 Get Directions
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Pharmacies;
