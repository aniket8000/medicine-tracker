// src/pages/MapView.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "../styles/global.css";
import "leaflet/dist/leaflet.css";
import { useMapData } from "../context/MapContext";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Helper to auto-center map
const RecenterToUser = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 14, { duration: 1 });
  }, [position, map]);
  return null;
};

const MapView = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { setNearbyPharmacies } = useMapData();

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
        fetchNearbyPharmacies(latitude, longitude);
      },
      () => {
        setError("Could not retrieve your location. Please enable GPS.");
        setLoading(false);
      }
    );
  }, []);

  const fetchNearbyPharmacies = async (lat, lon) => {
    try {
      const radius = 5000; // 5 km
      const query = `
        [out:json];
        node["amenity"="pharmacy"](around:${radius},${lat},${lon});
        out;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();

      const results = data.elements.map((el) => ({
        id: el.id,
        name: el.tags.name || "Unnamed Pharmacy",
        lat: el.lat,
        lon: el.lon,
        address:
          el.tags["addr:street"] ||
          el.tags["addr:full"] ||
          el.tags["addr:city"] ||
          "Address not available",
      }));

      setPharmacies(results);
      setNearbyPharmacies(results); // ✅ Share with other pages
    } catch (err) {
      console.error(err);
      setError("Failed to fetch pharmacies from OpenStreetMap");
    } finally {
      setLoading(false);
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const sortedPharmacies = userLocation
    ? pharmacies
        .map((p) => ({
          ...p,
          distance: getDistance(userLocation[0], userLocation[1], p.lat, p.lon),
        }))
        .sort((a, b) => a.distance - b.distance)
    : pharmacies;

  return (
    <div className="map-page fade-in">
      <header className="page-header slide-down">
        <h1>🗺️ Pharmacy Map</h1>
        <p>Explore nearby pharmacies — click markers or view details on the right.</p>
      </header>

      {loading && <p className="loading-text">Detecting your location...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="map-layout">
        {/* Left Side: Map */}
        <div className="map-section">
          <MapContainer
            center={userLocation || [20.5937, 78.9629]}
            zoom={userLocation ? 14 : 5}
            style={{ height: "75vh", width: "100%", borderRadius: "12px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            {userLocation && <RecenterToUser position={userLocation} />}

            {userLocation && (
              <>
                <Marker position={userLocation}>
                  <Popup>📍 You are here</Popup>
                </Marker>
                <Circle
                  center={userLocation}
                  radius={5000}
                  pathOptions={{ color: "#2563eb", fillOpacity: 0.1 }}
                />
              </>
            )}

            {sortedPharmacies.map((p) => (
              <Marker key={p.id} position={[p.lat, p.lon]}>
                <Popup>
                  <strong>{p.name}</strong> <br />
                  📍 {p.address} <br />
                  📏 {p.distance?.toFixed(2)} km away <br />
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#2563eb", fontWeight: "bold" }}
                  >
                    ➤ Get Directions
                  </a>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Right Side: Pharmacy List */}
        <div className="pharmacy-info-section">
          <h3>Nearby Pharmacies ({sortedPharmacies.length})</h3>
          {sortedPharmacies.length === 0 ? (
            <p className="no-results">No pharmacies found nearby.</p>
          ) : (
            <div className="pharmacy-cards">
              {sortedPharmacies.slice(0, 20).map((p) => (
                <div key={p.id} className="pharmacy-card fade-up">
                  <h4>{p.name}</h4>
                  <p><strong>Address:</strong> {p.address}</p>
                  <p className="distance">📏 {p.distance.toFixed(2)} km away</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="directions-btn"
                    style={{
                      display: "inline-block",
                      marginTop: "8px",
                      padding: "6px 10px",
                      borderRadius: "8px",
                      background: "#2563eb",
                      color: "white",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    📍 Get Directions
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
