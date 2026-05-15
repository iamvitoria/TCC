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
    cidade_ranking: "Sua região", // Valor padrão
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
            cidade_ranking: dados.regiao || dados.cidade || "Sua cidade", 
            denuncias: dados.total_denuncias ?? dados.denuncias ?? 0,
            conquistas: dados.conquistas || []
          });
        } else {
          if(resposta.status === 401) navigate("/");
        }
      } catch (erro) {
        console.error("Erro ao carregar perfil:", erro);
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
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });
      if (resposta.ok) {
        const dados = await resposta.json();
        setPerfil(prev => ({ ...prev, foto_perfil: dados.foto_perfil }));
      }
    } catch (erro) { console.error(erro); }
  };

  const fazerLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("meuToken"); 
    navigate("/");
  };

  // --- ESTILOS ---
  const styles = {
    container: { display: "flex", flexDirection: "column", height: "100vh", overflowY: "auto", backgroundColor: "#1C3520", boxSizing: "border-box" },
    topSection: { display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 20px 30px 20px", width: "100%", boxSizing: "border-box" },
    blob: { width: "140px", height: "140px", backgroundColor: "#7FB04B", borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "15px", position: "relative", cursor: "pointer", overflow: "hidden" },
    profilePic: { width: "100%", height: "100%", objectFit: "cover" },
    name: { color: "white", fontSize: "22px", fontWeight: "bold", margin: "0 0 5px 0", textAlign: "center" },
    location: { color: "#7FB04B", fontSize: "18px", margin: "0 0 20px 0", fontWeight: "normal", textAlign: "center" },
    progressBg: { width: "100%", maxWidth: "320px", height: "8px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "4px", marginBottom: "25px", overflow: "hidden" },
    progressFill: { width: `${Math.min((perfil.pontuacao / 1000) * 100, 100)}%`, height: "100%", backgroundColor: "#7FB04B", borderRadius: "4px", transition: "width 0.5s ease-in-out" },
    statsRow: { display: "flex", gap: "10px", width: "100%", maxWidth: "320px" },
    statCard: { backgroundColor: "#2D4627", borderRadius: "10px", padding: "15px 5px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
    statValue: { color: "white", fontSize: "20px", fontWeight: "bold", marginBottom: "5px" },
    statLabel: { color: "white", fontSize: "10px", fontWeight: "300", textAlign: "center" },
    bottomSection: { backgroundColor: "white", borderTopLeftRadius: "25px", borderTopRightRadius: "25px", flex: 1, width: "100%", padding: "25px 20px 140px 20px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "15px" },
    achievementsTitle: { margin: 0, fontSize: "16px", color: "#1C3520", fontWeight: "bold" },
    achievementCard: { backgroundColor: "#E7F0DC", borderRadius: "10px", padding: "15px", flex: 1, textAlign: "center", color: "#1C3520", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70px" },
    btnEdit: { width: "100%", padding: "15px", borderRadius: "10px", fontSize: "18px", backgroundColor: "#1C3520", color: "white", border: "none", cursor: "pointer" },
    btnPass: { width: "100%", padding: "15px", borderRadius: "10px", fontSize: "18px", backgroundColor: "#E7F0DC", color: "#1C3520", border: "none", cursor: "pointer" },
    btnLogout: { width: "100%", padding: "15px", borderRadius: "10px", fontSize: "18px", backgroundColor: "#FFF0F4", color: "#D8000C", border: "none", cursor: "pointer" }
  };

  return (
    <div style={styles.container}>
      <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={handleTrocarFoto} />

      <div style={styles.topSection}>
        <div style={styles.blob} onClick={() => fileInputRef.current.click()}>
          {perfil.foto_perfil ? (
            <img src={perfil.foto_perfil} alt="Perfil" style={styles.profilePic} />
          ) : (
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#1C3520" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>

        <h2 style={styles.name}>{carregando ? "Carregando..." : perfil.nome}</h2>
        {/* EXIBIÇÃO DA CIDADE/REGIÃO */}
        <h3 style={styles.location}>{carregando ? "..." : perfil.cidade_ranking}</h3>

        <div style={styles.progressBg}>
          <div style={styles.progressFill}></div>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{perfil.denuncias}</span>
            <span style={styles.statLabel}>Registro(s)</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{perfil.posicao_ranking}º</span>
            <span style={styles.statLabel}>Ranking local</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{perfil.pontuacao}</span>
            <span style={styles.statLabel}>Pontos</span>
          </div>
        </div>
      </div>

      <div style={styles.bottomSection}>
        <div onClick={() => navigate('/conquistas')} style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
          <h3 style={styles.achievementsTitle}>Últimas conquistas</h3>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C3520" strokeWidth="2"><path d="M9 18L15 12L9 6"/></svg>
        </div>

        <div style={{display: 'flex', gap: '15px'}}>
          {perfil.conquistas.length > 0 ? (
            perfil.conquistas.slice(-2).map((c, i) => (
              <div key={i} style={styles.achievementCard}>
                {typeof c === 'string' ? c : c.nome}
              </div>
            ))
          ) : (
            <div style={{...styles.achievementCard, backgroundColor: "#F4F6F3", color: "#666"}}>
              Nenhuma conquista
            </div>
          )}
        </div>

        <button style={styles.btnEdit}>Editar perfil</button>
        <button style={styles.btnPass}>Mudar senha</button>
        <button style={styles.btnLogout} onClick={fazerLogout}>Sair</button>
      </div>
      <Navbar isAdmin={false} />
    </div>
  );
};

export default Profile;