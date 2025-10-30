import React, { useEffect, useState } from "react";
import axios from "axios";

const PharmacyList = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/pharmacies");
        setPharmacies(res.data);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchPharmacies();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Available Pharmacies</h2>
      {pharmacies.length === 0 ? (
        <p>No pharmacies found.</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Contact</th>
              <th>Medicines</th>
            </tr>
          </thead>
          <tbody>
            {pharmacies.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.address}</td>
                <td>{p.contact}</td>
                <td>
                  {p.medicines.map((m, i) => (
                    <div key={i}>
                      {m.name} (Qty: {m.quantity}, ₹{m.price})
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PharmacyList;
