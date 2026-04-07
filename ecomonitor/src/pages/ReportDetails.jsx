import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLayout from "../components/PageLayout/PageLayout";

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

  const getStatusBadge = (status) => {
    let bgColor = "#D59A53"; 
    if (status === "Validado") bgColor = "#7FB04B"; 
    if (status === "Resolvida") bgColor = "#3B75A3"; 

    return (
      <span style={{ backgroundColor: bgColor, color: "white", padding: "4px 10px", borderRadius: "15px", fontSize: "12px", fontWeight: "bold" }}>
        {status || "Pendente"}
      </span>
    );
  };

  const historicoMock = [
    { data: "15/10/2023", hora: "14:30", texto: "Denúncia enviada pelo usuário\n(+50 pts)" },
    { data: "16/10/2023", hora: "10:15", texto: "Status alterado para \"em análise\"\n(by admin)" },
    { data: "18/10/2023", hora: "09:00", texto: "Status alterado para \"validado\"" },
    { data: "20/10/2023", hora: "08:00", texto: "Programação de coleta de lixo" }
  ];

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
          
          {/* 1. DADOS GERAIS */}
          <div>
            <h3 style={sectionTitleStyle}>Dados gerais</h3>
            <div style={{ ...grayBoxStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#2D4627" }}>Categoria</span>
                <span style={{ fontSize: "12px", color: "#444", textTransform: "capitalize" }}>
                  {denuncia.categoria.replace("_", " ")}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#2D4627" }}>Data</span>
                <span style={{ fontSize: "12px", color: "#444" }}>15/10/2023</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#2D4627" }}>Status</span>
                {getStatusBadge(denuncia.status)}
              </div>
            </div>
          </div>

          {/* 2. DESCRIÇÃO COMPLETA */}
          <div>
            <h3 style={sectionTitleStyle}>Descrição completa</h3>
            <div style={grayBoxStyle}>
              <p style={{ margin: 0, fontSize: "13px", color: "#444", lineHeight: "1.4" }}>
                {denuncia.descricao || "Nenhuma descrição detalhada fornecida pelo usuário."}
              </p>
            </div>
          </div>

          {/* 3. IMAGENS */}
          <div>
            <h3 style={sectionTitleStyle}>Imagens</h3>
            <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
              <img 
                src={`https://ecomonitor-api.onrender.com/${denuncia.foto_url}`} 
                alt="Denúncia" 
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "15px" }}
                onError={(e) => { e.target.src = "https://placehold.co/100x100/cccccc/ffffff?text=Sem+Foto" }}
              />
            </div>
          </div>

          {/* 4. LOCALIZAÇÃO */}
          <div>
            <h3 style={sectionTitleStyle}>Localização capturada</h3>
            <div style={{ ...grayBoxStyle, display: "flex", gap: "15px", alignItems: "center", padding: "10px" }}>
              <img 
                src={`https://placehold.co/120x80/e8f2db/2D4627/png?text=Mapa`} 
                alt="Mapa" 
                style={{ width: "100px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
              />
              <div style={{ fontSize: "12px", color: "#444", lineHeight: "1.4" }}>
                Lat: {denuncia.latitude?.toFixed(4)}<br/>
                Lng: {denuncia.longitude?.toFixed(4)}
              </div>
            </div>
          </div>

          {/* 5. HISTÓRICO */}
          <div>
            <h3 style={sectionTitleStyle}>Histórico</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0", marginTop: "10px" }}>
              {historicoMock.map((item, index) => (
                <div key={index} style={{ display: "flex", gap: "15px", minHeight: "50px" }}>
                  <div style={{ width: "70px", textAlign: "right", fontSize: "11px", color: "#444", paddingTop: "2px" }}>
                    <div>{item.data}</div>
                    <div>{item.hora}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "20px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#2D4627", zIndex: 2 }}></div>
                    {index !== historicoMock.length - 1 && (
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