// PharmacyCard.jsx
import React, { useState } from "react";

const PharmacyCard = ({ pharmacy, onEdit, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div
      className="pharmacy-card"
      style={{
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        padding: "16px",
        transition: "0.2s",
        position: "relative",
      }}
    >
      <h3 style={{ color: "#2563eb", marginBottom: "8px" }}>
        {pharmacy.name}
      </h3>

      <p><strong>Address:</strong> {pharmacy.address || "N/A"}</p>
      <p><strong>Contact:</strong> {pharmacy.contact || "N/A"}</p>

      <div style={{ marginTop: "8px", fontSize: "14px" }}>
        <strong>Medicines:</strong>
        <div style={{ marginTop: "6px" }}>
          {pharmacy.medicines?.length ? (
            pharmacy.medicines.map((m, i) => (
              <div key={i}>
                {m.name} (Qty: {m.quantity}, ₹{m.price})
              </div>
            ))
          ) : (
            <div style={{ color: "#777" }}>No medicines</div>
          )}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      {typeof onEdit === "function" && (
        <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
          {/* EDIT */}
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
            ✏️ Edit
          </button>

          {/* DELETE */}
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              background: "#ef4444",
              color: "white",
              padding: "6px 10px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            ❌ Delete
          </button>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 5000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>Delete Pharmacy?</h3>
            <p style={{ marginBottom: "20px" }}>{pharmacy.name}</p>

            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  padding: "6px 12px",
                  background: "gray",
                  color: "white",
                  borderRadius: "6px",
                }}
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onDelete(pharmacy._id);
                  setShowConfirm(false);
                }}
                style={{
                  padding: "6px 12px",
                  background: "#d11a2a",
                  color: "white",
                  borderRadius: "6px",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyCard;
