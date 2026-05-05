import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Navbar from "../components/Navbar/Navbar.jsx"; 

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Map = () => {
  const navigate = useNavigate();
  const [denuncias, setDenuncias] = useState([]);
  const [denunciasProximas, setDenunciasProximas] = useState([]);
  const [localizacaoUser, setLocalizacaoUser] = useState(null);
  const [carregandoLocalizacao, setCarregandoLocalizacao] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocalizacaoUser([position.coords.latitude, position.coords.longitude]);
          setCarregandoLocalizacao(false);
        },
        () => {
          setLocalizacaoUser([-29.6842, -53.8069]); 
          setCarregandoLocalizacao(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocalizacaoUser([-29.6842, -53.8069]);
      setCarregandoLocalizacao(false);
    }
  }, []);

  useEffect(() => {
    const buscarDenuncias = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://ecomonitor-api.onrender.com/denuncias", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setDenuncias(data);

          if (localizacaoUser) {
            const comDistancia = data.map((d) => {
              const lat = d.latitude || (-29.6842 + (Math.random() * 0.04 - 0.02));
              const lng = d.longitude || (-53.8069 + (Math.random() * 0.04 - 0.02));
              const dist = calcularDistancia(localizacaoUser[0], localizacaoUser[1], lat, lng);
              return { ...d, latitude: lat, longitude: lng, distancia: dist };
            });

            const proximas = comDistancia
              .filter((d) => d.distancia <= 10)
              .sort((a, b) => a.distancia - b.distancia);

            setDenunciasProximas(proximas);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (!carregandoLocalizacao) {
      buscarDenuncias();
    }
  }, [localizacaoUser, carregandoLocalizacao]);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#F9FAF9",
    overflow: "hidden"
  };

  const headerStyle = {
    backgroundColor: "#1C3520",
    padding: "20px",
    textAlign: "center",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10
  };

  const mapWrapperStyle = {
    flex: 1,
    position: "relative",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    overflow: "hidden",
    marginTop: "-15px",
    zIndex: 5
  };

  const bottomSectionStyle = {
    backgroundColor: "#F9FAF9",
    padding: "20px 20px 100px 20px",
    borderTop: "1px solid #EBEBEB"
  };

  const cardsContainerStyle = {
    display: "flex",
    gap: "15px",
    overflowX: "auto",
    paddingBottom: "10px",
    scrollbarWidth: "none"
  };

  const cardStyle = {
    backgroundColor: "white",
    minWidth: "150px",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    border: "1px solid #EBEFEB",
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>Mapa</div>

      <div style={mapWrapperStyle}>
        {!carregandoLocalizacao && localizacaoUser && (
          <MapContainer
            center={localizacaoUser}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker position={localizacaoUser}>
              <Popup>Você está aqui</Popup>
            </Marker>

            {denuncias.map((denuncia, index) => {
              // eslint-disable-next-line react-hooks/purity
              const lat = denuncia.latitude || (-29.6842 + (Math.random() * 0.04 - 0.02));
              // eslint-disable-next-line react-hooks/purity
              const lng = denuncia.longitude || (-53.8069 + (Math.random() * 0.04 - 0.02));

              return (
                <Marker key={denuncia.id || index} position={[lat, lng]}>
                  <Popup>
                    <div style={{ padding: "5px", minWidth: "120px" }}>
                      <h4 style={{ margin: "0 0 5px 0", color: "#1C3520", fontSize: "14px" }}>
                        {denuncia.categoria || "Denúncia"}
                      </h4>
                      <p style={{ margin: "0 0 10px 0", color: "#666", fontSize: "12px" }}>
                        {denuncia.cidade || "Localização não informada"}
                      </p>
                      <button
                        onClick={() => navigate(`/report-details/${denuncia.id}`)}
                        style={{
                          backgroundColor: "#2D5A27",
                          color: "white",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          width: "100%",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "12px"
                        }}
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>

      <div style={bottomSectionStyle}>
        <h3 style={{ margin: "0 0 15px 0", color: "#1C3520", fontSize: "16px" }}>
          Denúncias próximas
        </h3>

        {denunciasProximas.length > 0 ? (
          <div style={cardsContainerStyle}>
            {denunciasProximas.map((d, index) => (
              <div key={d.id || index} style={cardStyle} onClick={() => navigate(`/report-details/${d.id}`)}>
                <h4 style={{ margin: 0, color: "#1C3520", fontSize: "14px" }}>
                  {d.categoria || "Denúncia"}
                </h4>
                <p style={{ margin: 0, color: "#666", fontSize: "12px" }}>
                  {d.distancia.toFixed(1).replace(".", ",")} km
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
            Nenhuma denúncia próxima encontrada.
          </p>
        )}
      </div>

      <Navbar isAdmin={false} />
    </div>
  );
};

export default Map;