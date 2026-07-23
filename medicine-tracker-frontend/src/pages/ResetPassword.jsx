import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import PasswordInput from "../components/PasswordInput";
import "../styles/global.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-split">
        <div className="auth-info fade-up">
          <h1>Choose a new password</h1>
          <p>Your reset link is valid for 30 minutes from when it was sent.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>🔐 Reset Password</h2>

          <PasswordInput
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <PasswordInput
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="primary-btn" disabled={submitting}>
            {submitting ? "Resetting..." : "Reset Password"}
          </button>

          {message && <p className="message success">{message}</p>}
          {error && <p className="message error">{error}</p>}

          <p className="auth-switch">
            Remembered your password? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
