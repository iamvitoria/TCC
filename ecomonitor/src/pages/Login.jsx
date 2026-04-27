import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-ecomonitor.png"; 
import API_URL from "../config";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [alerta, setAlerta] = useState({ visivel: false, texto: "", tipo: "" });

  const fecharAlerta = () => setAlerta({ visivel: false, texto: "", tipo: "" });

  const fazerLogin = async () => {
    if (!email || !senha) {
      setAlerta({ visivel: true, texto: "Por favor, preencha o e-mail e a senha!", tipo: "erro" });
      return;
    }

    setCarregando(true);
    fecharAlerta();

    try {
      const detalhesDoLogin = new URLSearchParams();
      detalhesDoLogin.append('username', email); 
      detalhesDoLogin.append('password', senha);

      const resposta = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: detalhesDoLogin.toString(),
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        localStorage.setItem('meuToken', dados.access_token);
        
        setAlerta({ visivel: true, texto: "Login feito com sucesso!", tipo: "sucesso" });
        
        setTimeout(() => {
          navigate("/home");
        }, 1500);
        
      } else {
        setAlerta({ visivel: true, texto: "Email ou senha incorretos.", tipo: "erro" });
      }
      
    } catch (erro) {
      console.error(erro);
      setAlerta({ visivel: true, texto: "Erro de conexão. O servidor está ligado?", tipo: "erro" });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="mobile-container">
      <img src={logo} alt="EcoMonitor Logo" className="logo" />

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

      {alerta.visivel && (
        <div style={{
          padding: "10px",
          marginTop: "3px",
          marginBottom: "3px",
          borderRadius: "8px",
          width: "44%",
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
        className="btn-primary" 
        onClick={fazerLogin} 
        disabled={carregando}
        style={{ 
          opacity: carregando ? 0.7 : 1, 
          cursor: carregando ? "not-allowed" : "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px"
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
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </button>

      <div style={{marginTop: '20px', textAlign: 'center'}}>
        <p className="link-text" onClick={() => navigate("/register")}>
          Não tem conta? Cadastre-se
        </p>
        
        <p className="link-text" onClick={() => navigate("/admin-dashboard")}>
          Logar como admin
        </p>
      </div>
    </div>
  );
};

export default Login;