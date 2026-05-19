import React, { useState, useEffect } from "react";
import PageLayout from "../components/PageLayout/PageLayout";
import API_URL from "../config"; 

const Achievements = () => {
  const [conquistas, setConquistas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarConquistas = async () => {
      const token = localStorage.getItem("token") || localStorage.getItem("meuToken");
      
      if (!token) {
        setCarregando(false);
        return;
      }

      try {
        const resposta = await fetch(`${API_URL}/perfil`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (resposta.ok) {
          const dados = await resposta.json();
          const conquistasUnicas = (dados.conquistas || []).reduce((acc, atual) => {
            const nome = typeof atual === 'string' ? atual : atual.nome;
            if (!acc.find(item => (typeof item === 'string' ? item : item.nome) === nome)) {
              acc.push(atual);
            }
            return acc;
          }, []);
          
          setConquistas(conquistasUnicas);
        } else {
          setErro("Não foi possível carregar suas medalhas.");
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setErro("Erro ao conectar com o servidor.");
      } finally {
        setCarregando(false);
      }
    };

    carregarConquistas();
  }, []);

  const containerStyle = { padding: "20px", backgroundColor: "#F4F6F3", minHeight: "100vh", boxSizing: "border-box", paddingBottom: "100px" };
  const headerTitleStyle = { color: "#1C3520", fontSize: "18px", fontWeight: "bold", marginBottom: "20px", marginTop: "0" };
  const listStyle = { display: "flex", flexDirection: "column", gap: "12px" };
  const cardStyle = { backgroundColor: "white", borderRadius: "12px", padding: "15px", display: "flex", alignItems: "center", border: "1px solid #EBEBEB", boxShadow: "0px 2px 4px rgba(0,0,0,0.02)" };
  const iconContainerStyle = { backgroundColor: "#2D4627", width: "48px", height: "48px", borderRadius: "10px", display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0 };
  const textContainerStyle = { marginLeft: "15px", flexGrow: 1 };
  const titleStyle = { margin: 0, color: "#1C3520", fontSize: "16px", fontWeight: "bold" };
  const subtitleStyle = { margin: "4px 0 0 0", color: "#8FB090", fontSize: "12px", fontWeight: "500" };
  const pointsStyle = { color: "#1C3520", fontSize: "14px", fontWeight: "bold", whiteSpace: "nowrap" };

  return (
    <PageLayout title="Conquistas">
      <div style={containerStyle}>
        <h2 style={headerTitleStyle}>Badges e Conquistas</h2>
        
        {carregando && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              border: "4px solid rgba(45, 70, 39, 0.2)",
              borderTop: "4px solid #2D4627",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        )}
        {erro && (
          <div style={{ backgroundColor: "#FFF0F4", color: "#D8000C", padding: "15px", borderRadius: "8px" }}>
            {erro}
          </div>
        )}

        {!carregando && !erro && (
          <div style={listStyle}>
            {conquistas.length > 0 ? (
              conquistas.map((conquista, index) => (
                <div key={index} style={cardStyle}>
                  <div style={iconContainerStyle}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={textContainerStyle}>
                    <h3 style={titleStyle}>
                      {typeof conquista.nome === 'object' ? conquista.nome.nome : conquista.nome}
                    </h3>
                    <p style={subtitleStyle}>
                      {(conquista.descricao || "Conquista desbloqueada!").replace(/denúncia/g, "registro")}
                    </p>
                  </div>
                  <div style={pointsStyle}>+{conquista.pontos || 0} pts</div>
                </div>
              ))
            ) : (
              <p style={{ color: "#666" }}>Você ainda não possui conquistas.</p>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Achievements;