import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      console.error("ERRO REAL QUE ESTÁ ACONTECENDO:", erro);
      setAlerta({ visivel: true, texto: "Erro de conexão com o servidor.", tipo: "erro" });
    } finally {
      setCarregando(false);
    }
  };

  const containerStyle = {
    backgroundColor: "#1C3520", 
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", 
    padding: "30px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif"
  };

  const backButtonStyle = {
    color: "#5FA362",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: "40px",
    marginTop: "-20px" 
  };

  const titleStyle = {
    color: "white",
    fontSize: "32px", 
    fontWeight: "bold",
    margin: "0 0 10px 0",
    textAlign: "left"
  };

  const subtitleStyle = {
    color: "#5FA362", 
    fontSize: "16px",
    marginBottom: "30px",
    textAlign: "left"
  };

  const inputStyle = {
    width: "100%",
    backgroundColor: "#2E4731", 
    border: "1px solid #48684A", 
    borderRadius: "12px",
    padding: "18px 15px",
    marginBottom: "15px",
    color: "white",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    backgroundColor: "#4E9A51", 
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "18px",
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "10px",
    cursor: carregando ? "not-allowed" : "pointer",
    opacity: carregando ? 0.7 : 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
  };

  return (
    <div style={containerStyle}>
      
      <div style={backButtonStyle} onClick={() => navigate(-1)}>
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          style={{ marginRight: '6px' }}
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Voltar
      </div>

      <h1 style={titleStyle}>Criar conta</h1>
      <p style={subtitleStyle}>Junte-se à comunidade</p>

      <input 
        type="text" 
        placeholder="Nome completo" 
        style={inputStyle} 
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <input 
        type="email" 
        placeholder="Email" 
        style={inputStyle} 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <input 
        type="password" 
        placeholder="Senha" 
        style={inputStyle} 
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      <input 
        type="password" 
        placeholder="Confirmar senha" 
        style={inputStyle} 
        value={confirmarSenha}
        onChange={(e) => setConfirmarSenha(e.target.value)}
      />

      {alerta.visivel && (
        <div style={{
          padding: "15px",
          marginBottom: "15px",
          borderRadius: "12px",
          width: "100%", 
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: alerta.tipo === "erro" ? "#ffebee" : "#e8f5e9",
          color: alerta.tipo === "erro" ? "#c62828" : "#2e7d32",
          border: `1px solid ${alerta.tipo === "erro" ? "#ef9a9a" : "#a5d6a7"}`,
          fontWeight: "bold",
          fontSize: "14px"
        }}>
          <span>{alerta.texto}</span>
          <span onClick={fecharAlerta} style={{ cursor: "pointer", fontSize: "16px" }}>✖</span>
        </div>
      )}

      <button 
        onClick={fazerCadastro}
        disabled={carregando}
        style={buttonStyle}
      >
        {carregando ? (
          <>
            <div style={{
              width: "20px",
              height: "20px",
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
          "Criar conta"
        )}
      </button>
      
    </div>
  );
};

export default Register;