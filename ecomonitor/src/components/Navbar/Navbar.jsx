import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  House,      
  MapPin,       
  Plus,         
  Trophy,   
  User,
  LayoutDashboard 
} from "lucide-react";

const Navbar = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navbarContainerStyle = {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: "25px",
    borderTopRightRadius: "25px",
    boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
    padding: "15px 25px 20px 25px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1000
  };

  const getIconColor = (active) => active ? "#4E9A51" : "#A0AEC0"; 

  const navButtonStyle = {
    background: "none",
    border: "none",
    padding: "0",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "color 0.2s"
  };

  const centerButtonContainer = {
    position: "relative",
    width: "60px",
    display: "flex",
    justifyContent: "center"
  };

  const centerButtonStyle = {
    position: "absolute",
    bottom: "-10px", 
    backgroundColor: "#4E9A51",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(78, 154, 81, 0.4)",
    cursor: "pointer"
  };

  if (isAdmin) {
    return (
      <div style={{ ...navbarContainerStyle, justifyContent: "center", gap: "80px" }}>
        <button style={navButtonStyle} onClick={() => navigate("/admin-dashboard")}>
          <House size={28} color={getIconColor(isActive("/admin-dashboard"))} />
        </button>

        <button style={navButtonStyle} onClick={() => navigate("/admin-perfil")}>
          <User size={28} color={getIconColor(isActive("/admin-perfil"))} />
        </button>
      </div>
    );
  }

  return (
    <div style={navbarContainerStyle}>
      
      <button style={navButtonStyle} onClick={() => navigate("/home")}>
        <House size={28} color={getIconColor(isActive("/home"))} />
      </button>

      <button style={navButtonStyle} onClick={() => navigate("/mapa")}>
        <MapPin size={28} color={getIconColor(isActive("/mapa"))} />
      </button>

      <div style={centerButtonContainer}>
        <button style={centerButtonStyle} onClick={() => navigate("/denuncia")}>
          <Plus size={36} color="white" />
        </button>
      </div>

      <button style={navButtonStyle} onClick={() => navigate("/ranking")}>
        <Trophy size={28} color={getIconColor(isActive("/ranking"))} />
      </button>

      <button style={navButtonStyle} onClick={() => navigate("/perfil")}>
        <User size={28} color={getIconColor(isActive("/perfil"))} />
      </button>

    </div>
  );
};

export default Navbar;