import React from "react";
import { useNavigate } from "react-router-dom"; 
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import PageLayout from "../components/PageLayout/PageLayout";

import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

const Home = () => {
  const navigate = useNavigate();
  const position = [-29.6842, -53.8069];

  const fabStyle = {
    position: "absolute",
    bottom: "100px", 
    right: "20px",
    width: "60px",
    height: "60px",
    backgroundColor: "#7FB04B",
    borderRadius: "50%",
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    cursor: "pointer",
    zIndex: 1000,
  };

  return (
    <PageLayout title="Mapa">
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        
        <MapContainer 
          center={position} 
          zoom={15} 
          style={{ height: "100%", width: "100%" }} 
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position} />
        </MapContainer>

        <button style={fabStyle} onClick={() => navigate("/denuncia")}>
          +
        </button>
        
      </div>
    </PageLayout>
  );
};

export default Home;