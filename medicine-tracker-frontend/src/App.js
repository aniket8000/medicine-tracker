import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Pharmacies from "./pages/Pharmacies";
import Medicines from "./pages/Medicines";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import MapView from "./pages/MapView"; // ✅ new map page
import "./styles/global.css";
import { useAuth } from "./context/AuthContext";

// ✅ Protected Route Wrapper
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar />
      <main className="main-container">
        <Routes>
          {/* ===== Public Routes ===== */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/pharmacies" element={<Pharmacies />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/search" element={<Search />} />
          <Route path="/map" element={<MapView />} /> {/* ✅ Map route */}

          {/* ===== Auth Routes ===== */}
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />

          {/* ===== Protected Routes ===== */}
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
