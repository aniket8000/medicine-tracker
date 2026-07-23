import React from "react";
import "../styles/global.css";

const PrivacyPolicy = () => {
  return (
    <div className="static-page fade-in">
      <header className="page-header slide-down">
        <h1>🔒 Privacy Policy</h1>
        <p>Last updated: July 2026</p>
      </header>

      <section className="info-section fade-up">
        <h2>What We Collect</h2>
        <p>
          When you create an account, we store your name, email address, and
          a securely hashed password (we never store your password in plain
          text). If you place an order, we store the shipping name, contact
          number, and address you provide for that order.
        </p>
      </section>

      <section className="info-section fade-up">
        <h2>Location Data</h2>
        <p>
          Our Map Search feature asks your browser for your current location
          to find nearby pharmacies. This location is used only to display
          results and calculate distance — it is not stored on our servers.
        </p>
      </section>

      <section className="info-section fade-up">
        <h2>Your Cart</h2>
        <p>
          Items you add to your cart are stored locally in your browser
          (localStorage), not on our servers, until you complete checkout.
        </p>
      </section>

      <section className="info-section fade-up">
        <h2>How We Use Your Data</h2>
        <p>
          We use your information solely to operate MedFinder: authenticating
          your account, processing orders, sending order confirmations, and
          responding to support requests. We do not sell or share your
          personal data with third parties for marketing purposes.
        </p>
      </section>

      <section className="info-section fade-up">
        <h2>Your Rights</h2>
        <p>
          You can request access to, correction of, or deletion of your
          account data at any time by contacting us through the{" "}
          <a href="/contact">Contact Support</a> page.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
