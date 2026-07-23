import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <span className="logo">MedFinder</span>
          <p>
            Helping you find the right medicine, at the right pharmacy,
            without the runaround. Real-time stock, transparent pricing, and
            nearby pharmacy discovery — all in one place.
          </p>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/">Dashboard</Link>
          <Link to="/pharmacies">Pharmacies</Link>
          <Link to="/medicines">Medicines</Link>
          <Link to="/map">Map Search</Link>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Support</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} MedFinder. Built for faster, smarter healthcare access.</p>
      </div>
    </footer>
  );
};

export default Footer;
