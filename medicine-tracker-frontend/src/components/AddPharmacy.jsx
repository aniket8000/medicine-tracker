import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AddPharmacy = ({ onAddSuccess }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", address: "", contact: "" });
  const [medicines, setMedicines] = useState([{ name: "", quantity: "", price: "" }]);
  const [message, setMessage] = useState("");

  // 🚫 Restrict access for non-admins
  if (!user || user.role !== "admin") {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h3>🔒 Access Restricted</h3>
        <p>Only admins can add or modify pharmacy details.</p>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleMedicineChange = (i, e) => {
    const list = [...medicines];
    list[i][e.target.name] = e.target.value;
    setMedicines(list);
  };

  const addMedicineRow = () =>
    setMedicines([...medicines, { name: "", quantity: "", price: "" }]);

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
        <div className="medicine-row">
          <input name="name" placeholder="Pharmacy Name" value={form.name} onChange={handleChange} required />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
          <input name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} required />
        </div>

        <h4 style={{ marginTop: "15px" }}>Medicines</h4>
        {medicines.map((m, i) => (
          <div key={i} className="medicine-row">
            <input name="name" placeholder="Medicine Name" value={m.name} onChange={(e) => handleMedicineChange(i, e)} required />
            <input name="quantity" type="number" placeholder="Qty" value={m.quantity} onChange={(e) => handleMedicineChange(i, e)} required />
            <input name="price" type="number" placeholder="Price (₹)" value={m.price} onChange={(e) => handleMedicineChange(i, e)} required />
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
          <button type="button" onClick={addMedicineRow} className="btn-outline">
            + Add Medicine
          </button>
          <button type="submit" className="btn-primary">Save Pharmacy</button>
        </div>
      </form>

      {message && (
        <p className={`message ${message.includes("success") ? "success" : "error"}`}>{message}</p>
      )}
    </div>
  );
};

export default AddPharmacy;
