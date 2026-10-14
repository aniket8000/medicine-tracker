import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import "../styles/global.css";
import api from "../api/axios";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", address: "", contact: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.contact) {
      alert("Please fill all fields!");
      return;
    }
    setStep(2);
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    setOrderError("");
    try {
      const res = await api.post("/orders", {
        name: form.name,
        contact: form.contact,
        address: form.address,
        // Prices and the total are calculated by the server from live stock
        items: cart.map((item) => ({
          pharmacyId: item.pharmacyId,
          name: item.name,
          quantity: item.quantity || 1,
        })),
      });

      setConfirmedOrder(res.data);
      setStep(3);
      clearCart();
    } catch (err) {
      console.error("Order save failed:", err.message);
      // Show the server's reason (e.g. "Only 3 of X left in stock") when there is one
      setOrderError(
        err.response?.data?.message ||
          "Something went wrong placing your order. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-page fade-in">
      {step === 1 && (
        <form onSubmit={handleNext} className="checkout-form slide-down">
          <h2>🏠 Shipping Details</h2>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Delivery Address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={form.contact}
            onChange={handleChange}
            required
          />
          <button type="submit" className="primary-btn">
            Next ➡️
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="checkout-summary slide-up">
          <h2>🧾 Order Summary</h2>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Qty</th>
                <th>Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.quantity || 1}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>
            Total: ₹
            {cart.reduce(
              (sum, item) => sum + item.price * (item.quantity || 1),
              0
            )}
          </h3>

          {orderError && <p className="message error">{orderError}</p>}

          <div style={{ marginTop: "20px" }}>
            <button className="secondary-btn" onClick={() => setStep(1)}>
              ⬅️ Back
            </button>
            <button
              className="primary-btn"
              onClick={handleConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm Purchase ✅"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="checkout-success fade-up">
          <div className="success-animation">🎉</div>
          <h2>Order Confirmed!</h2>
          {confirmedOrder?._id && (
            <p className="order-id">
              Order #{confirmedOrder._id.slice(-8).toUpperCase()}
            </p>
          )}
          <p>
            A confirmation email is on its way. Thanks for shopping with
            MedFinder!
          </p>
          <button
            className="primary-btn"
            onClick={() => (window.location.href = "/")}
          >
            Go Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
