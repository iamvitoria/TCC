import React, { useState } from "react";
import PageLayout from "../components/PageLayout/PageLayout";

const Ranking = () => {
  const [activeTab, setActiveTab] = useState("global");

  const globalRanking = [
    { id: 1, flag: "🇧🇷", name: "Santa Maria (BR)", points: 1500 },
    { id: 2, flag: "🇩🇪", name: "Heidelberg (DE)", points: 1350 },
    { id: 3, flag: "🇧🇷", name: "Porto Alegre (BR)", points: 1200 },
    { id: 4, flag: "🇩🇪", name: "Kiel (DE)", points: 1100 },
    { id: 5, flag: "🇧🇷", name: "Joinville (BR)", points: 950 },
  ];

  const localRanking = [
    { id: 1, flag: "📍", name: "Centro", points: 800 },
    { id: 2, flag: "📍", name: "Camobi", points: 650 },
    { id: 3, flag: "📍", name: "Nossa Sra. de Lourdes", points: 500 },
  ];

  const currentData = activeTab === "global" ? globalRanking : localRanking;

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    padding: "20px 5%",
    gap: "15px",
    flex: 1,
    paddingBottom: "100px", 
    overflowY: "auto",
    boxSizing: "border-box",
  };

  const toggleWrapperStyle = {
    display: "flex",
    backgroundColor: "#78A64B",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "5px"
  };

  const getTabStyle = (tabName) => ({
    flex: 1,
    padding: "12px",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    backgroundColor: activeTab === tabName ? "#2D4627" : "#78A64B", 
    transition: "background-color 0.3s"
  });

  const subtitleStyle = {
    color: "#2D4627",
    fontWeight: "bold",
    fontSize: "15px",
    textAlign: "center",
    margin: "5px 0 10px 0"
  };

  const cardStyle = {
    backgroundColor: "#78A64B",
    borderRadius: "10px",
    padding: "15px",
    display: "flex",
    alignItems: "center",
    color: "white",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    gap: "15px"
  };

  return (
    <PageLayout title="Ranking">
      <div style={containerStyle}>
        
        <div style={toggleWrapperStyle}>
          <div 
            style={getTabStyle("local")} 
            onClick={() => setActiveTab("local")}
          >
            Ranking local
          </div>
          <div 
            style={getTabStyle("global")} 
            onClick={() => setActiveTab("global")}
          >
            Ranking global
          </div>
        </div>

        <p style={subtitleStyle}>
          Ranking por {activeTab === "global" ? "cidade" : "bairro"} que mais participou
        </p>

        {currentData.map((item, index) => (
          <div key={item.id} style={cardStyle}>
            <span style={{ fontWeight: "bold", fontSize: "18px", width: "25px" }}>
              {index + 1}
            </span>
            
            <span style={{ fontSize: "24px" }}>
              {item.flag}
            </span>
            
            <span style={{ flex: 1, fontWeight: "bold", fontSize: "14px" }}>
              {item.name}
            </span>
            
            <span style={{ fontSize: "11px", fontWeight: "bold" }}>
              {item.points} pts
            </span>
          </div>
        ))}

      </div>
    </PageLayout>
  );
};

export default Ranking;