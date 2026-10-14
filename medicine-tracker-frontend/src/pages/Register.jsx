import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";
import "../styles/global.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);

      showToast("Registered successfully 🎉");

      const userData = {
        name: res.data.user?.name,
        email: res.data.user?.email,
        role: res.data.user?.role,
        token: res.data.token,
      };

      login(userData);

      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      console.error("Registration failed:", error);
      showToast("Registration failed ❌");
    }
  };

  return (
    <div className="auth-page fade-in">
      {toast && <div className="toast-box">{toast}</div>}

      <div className="auth-split">
        <div className="auth-info fade-up">
          <h1>Join MedFinder today</h1>
          <p>
            Create a free account to search medicines, compare pharmacy
            prices, and check out in seconds.
          </p>
          <ul>
            <li>
              <span className="icon">⚡</span>
              Fast checkout with saved details
            </li>
            <li>
              <span className="icon">📦</span>
              Order tracking from cart to confirmation
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>🧍 Register</h2>

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <PasswordInput
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="primary-btn">
            Register
          </button>

          <p className="auth-switch">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
