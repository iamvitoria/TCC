import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";

const Home = () => {
  const navigate = useNavigate();

  const [nomeUsuario, setNomeUsuario] = useState("Usuário"); 
  const [localizacao, setLocalizacao] = useState("Buscando localização...");
  
  const [denuncias, setDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [estatisticas, setEstatisticas] = useState({
    abertas: 0,
    emAnalise: 0,
    resolvidas: 0
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setLocalizacao("Santa Maria - RS"),
        () => setLocalizacao("Localização não permitida")
      );
    } else {
      setLocalizacao("Santa Maria - RS");
    }

    const carregarDadosDaTela = async () => {
      const token = localStorage.getItem("token"); 

      if (!token) {
        setErro("Você precisa estar logado para ver seu painel.");
        setCarregando(false);
        return;
      }

      try {
        const responsePerfil = await fetch("https://ecomonitor-api.onrender.com/perfil", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (responsePerfil.ok) {
          const dadosPerfil = await responsePerfil.json();
          setNomeUsuario(dadosPerfil.nome || "Usuário");
        }

        const responseDenuncias = await fetch("https://ecomonitor-api.onrender.com/minhas-denuncias", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (responseDenuncias.ok) {
          const data = await responseDenuncias.json();
          setDenuncias(data);
          calcularEstatisticas(data);
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

    carregarDadosDaTela();
  }, []);

  const calcularEstatisticas = (listaDenuncias) => {
    let abertas = 0;
    let emAnalise = 0;
    let resolvidas = 0;

    listaDenuncias.forEach(d => {
      const status = d.status ? d.status.toLowerCase().trim() : "";
      if (status === "validado" || status === "aceito") abertas++;
      else if (status === "pendente" || status === "em análise" || status === "em analise") emAnalise++;
      else if (status === "resolvida" || status === "resolvido") resolvidas++;
    });

    setEstatisticas({ abertas, emAnalise, resolvidas });
  };

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
      if (isNaN(data.getTime())) return "Processando data...";
      return data.toLocaleDateString("pt-BR");
    } catch {
      return "Erro no formato";
    }
  };

  const getStatusStyle = (status) => {
    const s = status ? status.toLowerCase().trim() : "";
    
    if (s === "pendente" || s === "em análise" || s === "em analise") {
      return { backgroundColor: "#D98A3C", color: "white", text: "Em análise" };
    } 
    if (s === "validado" || s === "aceito") {
      return { backgroundColor: "#7CB342", color: "white", text: "Validado" };
    }
    if (s === "resolvida" || s === "resolvido") {
      return { backgroundColor: "#3178C6", color: "white", text: "Resolvido" };
    }
    if (s === "cancelado" || s === "rejeitado" || s === "cancelada") {
      return { backgroundColor: "#E74C3C", color: "white", text: "Cancelado" };
    }
    return { backgroundColor: "#9E9E9E", color: "white", text: status || "Desconhecido" };
  };

  return (
    <div style={{ backgroundColor: "#F5F7F5", minHeight: "100vh", paddingBottom: "120px", fontFamily: "Arial, sans-serif" }}>
      
      <div style={{ 
        backgroundColor: "#1C3520", 
        padding: "40px 20px 60px 20px", 
        borderBottomLeftRadius: "20px", 
        borderBottomRightRadius: "20px" 
      }}>
        <p style={{ color: "#6AA85B", margin: 0, fontSize: "16px", fontWeight: "bold" }}>
          Olá, {nomeUsuario}
        </p>
        <h1 style={{ color: "white", margin: "5px 0", fontSize: "24px" }}>
          Painel ambiental
        </h1>
        <p style={{ color: "#6AA85B", margin: 0, fontSize: "14px", display: "flex", alignItems: "center", gap: "5px" }}>
          {localizacao}
        </p>
      </div>

      <div style={{ padding: "0 20px", marginTop: "-30px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <div style={cardStatStyle}>
            <h2 style={{ margin: 0, fontSize: "24px", color: "#1C3520" }}>{estatisticas.abertas}</h2>
            <p style={{ margin: 0, fontSize: "12px", color: "#1C3520", fontWeight: "bold" }}>Abertas</p>
          </div>
          <div style={cardStatStyle}>
            <h2 style={{ margin: 0, fontSize: "24px", color: "#1C3520" }}>{estatisticas.emAnalise}</h2>
            <p style={{ margin: 0, fontSize: "12px", color: "#1C3520", fontWeight: "bold" }}>Em análise</p>
          </div>
          <div style={cardStatStyle}>
            <h2 style={{ margin: 0, fontSize: "24px", color: "#1C3520" }}>{estatisticas.resolvidas}</h2>
            <p style={{ margin: 0, fontSize: "12px", color: "#1C3520", fontWeight: "bold" }}>Resolvidas</p>
          </div>
        </div>

        <h3 style={{ marginTop: "30px", marginBottom: "15px", color: "#1C3520", fontSize: "18px" }}>
          Suas denúncias
        </h3>

        {carregando && <p style={{ textAlign: "center", color: "#2D4627" }}>Carregando suas denúncias... ⏳</p>}
        {erro && <p style={{ color: "#E74C3C", textAlign: "center", fontWeight: "bold" }}>{erro}</p>}
        
        {!carregando && !erro && denuncias.length === 0 && (
          <div style={{ textAlign: "center", color: "#2D4627", marginTop: "20px" }}>
            <p>Nenhuma denúncia relatada ainda.</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {!carregando && denuncias.map((denuncia) => {
            const statusInfo = getStatusStyle(denuncia.status);
            const dataReal = denuncia.data_criacao || denuncia.created_at;

            return (
              <div 
                key={denuncia.id} 
                onClick={() => navigate(`/report-details/${denuncia.id}`, { state: { denunciaSelecionada: denuncia } })}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.02)",
                  border: "1px solid #EBEFEB",
                  cursor: "pointer"
                }}
              >
                <div>
                  <h4 style={{ margin: 0, color: "#1C3520", fontSize: "16px" }}>
                    {formatarNomeCategoria(denuncia.categoria)}
                  </h4>
                  <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "12px" }}>
                    {formatarData(dataReal)}
                  </p>
                </div>
                
                <div style={{
                  backgroundColor: statusInfo.backgroundColor,
                  color: statusInfo.color,
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  minWidth: "90px",
                  textAlign: "center"
                }}>
                  {statusInfo.text}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <Navbar isAdmin={false} />

    </div>
  );
};

const cardStatStyle = {
  backgroundColor: "white",
  flex: 1,
  padding: "20px 10px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
  border: "1px solid #EBEFEB",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center"
};

export default Home;