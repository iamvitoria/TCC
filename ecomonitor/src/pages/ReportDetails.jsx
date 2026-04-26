import React from "react";
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
    const statusFormatado = status ? status.toLowerCase() : "pendente";
    
    let bgColor = "#888888"; 
    let texto = status || "Desconhecido";

    if (statusFormatado === "validado") {
      bgColor = "#7FB04B";
      texto = "Validado";
    } else if (statusFormatado === "resolvido" || statusFormatado === "resolvida") {
      bgColor = "#3B75A3";
      texto = "Resolvido";
    } else if (statusFormatado === "negado" || statusFormatado === "rejeitado") {
      bgColor = "#D9534F";
      texto = "Negado";
    } else if (statusFormatado === "pendente" || statusFormatado === "em analise" || statusFormatado === "em análise") {
      bgColor = "#D59A53";
      texto = "Em Análise";
    }

    return (
      <span style={{ backgroundColor: bgColor, color: "white", padding: "4px 10px", borderRadius: "15px", fontSize: "12px", fontWeight: "bold" }}>
        {texto}
      </span>
    );
  };

  const formatarData = (dataIso) => {
    if (!dataIso) return "Data indisponível";
    const date = new Date(dataIso);
    if (isNaN(date.getTime())) return "Data indisponível";
    return date.toLocaleDateString("pt-BR");
  };

  const formatarHora = (dataIso) => {
    if (!dataIso) return "--:--";
    const date = new Date(dataIso);
    if (isNaN(date.getTime())) return "--:--";
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const dataBase = denuncia.data_criacao || denuncia.criado_em || new Date().toISOString();

  const gerarHistorico = () => {
    const historico = [
      { 
        data: formatarData(dataBase), 
        hora: formatarHora(dataBase), 
        texto: "Denúncia enviada pelo usuário\n(+50 pts)" 
      }
    ];

    const statusFormatado = denuncia.status ? denuncia.status.toLowerCase() : "pendente";

    if (statusFormatado !== "pendente" && statusFormatado !== "em analise" && statusFormatado !== "em análise") {
      historico.push({
        data: formatarData(new Date().toISOString()),
        hora: formatarHora(new Date().toISOString()),
        texto: `Status atualizado para "${denuncia.status}"`
      });
    }

    return historico;
  };

  const historicoDinamico = gerarHistorico();

  const posicaoMapa = denuncia.latitude && denuncia.longitude 
    ? [denuncia.latitude, denuncia.longitude] 
    : null;

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
                <span style={{ fontSize: "12px", color: "#444" }}>
                  {formatarNomeCategoria(denuncia.categoria)}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#2D4627" }}>Data</span>
                <span style={{ fontSize: "12px", color: "#444" }}>{formatarData(dataBase)}</span>
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
                src={denuncia.foto_url ? `https://ecomonitor-api.onrender.com/${denuncia.foto_url}` : "https://placehold.co/100x100/cccccc/ffffff?text=Sem+Foto"} 
                alt="Denúncia" 
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "15px" }}
                onError={(e) => { e.target.src = "https://placehold.co/100x100/cccccc/ffffff?text=Sem+Foto" }}
              />
            </div>
          </div>

          <div>
            <h3 style={sectionTitleStyle}>Localização capturada</h3>
            <div style={{ ...grayBoxStyle, padding: "0", overflow: "hidden", display: "flex", flexDirection: "row", height: "90px" }}>
              {posicaoMapa ? (
                <div style={{ height: "100%", width: "40%", zIndex: 0 }}>
                  <MapContainer 
                    center={posicaoMapa} 
                    zoom={16} 
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={posicaoMapa} />
                  </MapContainer>
                </div>
              ) : (
                <div style={{ height: "100%", width: "40%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#e8f2db", color: "#2D4627", fontSize: "11px", textAlign: "center" }}>
                  Sem mapa
                </div>
              )}
              <div style={{ flex: 1, padding: "0 15px", fontSize: "12px", color: "#444", display: "flex", flexDirection: "column", justifyContent: "center", gap: "4px" }}>
                <span><strong>Lat:</strong> {denuncia.latitude ? denuncia.latitude.toFixed(6) : "N/D"}</span>
                <span><strong>Lng:</strong> {denuncia.longitude ? denuncia.longitude.toFixed(6) : "N/D"}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={sectionTitleStyle}>Histórico</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0", marginTop: "10px" }}>
              {historicoDinamico.map((item, index) => (
                <div key={index} style={{ display: "flex", gap: "15px", minHeight: "50px" }}>
                  <div style={{ width: "70px", textAlign: "right", fontSize: "11px", color: "#444", paddingTop: "2px" }}>
                    <div>{item.data}</div>
                    <div>{item.hora}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "20px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#2D4627", zIndex: 2 }}></div>
                    {index !== historicoDinamico.length - 1 && (
                      <div style={{ width: "2px", flex: 1, backgroundColor: "#2D4627", marginTop: "-2px", marginBottom: "-2px" }}></div>
                    )}
                  </div>
                  <div style={{ flex: 1, fontSize: "12px", color: "#444", paddingBottom: "20px", whiteSpace: "pre-line" }}>
                    {item.texto}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
};

export default ReportDetails;