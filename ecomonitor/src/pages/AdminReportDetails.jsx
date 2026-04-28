import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AdminReportDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [denuncia, setDenuncia] = useState(null);
  const [carregando, setCarregando] = useState(true);
  
  const [novoStatus, setNovoStatus] = useState(''); 
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => {
    const buscarDetalhesDenuncia = async () => {
      try {
        const resposta = await fetch(`https://ecomonitor-api.onrender.com/denuncias/${id}`);
        if (resposta.ok) {
          const dados = await resposta.json();
          setDenuncia(dados);
          setNovoStatus(dados.status);
        } else {
          console.error("Erro ao buscar detalhes.");
        }
      } catch (erro) {
        console.error("Falha na conexão com a API:", erro);
      } finally {
        setCarregando(false);
      }
    };

    buscarDetalhesDenuncia();
  }, [id]); 

  const confirmarAlteracao = async () => {
    if (novoStatus === denuncia.status) {
      alert("O status selecionado já é o status atual!");
      return;
    }

    setAtualizando(true);
    try {
      const resposta = await fetch(`https://ecomonitor-api.onrender.com/denuncias/${id}/status?novo_status=${novoStatus}`, {
        method: 'PUT',
      });

      if (resposta.ok) {
        alert("Status atualizado com sucesso!");
        setDenuncia({ ...denuncia, status: novoStatus });
        navigate('/admin-dashboard') 
      } else {
        alert("Erro ao atualizar o status.");
      }
    } catch (erro) {
      console.error("Erro na requisição:", erro);
    } finally {
      setAtualizando(false);
    }
  };

  const formatarData = (dataIso) => {
    if (!dataIso) return '';
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR');
  };

  if (carregando) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Carregando detalhes...</p>;
  }

  if (!denuncia) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Denúncia não encontrada.</p>;
  }

  return (
    // Adicionado height e overflowY para garantir que o scroll funcione
    <div style={{ backgroundColor: '#f4f4f4', height: '100vh', overflowY: 'auto', paddingBottom: '40px' }}>
      
      {/* Cabeçalho centralizado e sem flecha */}
      <header style={{ backgroundColor: '#2C5E2E', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.2rem', margin: 0 }}>Detalhes da denúncia (adm)</h1>
      </header>

      <main style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <section>
          <h2 style={{ fontSize: '1.1rem', color: '#2C5E2E', marginBottom: '10px' }}>Informações da Denúncia</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
            
            <div style={{ backgroundColor: '#EAEAEA', padding: '10px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block' }}>Categoria</span>
              <span>{denuncia.categoria}</span>
            </div>
            
            <div style={{ backgroundColor: '#EAEAEA', padding: '10px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block' }}>Data</span>
              <span>{formatarData(denuncia.data_criacao)}</span>
            </div>

            <div style={{ backgroundColor: '#EAEAEA', padding: '10px', borderRadius: '8px', gridColumn: 'span 2' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block' }}>Descrição</span>
              <span>{denuncia.descricao || 'Nenhuma descrição informada'}</span>
            </div>

            <div style={{ gridColumn: 'span 2', height: '120px', backgroundColor: '#ddd', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Mapa: Lat {denuncia.latitude?.toFixed(4)}, Lng {denuncia.longitude?.toFixed(4)}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '1.1rem', color: '#2C5E2E', marginBottom: '10px' }}>Foto</h2>
          {denuncia.foto_url ? (
            <img 
              src={`https://ecomonitor-api.onrender.com/${denuncia.foto_url}`} 
              alt="Foto da denúncia" 
              style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '15px' }}
            />
          ) : (
            <div style={{ height: '150px', backgroundColor: '#EAEAEA', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ color: '#888' }}>Sem Foto</span>
            </div>
          )}
        </section>

        <section>
          <h2 style={{ fontSize: '1.1rem', color: '#2C5E2E', marginBottom: '10px' }}>Informações do Usuário</h2>
          <div style={{ backgroundColor: '#EAEAEA', padding: '15px', borderRadius: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block' }}>Nome</span>
              <span style={{ fontSize: '0.9rem' }}>Vitória Camara</span>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block' }}>Região</span>
              <span style={{ fontSize: '0.9rem' }}>Santa Maria</span>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block' }}>Contribuições</span>
              <span style={{ fontSize: '0.9rem' }}>5</span>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '1.1rem', color: '#2C5E2E', marginBottom: '10px' }}>Ações Administrativas</h2>
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', border: '1px solid #ddd', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1rem', margin: '0 0 10px 0' }}>Alterar Status</h3>
            
            <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>
              Status atual: <span style={{ backgroundColor: '#D98C3A', color: 'white', padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.8rem' }}>{denuncia.status}</span>
            </p>
            
            <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Selecione o novo status:</label>
            <select 
              value={novoStatus} 
              onChange={(e) => setNovoStatus(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '15px', fontSize: '1rem' }}
            >
              <option value="Em análise">Em análise</option>
              <option value="Validado">Validado</option>
              <option value="Resolvido">Resolvido</option>
              <option value="Negado">Negado</option>
            </select>

            <button 
              onClick={confirmarAlteracao}
              disabled={atualizando}
              style={{ 
                width: '100%', 
                backgroundColor: atualizando ? '#666' : '#2C5E2E', 
                color: 'white', 
                padding: '12px', 
                borderRadius: '8px', 
                border: 'none', 
                fontWeight: 'bold', 
                fontSize: '1rem',
                cursor: atualizando ? 'not-allowed' : 'pointer'
              }}
            >
              {atualizando ? 'Salvando...' : 'Confirmar alteração'}
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}