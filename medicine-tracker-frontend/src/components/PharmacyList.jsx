// PharmacyList.jsx
// Fetches and renders all pharmacies in a grid using PharmacyCard.
// Includes an Edit modal so admin can update all fields (name, address, contact, medicines).

import React, { useEffect, useState } from "react";
import axios from "axios";
import PharmacyCard from "./PharmacyCard";

const PharmacyList = ({ refreshKey = 0, onUpdate }) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState(null); // holds pharmacy object being edited

  // Fetch pharmacies when component mounts or refreshKey changes
  useEffect(() => {
    let mounted = true;
    const fetchPharmacies = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("http://localhost:5000/api/pharmacies");
        if (mounted) setPharmacies(res.data);
      } catch (err) {
        if (mounted) setError("Failed to load pharmacies. Is backend running?");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPharmacies();
    return () => (mounted = false);
  }, [refreshKey]);

  // Open edit modal for a pharmacy
  const openEdit = (pharmacy) => {
    // clone to avoid mutating list directly
    setEditData(JSON.parse(JSON.stringify(pharmacy)));
  };

  // Close edit modal
  const closeEdit = () => setEditData(null);

  // Handle simple field edits (name, address, contact)
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Handle medicine field changes inside modal
  const handleMedicineChange = (index, e) => {
    const list = [...editData.medicines];
    list[index][e.target.name] = e.target.value;
    setEditData({ ...editData, medicines: list });
  };

  // Add a new medicine row in the modal
  const addMedicineRow = () => {
    const list = editData.medicines ? [...editData.medicines] : [];
    list.push({ name: "", quantity: "", price: "" });
    setEditData({ ...editData, medicines: list });
  };

  // Remove a medicine row in the modal
  const removeMedicineRow = (index) => {
    const list = [...editData.medicines];
    list.splice(index, 1);
    setEditData({ ...editData, medicines: list });
  };

  // Save edits by calling PUT API
  const saveEdit = async () => {
    try {
      // Ensure medicines array exists
      if (!editData.medicines) editData.medicines = [];
      await axios.put(
        `http://localhost:5000/api/pharmacies/${editData._id}`,
        editData
      );
      alert("Pharmacy updated successfully ✅");
      closeEdit();
      if (typeof onUpdate === "function") onUpdate();
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed ❌");
    }
  };

  if (loading) return <p>Loading pharmacies...</p>;
  if (error) return <p className="message error">{error}</p>;

  return (
    <div style={{ marginTop: "24px" }}>
      <h3>Available Pharmacies</h3>

      {pharmacies.length === 0 ? (
        <p>No pharmacies found.</p>
      ) : (
        <div className="results-grid">
          {pharmacies.map((p) => (
            <PharmacyCard key={p._id} pharmacy={p} onEdit={openEdit} />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editData && (
        <div className="modal-overlay" onClick={closeEdit}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3 style={{ marginTop: 0 }}>Edit Pharmacy</h3>

            <label style={{ display: "block", marginTop: "8px" }}>
              Name
            </label>
            <input
              name="name"
              value={editData.name}
              onChange={handleEditChange}
              style={{ width: "100%", marginTop: "6px" }}
            />

            <label style={{ display: "block", marginTop: "10px" }}>
              Address
            </label>
            <input
              name="address"
              value={editData.address}
              onChange={handleEditChange}
              style={{ width: "100%", marginTop: "6px" }}
            />

            <label style={{ display: "block", marginTop: "10px" }}>
              Contact
            </label>
            <input
              name="contact"
              value={editData.contact}
              onChange={handleEditChange}
              style={{ width: "100%", marginTop: "6px" }}
            />

            <h4 style={{ marginTop: "12px" }}>Medicines</h4>
            {editData.medicines && editData.medicines.length === 0 && (
              <p style={{ color: "#666" }}>No medicines — you can add some.</p>
            )}

            {(editData.medicines || []).map((m, idx) => (
              <div
                key={idx}
                className="medicine-row"
                style={{ marginTop: "8px", alignItems: "center" }}
              >
                <input
                  name="name"
                  placeholder="Medicine Name"
                  value={m.name}
                  onChange={(e) => handleMedicineChange(idx, e)}
                />
                <input
                  name="quantity"
                  placeholder="Qty"
                  value={m.quantity}
                  onChange={(e) => handleMedicineChange(idx, e)}
                />
                <input
                  name="price"
                  placeholder="Price (₹)"
                  value={m.price}
                  onChange={(e) => handleMedicineChange(idx, e)}
                />
                <button
                  type="button"
                  onClick={() => removeMedicineRow(idx)}
                  style={{
                    background: "#ef4444",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    marginLeft: "6px",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
              <button
                type="button"
                onClick={addMedicineRow}
                style={{
                  background: "#f0f4ff",
                  color: "#2563eb",
                  border: "1px solid #2563eb",
                  padding: "8px 12px",
                  borderRadius: "6px",
                }}
              >
                + Add Medicine
              </button>

              <button
                type="button"
                onClick={saveEdit}
                style={{
                  background: "#2563eb",
                  color: "white",
                  padding: "8px 14px",
                  borderRadius: "6px",
                }}
              >
                Save
              </button>

              <button
                type="button"
                onClick={closeEdit}
                style={{
                  background: "gray",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "6px",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyList;
