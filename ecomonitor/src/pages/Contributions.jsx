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
          console.log("DADOS DA API:", data);
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


  const formatarNomeCategoria = (slug) => {
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

  const formatarData = (dataIso) => {
    if (!dataIso) return "Data não informada"; 

    try {
      const data = new Date(dataIso);
      
      if (isNaN(data.getTime())) {
         console.warn("Data inválida recebida:", dataIso);
         return "Processando data...";
      }

      return data.toLocaleDateString("pt-BR");
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return "Erro no formato";
    }
  };

  const containerStyle = {
    padding: "20px 5%",
    paddingBottom: "120px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  };

  const cardStyle = {
    backgroundColor: "#EBEBEB",
    borderRadius: "15px",
    padding: "20px 15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    cursor: "pointer",
    transition: "transform 0.1s"
  };

  const leftSideStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  };

  const titleStyle = {
    margin: 0,
    color: "#2D4627",
    fontSize: "16px",
    fontWeight: "bold"
  };

  const dateStyle = {
    margin: 0,
    color: "#666",
    fontSize: "12px"
  };

  const getStatusBadgeStyle = (status) => {
    let bgColor = "#7FB04B"; 
    let textStatus = "Validado";

    if (status === "Pendente" || status === "Em Análise") {
      bgColor = "#D59A53"; 
      textStatus = "Em análise";
    } else if (status === "Resolvida") {
      bgColor = "#3B75A3"; 
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
            <h2>Nenhuma denúncia relatada</h2>
          </div>
        )}

        {!carregando && denuncias.map((denuncia) => {
          const badgeInfo = getStatusBadgeStyle(denuncia.status);
          const dataReal = denuncia.data_criacao || denuncia.created_at;
          
          return (
            <div 
              key={denuncia.id} 
              style={cardStyle}
              onClick={() => navigate(`/report-details/${denuncia.id}`, { state: { denunciaSelecionada: denuncia } })}
            >
              <div style={leftSideStyle}>
                <h3 style={titleStyle}>
                  {formatarNomeCategoria(denuncia.categoria)}
                </h3>
                <p style={dateStyle}>
                  {formatarData(dataReal)}
                </p>
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