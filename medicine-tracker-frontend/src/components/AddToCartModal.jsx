import React, { useState } from "react";
import Modal from "./Modal";
import "../styles/global.css";

const AddToCartModal = ({ medicine, onConfirm, onClose }) => {
  const [qty, setQty] = useState(1);

  if (!medicine) return null;

  // Keep the quantity a whole number between 1 and the available stock
  const clampQty = (value) => {
    const n = parseInt(value, 10);
    if (Number.isNaN(n)) return 1;
    return Math.max(1, Math.min(medicine.quantity, n));
  };

  const handleAdd = () => {
    onConfirm({ ...medicine, selectedQty: clampQty(qty) });
    onClose();
  };

  return (
    <Modal onClose={onClose} className="slide-up">
      <h2>Add to Cart</h2>
        <p>
          <strong>{medicine.name}</strong> <br />
          <small>From: {medicine.pharmacyName}</small> <br />
          <small>Price: ₹{medicine.price}</small>
        </p>

        <div className="qty-controls">
          <button
            onClick={() => setQty((q) => clampQty(clampQty(q) - 1))}
            className="qty-btn"
          >
            −
          </button>
          <input
            type="number"
            value={qty}
            min="1"
            max={medicine.quantity}
            // Allow the field to be briefly empty while typing; clamp otherwise
            onChange={(e) =>
              setQty(e.target.value === "" ? "" : clampQty(e.target.value))
            }
            onBlur={() => setQty(clampQty(qty))}
            className="qty-input"
          />
          <button
            onClick={() =>
              setQty((q) => clampQty(clampQty(q) + 1))
            }
            className="qty-btn"
          >
            +
          </button>
        </div>

        <div className="modal-actions">
          <button className="confirm-btn" onClick={handleAdd}>
            ✅ Add {clampQty(qty)} to Cart
          </button>
          <button className="cancel-btn" onClick={onClose}>
            ❌ Cancel
          </button>
        </div>
    </Modal>
  );
};

export default AddToCartModal;
