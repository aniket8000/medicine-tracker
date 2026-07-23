import React, { useState } from "react";
import api from "../api/axios";
import "../styles/global.css";

const ContactSupport = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ message: "", type: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ message: "", type: "" });

    try {
      const res = await api.post("/contact", form);
      setStatus({ message: res.data.message, type: "success" });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({
        message: err.response?.data?.message || "Failed to send message. Please try again.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="static-page fade-in">
      <header className="page-header slide-down">
        <h1>📩 Contact Support</h1>
        <p>Have a question or ran into an issue? We'd love to hear from you.</p>
      </header>

      <div className="contact-layout fade-up">
        <section className="info-section contact-info">
          <h2>Reach Us Directly</h2>
          <p>
            <strong>Aniket Kumar</strong>
            <br />
            Founder, MedFinder
          </p>
          <p>
            📧 <a href="mailto:aniketkumarvn@gmail.com">aniketkumarvn@gmail.com</a>
          </p>
          <p>
            We typically respond within 1–2 business days. For urgent issues
            with an active order, please include your order ID.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="auth-form contact-form">
          <h2>Send a Message</h2>

          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="How can we help?"
            value={form.message}
            onChange={handleChange}
            rows={5}
            required
          />

          <button type="submit" className="primary-btn" disabled={submitting}>
            {submitting ? "Sending..." : "Send Message"}
          </button>

          {status.message && (
            <p className={`message ${status.type === "error" ? "error" : "success"}`}>
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactSupport;
