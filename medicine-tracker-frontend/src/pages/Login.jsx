import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // ================
      // FIXED: NORMALIZED USER DATA
      // ================
      const userData = {
        name: res.data.name || "User",
        email: res.data.email,
        role: res.data.role || "admin", // <--- IMPORTANT FIX
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
      <h2>🔐 Login</h2>

      {toast && <div className="toast-box">{toast}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="primary-btn">
          Login
        </button>

        <p className="auth-switch">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
