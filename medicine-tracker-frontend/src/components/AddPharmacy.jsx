// This component lets me add a pharmacy with multiple medicines.
// The buttons are now properly aligned — "Add Medicine" on the left,
// and "Save Pharmacy" on the right with good spacing.

import React, { useState } from "react";
import axios from "axios";

const AddPharmacy = ({ onAddSuccess }) => {
  const [form, setForm] = useState({ name: "", address: "", contact: "" });
  const [medicines, setMedicines] = useState([{ name: "", quantity: "", price: "" }]);
  const [message, setMessage] = useState("");

  // Handle change in pharmacy basic details
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle change for each medicine input
  const handleMedicineChange = (i, e) => {
    const list = [...medicines];
    list[i][e.target.name] = e.target.value;
    setMedicines(list);
  };

  // Add a new blank medicine row
  const addMedicineRow = () => {
    setMedicines([...medicines, { name: "", quantity: "", price: "" }]);
  };

  // Submit the form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPharmacy = { ...form, medicines };
      await axios.post("http://localhost:5000/api/pharmacies", newPharmacy);
      setMessage("Pharmacy added successfully ✅");
      setForm({ name: "", address: "", contact: "" });
      setMedicines([{ name: "", quantity: "", price: "" }]);
      onAddSuccess();
    } catch {
      setMessage("Failed to add pharmacy ❌");
    }
  };

  return (
    <div>
      <h3>Add New Pharmacy</h3>

      <form onSubmit={handleSubmit}>
        {/* Basic pharmacy info */}
        <div className="medicine-row">
          <input
            name="name"
            placeholder="Pharmacy Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <input
            name="contact"
            placeholder="Contact"
            value={form.contact}
            onChange={handleChange}
            required
          />
        </div>

        {/* Medicine list section */}
        <h4 style={{ marginTop: "15px" }}>Medicines</h4>
        {medicines.map((m, i) => (
          <div key={i} className="medicine-row">
            <input
              name="name"
              placeholder="Medicine Name"
              value={m.name}
              onChange={(e) => handleMedicineChange(i, e)}
              required
            />
            <input
              name="quantity"
              type="number"
              placeholder="Qty"
              value={m.quantity}
              onChange={(e) => handleMedicineChange(i, e)}
              required
            />
            <input
              name="price"
              type="number"
              placeholder="Price (₹)"
              value={m.price}
              onChange={(e) => handleMedicineChange(i, e)}
              required
            />
          </div>
        ))}

        {/* --- Buttons --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "15px",
          }}
        >
          {/* Add Medicine Button */}
          <button
            type="button"
            onClick={addMedicineRow}
            style={{
              backgroundColor: "#f0f4ff",
              color: "#2563eb",
              border: "1px solid #2563eb",
              padding: "8px 14px",
              borderRadius: "6px",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#e0ecff")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#f0f4ff")}
          >
            + Add Medicine
          </button>

          {/* Save Pharmacy Button */}
          <button
            type="submit"
            style={{
              backgroundColor: "#2563eb",
              color: "#fff",
              padding: "8px 18px",
              borderRadius: "6px",
              fontWeight: "500",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#1e40af")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
          >
            Save Pharmacy
          </button>
        </div>
      </form>

      {/* Success/Error Message */}
      {message && (
        <p
          className={`message ${
            message.includes("success") ? "success" : "error"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AddPharmacy;
