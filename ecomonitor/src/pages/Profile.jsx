import React, { useState, useEffect, useRef } from "react"; 
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout/PageLayout";
import API_URL from "../config";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 

  const [perfil, setPerfil] = useState({
    nome: "Carregando...",
    pontuacao: 0,
    foto_perfil: null,
    posicao_ranking: null,
    cidade_ranking: "Carregando...",
    conquistas: []
  });

  useEffect(() => {
    const buscarPerfil = async () => {
      const token = localStorage.getItem("meuToken"); 
      
      if (!token) {
        console.error("Token não encontrado no localStorage");
        navigate("/"); 
        return;
      }

      try {
        const resposta = await fetch(`${API_URL}/perfil`, {
          headers: {
            "Authorization": `Bearer ${token}` 
          }
        });

        if (resposta.ok) {
          const dados = await resposta.json();
          setPerfil({
            nome: dados.nome || "Sem Nome",
            pontuacao: dados.pontuacao || 0,
            foto_perfil: dados.foto_perfil || null,
            posicao_ranking: dados.posicao_ranking || null,
            cidade_ranking: dados.cidade_ranking || "Brasil",
            conquistas: dados.conquistas || []
          });
        } else {
          const erroApi = await resposta.text();
          console.error(`Erro na API (${resposta.status}):`, erroApi);
          if(resposta.status === 401) navigate("/");
        }
      } catch (erro) {
        console.error("Erro de conexão no fetch:", erro);
      }
    };

    buscarPerfil();
  }, [navigate]);

  const handleTrocarFoto = async (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const formData = new FormData();
    formData.append("foto", arquivo);

    const token = localStorage.getItem("meuToken");

    try {
      const resposta = await fetch(`${API_URL}/perfil/foto`,{
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        setPerfil(prev => ({ ...prev, foto_perfil: dados.foto_perfil }));
      }
    } catch (erro) {
      console.error("Erro ao fazer upload:", erro);
    }
  };

  const fazerLogout = () => {
    localStorage.removeItem("meuToken"); 
    navigate("/");
  };

  const containerStyle = {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "20px 5%", gap: "20px", flex: 1, paddingBottom: "100px", 
    overflowY: "auto", boxSizing: "border-box",
  };

  const blobBackgroundStyle = {
    width: "140px", height: "140px", backgroundColor: "#7FB04B", 
    borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%", 
    display: "flex", justifyContent: "center", alignItems: "center",
    position: "relative", marginTop: "10px", cursor: "pointer" 
  };

  const profilePicStyle = {
    width: "100px", height: "100px", borderRadius: "50%",
    objectFit: "cover", border: "3px solid white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  };

  const nameStyle = { color: "#2D4627", fontWeight: "bold", fontSize: "20px", margin: "-5px 0 0 0" };

  const progressBarContainer = {
    width: "100%", backgroundColor: "#78A64B", borderRadius: "20px",
    height: "40px", position: "relative", overflow: "hidden",
  };

  const progressBarFill = {
    width: `${Math.min((perfil.pontuacao / 1000) * 100, 100)}%`, 
    backgroundColor: "#2D4627", height: "100%", borderRadius: "20px",
    display: "flex", alignItems: "center", paddingLeft: "20px", boxSizing: "border-box",
    transition: "width 0.5s ease-in-out"
  };

  const progressTextStyle = { color: "white", fontWeight: "bold", fontSize: "16px", zIndex: 2 };

  const rankingCardStyle = { 
    backgroundColor: "#78A64B", borderRadius: "15px", padding: "20px", 
    width: "100%", display: "flex", alignItems: "center", color: "white", 
    boxSizing: "border-box", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" 
  };

  const achievementsRowStyle = { display: "flex", width: "100%", gap: "10px", flexWrap: "wrap" };

  const achievementMiniCardStyle = { 
    backgroundColor: "#78A64B", borderRadius: "10px", padding: "15px 10px", 
    flex: "1 1 120px", textAlign: "center", color: "white", 
    fontWeight: "bold", fontSize: "14px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" 
  };

  const logoutBtnStyle = { 
    backgroundColor: "#78A64B", color: "white", border: "none", 
    borderRadius: "10px", padding: "15px", fontSize: "18px", 
    fontWeight: "bold", width: "100%", cursor: "pointer", marginTop: "10px"
  };

  return (
    <PageLayout title="Perfil">
      <div style={containerStyle}>
        
        <input 
          type="file" 
          accept="image/*" 
          style={{ display: "none" }} 
          ref={fileInputRef} 
          onChange={handleTrocarFoto} 
        />

        <div style={blobBackgroundStyle} onClick={() => fileInputRef.current.click()}>
          {perfil.foto_perfil ? (
            <img src={perfil.foto_perfil} alt="Perfil" style={profilePicStyle} />
          ) : (
            <div style={{color: "white", fontSize: "40px"}}>👤</div>
          )}
        </div>

        <h2 style={nameStyle}>{perfil.nome}</h2>

        <div style={progressBarContainer}>
          <div style={progressBarFill}>
            <span style={progressTextStyle}>{perfil.pontuacao}/1000</span>
          </div>
        </div>

        <div style={rankingCardStyle}>
          <div style={{ display: "flex", alignItems: "flex-start", marginRight: "25px" }}>
            <span style={{ fontSize: "55px", fontWeight: "bold", lineHeight: "1" }}>
              {perfil.posicao_ranking || "-"}
            </span>
            <span style={{ fontSize: "20px", fontWeight: "bold", marginTop: "5px" }}>º</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: "bold", fontSize: "18px" }}>Sua posição</span>
            <span style={{ fontSize: "13px", opacity: 0.9 }}>Ranking {perfil.cidade_ranking}</span>
          </div>
        </div>

        <div style={achievementsRowStyle}>
          {perfil.conquistas && perfil.conquistas.length > 0 ? (
            [...new Set(perfil.conquistas)].map((conquista, index) => (
              <div key={index} style={achievementMiniCardStyle}>
                {conquista}
              </div>
            ))
          ) : (
            <div style={{...achievementMiniCardStyle, opacity: 0.7, backgroundColor: "#E0E0E0", color: "#666"}}>
              Nenhuma conquista ainda
            </div>
          )}
        </div>

        <button style={logoutBtnStyle} onClick={fazerLogout}>
          Sair
        </button>

      </div>
    </PageLayout>
  );
};

export default Profile;