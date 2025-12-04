import React from "react";
import { Header } from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";

const Profile = () => {
  return (
    <div className="page-with-navbar">
      
      {/* 1. O HEADER NOVO NO TOPO */}
      {/* showBack={true} mostra a setinha de voltar */}
      <Header title="Meu Perfil" showBack={false} />

      {/* Conteúdo da Página */}
      <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
        
        {/* Foto de Perfil Simulada */}
        <div style={{ 
          width: '100px', height: '100px', backgroundColor: '#ddd', 
          borderRadius: '50%', margin: '20px auto', border: '4px solid #78A64B'
        }}></div>
        
        <h2>Usuário Eco</h2>
        <p style={{opacity: 0.8}}>usuario@email.com</p>

        <div style={{ marginTop: '30px', textAlign: 'left' }}>
          <div style={{background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px', marginBottom: '10px'}}>
            ⚙️ Configurações
          </div>
          <div style={{background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px', marginBottom: '10px'}}>
            🏆 Minhas Conquistas
          </div>
          <div style={{background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px'}}>
            📞 Suporte
          </div>
        </div>

      </div>

      {/* 2. NAVBAR EMBAIXO */}
      <Navbar />
    </div>
  );
};

export default Profile;