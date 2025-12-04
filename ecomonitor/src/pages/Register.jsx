import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-ecomonitor.png"; 

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container">
      {/* 1. Logo (um pouco menor para caber os campos extras) */}
      <img 
        src={logo} 
        alt="EcoMonitor Logo" 
        className="logo" 
        style={{ width: '150px', marginBottom: '20px' }} 
      />

      {/* Título para orientar o usuário */}
      <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '20px' }}>
        Crie sua conta
      </h2>

      {/* 2. Campos de Cadastro (Cinzas) */}
      <input 
        type="text" 
        placeholder="Nome completo" 
        className="input-field" 
      />

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

      <input 
        type="password" 
        placeholder="Confirmar senha" 
        className="input-field" 
      />

      {/* 3. Botão de Ação */}
      <button className="btn-primary" onClick={() => navigate("/home")}>
        Cadastrar
      </button>

      {/* 4. Link para voltar ao Login */}
      <div style={{marginTop: '20px', textAlign: 'center'}}>
        <p className="link-text" onClick={() => navigate("/login")}>
          Já tem uma conta? Faça Login
        </p>
      </div>
    </div>
  );
};

export default Register;