import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Calculate total price
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  return (
    <div className="cart-page fade-in">
      <header className="page-header slide-down">
        <h1>🛒 Your Cart</h1>
        <p>Review your selected medicines and proceed to checkout.</p>
      </header>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-grid fade-up">
            {cart.map((item, index) => (
              <div key={index} className="cart-item-card">
                <h3>{item.name}</h3>
                <p>
                  <strong>Pharmacy:</strong> {item.pharmacyName}
                </p>
                <p>
                  <strong>Price:</strong> ₹{item.price}
                </p>
                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>
                <p>
                  <strong>Contact:</strong> {item.contact}
                </p>
                <p className="address">{item.address}</p>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.name)}
                >
                  ❌ Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary fade-up">
            <h2>Total: ₹{total}</h2>
            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout 💳
            </button>
            <button className="clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
