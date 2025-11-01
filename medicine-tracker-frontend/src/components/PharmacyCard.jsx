// PharmacyCard.jsx
// Small, reusable card component that displays one pharmacy.
// Props:
// - pharmacy: the pharmacy object
// - onEdit: function to call when user clicks Edit (passes pharmacy object)

import React from "react";

const PharmacyCard = ({ pharmacy, onEdit }) => {
  return (
    <div className="pharmacy-card">
      <h3 style={{ color: "#2563eb", marginBottom: "8px" }}>{pharmacy.name}</h3>

      <p style={{ margin: "6px 0" }}>
        <strong>Address:</strong> {pharmacy.address}
      </p>

      <p style={{ margin: "6px 0" }}>
        <strong>Contact:</strong> {pharmacy.contact}
      </p>

      <div style={{ marginTop: "8px", fontSize: "14px", color: "#333" }}>
        <strong>Medicines:</strong>
        <div style={{ marginTop: "6px" }}>
          {pharmacy.medicines && pharmacy.medicines.length > 0 ? (
            pharmacy.medicines.map((m, i) => (
              <div key={i}>
                {m.name} (Qty: {m.quantity}, ₹{m.price})
              </div>
            ))
          ) : (
            <div style={{ color: "#777" }}>No medicines listed</div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => onEdit(pharmacy)}
          style={{
            background: "#2563eb",
            color: "white",
            padding: "6px 10px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default PharmacyCard;
