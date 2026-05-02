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
      
      console.log("Token recuperado:", token); 

      if (!token) {
        setErro("Sessão expirada. Por favor, faça login novamente.");
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

        if (resposta.status === 401) {
           setErro("Sua sessão expirou. Entre novamente.");
           return;
        }

        if (!resposta.ok) {
          throw new Error("Erro ao carregar conquistas.");
        }

        const dados = await resposta.json();
        setConquistas(dados);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setErro("Não foi possível conectar ao servidor.");
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
            <div style={{ textAlign: "center", color: "#666", padding: "40px" }}>
              <div className="spinner"></div> 
              <p>Buscando suas medalhas... 🏅</p>
            </div>
          )}

          {erro && (
            <div style={{ textAlign: "center", color: "#D9534F", padding: "20px", backgroundColor: "#F9EBEB", borderRadius: "10px" }}>
              {erro}
            </div>
          )}

          {!loading && !erro && (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              
              {conquistas.map((conquista) => (
                <div 
                  key={conquista.id} 
                  style={{ 
                    backgroundColor: conquista.desbloqueado ? "#F2F7ED" : "#F9F9F9", 
                    border: conquista.desbloqueado ? "1.5px solid #7FB04B" : "1px solid #EEE",
                    borderRadius: "15px", 
                    padding: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    boxShadow: conquista.desbloqueado ? "0 4px 6px rgba(0,0,0,0.05)" : "none",
                    transition: "transform 0.2s ease"
                  }}
                >
                  <div style={{ 
                    fontSize: "35px", 
                    position: "relative",
                    filter: conquista.desbloqueado ? "none" : "grayscale(100%) blur(0.5px)",
                    opacity: conquista.desbloqueado ? 1 : 0.5
                  }}>
                    {conquista.icone_url || "🏅"}
                    {!conquista.desbloqueado && (
                      <span style={{ 
                        position: "absolute", 
                        top: "-5px", 
                        right: "-5px", 
                        fontSize: "14px",
                        background: "white",
                        borderRadius: "50%",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        padding: "2px"
                      }}>🔒</span>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      margin: "0 0 3px 0", 
                      color: conquista.desbloqueado ? "#2D4627" : "#888", 
                      fontSize: "15px",
                      fontWeight: "bold"
                    }}>
                      {conquista.nome}
                    </h4>
                    <p style={{ 
                      margin: 0, 
                      fontSize: "12px", 
                      color: conquista.desbloqueado ? "#555" : "#AAA", 
                      lineHeight: "1.3" 
                    }}>
                      {conquista.descricao}
                    </p>
                  </div>
                </div>
              ))}

              {conquistas.length === 0 && (
                <p style={{ textAlign: "center", color: "#666", marginTop: "20px" }}>
                  Nenhuma conquista cadastrada no sistema.
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