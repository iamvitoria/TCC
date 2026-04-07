import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout/PageLayout";

const Contributions = () => {
  const navigate = useNavigate();
  const [denuncias, setDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

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

  // --- ESTILOS IDÊNTICOS AO SEU PRINT ---
  const containerStyle = {
    padding: "20px 5%",
    paddingBottom: "120px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  };

  const cardStyle = {
    backgroundColor: "#EBEBEB", // Cinza claro do seu print
    borderRadius: "15px",
    padding: "20px 15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    cursor: "pointer", // Mãozinha ao passar o mouse
    transition: "transform 0.1s"
  };

  const leftSideStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  };

  const titleStyle = {
    margin: 0,
    color: "#2D4627", // Verde escuro
    fontSize: "16px",
    fontWeight: "bold",
    textTransform: "capitalize"
  };

  const dateStyle = {
    margin: 0,
    color: "#666",
    fontSize: "12px"
  };

  // Cores dos botões baseadas no seu print
  const getStatusBadgeStyle = (status) => {
    let bgColor = "#7FB04B"; // Verde padrão (Validado)
    let textStatus = "Validado";

    // O banco salva "Pendente", mas no seu design aparece "Em análise" em laranja
    if (status === "Pendente" || status === "Em Análise") {
      bgColor = "#D59A53"; // Laranja do print
      textStatus = "Em análise";
    } else if (status === "Resolvida") {
      bgColor = "#3B75A3"; // Azul do print
      textStatus = "Resolvido";
    }

    return {
      style: {
        backgroundColor: bgColor,
        color: "white",
        padding: "8px 16px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: "bold",
        border: "none"
      },
      text: textStatus
    };
  };

  return (
    <PageLayout title="Minhas Contribuições">
      <div style={containerStyle}>
        
        {carregando && <p style={{ textAlign: "center", color: "#2D4627" }}>Carregando suas denúncias... ⏳</p>}
        {erro && <p style={{ color: "red", textAlign: "center" }}>{erro}</p>}

        {!carregando && !erro && denuncias.length === 0 && (
          <div style={{ textAlign: "center", color: "#2D4627", marginTop: "40px" }}>
            <h2>🌱 Nenhuma denúncia ainda!</h2>
            <button 
              onClick={() => navigate("/report")} 
              style={{ backgroundColor: "#2D4627", color: "white", padding: "10px 20px", borderRadius: "10px", border: "none", marginTop: "15px", cursor: "pointer" }}
            >
              Fazer uma Denúncia
            </button>
          </div>
        )}

        {/* LISTA DE CARDS */}
        {!carregando && denuncias.map((denuncia) => {
          const badgeInfo = getStatusBadgeStyle(denuncia.status);
          
          return (
            <div 
              key={denuncia.id} 
              style={cardStyle}
              // 👇 AQUI ACONTECE A MÁGICA: Redireciona e envia os dados da denúncia!
              onClick={() => navigate(`/report-details/${denuncia.id}`, { state: { denunciaSelecionada: denuncia } })}
            >
              <div style={leftSideStyle}>
                <h3 style={titleStyle}>
                  {denuncia.categoria.replace("_", " ")}
                </h3>
                {/* Como não temos data no banco ainda, coloquei a de hoje como exemplo */}
                <p style={dateStyle}>07/04/2026</p> 
              </div>

              <div>
                <button style={badgeInfo.style}>
                  {badgeInfo.text}
                </button>
              </div>
            </div>
          );
        })}

      </div>
    </PageLayout>
  );
};

export default Contributions;