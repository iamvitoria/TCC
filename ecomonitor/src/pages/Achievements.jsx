import React from "react";
import PageLayout from "../components/PageLayout/PageLayout";

const Achievements = () => {
  const achievementsData = [
    { id: 1, title: "Primeiro Relato", desc: "10 pontos - 1 relatório", icon: "🏆" },
    { id: 2, title: "Ativista Local", desc: "25 pontos - 5 relatórios", icon: "🏆" },
    { id: 3, title: "Comunitário Ativo", desc: "50 pontos - 10 relatórios", icon: "🏆" },
    { id: 4, title: "Comunitário Ativo", desc: "50 pontos - 10 relatórios", icon: "🏆" },
  ];

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

  const sectionTitleStyle = {
    color: "#2D4627", 
    fontWeight: "bold",
    fontSize: "18px",
    margin: "0 0 5px 0",
  };

  const cardStyle = {
    backgroundColor: "#78A64B",
    borderRadius: "10px",
    padding: "15px 20px",
    display: "flex",
    alignItems: "center",
    color: "white",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    boxSizing: "border-box",
    width: "100%",
  };

  const iconContainerStyle = {
    fontSize: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: "20px",
    marginRight: "20px",
    borderRight: "2px solid rgba(255, 255, 255, 0.4)", 
  };

  const textContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center", 
    justifyContent: "center",
    flex: 1, 
    gap: "5px",
  };

  const titleStyle = {
    fontWeight: "bold",
    fontSize: "16px",
    margin: 0,
    textAlign: "center",
  };

  const descStyle = {
    fontSize: "11px",
    margin: 0,
    fontWeight: "500",
    textAlign: "center",
  };

  return (
    <PageLayout title="Conquistas">
      <div style={containerStyle}>
        
        <h3 style={sectionTitleStyle}>Badges e Conquistas</h3>
        
        {achievementsData.map((item) => (
          <div key={item.id} style={cardStyle}>
            
            <div style={iconContainerStyle}>
              {item.icon}
            </div>

            <div style={textContainerStyle}>
              <p style={titleStyle}>{item.title}</p>
              <p style={descStyle}>{item.desc}</p>
            </div>

          </div>
        ))}

      </div>
    </PageLayout>
  );
};

export default Achievements;