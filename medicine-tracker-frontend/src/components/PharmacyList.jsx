import React, { useEffect, useState } from "react";
import axios from "axios";

const PharmacyList = ({ refreshKey, onUpdate }) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/pharmacies");
        setPharmacies(res.data);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchPharmacies();
  }, [refreshKey]);

  const openEdit = (pharmacy) => setEditData({ ...pharmacy });
  const closeEdit = () => setEditData(null);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleMedicineChange = (i, e) => {
    const meds = [...editData.medicines];
    meds[i][e.target.name] = e.target.value;
    setEditData({ ...editData, medicines: meds });
  };

  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/pharmacies/${editData._id}`, editData);
      alert("Pharmacy updated ✅");
      onUpdate();
      closeEdit();
    } catch {
      alert("Update failed ❌");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="message error">{error}</p>;

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Available Pharmacies</h3>
      {pharmacies.length === 0 ? (
        <p>No pharmacies found.</p>
      ) : (
        <div className="pharmacy-grid">
          {pharmacies.map((p) => (
            <div key={p._id} className="card">
              <h4 style={{ color: "#2563eb" }}>{p.name}</h4>
              <p><strong>Address:</strong> {p.address}</p>
              <p><strong>Contact:</strong> {p.contact}</p>
              <div style={{ marginTop: "8px" }}>
                <strong>Medicines:</strong>
                {p.medicines.map((m, i) => (
                  <div key={i}>{m.name} (Qty: {m.quantity}, ₹{m.price})</div>
                ))}
              </div>
              <button onClick={() => openEdit(p)} style={{ marginTop: "10px" }}>
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {editData && (
        <div className="modal-overlay" onClick={closeEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Pharmacy</h3>
            <input name="name" value={editData.name} onChange={handleEditChange} />
            <input name="address" value={editData.address} onChange={handleEditChange} />
            <input name="contact" value={editData.contact} onChange={handleEditChange} />

            <h4 style={{ marginTop: "10px" }}>Medicines</h4>
            {editData.medicines.map((m, i) => (
              <div key={i} className="medicine-row">
                <input name="name" value={m.name} onChange={(e) => handleMedicineChange(i, e)} />
                <input name="quantity" type="number" value={m.quantity} onChange={(e) => handleMedicineChange(i, e)} />
                <input name="price" type="number" value={m.price} onChange={(e) => handleMedicineChange(i, e)} />
              </div>
            ))}
            <div style={{ marginTop: "15px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={saveEdit}>Save</button>
              <button onClick={closeEdit} style={{ backgroundColor: "gray" }}>
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
