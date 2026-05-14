import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLayout from "../components/PageLayout/PageLayout";
import Navbar from "../components/Navbar/Navbar.jsx";
import API_URL from "../config";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const ReportDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const denuncia = location.state?.denunciaSelecionada;
  
  const [historicoReal, setHistoricoReal] = useState([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(true);
  
  const [enderecoExibido, setEnderecoExibido] = useState(denuncia?.endereco || "Buscando localização...");

  useEffect(() => {
    const buscarHistorico = async () => {
      if (!denuncia?.id) return;
      try {
        const response = await fetch(`${API_URL}/denuncias/${denuncia.id}/historico`);
        if (response.ok) {
          const data = await response.json();
          setHistoricoReal(data);
        }
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setCarregandoHistorico(false);
      }
    };
    buscarHistorico();
  }, [denuncia?.id]);

  useEffect(() => {
    if (!denuncia?.endereco && denuncia?.latitude && denuncia?.longitude) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${denuncia.latitude}&lon=${denuncia.longitude}&zoom=18&addressdetails=1`)
        .then(res => res.json())
        .then(data => {
          if (data && data.address) {
            const rua = data.address.road || data.address.pedestrian || "Rua não identificada";
            const numero = data.address.house_number ? `, ${data.address.house_number}` : "";
            const bairro = data.address.suburb || data.address.neighbourhood ? ` - ${data.address.suburb || data.address.neighbourhood}` : "";
            setEnderecoExibido(`${rua}${numero}${bairro}`);
          }
        })
        .catch(() => setEnderecoExibido("Endereço indisponível"));
    }
  }, [denuncia]);

  if (!denuncia) return null;

  const formatarNomeCategoria = (slug) => {
    const nomes = {
      lixo: "Descarte irregular de lixo",
      desmatamento: "Desmatamento",
      poluicao_agua: "Poluição da água",
      queimada: "Queimada",
      poluicao_ar: "Poluição do ar",
      animais: "Maus-tratos animais",
      foco_mosquito: "Foco de mosquito",
      esgoto: "Esgoto aberto"
    };
    if (nomes[slug]) return nomes[slug];
    const texto = slug?.replace(/_/g, " ") || "";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : "pendente";
    let bgColor = "#888888";
    if (s === "validado" || s === "aceito") bgColor = "#7FB04B";
    else if (s === "resolvido" || s === "resolvida") bgColor = "#3B75A3";
    else if (s === "cancelado" || s === "rejeitado") bgColor = "#D9534F";
    else if (s === "pendente" || s.includes("análise")) bgColor = "#D59A53";

    return (
      <span style={{ ...styles.statusBadge, backgroundColor: bgColor }}>
        {status || "Pendente"}
      </span>
    );
  };

  const formatarData = (dataIso) => {
    const dataAlvo = dataIso || denuncia?.data_criacao;
    if (!dataAlvo) return "Data indisponível";
    const date = new Date(dataAlvo);
    return isNaN(date.getTime()) ? "Data indisponível" : date.toLocaleDateString("pt-BR");
  };

  const formatarHora = (dataIso) => {
    const dataAlvo = dataIso || denuncia.data_criacao;
    const date = new Date(dataAlvo);
    return isNaN(date.getTime()) ? "--:--" : date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <PageLayout>
      <div style={styles.statusBarPlaceholder}></div>
      
      <div style={styles.headerContainer}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#2D4627" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 style={styles.headerTitle}>Detalhes da denúncia</h2>
        <div style={{ width: "24px" }}></div>
      </div>

      <div style={styles.whiteCardContainer}>
        <section>
          <h3 style={styles.sectionTitle}>Dados gerais</h3>
          <div style={{ ...styles.grayCardBox, ...styles.dataGeneralRow }}>
            <div style={styles.dataColumn}>
              <span style={styles.dataLabel}>Categoria</span>
              <span style={styles.dataValue}>{formatarNomeCategoria(denuncia.categoria)}</span>
            </div>
            <div style={styles.dataColumn}>
              <span style={styles.dataLabel}>Data</span>
              <span style={styles.dataValue}>{formatarData()}</span>
            </div>
            <div style={{ ...styles.dataColumn, alignItems: "center" }}>
              <span style={styles.dataLabel}>Status</span>
              {getStatusBadge(denuncia.status)}
            </div>
          </div>
        </section>

        <section>
          <h3 style={styles.sectionTitle}>Descrição completa</h3>
          <div style={styles.grayCardBox}>
            <p style={{ margin: 0, fontSize: "14px", color: "#444", lineHeight: "1.5" }}>
              {denuncia.descricao || "Nenhuma descrição fornecida."}
            </p>
          </div>
        </section>

        <section>
          <h3 style={styles.sectionTitle}>Imagens</h3>
          <div style={styles.imageRow}>
            <img 
              src={denuncia.foto_url} 
              alt="Denúncia" 
              style={styles.imageItem}
              onError={(e) => { e.target.src = "https://placehold.co/120x100?text=Sem+Foto"; }}
            />
          </div>
        </section>

        <section>
          <h3 style={styles.sectionTitle}>Localização capturada</h3>
          <div style={styles.locationRow}>
            <div style={styles.mapContainerWrapper}>
              <MapContainer center={[denuncia.latitude, denuncia.longitude]} zoom={16} style={{ height: "100%", width: "100%" }} zoomControl={false} dragging={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[denuncia.latitude, denuncia.longitude]} />
              </MapContainer>
            </div>
            <div style={styles.addressColumn}>
              <span>{enderecoExibido}</span>
            </div>
          </div>
        </section>

        <section style={{paddingBottom: "100px"}}>
          <h3 style={styles.sectionTitle}>Histórico</h3>
          <div style={styles.timelineContainer}>
            {carregandoHistorico ? (
              <p>Carregando...</p>
            ) : historicoReal.length > 0 ? (
              historicoReal.map((item, index) => (
                <div key={index} style={styles.timelineItemRow}>
                  <div style={styles.timelineDateColumn}>
                    <div>{formatarData(item.data_registro)}</div>
                    <div style={{ fontSize: "11px" }}>{formatarHora(item.data_registro)}</div>
                  </div>
                  <div style={styles.timelineGraphicColumn}>
                    <div style={styles.timelineDot}></div>
                    {index !== historicoReal.length - 1 && <div style={styles.timelineLine}></div>}
                  </div>
                  <div style={styles.timelineTextColumn}>{item.texto}</div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "13px", color: "#666" }}>Aguardando análise da prefeitura.</p>
            )}
          </div>
        </section>
      </div>
      <Navbar isAdmin={false} />
    </PageLayout>
  );
};

const styles = {
  statusBarPlaceholder: { backgroundColor: "#1C3520", height: "30px", width: "100%" },
  headerContainer: { backgroundColor: "#fff", display: "flex", alignItems: "center", padding: "20px" },
  backButton: { background: "none", border: "none", cursor: "pointer" },
  headerTitle: { margin: 0, color: "#2D4627", fontSize: "20px", fontWeight: "bold", textAlign: "center", flex: 1 },
  whiteCardContainer: { backgroundColor: "#fff", borderTopLeftRadius: "25px", borderTopRightRadius: "25px", padding: "30px 20px 20px 20px", flex: 1, display: "flex", flexDirection: "column", gap: "25px" },
  sectionTitle: { color: "#2D4627", fontSize: "18px", fontWeight: "bold", margin: "0 0 12px 0" },
  grayCardBox: { backgroundColor: "#F0F0F0", borderRadius: "15px", padding: "15px" },
  dataGeneralRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  dataColumn: { display: "flex", flexDirection: "column", gap: "5px" },
  dataLabel: { fontSize: "12px", fontWeight: "bold", color: "#2D4627" },
  dataValue: { fontSize: "13px", color: "#444" },
  statusBadge: { color: "white", padding: "5px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" },
  imageRow: { display: "flex", gap: "10px" },
  imageItem: { width: "120px", height: "100px", objectFit: "cover", borderRadius: "15px" },
  locationRow: { backgroundColor: "#F0F0F0", borderRadius: "15px", display: "flex", height: "90px", overflow: "hidden" },
  mapContainerWrapper: { width: "35%", height: "100%" },
  addressColumn: { flex: 1, padding: "10px", fontSize: "12px", color: "#444", display: "flex", alignItems: "center" },
  timelineContainer: { display: "flex", flexDirection: "column" },
  timelineItemRow: { display: "flex", gap: "10px" },
  timelineDateColumn: { width: "70px", textAlign: "right", fontSize: "12px", color: "#444" },
  timelineGraphicColumn: { display: "flex", flexDirection: "column", alignItems: "center" },
  timelineDot: { width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#2D4627" },
  timelineLine: { width: "2px", flex: 1, backgroundColor: "#2D4627" },
  timelineTextColumn: { flex: 1, fontSize: "13px", color: "#2D4627", paddingBottom: "20px" }
};

export default ReportDetails;