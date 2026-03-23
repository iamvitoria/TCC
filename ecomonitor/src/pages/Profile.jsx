import React from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout/PageLayout";

const Profile = () => {
  const navigate = useNavigate();

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 5%",
    gap: "20px",
    flex: 1,
    paddingBottom: "100px", 
    overflowY: "auto",
    boxSizing: "border-box",
  };

  const blobBackgroundStyle = {
    width: "140px",
    height: "140px",
    backgroundColor: "#7FB04B", 
    borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%", 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: "10px"
  };

  const profilePicStyle = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  };

  const nameStyle = {
    color: "#2D4627",
    fontWeight: "bold",
    fontSize: "20px",
    margin: "-5px 0 0 0",
  };

  const progressBarContainer = {
    width: "100%",
    backgroundColor: "#78A64B", 
    borderRadius: "20px",
    height: "40px",
    position: "relative",
    overflow: "hidden",
  };

  const progressBarFill = {
    width: "55%", 
    backgroundColor: "#2D4627", 
    height: "100%",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    paddingLeft: "20px",
    boxSizing: "border-box"
  };

  const progressTextStyle = {
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    zIndex: 2,
  };

  const rankingCardStyle = {
    backgroundColor: "#78A64B",
    borderRadius: "15px",
    padding: "20px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    color: "white",
    boxSizing: "border-box",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  };

  const achievementsRowStyle = {
    display: "flex",
    width: "100%",
    gap: "10px",
  };

  const achievementMiniCardStyle = {
    backgroundColor: "#78A64B",
    borderRadius: "10px",
    padding: "15px 10px",
    flex: 1, 
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "14px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  };

  const logoutBtnStyle = {
    backgroundColor: "#78A64B",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "15px",
    fontSize: "18px",
    fontWeight: "bold",
    width: "100%",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  };

  return (
    <PageLayout title="Perfil">
      <div style={containerStyle}>
        
        <div style={blobBackgroundStyle}>
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
            alt="Foto de Perfil" 
            style={profilePicStyle} 
          />
        </div>

        <h2 style={nameStyle}>Vitória Luiza Camara</h2>

        <div style={progressBarContainer}>
          <div style={progressBarFill}>
            <span style={progressTextStyle}>550/1000</span>
          </div>
        </div>

        <div style={rankingCardStyle}>
          <div style={{ fontSize: "40px", fontWeight: "bold", marginRight: "20px" }}>
            5º
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>Sua posição</span>
            <span style={{ fontSize: "12px", opacity: 0.9 }}>Ranking Santa Maria</span>
          </div>
        </div>

        <div style={achievementsRowStyle}>
          <div style={achievementMiniCardStyle}>Conquista x</div>
          <div style={achievementMiniCardStyle}>Conquista y</div>
        </div>

        <button 
          style={logoutBtnStyle} 
          onClick={() => navigate("/")} 
        >
          Sair
        </button>

      </div>
    </PageLayout>
  );
};

export default Profile;