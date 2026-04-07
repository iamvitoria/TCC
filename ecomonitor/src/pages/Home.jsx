import React, { useState, useEffect } from "react";
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
  
  // Criamos um "estado" para guardar a posição. Ele começa vazio (null)
  const [position, setPosition] = useState(null);

  useEffect(() => {
    // Pede a localização do usuário assim que a tela abre
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          // Se deu certo, pega a latitude e longitude reais (Isso já é assíncrono, o React gosta)
          setPosition([location.coords.latitude, location.coords.longitude]);
        },
        (error) => {
          console.warn("Erro ao buscar localização ou permissão negada. Usando padrão.", error);
          // Se recusar ou der erro, usa Santa Maria como fallback (Também é assíncrono)
          setPosition([-29.6842, -53.8069]);
        },
        { enableHighAccuracy: true } 
      );
    } else {
      // Se o navegador não suportar GPS, colocamos um pequeno atraso para não quebrar a regra do React
      setTimeout(() => {
        setPosition([-29.6842, -53.8069]);
      }, 10);
    }
  }, []);

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
        
        {/* Só desenha o mapa QUANDO a posição já foi descoberta */}
        {!position ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#2D4627", fontWeight: "bold" }}>
            Buscando sua localização... 📍
          </div>
        ) : (
          <MapContainer 
            center={position} 
            zoom={16} // Dei um zoom um pouquinho maior para focar na rua da pessoa
            style={{ height: "100%", width: "100%" }} 
            zoomControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position} />
          </MapContainer>
        )}

        <button style={fabStyle} onClick={() => navigate("/denuncia")}>
          +
        </button>
        
      </div>
    </PageLayout>
  );
};

export default Home;