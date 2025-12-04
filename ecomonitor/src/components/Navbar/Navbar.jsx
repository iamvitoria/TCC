import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Heart,      
  Star,       
  Camera,     
  ThumbsUp,   
  User        
} from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="navbar-container">
      <nav className="navbar-content">
        
        {/* 1. CORAÇÃO -> CONTRIBUIÇÕES */}
        <button
          className={`nav-btn ${isActive("/contribuicoes") ? "active" : ""}`}
          onClick={() => navigate("/contribuicoes")}
        >
          <Heart size={24} />
        </button>

        {/* 2. ESTRELA */}
        <button
          className={`nav-btn ${isActive("/destaques") ? "active" : ""}`}
          onClick={() => navigate("/destaques")}
        >
          <Star size={24} />
        </button>

        {/* 3. CÂMERA (AGORA É A HOME) */}
        <button
          // Adiciona classe extra se estiver na Home para destacar
          className={`nav-btn camera-btn ${isActive("/home") ? "camera-active" : ""}`}
          onClick={() => navigate("/home")}
        >
          <Camera size={28} />
        </button>

        {/* 4. LIKE */}
        <button
          className={`nav-btn ${isActive("/curtidas") ? "active" : ""}`}
          onClick={() => navigate("/curtidas")}
        >
          <ThumbsUp size={24} />
        </button>

        {/* 5. PERFIL */}
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