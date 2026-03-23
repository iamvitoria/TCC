import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";

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
  const position = [-29.6842, -53.8069];

  // Estilo apenas para o Botão Flutuante (+), pois ele pertence ao Mapa desta tela
  const fabStyle = {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    width: "65px",
    height: "65px",
    backgroundColor: "#7FB04B",
    borderRadius: "50%",
    border: "none",
    color: "white",
    fontSize: "35px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    cursor: "pointer",
    zIndex: 1000, 
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", overflow: "hidden" }}>
      
      <Header title="Mapa" />

      <div style={{ 
        flex: 1, 
        position: "relative", 
        borderTopLeftRadius: "30px", 
        borderTopRightRadius: "30px",
        overflow: "hidden",
        backgroundColor: "white" 
      }}>
        <MapContainer 
          center={position} 
          zoom={15} 
          style={{ height: "100%", width: "100%" }} 
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position} />
        </MapContainer>

        <button style={fabStyle} onClick={() => alert("Nova Denúncia")}>
          +
        </button>
      </div>

      <Navbar />
      
    </div>
  );
};

export default Home;