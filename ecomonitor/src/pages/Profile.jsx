import React, { useState, useEffect, useRef } from "react"; 
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import API_URL from "../config";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 

  const [carregando, setCarregando] = useState(true);
  const [perfil, setPerfil] = useState({
    nome: "",
    pontuacao: 0,
    foto_perfil: null,
    posicao_ranking: "-",
    cidade_ranking: "",
    denuncias: 0,
    conquistas: []
  });

  useEffect(() => {
    const buscarPerfil = async () => {
      const token = localStorage.getItem("token") || localStorage.getItem("meuToken"); 
      
      if (!token) {
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
            nome: dados.nome || "Usuário",
            pontuacao: dados.pontuacao || 0,
            foto_perfil: dados.foto_perfil || null,
            posicao_ranking: dados.posicao_ranking || "-",
            cidade_ranking: dados.cidade || dados.cidade_ranking || "Sua região",
            denuncias: dados.denuncias ?? dados.total_denuncias ?? 0,
            conquistas: dados.conquistas || []
          });
        } else {
          if(resposta.status === 401) navigate("/");
        }
      } catch (erro) {
        console.error(erro);
      } finally {
        setCarregando(false);
      }
    };

    buscarPerfil();
  }, [navigate]);

  const handleTrocarFoto = async (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const formData = new FormData();
    formData.append("foto", arquivo);

    const token = localStorage.getItem("token") || localStorage.getItem("meuToken");

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
      console.error(erro);
    }
  };

  const fazerLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("meuToken"); 
    navigate("/");
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100vh", 
    overflowY: "auto", 
    backgroundColor: "#1C3520", 
    boxSizing: "border-box",
  };

  const topSectionStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "50px 20px 30px 20px",
    width: "100%",
    boxSizing: "border-box"
  };

  const blobStyle = {
    width: "140px", 
    height: "140px",
    backgroundColor: "#7FB04B",
    borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center",
    marginBottom: "15px", 
    position: "relative",
    cursor: "pointer"
  };

  const profilePicStyle = {
    width: "120px", 
    height: "120px",
    borderRadius: "50%", 
    objectFit: "cover"
  };

  const nameStyle = { 
    color: "white", 
    fontSize: "22px", 
    fontWeight: "bold", 
    margin: "0 0 5px 0",
    textAlign: "center"
  };

  const locationStyle = { 
    color: "#7FB04B", 
    fontSize: "18px", 
    margin: "0 0 20px 0", 
    fontWeight: "normal",
    textAlign: "center"
  };

  const progressBgStyle = {
    width: "100%", 
    maxWidth: "320px", 
    height: "8px",
    backgroundColor: "rgba(255,255,255,0.2)", 
    borderRadius: "4px",
    marginBottom: "25px",
    overflow: "hidden"
  };

  const progressFillStyle = {
    width: `${Math.min((perfil.pontuacao / 1000) * 100, 100)}%`,
    height: "100%",
    backgroundColor: "#7FB04B", 
    borderRadius: "4px",
    transition: "width 0.5s ease-in-out"
  };

  const statsRowStyle = {
    display: "flex", 
    gap: "10px", 
    width: "100%", 
    maxWidth: "320px"
  };

  const statCardStyle = {
    backgroundColor: "#2D4627", 
    borderRadius: "10px", 
    padding: "15px 5px",
    flex: 1, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center",
    justifyContent: "center"
  };

  const statValueStyle = { 
    color: "white", 
    fontSize: "20px", 
    fontWeight: "bold", 
    marginBottom: "5px" 
  };

  const statLabelStyle = { 
    color: "white", 
    fontSize: "10px", 
    fontWeight: "300", 
    textAlign: "center" 
  };

  const bottomSectionStyle = {
    backgroundColor: "white", 
    borderTopLeftRadius: "25px",
    borderTopRightRadius: "25px",
    flex: 1, 
    width: "100%",
    padding: "25px 20px 140px 20px", 
    boxSizing: "border-box",
    display: "flex", 
    flexDirection: "column", 
    gap: "15px"
  };

  const achievementsTitleContainerStyle = {
    display: "flex", 
    alignItems: "center", 
    gap: "8px", 
    cursor: "pointer",
    marginBottom: "5px"
  };

  const achievementsTitleStyle = {
    margin: 0, 
    fontSize: "16px", 
    color: "#1C3520", 
    fontWeight: "bold" 
  };

  const achievementsRowStyle = { 
    display: "flex", 
    gap: "15px", 
    marginBottom: "5px" 
  };

  const achievementCardStyle = {
    backgroundColor: "#E7F0DC", 
    borderRadius: "10px", 
    padding: "15px",
    flex: 1, 
    textAlign: "center", 
    color: "#1C3520", 
    fontSize: "16px",
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center",
    minHeight: "70px",
    boxSizing: "border-box"
  };

  const btnBaseStyle = {
    width: "100%", 
    padding: "15px", 
    borderRadius: "10px",
    fontSize: "18px", 
    fontWeight: "normal", 
    border: "none", 
    cursor: "pointer",
    textAlign: "center"
  };

  const btnEditStyle = { ...btnBaseStyle, backgroundColor: "#1C3520", color: "white" };
  const btnPassStyle = { ...btnBaseStyle, backgroundColor: "#E7F0DC", color: "#1C3520" };
  const btnLogoutStyle = { ...btnBaseStyle, backgroundColor: "#FFF0F4", color: "#D8000C" };

  const renderizarConquista = (conquista) => {
    if (typeof conquista === 'string') return conquista;
    return conquista.nome || conquista.titulo || "Conquista";
  };

  return (
    <div style={containerStyle}>
      <input 
        type="file" 
        accept="image/*" 
        style={{ display: "none" }} 
        ref={fileInputRef} 
        onChange={handleTrocarFoto} 
      />

      <div style={topSectionStyle}>
        <div style={blobStyle} onClick={() => fileInputRef.current.click()}>
          {perfil.foto_perfil ? (
            <img src={perfil.foto_perfil} alt="Perfil" style={profilePicStyle} />
          ) : (
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#1C3520" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          )}
        </div>

        <h2 style={nameStyle}>{carregando ? "Carregando..." : perfil.nome}</h2>
        <h3 style={locationStyle}>{carregando ? "..." : perfil.cidade_ranking}</h3>

        <div style={progressBgStyle}>
          <div style={progressFillStyle}></div>
        </div>

        <div style={statsRowStyle}>
          <div style={statCardStyle}>
            <span style={statValueStyle}>{carregando ? "-" : perfil.denuncias}</span>
            <span style={statLabelStyle}>Denúncias</span>
          </div>
          <div style={statCardStyle}>
            <span style={statValueStyle}>{carregando ? "-" : `${perfil.posicao_ranking}º`}</span>
            <span style={statLabelStyle}>Ranking local</span>
          </div>
          <div style={statCardStyle}>
            <span style={statValueStyle}>{carregando ? "-" : perfil.pontuacao}</span>
            <span style={statLabelStyle}>Pontos</span>
          </div>
        </div>
      </div>

      <div style={bottomSectionStyle}>
        
        <div 
          onClick={() => navigate('/conquistas')} 
          style={achievementsTitleContainerStyle}
        >
          <h3 style={achievementsTitleStyle}>
            Últimas conquistas
          </h3>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="#1C3520" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div style={achievementsRowStyle}>
          {carregando ? (
            <div style={{...achievementCardStyle, color: "#666", backgroundColor: "#F4F6F3"}}>
              Carregando conquistas...
            </div>
          ) : perfil.conquistas && perfil.conquistas.length > 0 ? (
            perfil.conquistas.slice(-2).map((conquista, index) => (
              <div key={index} style={achievementCardStyle}>
                {renderizarConquista(conquista)}
              </div>
            ))
          ) : (
            <div style={{...achievementCardStyle, color: "#666", backgroundColor: "#F4F6F3"}}>
              Nenhuma conquista ainda
            </div>
          )}
        </div>

        <button style={btnEditStyle}>Editar perfil</button>
        <button style={btnPassStyle}>Mudar senha</button>
        <button style={btnLogoutStyle} onClick={fazerLogout}>Sair</button>
      </div>

      <Navbar isAdmin={false} />
    </div>
  );
};

export default Profile;