import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageLayout from "../components/PageLayout/PageLayout";

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Pega os dados que foram passados pelo clique no card
  const denuncia = location.state?.denunciaSelecionada;

  const containerStyle = {
    padding: "20px 5%",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    color: "#2D4627"
  };

  if (!denuncia) {
    return (
      <PageLayout title="Detalhes">
        <div style={containerStyle}>
            <p>Denúncia não encontrada.</p>
            <button onClick={() => navigate(-1)}>Voltar</button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`Denúncia #${id}`}>
      <div style={containerStyle}>
        
        <button style={{ backgroundColor: "transparent", border: "none", color: "#2D4627", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "5px", fontWeight: "bold", alignSelf: "flex-start" }} onClick={() => navigate(-1)}>
           ← Voltar
        </button>

        {/* 1. Foto Real */}
        <img 
            src={`https://ecomonitor-api.onrender.com/${denuncia.foto_url}`} 
            alt="Foto da denúncia" 
            style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
            onError={(e) => { e.target.src = "https://placehold.co/600x400/cccccc/ffffff?text=Sem+Foto" }}
        />

        {/* 2. Título e Status */}
        <div>
            <h2 style={{ margin: 0, textTransform: "capitalize" }}>{denuncia.categoria.replace("_", " ")}</h2>
            <span style={{ backgroundColor: "#7FB04B", color: "white", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", display: "inline-block", marginTop: "10px" }}>
                Status: {denuncia.status}
            </span>
        </div>

        {/* 3. GPS / Mapa Simulado */}
        <div style={{ backgroundColor: "#F1F8E9", padding: "15px", borderRadius: "15px", border: "1px solid #A1C680" }}>
            <h4 style={{margin: "0 0 10px 0"}}>📍 Localização Capturada</h4>
            <img 
                src={`https://placehold.co/600x300/e8f2db/2D4627/png?text=Mapa+Lat:${denuncia.latitude?.toFixed(4)}`}
                alt="Mapa da localização" 
                style={{width: '100%', height: '120px', objectFit: 'cover', borderRadius: "10px"}}
            />
            <div style={{fontSize: "12px", color: "#666", marginTop: "8px", display: "flex", justifyContent: "space-between"}}>
                <span>Lat: {denuncia.latitude?.toFixed(4)}</span>
                <span>Lng: {denuncia.longitude?.toFixed(4)}</span>
            </div>
        </div>

        {/* 4. Descrição */}
        <div>
            <h4 style={{margin: "0 0 8px 0"}}>Descrição Completa</h4>
            <p style={{margin: 0, fontSize: "14px", color: "#555", lineHeight: "1.5"}}>
                {denuncia.descricao || "Nenhuma descrição detalhada fornecida no momento da denúncia."}
            </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default ReportDetails;