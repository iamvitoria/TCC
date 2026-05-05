import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from "../components/PageLayout/PageLayout";

export default function AdminDashboard() {
  const [denuncias, setDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todas');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const navigate = useNavigate();

  useEffect(() => {
    buscarDenuncias();
  }, []);

  const buscarDenuncias = async () => {
    setCarregando(true);
    try {
      const resposta = await fetch(`https://ecomonitor-api.onrender.com/denuncias?t=${new Date().getTime()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (resposta.ok) {
        const dados = await resposta.json();
        setDenuncias(dados);
      } else {
        console.error("Servidor respondeu com erro:", resposta.status);
      }
    } catch (erro) {
      console.error("Erro na chamada fetch:", erro);
    } finally {
      setCarregando(false);
    }
  };

  const denunciasFiltradas = denuncias.filter(d => {
    if (!d) return false;
    const matchesBusca = termoBusca === '' || d.id?.toString().includes(termoBusca);
    const matchesStatus = filtroStatus === 'Todas' || d.status === filtroStatus;
    const matchesCategoria = 
      filtroCategoria === 'Todas' || 
      d.categoria?.trim().toLowerCase() === filtroCategoria.trim().toLowerCase();
    
    return matchesBusca && matchesStatus && matchesCategoria;
  });

  const obterCorStatus = (status) => {
    switch (status) {
      case 'Em análise':
        return '#CD8B42'; // Laranja escuro / ocre
      case 'Validado':
        return '#5A8F53'; // Verde natural
      case 'Resolvido':
        return '#4A7CA6'; // Azul
      case 'Negado':
      case 'Cancelado':
        return '#A64A4A'; // Vermelho terroso
      default:
        return '#6C757D'; // Cinza
    }
  };

  // --- Estilos ---
  const containerStyle = {
    backgroundColor: '#F4F6F3',
    minHeight: '100vh',
    padding: '20px',
    paddingBottom: '100px',
    boxSizing: 'border-box',
    fontFamily: 'sans-serif'
  };

  const searchInputStyle = {
    width: '100%',
    padding: '14px 15px',
    borderRadius: '10px',
    border: '1px solid #A3B5A3',
    backgroundColor: 'white',
    fontSize: '15px',
    color: '#333',
    marginBottom: '15px',
    boxSizing: 'border-box',
    outline: 'none'
  };

  const filtersGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '20px'
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#6F9E60',
    display: 'block',
    marginBottom: '6px'
  };

  const selectStyle = {
    width: '100%',
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #A3B5A3',
    backgroundColor: 'white',
    fontSize: '14px',
    color: '#666',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%231C3520\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    backgroundSize: '16px',
    boxSizing: 'border-box',
    outline: 'none'
  };

  const dividerStyle = {
    borderTop: '1px solid #EBEBEB',
    margin: '20px 0',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #EAEAEA',
    marginBottom: '12px',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  };

  const idStyle = {
    color: '#8CA1C4',
    fontSize: '15px',
    fontWeight: 'bold',
    width: '30px',
    textAlign: 'center'
  };

  const titleStyle = {
    color: '#1C3520',
    fontSize: '14px',
    fontWeight: 'bold',
    margin: '0 0 2px 0'
  };

  const dateStyle = {
    color: '#A0AAB5',
    fontSize: '12px',
    margin: 0
  };

  return (
    <PageLayout title="Denúncias Recebidas" isAdmin={true}>
      <div style={containerStyle}>
        
        {/* Busca */}
        <input 
          type="text" 
          placeholder="ID, Usuário..." 
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          style={searchInputStyle}
        />

        {/* Filtros */}
        <div style={filtersGridStyle}>
          <div>
            <label style={labelStyle}>Categoria</label>
            <select 
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              style={selectStyle}
            >
              <option value="Todas">Todas</option>
              <option value="Descarte Irregular de Lixo">Descarte de lixo</option>
              <option value="Desmatamento">Desmatamento</option>
              <option value="Poluição da Água">Poluição da Água</option>
              <option value="Queimada">Queimada</option>
              <option value="Poluição do Ar">Poluição do Ar</option>
              <option value="Maus-tratos Animais">Maus-tratos Animais</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select 
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              style={selectStyle}
            >
              <option value="Todas">Todas</option>
              <option value="Em análise">Em análise</option>
              <option value="Validado">Validado</option>
              <option value="Resolvido">Resolvido</option>
              <option value="Negado">Negado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Região</label>
            <select style={selectStyle}>
              <option>Todas</option>
              <option>Santa Maria</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Ordenar</label>
            <select style={selectStyle}>
              <option>Todas</option>
              <option>Mais recente</option>
            </select>
          </div>
        </div>

        <div style={dividerStyle}></div>

        {/* Listagem */}
        <div>
          {carregando ? (
            <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>Carregando...</p>
          ) : denunciasFiltradas.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>Nenhuma denúncia encontrada.</p>
          ) : (
            denunciasFiltradas.map((denuncia) => (
              <div
                key={denuncia.id}
                onClick={() => navigate(`/admin/denuncia/${denuncia.id}`)}
                style={cardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={idStyle}>{denuncia.id}</span>
                  <div>
                    <h4 style={titleStyle}>{denuncia.categoria || "Sem Categoria"}</h4>
                    <p style={dateStyle}>
                      {denuncia.data_criacao 
                        ? new Date(denuncia.data_criacao).toLocaleDateString('pt-BR') 
                        : "Data não informada"}
                    </p>
                  </div>
                </div>

                <div style={{ 
                  backgroundColor: obterCorStatus(denuncia.status || 'Em análise'), 
                  color: 'white', 
                  padding: '6px 14px', 
                  borderRadius: '16px', 
                  fontSize: '12px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}>
                  {denuncia.status || 'Em análise'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}