import React from "react";
import PharmacyList from "./components/PharmacyList";

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>💊 Medicine Availability Tracker</h1>
      <PharmacyList />
    </div>
  );
}

export default App;
