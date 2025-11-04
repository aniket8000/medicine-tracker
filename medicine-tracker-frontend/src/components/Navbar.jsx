import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/global.css";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const handleLogout = () => {
    logout();
    alert("Logged out successfully ✅");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="logo" onClick={() => navigate("/")}>
          💊 Medicine Tracker
        </span>
      </div>

      <div className="nav-center">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Dashboard
        </Link>

        {/* Pharmacies → Admin only */}
        {user?.role === "admin" && (
          <Link
            to="/pharmacies"
            className={location.pathname === "/pharmacies" ? "active" : ""}
          >
            Pharmacies
          </Link>
        )}

        {/* Medicines → Everyone */}
        <Link
          to="/medicines"
          className={location.pathname === "/medicines" ? "active" : ""}
        >
          Medicines
        </Link>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <span className="user-info">
              👤 {user.name || "User"} ({user.role})
            </span>

            {/* Cart visible only for customers */}
            {user.role === "customer" && (
              <Link to="/cart" className="cart-icon">
                🛒 Cart {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
              </Link>
            )}

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>Login</Link>
            <Link to="/register" className={location.pathname === "/register" ? "active" : ""}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
