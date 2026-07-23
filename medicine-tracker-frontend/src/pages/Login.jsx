import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import "../styles/global.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const userData = {
        name: res.data.user?.name || "User",
        email: res.data.user?.email,
        role: res.data.user?.role || "customer",
        token: res.data.token || null,
      };

      login(userData);
      showToast("Login successful 🎉");

      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      showToast("Invalid credentials ❌");
      console.error(error);
    }
  };

  return (
    <div className="auth-page fade-in">
      {toast && <div className="toast-box">{toast}</div>}

      <div className="auth-split">
        <div className="auth-info fade-up">
          <h1>Welcome back to MedFinder</h1>
          <p>
            Log in to track medicine availability, save your cart, and
            checkout faster the next time you need a refill.
          </p>
          <ul>
            <li>
              <span className="icon">💊</span>
              Live stock &amp; pricing across nearby pharmacies
            </li>
            <li>
              <span className="icon">🛒</span>
              Cart and order history saved to your account
            </li>
            <li>
              <span className="icon">🗺️</span>
              Map-based pharmacy discovery near you
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>🔐 Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <p className="auth-switch" style={{ textAlign: "right", marginTop: "-6px" }}>
            <a href="/forgot-password">Forgot password?</a>
          </p>

          <button type="submit" className="primary-btn">
            Login
          </button>

          <p className="auth-switch">
            Don’t have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
