import React, { useState } from "react";
import "../styles/global.css";

const AddToCartModal = ({ medicine, onConfirm, onClose }) => {
  const [qty, setQty] = useState(1);

  if (!medicine) return null;

  const handleAdd = () => {
    onConfirm({ ...medicine, selectedQty: qty });
    onClose();
  };

  return (
    <div className="modal-overlay fade-in">
      <div className="modal-content slide-up">
        <h2>Add to Cart</h2>
        <p>
          <strong>{medicine.name}</strong> <br />
          <small>From: {medicine.pharmacyName}</small> <br />
          <small>Price: ₹{medicine.price}</small>
        </p>

        <div className="qty-controls">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="qty-btn"
          >
            −
          </button>
          <input
            type="number"
            value={qty}
            min="1"
            max={medicine.quantity}
            onChange={(e) => setQty(Math.min(medicine.quantity, e.target.value))}
            className="qty-input"
          />
          <button
            onClick={() =>
              setQty((q) => Math.min(medicine.quantity, q + 1))
            }
            className="qty-btn"
          >
            +
          </button>
        </div>

        <div className="modal-actions">
          <button className="confirm-btn" onClick={handleAdd}>
            ✅ Add {qty} to Cart
          </button>
          <button className="cancel-btn" onClick={onClose}>
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
