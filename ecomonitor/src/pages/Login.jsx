import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-ecomonitor.png"; 

const Login = () => {
  const navigate = useNavigate();

  // 2. Criamos os "cofres" para guardar o que o usuário digita
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const fazerLogin = async () => {
    // Verificação rápida: o usuário preencheu tudo?
    if (!email || !senha) {
      alert("Por favor, preencha o e-mail e a senha!");
      return;
    }

    try {
      const detalhesDoLogin = new URLSearchParams();
      detalhesDoLogin.append('username', email); 
      detalhesDoLogin.append('password', senha);

      const resposta = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: detalhesDoLogin.toString(),
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        
        // Guardamos a Pulseira VIP!
        localStorage.setItem('meuToken', dados.access_token);
        
        alert("Login feito com sucesso! 🎉");
        
        // 3. AGORA SIM, depois do sucesso, nós navegamos para a Home!
        navigate("/home");
        
      } else {
        alert("Email ou senha incorretos. 🛑");
      }
      
    } catch (erro) {
      console.error("Ocorreu um erro ao conectar com o servidor:", erro);
      alert("Erro de conexão. O servidor está ligado?");
    }
  };

  return (
    <div className="mobile-container">
      <img src={logo} alt="EcoMonitor Logo" className="logo" />

      {/* 4. Conectamos os inputs aos nossos "cofres" do useState */}
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

      {/* 5. Mudamos o botão para chamar a função de login! */}
      <button className="btn-primary" onClick={fazerLogin}>
        Entrar
      </button>

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