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

  // Toast function (same style used in delete confirmation)
  const showToast = (msg) => {
    const toast = document.createElement("div");
    toast.className = "toast-message fade-in";
    toast.innerText = msg;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 2000);
  };

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully ✅");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* ===== Left (Logo) ===== */}
      <div className="nav-left" onClick={() => navigate("/")}>
        <span className="logo">MedFinder</span>
      </div>

      {/* ===== Center (Navigation Links) ===== */}
      <div className="nav-center">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Dashboard
        </Link>

        <Link
          to="/pharmacies"
          className={location.pathname === "/pharmacies" ? "active" : ""}
        >
          Pharmacies
        </Link>

        <Link
          to="/medicines"
          className={location.pathname === "/medicines" ? "active" : ""}
        >
          Medicines
        </Link>

        <Link
          to="/map"
          className={location.pathname === "/map" ? "active" : ""}
        >
          🗺️ Map
        </Link>
      </div>

      {/* ===== Right ===== */}
      <div className="nav-right">
        {user ? (
          <>
            <span className="user-info">
              👤 {user.name || "User"}{" "}
              <span className="user-role">({user.role})</span>
            </span>

            {user.role === "customer" && (
              <Link
                to="/cart"
                className={`cart-icon ${
                  location.pathname === "/cart" ? "active" : ""
                }`}
              >
                🛒 Cart{" "}
                {cart.length > 0 && (
                  <span className="cart-count">{cart.length}</span>
                )}
              </Link>
            )}

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={location.pathname === "/login" ? "active" : ""}
            >
              Login
            </Link>

            <Link
              to="/register"
              className={location.pathname === "/register" ? "active" : ""}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
