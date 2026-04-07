import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Se você usa o PageLayout nas outras telas, mantenha o import:
import PageLayout from "../components/PageLayout/PageLayout";

const Contributions = () => {
  const navigate = useNavigate();
  const [denuncias, setDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // O useEffect roda assim que a tela abre, para buscar os dados
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
          // Guarda a lista de denúncias no nosso Estado
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

  // --- ESTILOS ---
  const containerStyle = {
    padding: "20px 5%",
    paddingBottom: "120px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  };

  const cardStyle = {
    backgroundColor: "#F1F8E9",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    border: "1px solid #78A64B"
  };

  const statusBadgeStyle = (status) => ({
    backgroundColor: status === "Resolvida" ? "#2D4627" : "#7FB04B",
    color: "white",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    display: "inline-block",
    marginBottom: "8px"
  });

  return (
    <PageLayout title="Minhas Contribuições">
      <div style={containerStyle}>
        
        {carregando && <p style={{ textAlign: "center", color: "#2D4627" }}>Carregando suas denúncias... ⏳</p>}
        {erro && <p style={{ color: "red", textAlign: "center" }}>{erro}</p>}

        {!carregando && !erro && denuncias.length === 0 && (
          <div style={{ textAlign: "center", color: "#2D4627", marginTop: "40px" }}>
            <h2>🌱 Nenhuma denúncia ainda!</h2>
            <p>Que tal começar a ajudar o meio ambiente agora?</p>
            <button 
              onClick={() => navigate("/report")} 
              style={{ backgroundColor: "#2D4627", color: "white", padding: "10px 20px", borderRadius: "10px", border: "none", marginTop: "15px", cursor: "pointer" }}
            >
              Fazer uma Denúncia
            </button>
          </div>
        )}

        {!carregando && denuncias.map((denuncia) => (
          <div key={denuncia.id} style={cardStyle}>
            {/* O Backend salva a foto_url como "uploads/foto.png", então precisamos juntar com o link da API */}
            <img 
              src={`https://ecomonitor-api.onrender.com/${denuncia.foto_url}`} 
              alt="Foto da denúncia" 
              style={{ width: "100%", height: "180px", objectFit: "cover" }}
              onError={(e) => { e.target.src = "https://placehold.co/400x200/cccccc/ffffff?text=Sem+Foto" }}
            />
            
            <div style={{ padding: "15px" }}>
              <span style={statusBadgeStyle(denuncia.status)}>
                {denuncia.status || "Pendente"}
              </span>
              <h3 style={{ margin: "0 0 5px 0", color: "#2D4627", textTransform: "capitalize" }}>
                {denuncia.categoria.replace("_", " ")}
              </h3>
              <p style={{ margin: "0 0 10px 0", color: "#555", fontSize: "14px" }}>
                {denuncia.descricao || "Sem descrição."}
              </p>
              <div style={{ fontSize: "12px", color: "#888", display: "flex", justifyContent: "space-between" }}>
                <span>📍 GPS: {denuncia.latitude.toFixed(2)}, {denuncia.longitude.toFixed(2)}</span>
                <span>ID: #{denuncia.id}</span>
              </div>
            </div>
          </div>
        ))}

      </div>
    </PageLayout>
  );
};

export default Contributions;