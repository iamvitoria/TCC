import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLayout from "../components/PageLayout/PageLayout";

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

  useEffect(() => {
    const buscarHistorico = async () => {
      if (!denuncia?.id) return;

      try {
        const response = await fetch(`https://ecomonitor-api.onrender.com/denuncias/${denuncia.id}/historico`);
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

  if (!denuncia) {
    return (
      <PageLayout title="Detalhes da Denúncia">
        <div style={{ padding: "20px", textAlign: "center", color: "white" }}>
            <p>Denúncia não encontrada.</p>
            <button onClick={() => navigate(-1)}>Voltar</button>
        </div>
      </PageLayout>
    );
  }

  const whiteCardStyle = {
    backgroundColor: "white",
    borderTopLeftRadius: "25px",
    borderTopRightRadius: "25px",
    padding: "25px 20px 40px 20px", 
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: "20px",
  };

  const sectionTitleStyle = {
    color: "#2D4627",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 0 10px 0"
  };

  const grayBoxStyle = {
    backgroundColor: "#F0F0F0",
    borderRadius: "10px",
    padding: "15px",
  };

  const formatarNomeCategoria = (slug) => {
    if (!slug) return "Desconhecida";
    const nomes = {
      lixo: "Descarte Irregular de Lixo",
      desmatamento: "Desmatamento",
      poluicao_agua: "Poluição da Água",
      queimada: "Queimada",
      poluicao_ar: "Poluição do Ar",
      animais: "Maus-tratos Animais",
      foco_mosquito: "Foco de Mosquito",
      esgoto: "Esgoto Aberto"
    };
    return nomes[slug] || slug.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : "pendente";
    let bgColor = "#888888"; 
    let texto = status || "Desconhecido";

    if (s === "validado") { bgColor = "#7FB04B"; texto = "Validado"; }
    else if (s === "resolvido" || s === "resolvida") { bgColor = "#3B75A3"; texto = "Resolvido"; }
    else if (s === "cancelado" || s === "rejeitado") { bgColor = "#D9534F"; texto = "Cancelado"; }
    else if (s === "pendente" || s === "em analise" || s === "em análise") { bgColor = "#D59A53"; texto = "Em Análise"; }

    return (
      <span style={{ backgroundColor: bgColor, color: "white", padding: "4px 10px", borderRadius: "15px", fontSize: "12px", fontWeight: "bold" }}>
        {texto}
      </span>
    );
  };

  const formatarData = (dataIso) => {
    if (!dataIso) return "Data indisponível";
    const date = new Date(dataIso);
    return isNaN(date.getTime()) ? "Data indisponível" : date.toLocaleDateString("pt-BR");
  };

  const formatarHora = (dataIso) => {
    if (!dataIso) return "--:--";
    const date = new Date(dataIso);
    return isNaN(date.getTime()) ? "--:--" : date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const posicaoMapa = denuncia.latitude && denuncia.longitude ? [denuncia.latitude, denuncia.longitude] : null;

  return (
    <PageLayout title="Detalhes da denúncia">
      <div style={{ paddingBottom: "150px" }}>
        <div style={{ padding: "0 5%" }}>
          <button 
            style={{ background: "none", border: "none", color: "white", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontWeight: "bold" }} 
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>
        </div>

        <div style={whiteCardStyle}>
          <div>
            <h3 style={sectionTitleStyle}>Dados gerais</h3>
            <div style={{ ...grayBoxStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#2D4627" }}>Categoria</span>
                <span style={{ fontSize: "12px", color: "#444" }}>{formatarNomeCategoria(denuncia.categoria)}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#2D4627" }}>Data</span>
                <span style={{ fontSize: "12px", color: "#444" }}>{formatarData(denuncia.data_criacao)}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#2D4627" }}>Status</span>
                {getStatusBadge(denuncia.status)}
              </div>
            </div>
          </div>

          <div>
            <h3 style={sectionTitleStyle}>Descrição completa</h3>
            <div style={grayBoxStyle}>
              <p style={{ margin: 0, fontSize: "13px", color: "#444", lineHeight: "1.4" }}>
                {denuncia.descricao || "Nenhuma descrição detalhada fornecida pelo usuário."}
              </p>
            </div>
          </div>

          <div>
            <h3 style={sectionTitleStyle}>Imagens</h3>
            <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
              <img 
                src={denuncia.foto_url ? `https://ecomonitor-api.onrender.com/${denuncia.foto_url}` : "https://placehold.co/100x100?text=Sem+Foto"} 
                alt="Denúncia" 
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "15px" }}
                onError={(e) => { e.target.src = "https://placehold.co/100x100?text=Sem+Foto" }}
              />
            </div>
          </div>

          <div>
            <h3 style={sectionTitleStyle}>Localização capturada</h3>
            <div style={{ ...grayBoxStyle, padding: "0", overflow: "hidden", display: "flex", height: "90px" }}>
              {posicaoMapa ? (
                <div style={{ height: "100%", width: "40%", zIndex: 0 }}>
                  <MapContainer center={posicaoMapa} zoom={16} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={posicaoMapa} />
                  </MapContainer>
                </div>
              ) : (
                <div style={{ width: "40%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#e8f2db", fontSize: "11px" }}>Sem mapa</div>
              )}
              <div style={{ flex: 1, padding: "0 15px", fontSize: "12px", color: "#444", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span><strong>Lat:</strong> {denuncia.latitude?.toFixed(6)}</span>
                <span><strong>Lng:</strong> {denuncia.longitude?.toFixed(6)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={sectionTitleStyle}>Histórico</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0", marginTop: "10px" }}>
              {carregandoHistorico ? (
                <p style={{ fontSize: "12px", color: "#666" }}>Carregando histórico...</p>
              ) : historicoReal.length > 0 ? (
                historicoReal.map((item, index) => (
                  <div key={item.id || index} style={{ display: "flex", gap: "15px", minHeight: "50px" }}>
                    <div style={{ width: "70px", textAlign: "right", fontSize: "11px", color: "#444", paddingTop: "2px" }}>
                      <div>{formatarData(item.data_registro)}</div>
                      <div>{formatarHora(item.data_registro)}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "20px" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#2D4627", zIndex: 2 }}></div>
                      {index !== historicoReal.length - 1 && (
                        <div style={{ width: "2px", flex: 1, backgroundColor: "#2D4627", marginTop: "-2px", marginBottom: "-2px" }}></div>
                      )}
                    </div>
                    <div style={{ flex: 1, fontSize: "12px", color: "#444", paddingBottom: "20px", whiteSpace: "pre-line" }}>
                      {item.texto}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "12px", color: "#666" }}>Nenhum registro no histórico.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
};

export default ReportDetails;