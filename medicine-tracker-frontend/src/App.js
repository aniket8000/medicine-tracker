import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Pharmacies from "./pages/Pharmacies";
import Medicines from "./pages/Medicines";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Checkout from "./pages/Checkout";
import MapView from "./pages/MapView"; // ✅ new map page
import AboutUs from "./pages/AboutUs";
import ContactSupport from "./pages/ContactSupport";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import "./styles/global.css";
import { useAuth } from "./context/AuthContext";

// ✅ Protected Route Wrapper
const PrivateRoute = ({ children }) => {
  const { user, checkingSession } = useAuth();
  if (checkingSession) return null;
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  const { user, checkingSession } = useAuth();

  if (checkingSession) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontWeight: 600,
          color: "var(--text-muted)",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <main className="main-container">
        <Routes>
          {/* ===== Public Routes (explorable without logging in) ===== */}
          <Route path="/map" element={<MapView />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactSupport />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* ===== Auth Routes ===== */}
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/forgot-password"
            element={user ? <Navigate to="/" /> : <ForgotPassword />}
          />
          <Route
            path="/reset-password/:token"
            element={user ? <Navigate to="/" /> : <ResetPassword />}
          />

          {/* ===== Protected Routes (require login) ===== */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/pharmacies"
            element={
              <PrivateRoute>
                <Pharmacies />
              </PrivateRoute>
            }
          />
          <Route
            path="/medicines"
            element={
              <PrivateRoute>
                <Medicines />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />

          {/* Catch-All Redirect */}
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
