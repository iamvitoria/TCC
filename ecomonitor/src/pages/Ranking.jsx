import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar.jsx"; 
import API_URL from "../config";

const Ranking = () => {
  const [activeTab, setActiveTab] = useState("local");
  const [rankingLocal, setRankingLocal] = useState([]);
  const [rankingGlobal, setRankingGlobal] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [cidadeUser, setCidadeUser] = useState("..."); 

  useEffect(() => {
    const obterCidadeAtual = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
            );
            const data = await response.json();
            const cidade = data.address.city || data.address.town || data.address.village || "sua região";
            setCidadeUser(cidade);
          } catch (error) {
            console.error("Erro ao obter nome da cidade:", error);
          }
        });
      }
    };

    const buscarRanking = async () => {
      setCarregando(true);
      try {
        const token = localStorage.getItem("token"); 
        const response = await fetch(`${API_URL}/ranking`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          setRankingLocal(data.local || []);
          setRankingGlobal(data.global || []);
        }
      } catch (error) {
        console.error("Erro ao procurar ranking:", error);
      } finally {
        setCarregando(false);
      }
    };
    
    obterCidadeAtual();
    buscarRanking();
  }, []);

  const currentData = activeTab === "global" ? rankingGlobal : rankingLocal;

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "#F4F6F3",
      paddingBottom: "120px", 
      boxSizing: "border-box",
    },
    header: {
      backgroundColor: "#1C3520",
      padding: "25px 20px",
      textAlign: "center",
      color: "white",
      fontSize: "20px",
      fontWeight: "bold",
    },
    content: {
      padding: "20px 5%",
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    },
    toggleWrapper: {
      display: "flex",
      backgroundColor: "#8DAF73",
      borderRadius: "8px",
      overflow: "hidden",
      marginBottom: "5px"
    },
    tab: (tabName) => ({
      flex: 1,
      padding: "12px",
      textAlign: "center",
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
      backgroundColor: activeTab === tabName ? "#1C3520" : "#8DAF73",
      border: "none",
      outline: "none",
      transition: "0.3s"
    }),
    subtitle: {
      color: "#1C3520",
      fontWeight: "bold",
      textAlign: "center",
      margin: "10px 0",
      fontSize: "14px",
      lineHeight: "1.4"
    },
    card: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "15px 20px",
      display: "flex",
      alignItems: "center",
      gap: "15px",
      boxShadow: "0px 2px 4px rgba(0,0,0,0.03)"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Ranking</div>

      <div style={styles.content}>
        <div style={styles.toggleWrapper}>
          <button style={styles.tab("local")} onClick={() => setActiveTab("local")}>
            Ranking local
          </button>
          <button style={styles.tab("global")} onClick={() => setActiveTab("global")}>
            Ranking global
          </button>
        </div>

        <p style={styles.subtitle}>
          {activeTab === "global" 
            ? "Cidades que mais contribuíram" 
            : `Moradores que mais contribuíram na cidade de ${cidadeUser}`}
        </p>

        {carregando ? (
          <p style={{ textAlign: "center", color: "#1C3520", marginTop: "20px" }}>Carregando dados...</p>
        ) : (!currentData || currentData.length === 0) ? (
          <div style={{ 
            textAlign: "center", 
            marginTop: "40px",
            padding: "30px 20px",
            backgroundColor: "#E7F0DC",
            borderRadius: "15px",
            border: "2px dashed #8DAF73"
          }}>
            <span style={{ fontSize: "50px" }}>🏆</span>
            <h3 style={{ color: "#1C3520", margin: "15px 0 5px 0" }}>Ninguém no ranking ainda!</h3>
            <p style={{ color: "#2D4627", fontSize: "14px" }}>
              Seja o primeiro a contribuir!
            </p>
          </div>
        ) : (
          currentData.map((item, index) => (
            <div key={index} style={styles.card}>
              <span style={{ fontWeight: "bold", fontSize: "18px", width: "25px", color: "#1C3520" }}>
                {index + 1}
              </span>

              <div style={{ 
                width: "45px", height: "45px", borderRadius: "50%", 
                border: "2px solid #8DAF73", backgroundColor: "#E7F0DC", 
                display: "flex", justifyContent: "center", alignItems: "center" 
              }}>
                {activeTab === "global" ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2D4627" strokeWidth="2">
                    <path d="M3 21h18M3 7v14M13 21V3H3M13 7h8v14"></path>
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2D4627" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                )}
              </div>

              <span style={{ flex: 1, fontWeight: "bold", color: "#1C3520", fontSize: "15px" }}>
                {item.nome || item.cidade || "Anônimo"}
              </span>

              <span style={{ fontWeight: "bold", color: "#1C3520", fontSize: "14px" }}>
                {item.pts || item.total || item.pontos || 0} 
                <span style={{ marginLeft: "4px", fontSize: "12px", fontWeight: "normal" }}>
                  {activeTab === "global" ? "denúncias" : "pts"}
                </span>
              </span>
            </div>
          ))
        )}
      </div>

      <Navbar isAdmin={false} />
    </div>
  );
};

export default Ranking;