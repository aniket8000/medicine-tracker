import React, { createContext, useState, useContext } from "react";

const MapContext = createContext();

export const useMapData = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  return (
    <MapContext.Provider
      value={{ nearbyPharmacies, setNearbyPharmacies, userLocation, setUserLocation }}
    >
      {children}
    </MapContext.Provider>
  );
};