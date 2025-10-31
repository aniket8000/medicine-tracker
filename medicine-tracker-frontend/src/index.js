// Entry file that mounts the React app on the root div inside index.html.
// I used React.StrictMode to ensure clean rendering and better debugging.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

