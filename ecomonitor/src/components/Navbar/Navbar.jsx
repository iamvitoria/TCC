import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  MapPin, 
  Camera, 
  Trophy, 
  User, 
  LogIn 
} from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Simulação de login (pode substituir pelo seu Context depois)
  const isLoggedIn = true; 

  // Função para verificar se o ícone está ativo (muda a opacidade)
  const isActive = (path) => location.pathname === path;

  return (
    <div className="navbar-container">
      <nav className="navbar-content">
        
        {/* 1. HOME */}
        <button
          className={`nav-btn ${isActive("/home") ? "active" : ""}`}
          onClick={() => navigate("/home")}
        >
          <Home size={24} />
        </button>

        {/* 2. MAPA / PONTOS */}
        <button
          className={`nav-btn ${isActive("/mapa") ? "active" : ""}`}
          onClick={() => navigate("/mapa")} // Você pode criar essa rota depois
        >
          <MapPin size={24} />
        </button>

        {/* 3. CÂMERA (CENTRAL) */}
        <button
          className="nav-btn camera-btn"
          onClick={() => navigate("/camera")} // Rota da câmera (futura)
        >
          <Camera size={28} />
        </button>

        {/* 4. CONQUISTAS */}
        <button
          className={`nav-btn ${isActive("/conquistas") ? "active" : ""}`}
          onClick={() => navigate("/conquistas")}
        >
          <Trophy size={24} />
        </button>

        {/* 5. PERFIL / LOGIN */}
        <button
          className={`nav-btn ${isActive("/perfil") ? "active" : ""}`}
          onClick={() => navigate(isLoggedIn ? "/perfil" : "/login")}
        >
          {isLoggedIn ? <User size={24} /> : <LogIn size={24} />}
        </button>

      </nav>
    </div>
  );
};

export default Navbar;