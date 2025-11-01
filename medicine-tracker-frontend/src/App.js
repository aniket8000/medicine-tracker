import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Pharmacies from "./pages/Pharmacies";
import Medicines from "./pages/Medicines";
import Search from "./pages/Search";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pharmacies" element={<Pharmacies />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
