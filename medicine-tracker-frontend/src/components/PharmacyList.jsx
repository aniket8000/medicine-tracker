// PharmacyList.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import PharmacyCard from "./PharmacyCard";
import Pagination from "./Pagination";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 12;

const PharmacyList = ({ refreshKey = 0, onUpdate }) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(1);
  const { user } = useAuth();

  const fetchPharmacies = async () => {
    setLoading(true);
    try {
      const res = await api.get("/pharmacies");
      setPharmacies(res.data);
      setPage(1);
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
      await api.delete(`/pharmacies/${id}`);
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
      await api.put(`/pharmacies/${editData._id}`, editData);
      closeEdit();
      fetchPharmacies();
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <p className="loading-text">Loading pharmacies...</p>;
  if (error) return <p className="error-text">{error}</p>;

  if (pharmacies.length === 0) {
    return (
      <div className="empty-state fade-up">
        <div className="empty-icon">🏪</div>
        <h3>No pharmacies registered yet</h3>
        <p>
          {user?.role === "admin"
            ? "Add your first pharmacy using the form above."
            : "Check back soon, or explore the map to find pharmacies nearby."}
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(pharmacies.length / PAGE_SIZE);
  const paginatedPharmacies = pharmacies.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div style={{ marginTop: "24px" }}>
      <p className="section-subtitle">
        {pharmacies.length} pharmac{pharmacies.length === 1 ? "y" : "ies"} available
      </p>
      <div className="results-grid">
        {paginatedPharmacies.map((p) => (
          <PharmacyCard
            key={p._id}
            pharmacy={p}
            onEdit={user?.role === "admin" ? openEdit : undefined}
            onDelete={user?.role === "admin" ? deletePharmacy : undefined}
          />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Edit Modal */}
      {user?.role === "admin" && editData && (
        <Modal onClose={closeEdit}>
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
              <button onClick={() => removeMedicineRow(idx)} className="delete-btn">
                Remove
              </button>
            </div>
          ))}

          <button onClick={addMedicineRow} className="btn-outline modal-add-btn">
            + Add Medicine
          </button>

          <div className="modal-actions">
            <button onClick={closeEdit} className="secondary-btn">
              Cancel
            </button>
            <button onClick={saveEdit} className="primary-btn">
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PharmacyList;
