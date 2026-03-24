import React, { useState, useEffect, useRef } from "react"; // Adicionamos useState, useEffect e useRef
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout/PageLayout";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Referência para o nosso input invisível

  // 1. Estado para guardar os dados do usuário vindos do banco
  const [perfil, setPerfil] = useState({
    nome: "Carregando...",
    pontuacao: 0,
    foto_perfil: null,
  });

  // 2. Busca os dados do perfil assim que a tela abre
  useEffect(() => {
    const buscarPerfil = async () => {
      const token = localStorage.getItem("meuToken");
      if (!token) {
        navigate("/"); // Se não tem token, manda pro login!
        return;
      }

      try {
        const resposta = await fetch("http://localhost:8000/perfil", {
          headers: {
            "Authorization": `Bearer ${token}` // Mostra a pulseira VIP pro segurança
          }
        });

        if (resposta.ok) {
          const dados = await resposta.json();
          setPerfil(dados);
        }
      } catch (erro) {
        console.error("Erro ao carregar perfil:", erro);
      }
    };

    buscarPerfil();
  }, [navigate]);

  // 3. Função que envia a foto para o Backend
  const handleTrocarFoto = async (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    // Colocamos o arquivo no formato que o backend espera
    const formData = new FormData();
    formData.append("foto", arquivo);

    const token = localStorage.getItem("meuToken");

    try {
      const resposta = await fetch("http://localhost:8000/perfil/foto", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          // Atenção: NÃO colocamos 'Content-Type' aqui. O navegador faz isso sozinho com FormData!
        },
        body: formData,
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        // Atualiza a foto na tela com a URL nova que o backend devolveu!
        setPerfil({ ...perfil, foto_perfil: dados.foto_perfil });
        alert("Foto atualizada com sucesso! 📸");
      } else {
        alert("Erro ao enviar a foto.");
      }
    } catch (erro) {
      console.error("Erro ao fazer upload:", erro);
    }
  };

  // --- ESTILOS ---
  const containerStyle = {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "20px 5%", gap: "20px", flex: 1, paddingBottom: "100px", 
    overflowY: "auto", boxSizing: "border-box",
  };

  const blobBackgroundStyle = {
    width: "140px", height: "140px", backgroundColor: "#7FB04B", 
    borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%", 
    display: "flex", justifyContent: "center", alignItems: "center",
    position: "relative", marginTop: "10px",
    cursor: "pointer" // Adiciona a "mãozinha" do mouse para mostrar que é clicável!
  };

  const profilePicStyle = {
    width: "100px", height: "100px", borderRadius: "50%",
    objectFit: "cover", border: "3px solid white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  };

  const nameStyle = {
    color: "#2D4627", fontWeight: "bold", fontSize: "20px", margin: "-5px 0 0 0",
  };

  const progressBarContainer = {
    width: "100%", backgroundColor: "#78A64B", borderRadius: "20px",
    height: "40px", position: "relative", overflow: "hidden",
  };

  const progressBarFill = {
    width: `${Math.min((perfil.pontuacao / 1000) * 100, 100)}%`, // Barra enche de verdade baseada nos pontos!
    backgroundColor: "#2D4627", height: "100%", borderRadius: "20px",
    display: "flex", alignItems: "center", paddingLeft: "20px", boxSizing: "border-box"
  };

  const progressTextStyle = {
    color: "white", fontWeight: "bold", fontSize: "16px", zIndex: 2,
  };

  // Outros estilos minimizados para poupar espaço
  const rankingCardStyle = { backgroundColor: "#78A64B", borderRadius: "15px", padding: "20px", width: "100%", display: "flex", alignItems: "center", color: "white", boxSizing: "border-box", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" };
  const achievementsRowStyle = { display: "flex", width: "100%", gap: "10px" };
  const achievementMiniCardStyle = { backgroundColor: "#78A64B", borderRadius: "10px", padding: "15px 10px", flex: 1, textAlign: "center", color: "white", fontWeight: "bold", fontSize: "14px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" };
  const logoutBtnStyle = { backgroundColor: "#78A64B", color: "white", border: "none", borderRadius: "10px", padding: "15px", fontSize: "18px", fontWeight: "bold", width: "100%", cursor: "pointer", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" };

  // O que usar se o usuário ainda não tiver foto? (A sua do Unsplash!)
  const fotoParaMostrar = perfil.foto_perfil || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80";

  // Função de deslogar
  const fazerLogout = () => {
    localStorage.removeItem("meuToken"); // Arranca a pulseira VIP
    navigate("/");
  };

  return (
    <PageLayout title="Perfil">
      <div style={containerStyle}>
        
        {/* INPUT INVISÍVEL */}
        <input 
          type="file" 
          accept="image/*" 
          style={{ display: "none" }} 
          ref={fileInputRef} 
          onChange={handleTrocarFoto} 
        />

        {/* Clicar aqui aciona o input invisível! */}
        <div style={blobBackgroundStyle} onClick={() => fileInputRef.current.click()}>
          <img 
            src={fotoParaMostrar} 
            alt="Foto de Perfil" 
            style={profilePicStyle} 
          />
        </div>

        {/* Nome vindo do Banco de Dados! */}
        <h2 style={nameStyle}>{perfil.nome}</h2>

        <div style={progressBarContainer}>
          <div style={progressBarFill}>
            {/* Pontuação vinda do Banco de Dados! */}
            <span style={progressTextStyle}>{perfil.pontuacao}/1000</span>
          </div>
        </div>

        <div style={rankingCardStyle}>
          <div style={{ fontSize: "40px", fontWeight: "bold", marginRight: "20px" }}>5º</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>Sua posição</span>
            <span style={{ fontSize: "12px", opacity: 0.9 }}>Ranking Santa Maria</span>
          </div>
        </div>

        <div style={achievementsRowStyle}>
          <div style={achievementMiniCardStyle}>Conquista x</div>
          <div style={achievementMiniCardStyle}>Conquista y</div>
        </div>

        <button style={logoutBtnStyle} onClick={fazerLogout}>
          Sair
        </button>

      </div>
    </PageLayout>
  );
};

export default Profile;