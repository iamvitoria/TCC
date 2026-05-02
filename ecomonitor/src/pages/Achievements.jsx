import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout/PageLayout";
import API_BASE_URL from "../config"; 
const Achievements = () => {
  const navigate = useNavigate();
  
  const [conquistas, setConquistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setErro("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      try {
        const resposta = await fetch(`${API_BASE_URL}/usuarios/conquistas`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!resposta.ok) {
          throw new Error("Erro ao carregar conquistas do servidor.");
        }

        const dados = await resposta.json();
        setConquistas(dados);
      } catch (err) {
        console.error("Erro:", err);
        setErro("Não foi possível carregar as conquistas.");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const whiteCardStyle = {
    backgroundColor: "white",
    borderTopLeftRadius: "25px",
    borderTopRightRadius: "25px",
    padding: "25px 20px 40px 20px",
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  };

  return (
    <PageLayout title="Minhas Conquistas">
      <div style={{ paddingBottom: "150px" }}>
        
        <div style={{ padding: "0 5%" }}>
          <button 
            style={{ 
              background: "none", 
              border: "none", 
              color: "white", 
              fontSize: "16px", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              gap: "5px", 
              fontWeight: "bold" 
            }} 
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>
        </div>

        <div style={whiteCardStyle}>
          <h3 style={{ color: "#2D4627", fontSize: "18px", margin: "0 0 10px 0" }}>
            Suas Medalhas
          </h3>

          {loading && (
            <div style={{ textAlign: "center", color: "#666", padding: "20px" }}>
              Buscando suas medalhas... 🏅
            </div>
          )}

          {erro && (
            <div style={{ textAlign: "center", color: "red", padding: "20px" }}>
              {erro}
            </div>
          )}

          {!loading && !erro && (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              
              {conquistas.map((conquista) => (
                <div 
                  key={conquista.id} 
                  style={{ 
                    backgroundColor: conquista.desbloqueado ? "#F2F7ED" : "#F0F0F0", 
                    border: conquista.desbloqueado ? "1px solid #7FB04B" : "1px dashed #CCC",
                    borderRadius: "15px", 
                    padding: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    opacity: conquista.desbloqueado ? 1 : 0.7,
                    filter: conquista.desbloqueado ? "none" : "grayscale(100%)",
                    transition: "all 0.3s ease"
                  }}
                >
                  <div style={{ fontSize: "40px", position: "relative" }}>
                    {conquista.icone_url}
                    {!conquista.desbloqueado && (
                      <span style={{ 
                        position: "absolute", 
                        bottom: "-5px", 
                        right: "-5px", 
                        fontSize: "16px",
                        background: "white",
                        borderRadius: "50%",
                        padding: "2px"
                      }}>🔒</span>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 5px 0", color: "#2D4627", fontSize: "15px" }}>
                      {conquista.nome}
                    </h4>
                    <p style={{ margin: 0, fontSize: "12px", color: "#666", lineHeight: "1.4" }}>
                      {conquista.descricao}
                    </p>
                  </div>
                </div>
              ))}

              {conquistas.length === 0 && (
                <p style={{ textAlign: "center", color: "#666" }}>
                  Nenhuma conquista disponível no momento.
                </p>
              )}

            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Achievements;