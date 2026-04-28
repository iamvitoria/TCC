import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [denuncias, setDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const navigate = useNavigate();

  useEffect(() => {
    buscarDenuncias();
  }, []);

  const buscarDenuncias = async () => {
    try {
      const resposta = await fetch('https://ecomonitor-api.onrender.com/denuncias');
      if (resposta.ok) {
        const dados = await resposta.json();
        console.log("DADOS DO BANCO:", dados); 
        setDenuncias(dados.sort((a, b) => b.id - a.id));
      }
    } catch (erro) {
      console.error("Erro:", erro);
    } finally {
      setCarregando(false);
    }
  };

  const denunciasFiltradas = denuncias.filter(d => {
  if (!d) return false;
  const matchesBusca = termoBusca === '' || d.id?.toString().includes(termoBusca);
  const matchesStatus = filtroStatus === 'Todos' || d.status === filtroStatus;
  const matchesCategoria = 
    filtroCategoria === 'Todas' || 
    d.categoria?.trim().toLowerCase() === filtroCategoria.trim().toLowerCase();
  
  return matchesBusca && matchesStatus && matchesCategoria;
});

  return (
    <div style={{ backgroundColor: '#2C4E2E', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      <header style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          Denúncias Recebidas
        </h1>
      </header>

      <main style={{ 
        backgroundColor: '#F5F5F5', 
        borderTopLeftRadius: '30px', 
        borderTopRightRadius: '30px', 
        minHeight: 'calc(100vh - 110px)',
        padding: '25px 20px' 
      }}>
        
        <section style={{ 
          backgroundColor: '#EAEAEA', 
          borderRadius: '20px', 
          padding: '20px', 
          marginBottom: '25px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <input 
            type="text" 
            placeholder="ID, Usuário..." 
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            style={{ 
              padding: '12px 15px', 
              borderRadius: '12px', 
              border: 'none', 
              backgroundColor: '#D1D1D1',
              fontSize: '16px'
            }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Categoria</label>
              <select 
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                style={selectStyle}
              >
                <option value="Todas">Todas</option>
                <option value="Descarte Irregular de Lixo">Descarte Irregular de Lixo</option>
                <option value="Desmatamento">Desmatamento</option>
                <option value="Poluição da Água">Poluição da Água</option>
                <option value="Queimada">Queimada</option>
                <option value="Poluição do Ar">Poluição do Ar</option>
                <option value="Maus-tratos Animais">Maus-tratos Animais</option>
                <option value="Foco de Mosquito">Foco de Mosquito</option>
                <option value="Esgoto Aberto">Esgoto Aberto</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Status</label>
              <select 
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                style={selectStyle}
              >
                <option>Todos</option>
                <option>Em análise</option>
                <option>Validado</option>
                <option>Resolvido</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Região</label>
              <select style={selectStyle}><option>Santa Maria</option></select>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Ordenar</label>
              <select style={selectStyle}><option>Mais recente</option></select>
            </div>
          </div>
        </section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {carregando ? <p style={{textAlign: 'center'}}>Carregando...</p> : 
           denunciasFiltradas.map((denuncia) => (
            <div
              key={denuncia.id}
              onClick={() => navigate(`/admin/denuncia/${denuncia.id}`)}
              style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', gap: '30px' }}>
                <div>
                  <span style={labelStyle}>ID</span>
                  <span style={valueStyle}>{denuncia.id}</span>
                </div>
                <div>
                  <span style={labelStyle}>Data</span>
                  <span style={valueStyle}>{new Date(denuncia.data_criacao).toLocaleDateString('pt-BR')}</span>
                </div>
                <div>
                  <span style={labelStyle}>Categoria</span>
                  <span style={{ ...valueStyle, color: '#4A7C59' }}>{denuncia.categoria}</span>
                </div>
              </div>

              <div style={{ 
                backgroundColor: '#D98C3A', 
                color: 'white', 
                padding: '8px 15px', 
                borderRadius: '15px', 
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {denuncia.status || 'Em análise'}
              </div>
            </div>
          ))}
        </div>
      </main>
      
    </div>
  );
}

const selectStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '12px',
  border: 'none',
  backgroundColor: '#D1D1D1',
  fontSize: '14px',
  appearance: 'none',
  backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  backgroundSize: '15px'
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#4A7C59',
  display: 'block',
  marginBottom: '5px'
};

const valueStyle = {
  fontSize: '14px',
  color: '#555',
  fontWeight: '500'
};