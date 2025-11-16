// PharmacyList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import PharmacyCard from "./PharmacyCard";
import { useAuth } from "../context/AuthContext";

const PharmacyList = ({ refreshKey = 0, onUpdate }) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState(null);
  const { user } = useAuth();

  const fetchPharmacies = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/pharmacies");
      setPharmacies(res.data);
    } catch (err) {
      setError("Failed to load pharmacies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, [refreshKey]);

  // DELETE pharmacy
  const deletePharmacy = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/pharmacies/${id}`);
      fetchPharmacies(); // refresh UI
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const openEdit = (pharmacy) => setEditData(JSON.parse(JSON.stringify(pharmacy)));
  const closeEdit = () => setEditData(null);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleMedicineChange = (index, e) => {
    const list = [...editData.medicines];
    list[index][e.target.name] = e.target.value;
    setEditData({ ...editData, medicines: list });
  };

  const addMedicineRow = () => {
    const list = [...(editData.medicines || [])];
    list.push({ name: "", quantity: "", price: "" });
    setEditData({ ...editData, medicines: list });
  };

  const removeMedicineRow = (index) => {
    const list = [...editData.medicines];
    list.splice(index, 1);
    setEditData({ ...editData, medicines: list });
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/pharmacies/${editData._id}`,
        editData
      );
      closeEdit();
      fetchPharmacies();
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <p>Loading pharmacies...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ marginTop: "24px" }}>
      <h3>Available Pharmacies</h3>

      <div className="results-grid">
        {pharmacies.map((p) => (
          <PharmacyCard
            key={p._id}
            pharmacy={p}
            onEdit={user?.role === "admin" ? openEdit : undefined}
            onDelete={user?.role === "admin" ? deletePharmacy : undefined}
          />
        ))}
      </div>

      {/* Edit Modal */}
      {user?.role === "admin" && editData && (
        <div className="modal-overlay" onClick={closeEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Pharmacy</h3>

            <label>Name</label>
            <input name="name" value={editData.name} onChange={handleEditChange} />

            <label>Address</label>
            <input name="address" value={editData.address} onChange={handleEditChange} />

            <label>Contact</label>
            <input name="contact" value={editData.contact} onChange={handleEditChange} />

            <h4>Medicines</h4>

            {editData.medicines?.map((m, idx) => (
              <div key={idx} className="medicine-row">
                <input name="name" value={m.name} onChange={(e) => handleMedicineChange(idx, e)} />
                <input name="quantity" value={m.quantity} onChange={(e) => handleMedicineChange(idx, e)} />
                <input name="price" value={m.price} onChange={(e) => handleMedicineChange(idx, e)} />
                <button onClick={() => removeMedicineRow(idx)}>Remove</button>
              </div>
            ))}

            <button onClick={addMedicineRow}>+ Add Medicine</button>
            <button onClick={saveEdit}>Save</button>
            <button onClick={closeEdit}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyList;
