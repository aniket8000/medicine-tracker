import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import "../styles/global.css";
import axios from "axios";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", address: "", contact: "" });
  const [isProcessing, setIsProcessing] = useState(false);

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
    setTimeout(async () => {
      try {
        await axios.post("http://localhost:5000/api/orders", {
          user: form.name,
          contact: form.contact,
          address: form.address,
          items: cart,
          total: cart.reduce(
            (sum, item) => sum + item.price * (item.quantity || 1),
            0
          ),
        });
      } catch (err) {
        console.error("Order save failed:", err.message);
      }

      setStep(3);
      setIsProcessing(false);
      clearCart();
    }, 2000);
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
          <h2>Thank You for Your Purchase!</h2>
          <p>Your order has been placed successfully.</p>
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
