import React, { useState, useEffect } from "react";
import PageLayout from "../components/PageLayout/PageLayout";
import API_URL from "../config"; // Certifique-se que o caminho está correto

const Achievements = () => {
  const [conquistas, setConquistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarConquistas = async () => {
      // AJUSTE: Usando a mesma chave do seu Profile.jsx
      const token = localStorage.getItem("meuToken");
      
      console.log("Token recuperado no Achievements:", token);

      if (!token) {
        setErro("Sessão expirada. Por favor, faça login novamente.");
        setLoading(false);
        return;
      }

      try {
        // Chamada para a rota de conquistas (ajuste o endpoint se necessário)
        const resposta = await fetch(`${API_URL}/perfil`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (resposta.ok) {
          const dados = await resposta.json();
          // Pegamos apenas a lista de conquistas que vem do objeto perfil
          setConquistas(dados.conquistas || []);
        } else {
          const textoErro = await resposta.text();
          console.error("Erro na API:", textoErro);
          setErro("Não foi possível carregar suas medalhas.");
        }
      } catch (err) {
        console.error("Erro de conexão:", err);
        setErro("Erro ao conectar com o servidor.");
      } finally {
        setLoading(false);
      }
    };

    carregarConquistas();
  }, []);

  // Estilos rápidos baseados no seu layout
  const gridStyle = {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    padding: "20px"
  };

  const cardStyle = {
    backgroundColor: "#78A64B",
    borderRadius: "10px",
    padding: "15px",
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    flex: "1 1 150px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  };

  return (
    <PageLayout title="Minhas Conquistas">
      <div style={{ padding: "20px" }}>
        <h2 style={{ color: "#2D4627", marginBottom: "20px" }}>Suas Medalhas</h2>
        
        {loading && <p>Carregando...</p>}
        
        {erro && (
          <div style={{ backgroundColor: "#FFE3E3", color: "#D12E2E", padding: "15px", borderRadius: "8px" }}>
            {erro}
          </div>
        )}

        {!loading && !erro && (
          <div style={gridStyle}>
            {conquistas.length > 0 ? (
              // Usamos o Set aqui também para garantir que não duplique visualmente
              [...new Set(conquistas)].map((conquista, index) => (
                <div key={index} style={cardStyle}>
                  {conquista}
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