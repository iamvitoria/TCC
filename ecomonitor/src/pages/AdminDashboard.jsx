import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from "../components/PageLayout/PageLayout";
import API_URL from "../config";

export default function AdminDashboard() {
  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todas');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroRegiao, setFiltroRegiao] = useState('Todas');
  const [ordenacao, setOrdenacao] = useState('Mais recente');
  const navigate = useNavigate();

  useEffect(() => {
    buscarRegistros();
  }, []);

  const buscarRegistros = async () => {
    setCarregando(true);
    try {
      const resposta = await fetch(`${API_URL}/registros?t=${new Date().getTime()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (resposta.ok) {
        const dados = await resposta.json();
        setRegistros(dados);
      } else {
        console.error("Servidor respondeu com erro:", resposta.status);
      }
    } catch (erro) {
      console.error("Erro na chamada fetch:", erro);
    } finally {
      setCarregando(false);
    }
  };

  const regioesDisponiveis = [
    ...new Set(
      registros
        .map(d => d?.cidade || d?.regiao)
        .filter(Boolean)
        .map(r => r.trim())
    )
  ].sort((a, b) => a.localeCompare(b));

  const filtradasEOrdenadas = () => {
    const filtradas = registros.filter(d => {
      if (!d) return false;

      const buscaLower = termoBusca.trim().toLowerCase();
      const matchesBusca = 
        buscaLower === '' || 
        d.id?.toString().includes(buscaLower) || 
        (d.usuario_nome && d.usuario_nome.toLowerCase().includes(buscaLower)) ||
        (d.nome && d.nome.toLowerCase().includes(buscaLower));

      const matchesStatus = filtroStatus === 'Todas' || d.status === filtroStatus;

      const nomeCategoriaDaDenuncia = typeof d.categoria === 'object' && d.categoria !== null 
        ? d.categoria.nome 
        : (d.categoria || '');

      const matchesCategoria = 
        filtroCategoria === 'Todas' || 
        (nomeCategoriaDaDenuncia.trim().toLowerCase() === filtroCategoria.trim().toLowerCase());

      const regiaoItem = (d.cidade || d.regiao || '').trim().toLowerCase();
      const matchesRegiao = 
        filtroRegiao === 'Todas' || 
        regiaoItem === filtroRegiao.trim().toLowerCase();
      
      return matchesBusca && matchesStatus && matchesCategoria && matchesRegiao;
    });

    if (ordenacao === 'Mais recente') {
      return filtradas.sort((a, b) => {
        const dataA = a.data_criacao ? new Date(a.data_criacao).getTime() : 0;
        const dataB = b.data_criacao ? new Date(b.data_criacao).getTime() : 0;
        return dataB - dataA;
      });
    }

    return filtradas;
  };

  const denunciasFiltradas = filtradasEOrdenadas();

  const obterCorStatus = (status) => {
    switch (status) {
      case 'Em análise':
        return '#CD8B42'; 
      case 'Validado':
        return '#5A8F53'; 
      case 'Resolvido':
        return '#4A7CA6'; 
      case 'Negado':
      case 'Cancelado':
        return '#A64A4A'; 
      default:
        return '#6C757D'; 
    }
  };

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
    <PageLayout title="Registros recebidos" isAdmin={true}>
      <div style={containerStyle}>
        
        <input 
          type="text" 
          placeholder="ID, Usuário..." 
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          style={searchInputStyle}
        />

        <div style={filtersGridStyle}>
          <div>
            <label style={labelStyle}>Categoria</label>
            <select 
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              style={selectStyle}
            >
              <option value="Todas">Todas</option>
              <option value="Descarte Irregular de Lixo">Descarte irregular de lixo</option>
              <option value="Desmatamento">Desmatamento</option>
              <option value="Poluição da Água">Poluição da Água</option>
              <option value="Queimada">Queimada</option>
              <option value="Poluição do Ar">Poluição do Ar</option>
              <option value="Maus-tratos aos Animais">Maus-tratos aos Animais</option>
              <option value="Foco de Mosquito">Foco de Mosquito</option>
              <option value="Esgoto Aberto">Esgoto a Céu Aberto</option>
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
            </select>
          </div>
          <div>
            <label style={labelStyle}>Região</label>
            <select 
              value={filtroRegiao} 
              onChange={(e) => setFiltroRegiao(e.target.value)} 
              style={selectStyle}
            >
              <option value="Todas">Todas</option>
              {regioesDisponiveis.map((regiao, index) => (
                <option key={index} value={regiao}>{regiao}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Ordenar</label>
            <select 
              value={ordenacao} 
              onChange={(e) => setOrdenacao(e.target.value)} 
              style={selectStyle}
            >
              <option value="Todas">Todas (Padrão)</option>
              <option value="Mais recente">Mais recente</option>
            </select>
          </div>
        </div>

        <div style={dividerStyle}></div>

        <div>
          {carregando ? (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              border: "4px solid rgba(45, 70, 39, 0.2)",
              borderTop: "4px solid #2D4627",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        ) : denunciasFiltradas.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>Nenhum registro encontrado.</p>
          ) : (
            denunciasFiltradas.map((denuncia) => (
              <div
                key={denuncia.id}
                onClick={() => navigate(`/admin/registros/${denuncia.id}`, { state: { denunciaSelecionada: denuncia } })}
                style={cardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={idStyle}>{denuncia.id}</span>
                  <div>
                    <h4 style={titleStyle}>
                      {typeof denuncia.categoria === 'object' && denuncia.categoria !== null 
                        ? denuncia.categoria.nome 
                        : (denuncia.categoria || "Sem Categoria")}
                    </h4>
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