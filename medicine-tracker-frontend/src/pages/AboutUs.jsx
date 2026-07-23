import React from "react";
import "../styles/global.css";

const AboutUs = () => {
  return (
    <div className="static-page fade-in">
      <header className="page-header slide-down">
        <h1>💡 About MedFinder</h1>
        <p>Built to make finding medicine as easy as finding a restaurant.</p>
      </header>

      <section className="info-section fade-up">
        <h2>Our Story</h2>
        <p>
          MedFinder started as a simple frustration: calling pharmacy after
          pharmacy to find out if a medicine was in stock, only to be told
          "no" every time. We built MedFinder so nobody has to do that again
          — search once, see real-time stock and pricing across nearby
          pharmacies, and go straight to the one that actually has what you
          need.
        </p>
      </section>

      <section className="info-section fade-up">
        <h2>What We Do</h2>
        <p>
          MedFinder connects customers with local pharmacies through a single
          platform. Pharmacy admins list and manage their medicine stock in
          real time, while customers can search, compare prices, add to
          cart, and check out — all without a single phone call. Our map
          search also helps you discover pharmacies near you using live
          OpenStreetMap data.
        </p>
      </section>

      <section className="info-section fade-up">
        <h2>Our Mission</h2>
        <p>
          Healthcare access shouldn't depend on luck or guesswork. We're
          building the tools to make medicine availability transparent,
          searchable, and fast — for customers who need it, and for
          pharmacies who want to be found.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
