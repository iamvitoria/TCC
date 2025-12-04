import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-ecomonitor.png"; 

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container">
      {/* 1. Logo Centralizada */}
      <img src={logo} alt="EcoMonitor Logo" className="logo" />

      {/* 2. Campos de Login (Cinzas) */}
      <input 
        type="email" 
        placeholder="E-mail" 
        className="input-field" 
      />
      
      <input 
        type="password" 
        placeholder="Senha" 
        className="input-field" 
      />

      {/* 3. Botão de Ação */}
      <button className="btn-primary" onClick={() => navigate("/home")}>
        Entrar
      </button>

      {/* 4. Opções Extras (Links discretos) */}
      <div style={{marginTop: '20px', textAlign: 'center'}}>
        <p className="link-text" onClick={() => navigate("/register")}>
          Não tem conta? Cadastre-se
        </p>
        
        <p className="link-text" onClick={() => navigate("/home")}>
          Acessar sem login
        </p>
      </div>
    </div>
  );
};

export default Login;