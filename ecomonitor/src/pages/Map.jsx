import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Navbar from "../components/Navbar/Navbar.jsx"; 
import API_URL from "../config";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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
  const [denuncias, setDenuncias] = useState([]);
  const [denunciasProximas, setDenunciasProximas] = useState([]);
  const [localizacaoUser, setLocalizacaoUser] = useState(null);
  const [carregandoLocalizacao, setCarregandoLocalizacao] = useState(true);
  const [carregandoDados, setCarregandoDados] = useState(false);

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
      setCarregandoDados(true);
      const token = localStorage.getItem("token");
      try {
        // UTILIZANDO API_URL DO CONFIG.JS
        const response = await fetch(`${API_URL}/denuncias`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          
          if (localizacaoUser) {
            const comDistancia = data.map((d) => {
              const lat = d.latitude || (-29.6842 + (Math.random() * 0.04 - 0.02));
              const lng = d.longitude || (-53.8069 + (Math.random() * 0.04 - 0.02));
              const dist = calcularDistancia(localizacaoUser[0], localizacaoUser[1], lat, lng);
              return { ...d, latitude: lat, longitude: lng, distancia: dist };
            });

            setDenuncias(comDistancia);

            const proximas = comDistancia
              .filter((d) => d.distancia <= 10)
              .sort((a, b) => a.distancia - b.distancia);

            setDenunciasProximas(proximas);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar registros:", error);
      } finally {
        setCarregandoDados(false);
      }
    };

    if (!carregandoLocalizacao) {
      buscarDenuncias();
    }
  }, [localizacaoUser, carregandoLocalizacao]);

  const styles = {
    container: { display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#F9FAF9", overflow: "hidden" },
    header: { backgroundColor: "#1C3520", padding: "20px", textAlign: "center", color: "white", fontSize: "18px", fontWeight: "bold", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 },
    mapWrapper: { flex: 1, position: "relative", borderTopLeftRadius: "20px", borderTopRightRadius: "20px", overflow: "hidden", marginTop: "-15px", zIndex: 5 },
    bottomSection: { backgroundColor: "#F9FAF9", padding: "20px 20px 100px 20px", borderTop: "1px solid #EBEBEB" },
    cardsContainer: { display: "flex", gap: "15px", overflowX: "auto", paddingBottom: "10px", scrollbarWidth: "none" },
    card: { backgroundColor: "white", minWidth: "150px", padding: "15px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", border: "1px solid #EBEFEB", display: "flex", flexDirection: "column", gap: "5px", cursor: "pointer" },
    popupBox: { minWidth: "180px", padding: "5px" },
    infoRow: { marginBottom: "8px", fontSize: "13px" },
    label: { fontWeight: "bold", color: "#1C3520", display: "block" }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Mapa</div>

      <div style={styles.mapWrapper}>
        {!carregandoLocalizacao && localizacaoUser && (
          <MapContainer center={localizacaoUser} zoom={14} style={{ height: "100%", width: "100%" }} zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={localizacaoUser} icon={redIcon}><Popup>Você está aqui</Popup></Marker>

            {denuncias.map((denuncia, index) => (
              <Marker key={denuncia.id || index} position={[denuncia.latitude, denuncia.longitude]}>
                <Popup>
                  <div style={styles.popupBox}>
                    <h4 style={{ margin: "0 0 10px 0", color: "#1C3520", fontSize: "16px", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>
                      {denuncia.categoria}
                    </h4>
                    <div style={styles.infoRow}>
                      <span style={styles.label}>Descrição:</span>
                      <p style={{ margin: "2px 0", color: "#444" }}>{denuncia.descricao || "Sem descrição."}</p>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.label}>Local:</span>
                      <p style={{ margin: "2px 0", color: "#444" }}>{denuncia.endereco || denuncia.cidade || "Localização via GPS"}</p>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.label}>Usuário:</span>
                      <p style={{ margin: "2px 0", color: "#444" }}>{denuncia.usuario_nome || "Anônimo"}</p>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.label}>Distância:</span>
                      <p style={{ margin: "2px 0", color: "#444" }}>{denuncia.distancia?.toFixed(1).replace(".", ",")} km</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      <div style={styles.bottomSection}>
        <h3 style={{ margin: "0 0 15px 0", color: "#1C3520", fontSize: "16px" }}>Registros próximos</h3>
        {carregandoLocalizacao || carregandoDados ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "16px", height: "16px", border: "2px solid #ccc", borderTop: "2px solid #1C3520", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>Sincronizando dados...</p>
          </div>
        ) : (
          denunciasProximas.length > 0 ? (
            <div style={styles.cardsContainer}>
              {denunciasProximas.map((d, index) => (
                <div key={d.id || index} style={styles.card}>
                  <h4 style={{ margin: 0, color: "#1C3520", fontSize: "14px" }}>{d.categoria || "Denúncia"}</h4>
                  <p style={{ margin: 0, color: "#666", fontSize: "12px" }}>{d.distancia.toFixed(1).replace(".", ",")} km</p>
                </div>
              ))}
            </div>
          ) : <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>Nenhuma denúncia próxima encontrada.</p>
        )}
      </div>
      <Navbar isAdmin={false} />
    </div>
  );
};

export default Map;