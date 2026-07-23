// PharmacyCard.jsx
import React, { useState } from "react";
import Modal from "./Modal";

const PharmacyCard = ({ pharmacy, onEdit, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="pharmacy-card">
      <h3 className="pharmacy-card-title">{pharmacy.name}</h3>

      <p><strong>Address:</strong> {pharmacy.address || "N/A"}</p>
      <p><strong>Contact:</strong> {pharmacy.contact || "N/A"}</p>

      <div className="pharmacy-card-medicines">
        <strong>Medicines:</strong>
        <div style={{ marginTop: "6px" }}>
          {pharmacy.medicines?.length ? (
            pharmacy.medicines.map((m, i) => (
              <div key={i}>
                {m.name} (Qty: {m.quantity}, ₹{m.price})
              </div>
            ))
          ) : (
            <div className="pharmacy-card-empty">No medicines</div>
          )}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      {typeof onEdit === "function" && (
        <div className="pharmacy-card-actions">
          <button onClick={() => onEdit(pharmacy)} className="btn-outline">
            ✏️ Edit
          </button>

          <button onClick={() => setShowConfirm(true)} className="delete-btn">
            ❌ Delete
          </button>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showConfirm && (
        <Modal
          onClose={() => setShowConfirm(false)}
          contentStyle={{ width: "320px", textAlign: "center" }}
        >
          <h3 style={{ marginBottom: "10px" }}>Delete Pharmacy?</h3>
          <p style={{ marginBottom: "20px" }}>{pharmacy.name}</p>

          <div className="modal-actions" style={{ justifyContent: "space-around" }}>
            <button onClick={() => setShowConfirm(false)} className="secondary-btn">
              Cancel
            </button>

            <button
              onClick={() => {
                onDelete(pharmacy._id);
                setShowConfirm(false);
              }}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PharmacyCard;
