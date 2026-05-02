import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-ecomonitor.png"; 
import API_URL from "../config"; 

const Register = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [alerta, setAlerta] = useState({ visivel: false, texto: "", tipo: "" });

  const fecharAlerta = () => setAlerta({ visivel: false, texto: "", tipo: "" });

  const fazerCadastro = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      setAlerta({ visivel: true, texto: "Por favor, preencha todos os campos!", tipo: "erro" });
      return;
    }

    if (senha !== confirmarSenha) {
      setAlerta({ visivel: true, texto: "As senhas não coincidem!", tipo: "erro" });
      return;
    }

    setCarregando(true);
    fecharAlerta();

    try {
      const resposta = await fetch(`${API_URL}/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          senha: senha,
          perfil: "user"
        }),
      });

      if (resposta.ok) {
        setAlerta({ visivel: true, texto: "Cadastro realizado com sucesso!", tipo: "sucesso" });
        
        setTimeout(() => {
          navigate("/login"); 
        }, 2000);
        
      } else {
        const erroData = await resposta.json();
        setAlerta({ visivel: true, texto: erroData.detail || "Erro ao realizar o cadastro.", tipo: "erro" });
      }
      
    } catch (erro) {
      console.error(erro);
      setAlerta({ visivel: true, texto: "Erro de conexão com o servidor.", tipo: "erro" });
    } finally {
      setCarregando(false);
    }
  };

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
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <input 
        type="email" 
        placeholder="E-mail" 
        className="input-field" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <input 
        type="password" 
        placeholder="Senha" 
        className="input-field" 
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      <input 
        type="password" 
        placeholder="Confirmar senha" 
        className="input-field" 
        value={confirmarSenha}
        onChange={(e) => setConfirmarSenha(e.target.value)}
      />

      {alerta.visivel && (
        <div style={{
          padding: "10px",
          marginTop: "10px",
          marginBottom: "10px",
          borderRadius: "8px",
          width: "44%",
          minWidth: "250px",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: alerta.tipo === "erro" ? "#ffebee" : "#e8f5e9",
          color: alerta.tipo === "erro" ? "#c62828" : "#2e7d32",
          border: `1px solid ${alerta.tipo === "erro" ? "#ef9a9a" : "#a5d6a7"}`,
          fontWeight: "bold",
          fontSize: "14px",
          textAlign: "center"
        }}>
          <span style={{ flex: 1 }}>{alerta.texto}</span>
          <span onClick={fecharAlerta} style={{ cursor: "pointer", fontSize: "16px", marginLeft: "10px" }}>✖</span>
        </div>
      )}

      <button 
        className="btn-primary" 
        onClick={fazerCadastro}
        disabled={carregando}
        style={{ 
          opacity: carregando ? 0.7 : 1, 
          cursor: carregando ? "not-allowed" : "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginTop: "10px"
        }}
      >
        {carregando ? (
          <>
            <div style={{
              width: "18px",
              height: "18px",
              border: "3px solid rgba(255,255,255,0.3)",
              borderTop: "3px solid white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            <style>
              {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
            </style>
            Cadastrando...
          </>
        ) : (
          "Cadastrar"
        )}
      </button>

      <div style={{marginTop: '20px', textAlign: 'center'}}>
        <p className="link-text" onClick={() => navigate("/login")} style={{ cursor: 'pointer' }}>
          Já tem uma conta? Faça Login
        </p>
      </div>
    </div>
  );
};

export default Register;