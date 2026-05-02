import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Key, Edit3, LogOut, ShieldCheck, MapPin, CheckCircle2, Clock } from 'lucide-react';
import PageLayout from '../components/PageLayout/PageLayout'; 

export default function AdminPerfil() {
  const navigate = useNavigate();

  // Dados provisórios mais completos
  const adminData = {
    nome: "Vitória Luiza Camara",
    cargo: "Analista Ambiental",
    regiao: "Santa Maria",
    foto: "https://i.pravatar.cc/150?img=47",
    estatisticas: {
      resolvidas: 142,
      pendentes: 18
    }
  };

  const handleSair = () => {
    navigate('/'); 
  };

  return (
    <PageLayout title="Perfil Admin" isAdmin={true}>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px 20px',
        paddingBottom: '90px', // Espaço para a navbar
        fontFamily: 'sans-serif'
      }}>

        {/* --- SEÇÃO DA FOTO COM FUNDO ORGÂNICO (BLOB) --- */}
        <div style={{ position: 'relative', marginBottom: '15px' }}>
          <div style={{
            position: 'absolute',
            top: '-15px', 
            left: '-20px', 
            right: '-20px', 
            bottom: '-15px',
            backgroundColor: '#7BA45A', 
            borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
            zIndex: 0
          }}></div>

          <img
            src={adminData.foto}
            alt="Foto de Perfil"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              border: '4px solid white'
            }}
          />
        </div>

        {/* --- NOME E INFORMAÇÕES BÁSICAS --- */}
        <h2 style={{ color: '#1B3B22', fontSize: '22px', fontWeight: 'bold', margin: '10px 0 5px 0', textAlign: 'center' }}>
          {adminData.nome}
        </h2>
        
        <div style={{ display: 'flex', gap: '15px', color: '#555', fontSize: '14px', marginBottom: '25px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ShieldCheck size={16} color="#7BA45A" /> {adminData.cargo}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <MapPin size={16} color="#7BA45A" /> {adminData.regiao}
          </span>
        </div>

        {/* --- ESTATÍSTICAS (NOVO) --- */}
        <div style={{ 
          display: 'flex', 
          width: '100%', 
          gap: '15px', 
          marginBottom: '30px' 
        }}>
          <div style={statsCardStyle}>
            <CheckCircle2 size={24} color="#28A745" style={{ marginBottom: '8px' }} />
            <span style={statsNumberStyle}>{adminData.estatisticas.resolvidas}</span>
            <span style={statsLabelStyle}>Resolvidas</span>
          </div>
          <div style={statsCardStyle}>
            <Clock size={24} color="#F5B041" style={{ marginBottom: '8px' }} />
            <span style={statsNumberStyle}>{adminData.estatisticas.pendentes}</span>
            <span style={statsLabelStyle}>Pendentes</span>
          </div>
        </div>

        {/* --- MENU DE OPÇÕES (NOVO) --- */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <button style={actionButtonStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Edit3 size={20} />
              <span style={actionButtonText}>Editar Perfil</span>
            </div>
          </button>

          <button style={actionButtonStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Key size={20} />
              <span style={actionButtonText}>Mudar Senha</span>
            </div>
          </button>

          <button style={actionButtonStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Settings size={20} />
              <span style={actionButtonText}>Configurações do Sistema</span>
            </div>
          </button>

        </div>

        {/* --- BOTÃO DE SAIR --- */}
        <div style={{ width: '100%', marginTop: '30px' }}>
          <button onClick={handleSair} style={logoutButtonStyle}>
            <LogOut size={20} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Sair da Conta</span>
          </button>
        </div>

      </div>
    </PageLayout>
  );
}

// --- ESTILOS ---

const statsCardStyle = {
  flex: 1,
  backgroundColor: '#EAEAEA',
  borderRadius: '16px',
  padding: '15px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

const statsNumberStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1B3B22'
};

const statsLabelStyle = {
  fontSize: '12px',
  color: '#666',
  fontWeight: 'bold',
  textTransform: 'uppercase'
};

const actionButtonStyle = {
  backgroundColor: '#7BA45A', 
  color: 'white',
  borderRadius: '12px',
  padding: '16px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  width: '100%'
};

const actionButtonText = {
  fontSize: '16px',
  fontWeight: '500'
};

const logoutButtonStyle = {
  backgroundColor: '#FFEBEE', 
  color: '#DC3545',
  borderRadius: '12px',
  padding: '16px 20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  border: '2px solid #FFCDD2',
  cursor: 'pointer',
  width: '100%'
};