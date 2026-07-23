import React, { useState } from "react";
import api from "../api/axios";
import "../styles/global.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-split">
        <div className="auth-info fade-up">
          <h1>Forgot your password?</h1>
          <p>
            No problem — enter the email you registered with and we'll send
            you a link to reset it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>🔑 Reset Password</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="primary-btn" disabled={submitting}>
            {submitting ? "Sending..." : "Send Reset Link"}
          </button>

          {message && <p className="message success">{message}</p>}

          <p className="auth-switch">
            Remembered your password? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
