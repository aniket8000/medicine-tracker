import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );
  const [checkingSession, setCheckingSession] = useState(true);

  // Verify the stored token is still valid on app load — a stale/expired
  // token (e.g. after a JWT secret rotation) should not render as logged in.
  useEffect(() => {
    const verifySession = async () => {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (!stored?.token) {
        setCheckingSession(false);
        return;
      }

      try {
        await api.get("/auth/me");
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setCheckingSession(false);
      }
    };

    verifySession();
  }, []);

  // Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 1500);
  };

  // ===========================
  // LOGIN — FIXED & SAFE
  // ===========================
  const login = (data) => {
    const normalized = {
      name: data?.name || "User",
      email: data?.email || "",
      role: data?.role || "customer", // fallback if backend fails
      token: data?.token || null,
    };

    localStorage.setItem("user", JSON.stringify(normalized));
    setUser(normalized);
    showToast("Logged in successfully");
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    showToast("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, showToast, checkingSession }}>
      {children}

      {/* Toast UI */}
      {toast.show && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "12px 18px",
            background: toast.type === "error" ? "#e63946" : "#2563eb",
            color: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 5000,
            animation: "fadeInOut 1.5s ease",
            fontSize: "15px",
          }}
        >
          {toast.message}
        </div>
      )}

      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-10px); }
            15% { opacity: 1; transform: translateY(0); }
            85% { opacity: 1; }
            100% { opacity: 0; transform: translateY(-10px); }
          }
        `}
      </style>
    </AuthContext.Provider>
  );
};
