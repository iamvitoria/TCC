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
        
        localStorage.setItem('token', dados.access_token);
        
        const perfilDoUsuario = dados.perfil || 'user'; 
        localStorage.setItem('perfilUsuario', perfilDoUsuario); 

        if (dados.nome) {
            localStorage.setItem('nomeUsuario', dados.nome);
        }

        setAlerta({ visivel: true, texto: "Login feito com sucesso!", tipo: "sucesso" });
        
        setTimeout(() => {
          if (perfilDoUsuario === 'admin') {
            navigate("/admin-dashboard"); 
          } else {
            navigate("/home");            
          }
        }, 1500);
        
      } else {
        setAlerta({ visivel: true, texto: "Email ou senha incorretos.", tipo: "erro" });
      }
      
    } catch (erro) {
      console.error("ERRO DETALHADO:", erro);
      setAlerta({ 
        visivel: true, 
        texto: "O servidor demorou muito ou bloqueou a resposta. Verifique se o usuário foi criado.", 
        tipo: "erro" 
      });
    } finally {
      setCarregando(false);
    }
  };

  const containerStyle = {
    backgroundColor: "#1C3520", 
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif"
  };

  const logoStyle = {
    height: "220px",
    marginBottom: "-30px",
    marginTop: "-100px"
  };

  const titleStyle = {
    color: "white",
    fontSize: "26px",
    fontWeight: "bold",
    margin: "0 0 10px 0"
  };

  const subtitleStyle = {
    color: "#5FA362", 
    fontSize: "15px",
    marginBottom: "30px"
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

  const linkStyle = {
    color: "#5FA362", 
    fontSize: "14px",
    marginTop: "25px",
    cursor: "pointer",
    fontWeight: "bold"
  };

  return (
    <div style={containerStyle}>
      <img src={logo} alt="EcoMonitor Logo" style={logoStyle} />

      <h1 style={titleStyle}>Bem-Vindo!</h1>
      <p style={subtitleStyle}>Faça login para entrar</p>

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
        onClick={fazerLogin} 
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
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </button>

      <p style={linkStyle} onClick={() => navigate("/register")}>
        Não tem uma conta? Cadastre-se
      </p>
      
    </div>
  );
};

export default Login;