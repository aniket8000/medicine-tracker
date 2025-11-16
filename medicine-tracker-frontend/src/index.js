// Entry file that mounts the React app on the root div inside index.html.
// Added AuthProvider (for login/register), CartProvider (for global cart management),
// and MapProvider (for sharing map-detected pharmacies globally).

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { MapProvider } from "./context/MapContext"; 

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <MapProvider> {/* ✅ Wraps the entire app for map sharing */}
          <App />
        </MapProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
