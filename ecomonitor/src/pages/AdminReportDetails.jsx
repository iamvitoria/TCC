import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from "../components/PageLayout/PageLayout";

export default function AdminReportDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [denuncia, setDenuncia] = useState(null);
  const [carregando, setCarregando] = useState(true);
  
  const [novoStatus, setNovoStatus] = useState(''); 
  const [atualizando, setAtualizando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

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
    setMensagem({ texto: '', tipo: '' });

    if (novoStatus === denuncia.status) {
      setMensagem({ texto: "O status selecionado já é o status atual!", tipo: 'erro' });
      return;
    }

    setAtualizando(true);
    try {
      const resposta = await fetch(`https://ecomonitor-api.onrender.com/denuncias/${id}/status?novo_status=${novoStatus}`, {
        method: 'PUT',
      });

      if (resposta.ok) {
        setMensagem({ texto: "Status atualizado com sucesso! Redirecionando...", tipo: 'sucesso' });
        setDenuncia({ ...denuncia, status: novoStatus });
        
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 1500); 
      } else {
        setMensagem({ texto: "Erro ao atualizar o status.", tipo: 'erro' });
      }
    } catch (erro) {
      console.error("Erro na requisição:", erro);
      setMensagem({ texto: "Erro na conexão com o servidor.", tipo: 'erro' });
    } finally {
      setAtualizando(false);
    }
  };

  const formatarData = (dataIso) => {
    if (!dataIso) return '';
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR');
  };

  // Função para definir a cor baseada no status
  const obterCorStatus = (status) => {
    switch (status) {
      case 'Em análise':
        return '#F5B041'; // Amarelo/Laranja
      case 'Validado':
        return '#28A745'; // Verde
      case 'Resolvido':
        return '#007BFF'; // Azul
      case 'Negado':
      case 'Cancelado':
        return '#DC3545'; // Vermelho
      default:
        return '#6C757D'; // Cinza (caso venha algum status diferente)
    }
  };

  if (carregando) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Carregando detalhes...</p>;
  }

  if (!denuncia) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Denúncia não encontrada.</p>;
  }

  return (
    <PageLayout title="Detalhes da denúncia (adm)">
      <main style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '80px', fontFamily: 'sans-serif' }}>
        
        <section>
          <h2 style={{ fontSize: '1.1rem', color: '#2C5E2E', marginBottom: '10px' }}>Informações da Denúncia</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
            
            <div style={{ backgroundColor: '#EAEAEA', padding: '10px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', color: '#4A7C59' }}>Categoria</span>
              <span style={{ fontSize: '0.9rem' }}>{denuncia.categoria}</span>
            </div>
            
            <div style={{ backgroundColor: '#EAEAEA', padding: '10px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', color: '#4A7C59' }}>Data</span>
              <span style={{ fontSize: '0.9rem' }}>{formatarData(denuncia.data_criacao)}</span>
            </div>

            <div style={{ backgroundColor: '#EAEAEA', padding: '10px', borderRadius: '8px', gridColumn: 'span 2' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', color: '#4A7C59' }}>Descrição</span>
              <span style={{ fontSize: '0.9rem' }}>{denuncia.descricao || 'Nenhuma descrição informada'}</span>
            </div>

            <div style={{ 
              width: '100%', 
              height: '300px', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              marginTop: '16px',
              gridColumn: 'span 2' 
            }}>
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${denuncia.latitude},${denuncia.longitude}&z=16&output=embed`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
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
          <h2 style={{ fontSize: '1.1rem', color: '#2C5E2E', marginBottom: '10px', fontWeight: 'bold' }}>
            Informações do Usuário
          </h2>
          <div style={{ 
            backgroundColor: '#EAEAEA', 
            padding: '20px', 
            borderRadius: '20px', 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: '15px' 
          }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A7C59', display: 'block' }}>Nome</span>
              <span style={{ fontSize: '14px', color: '#555' }}>
                {denuncia.usuario?.nome || 'Não identificado'}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A7C59', display: 'block' }}>Região</span>
              <span style={{ fontSize: '14px', color: '#555' }}>
                {denuncia.usuario?.regiao || 'Santa Maria'}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A7C59', display: 'block' }}>Contribuições</span>
              <span style={{ fontSize: '14px', color: '#555' }}>
                {denuncia.usuario?.contribuicoes ?? 0} denúncia(s)
              </span>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '1.1rem', color: '#2C5E2E', marginBottom: '10px' }}>Ações Administrativas</h2>
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', border: '1px solid #ddd', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1rem', margin: '0 0 10px 0' }}>Alterar Status</h3>
            
            <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>
              Status atual: 
              <span style={{ 
                backgroundColor: obterCorStatus(denuncia.status), 
                color: 'white', 
                padding: '4px 10px', 
                borderRadius: '12px', 
                fontWeight: 'bold', 
                fontSize: '0.8rem',
                marginLeft: '8px',
                textShadow: '0px 1px 2px rgba(0,0,0,0.3)' // Sombra para ajudar na leitura do texto branco
              }}>
                {denuncia.status}
              </span>
            </p>
            
            <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '5px', marginTop: '15px' }}>Selecione o novo status:</label>
            <select 
              value={novoStatus} 
              onChange={(e) => setNovoStatus(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '15px', fontSize: '1rem', outline: 'none' }}
            >
              <option value="Em análise">Em análise</option>
              <option value="Validado">Validado</option>
              <option value="Resolvido">Resolvido</option>
              <option value="Negado">Negado</option>
              <option value="Cancelado">Cancelado</option>
            </select>

            {mensagem.texto && (
              <div style={{ 
                padding: '10px', 
                marginBottom: '15px', 
                borderRadius: '8px', 
                textAlign: 'center',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                backgroundColor: mensagem.tipo === 'sucesso' ? '#D4EDDA' : '#F8D7DA',
                color: mensagem.tipo === 'sucesso' ? '#155724' : '#721C24',
                border: `1px solid ${mensagem.tipo === 'sucesso' ? '#C3E6CB' : '#F5C6CB'}`
              }}>
                {mensagem.texto}
              </div>
            )}

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
    </PageLayout>
  );
}