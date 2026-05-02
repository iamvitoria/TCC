import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-ecomonitor.png"; 

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container">
      <img 
        src={logo} 
        alt="EcoMonitor Logo" 
        className="logo" 
        style={{ width: '150px', marginBottom: '20px' }} 
      />

      <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '20px' }}>
        Crie sua conta
      </h2>

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

      <button className="btn-primary" onClick={() => navigate("/home")}>
        Cadastrar
      </button>

      <div style={{marginTop: '20px', textAlign: 'center'}}>
        <p className="link-text" onClick={() => navigate("/login")}>
          Já tem uma conta? Faça Login
        </p>
      </div>
    </div>
  );
};

export default Register;