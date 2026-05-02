import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Heart,      
  Star,       
  House,     
  Trophy,   
  User,
  LayoutDashboard 
} from "lucide-react";
import "./Navbar.css";

const Navbar = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  if (isAdmin) {
    return (
      <div className="navbar-container">
        <nav className="navbar-content" style={{ justifyContent: 'space-evenly' }}>
          
          <button
            className={`nav-btn ${isActive("/admin-dashboard") ? "active" : ""}`}
            onClick={() => navigate("/admin-dashboard")}
          >
            <LayoutDashboard size={24} />
          </button>

          <button
            className={`nav-btn camera-btn ${isActive("/admin-home") ? "camera-active" : ""}`}
            onClick={() => navigate("/admin-dashboard")}
          >
            <House size={28} />
          </button>

          <button
            className={`nav-btn ${isActive("/admin-perfil") ? "active" : ""}`}
            onClick={() => navigate("/admin-perfil")} 
          >
            <User size={24} />
          </button>

        </nav>
      </div>
    );
  }

  return (
    <div className="navbar-container">
      <nav className="navbar-content">
        
        <button
          className={`nav-btn ${isActive("/contribuicoes") ? "active" : ""}`}
          onClick={() => navigate("/contribuicoes")}
        >
          <Heart size={24} />
        </button>

        <button
          className={`nav-btn ${isActive("/conquistas") ? "active" : ""}`}
          onClick={() => navigate("/conquistas")} 
        >
          <Star size={24} />
        </button>

        <button
          className={`nav-btn camera-btn ${isActive("/home") ? "camera-active" : ""}`}
          onClick={() => navigate("/home")}
        >
          <House size={28} />
        </button>

        <button
          className={`nav-btn ${isActive("/ranking") ? "active" : ""}`}
          onClick={() => navigate("/ranking")}
        >
          <Trophy size={24} />
        </button>

        <button
          className={`nav-btn ${isActive("/perfil") ? "active" : ""}`}
          onClick={() => navigate("/perfil")}
        >
          <User size={24} />
        </button>

      </nav>
    </div>
  );
};

export default Navbar;