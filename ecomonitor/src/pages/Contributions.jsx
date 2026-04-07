import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout/PageLayout";

const Contributions = () => {
  const navigate = useNavigate();
  const [denuncias, setDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  
  // Barra de filtros do topo
  const filtros = ["Todas", "Recentes", "Aprovadas", "Pendentes"];
  const [filtroAtivo, setFiltroAtivo] = useState("Todas");

  useEffect(() => {
    const buscarDenuncias = async () => {
      const token = localStorage.getItem("meuToken");

      if (!token) {
        setErro("Você precisa estar logado para ver suas contribuições.");
        setCarregando(false);
        return;
      }

      try {
        const response = await fetch("https://ecomonitor-api.onrender.com/minhas-denuncias", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setDenuncias(data); 
        } else {
          setErro("Não foi possível carregar as denúncias.");
        }
      } catch (error) {
        console.error("Erro de conexão:", error);
        setErro("Erro ao conectar com o servidor.");
      } finally {
        setCarregando(false);
      }
    };

    buscarDenuncias();
  }, []);

  // Função para escolher um ícone baseado na categoria
  const getIconeCategoria = (categoria) => {
    const cat = categoria?.toLowerCase() || "";
    if (cat.includes("desmatamento") || cat.includes("arvore")) return "🪓";
    if (cat.includes("lixo") || cat.includes("residuos")) return "🗑️";
    if (cat.includes("fogo") || cat.includes("queimada")) return "🔥";
    if (cat.includes("agua") || cat.includes("esgoto")) return "💧";
    return "🌱"; // Padrão
  };

  // --- ESTILOS ---
  const containerStyle = {
    padding: "20px 5%",
    paddingBottom: "120px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  };

  const scrollBarStyle = {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    paddingBottom: "5px",
    scrollbarWidth: "none"
  };

  const getFiltroStyle = (filtro) => ({
    padding: "6px 15px",
    borderRadius: "20px",
    backgroundColor: filtro === filtroAtivo ? "#7FB04B" : "transparent",
    color: filtro === filtroAtivo ? "white" : "#7FB04B",
    border: `1px solid ${filtro === filtroAtivo ? "#7FB04B" : "#A1C680"}`,
    fontSize: "14px",
    cursor: "pointer",
    whiteSpace: "nowrap"
  });

  const cardStyle = {
    backgroundColor: "#F1F8E9",
    borderRadius: "15px",
    padding: "15px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    cursor: "pointer", 
    border: "1px solid transparent"
  };

  const getStatusButtonStyle = (status) => {
    let bgColor = "#7FB04B"; // Verde padrão
    let color = "white";

    if (status === "Pendente" || status?.includes("análise")) {
      bgColor = "#FFD54F"; // Amarelo
      color = "#2D4627";
    } else if (status === "Resolvida") {
      bgColor = "#2D4627"; // Verde escuro
    }

    return {
      border: "none",
      padding: "4px 12px",
      borderRadius: "20px",
      backgroundColor: bgColor,
      color: color,
      fontSize: "12px",
      fontWeight: "600",
      marginTop: "4px",
      display: "inline-block"
    };
  };

  // Aplica o filtro na lista (simples frontend)
  const denunciasFiltradas = denuncias.filter(d => {
    if (filtroAtivo === "Todas" || filtroAtivo === "Recentes") return true;
    if (filtroAtivo === "Pendentes") return d.status === "Pendente" || d.status === "Em Análise";
    if (filtroAtivo === "Aprovadas") return d.status === "Validado" || d.status === "Resolvida";
    return true;
  });

  return (
    <PageLayout title="Minhas Contribuições">
      {/* 1. Barra de Filtros */}
      <div style={{...containerStyle, paddingBottom: 0}}>
          <div style={scrollBarStyle}>
              {filtros.map(filtro => (
                  <button key={filtro} style={getFiltroStyle(filtro)} onClick={() => setFiltroAtivo(filtro)}>
                      {filtro}
                  </button>
              ))}
          </div>
      </div>

      {/* 2. Lista de Cards */}
      <div style={containerStyle}>
        {carregando && <p style={{ textAlign: "center", color: "#2D4627" }}>Carregando suas denúncias... ⏳</p>}
        {erro && <p style={{ color: "red", textAlign: "center" }}>{erro}</p>}

        {!carregando && !erro && denunciasFiltradas.length === 0 && (
          <div style={{ textAlign: "center", color: "#2D4627", marginTop: "20px" }}>
            <p>Nenhuma denúncia encontrada para este filtro.</p>
          </div>
        )}

        {!carregando && denunciasFiltradas.map((denuncia) => (
          <div 
            key={denuncia.id} 
            style={cardStyle} 
            // ENVIA OS DADOS DA DENÚNCIA JUNTO COM O REDIRECIONAMENTO 👇
            onClick={() => navigate(`/report-details/${denuncia.id}`, { state: { denunciaSelecionada: denuncia } })}
          >
            {/* Ícone na esquerda */}
            <div style={{ fontSize: "30px", width: "45px", textAlign: "center" }}>
                {getIconeCategoria(denuncia.categoria)}
            </div>

            {/* Textos no meio e status */}
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, color: "#2D4627", fontSize: "16px", textTransform: "capitalize" }}>
                {denuncia.categoria.replace("_", " ")}
              </h3>
              <p style={{ margin: "2px 0 0 0", color: "#A1C680", fontSize: "12px" }}>
                Acompanhe o status:
              </p>
              <div style={getStatusButtonStyle(denuncia.status)}>
                {denuncia.status || "Pendente"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default Contributions;