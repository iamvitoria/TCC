import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [status, setStatus] = useState('Todos');
  const [ordem, setOrdem] = useState('Mais recente');

  const [denuncias, setDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const navigate = useNavigate();
  
  useEffect(() => {
    buscarDenuncias();
  }, []);

  const buscarDenuncias = async () => {
    try {
      const resposta = await fetch('https://ecomonitor-api.onrender.com/denuncias'); 
      
      if (resposta.ok) {
        const dados = await resposta.json();
        console.log("Dados recebidos:", dados);
        setDenuncias(dados);
      } else {
        console.error("Erro ao buscar dados do servidor");
      }
    } catch (erro) {
      console.error("Falha na conexão com a API:", erro);
    } finally {
      setCarregando(false);
    }
  };

  const formatarData = (dataIso) => {
    if (!dataIso) return '';
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div style={{ backgroundColor: '#f4f4f4', minHeight: '100vh', paddingBottom: '20px' }}>
      
      <header style={{ backgroundColor: '#2C5E2E', color: 'white', padding: '20px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
        Denúncias Recebidas
      </header>

      <main style={{ padding: '20px' }}>
        
        <div style={{ backgroundColor: '#EAEAEA', borderRadius: '15px', padding: '15px', marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="Buscar por ID, Categoria..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', marginBottom: '15px' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Categoria</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: 'none' }}>
                <option>Todas</option>
                <option>Descarte de lixo</option>
                <option>Foco de mosquito</option>
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: 'none' }}>
                <option>Todos</option>
                <option>Em análise</option>
                <option>Validado</option>
                <option>Resolvido</option>
                <option>Cancelado</option>
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Ordenar por</label>
              <select value={ordem} onChange={(e) => setOrdem(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: 'none' }}>
                <option>Mais recente</option>
                <option>Mais antigo</option>
              </select>
            </div>
          </div>
        </div>

        {carregando && <p style={{ textAlign: 'center', color: '#555' }}>Carregando denúncias...</p>}

        {!carregando && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {denuncias.map((denuncia) => (
              <div 
                key={denuncia.id} 
                style={{ 
                  backgroundColor: 'white', 
                  padding: '15px', 
                  borderRadius: '15px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  cursor: 'pointer' 
                }}
                onClick={() => navigate(`/admin/denuncia/${denuncia.id}`)}
              >
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '70%' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'gray', display: 'block' }}>ID da Denúncia</span>
                    <strong style={{ fontSize: '0.9rem' }}>#{denuncia.id}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'gray', display: 'block' }}>Data</span>
                    <strong style={{ fontSize: '0.9rem' }}>{formatarData(denuncia.data_criacao)}</strong>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ fontSize: '0.8rem', color: 'gray', display: 'block' }}>Categoria</span>
                    <strong style={{ fontSize: '0.9rem', color: '#2C5E2E' }}>{denuncia.categoria}</strong>
                  </div>
                </div>

                <div>
                  <span style={{ 
                    backgroundColor: denuncia.status === 'Validado' ? '#2196F3' : (denuncia.status === 'Em análise' ? '#D98C3A' : '#F44336'), 
                    color: 'white', 
                    padding: '5px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    textAlign: 'center',
                    display: 'inline-block'
                  }}>
                    {denuncia.status}
                  </span>
                </div>

              </div>
            ))}

            {denuncias.length === 0 && (
              <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>Nenhuma denúncia encontrada.</p>
            )}
          </div>
        )}

      </main>
    </div>
  );
}