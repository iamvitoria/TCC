import React from "react";
// Deixe assim:
import { useNavigate, useLocation } from "react-router-dom";
import PageLayout from "../components/PageLayout/PageLayout";

const ReportDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Pega todos os dados da denúncia (foto, GPS, descrição) que vieram do clique
  const denuncia = location.state?.denunciaSelecionada;

  const containerStyle = {
    padding: "20px 5%",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    color: "#2D4627",
    paddingBottom: "100px"
  };

  // Se por acaso alguém digitar a URL direto sem clicar no card, avisamos que não achou
  if (!denuncia) {
    return (
      <PageLayout title="Detalhes da Denúncia">
        <div style={containerStyle}>
            <p>Denúncia não encontrada.</p>
            <button onClick={() => navigate(-1)}>Voltar</button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Detalhes da Denúncia">
      <div style={containerStyle}>
        
        {/* Botão de Voltar */}
        <button 
          style={{ backgroundColor: "transparent", border: "none", color: "#2D4627", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", gap: "5px", fontWeight: "bold", alignSelf: "flex-start" }} 
          onClick={() => navigate(-1)}
        >
           ← Voltar
        </button>

        {/* 1. A FOTO GRANDE QUE SALVAMOS NO BANCO! */}
        <img 
            src={`https://ecomonitor-api.onrender.com/${denuncia.foto_url}`} 
            alt="Foto da denúncia" 
            style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
            onError={(e) => { e.target.src = "https://placehold.co/600x400/cccccc/ffffff?text=Foto+Indisponível" }}
        />

        {/* 2. Título e Status */}
        <div>
            <h2 style={{ margin: 0, textTransform: "capitalize", fontSize: "22px" }}>
              {denuncia.categoria.replace("_", " ")}
            </h2>
            <p style={{ margin: "5px 0 10px 0", color: "#666", fontSize: "14px" }}>
                ID da Denúncia: #{denuncia.id}
            </p>
        </div>

        {/* 3. Descrição Completa */}
        <div>
            <h4 style={{margin: "0 0 8px 0", fontSize: "18px"}}>Descrição Completa</h4>
            <p style={{margin: 0, fontSize: "16px", color: "#444", lineHeight: "1.5", backgroundColor: "#EBEBEB", padding: "15px", borderRadius: "10px"}}>
                {denuncia.descricao || "Nenhuma descrição detalhada fornecida pelo usuário."}
            </p>
        </div>

        {/* 4. GPS / Minimapa */}
        <div style={{ backgroundColor: "#F1F8E9", padding: "15px", borderRadius: "10px", border: "1px solid #78A64B" }}>
            <h4 style={{margin: "0 0 10px 0", color: "#2D4627"}}>📍 Localização Capturada</h4>
            <img 
                src={`https://placehold.co/600x300/e8f2db/2D4627/png?text=Mapa+Lat:${denuncia.latitude?.toFixed(4)}`}
                alt="Mapa da localização" 
                style={{width: '100%', height: '120px', objectFit: 'cover', borderRadius: "8px"}}
            />
            <div style={{fontSize: "14px", color: "#2D4627", marginTop: "10px", display: "flex", justifyContent: "space-between", fontWeight: "bold"}}>
                <span>Lat: {denuncia.latitude?.toFixed(4)}</span>
                <span>Lng: {denuncia.longitude?.toFixed(4)}</span>
            </div>
        </div>

      </div>
    </PageLayout>
  );
};

export default ReportDetails;