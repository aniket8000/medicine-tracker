import React, { createContext, useState, useContext } from "react";

const MapContext = createContext();

export const useMapData = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const [nearbyPharmacies, setNearbyPharmacies] = useState([]);

  return (
    <MapContext.Provider value={{ nearbyPharmacies, setNearbyPharmacies }}>
      {children}
    </MapContext.Provider>
  );
};