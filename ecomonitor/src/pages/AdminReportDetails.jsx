import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PageLayout from "../components/PageLayout/PageLayout";
import API_URL from "../config";

export default function AdminReportDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  
  const denunciaInicial = location.state?.denunciaSelecionada;

  const [denuncia, setDenuncia] = useState(denunciaInicial || null);
  const [carregando, setCarregando] = useState(!denunciaInicial);
  const [endereco, setEndereco] = useState(denunciaInicial?.endereco || "Buscando endereço...");
  
  const [novoStatus, setNovoStatus] = useState(denunciaInicial?.status || ''); 
  const [atualizando, setAtualizando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    const buscarDetalhesDenuncia = async () => {
      try {
        const resposta = await fetch(`${API_URL}/registros/${id}`);
        if (resposta.ok) {
          const dados = await resposta.json();
          setDenuncia(dados);
          setNovoStatus(dados.status);
        }
      } catch (erro) {
        console.error(erro);
      } finally {
        setCarregando(false);
      }
    };

    buscarDetalhesDenuncia();
  }, [id]); 

  useEffect(() => {
    if (denuncia?.latitude && denuncia?.longitude) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${denuncia.latitude}&lon=${denuncia.longitude}&zoom=18&addressdetails=1`)
        .then(res => res.json())
        .then(data => {
          if (data && data.address) {
            const rua = data.address.road || data.address.pedestrian || "Rua não identificada";
            const numero = data.address.house_number ? `, ${data.address.house_number}` : "";
            const bairro = data.address.suburb || data.address.neighbourhood ? ` - ${data.address.suburb || data.address.neighbourhood}` : "";
            setEndereco(`${rua}${numero}${bairro}`);
          } else {
            setEndereco("Endereço não encontrado");
          }
        })
        .catch(() => setEndereco("Erro ao buscar endereço"));
    } else if (!denuncia) {
      setEndereco("Localização não informada");
    }
  }, [denuncia?.latitude, denuncia?.longitude]);

  const confirmarAlteracao = async () => {
    setMensagem({ texto: '', tipo: '' });

    if (novoStatus === denuncia.status) {
      setMensagem({ texto: "O status selecionado já é o status atual!", tipo: 'erro' });
      return;
    }

    setAtualizando(true);
    try {
      const resposta = await fetch(`${API_URL}/registros/${id}/status?novo_status=${novoStatus}`, {        method: 'PUT',
      });

      if (resposta.ok) {
        setMensagem({ texto: "Status atualizado com sucesso!", tipo: 'sucesso' });
        setDenuncia({ ...denuncia, status: novoStatus });
        
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 1500); 
      } else {
        setMensagem({ texto: "Erro ao atualizar o status.", tipo: 'erro' });
      }
    // eslint-disable-next-line no-unused-vars
    } catch (erro) {
      setMensagem({ texto: "Erro na conexão com o servidor.", tipo: 'erro' });
    } finally {
      setAtualizando(false);
    }
  };

  const formatarData = (dataIso) => {
    if (!dataIso) return '';
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const obterCorStatus = (status) => {
    switch (status) {
      case 'Em análise':
        return '#D59A53'; 
      case 'Validado':
        return '#7FB04B'; 
      case 'Resolvido':
        return '#3B75A3'; 
      case 'Negado':
      case 'Cancelado':
        return '#D9534F'; 
      default:
        return '#6C757D'; 
    }
  };

  if (carregando && !denuncia) {
    return (
      <PageLayout isAdmin={true}>
        <div style={{ backgroundColor: "#F4F6F3", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p style={{ color: "#1C3520" }}>Carregando detalhes...</p>
        </div>
      </PageLayout>
    );
  }

  if (!denuncia) {
    return (
      <PageLayout isAdmin={true}>
        <div style={{ backgroundColor: "#F4F6F3", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p style={{ color: "#1C3520" }}>Registro não encontrado.</p>
        </div>
      </PageLayout>
    );
  }

  const urlFotoFinal = denuncia.foto_url
    ? denuncia.foto_url.startsWith('http') 
      ? denuncia.foto_url 
      : `${API_URL}/${denuncia.foto_url}`
    : null;

  const containerStyle = {
    backgroundColor: "#F4F6F3",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    paddingBottom: "900px", 
    fontFamily: "sans-serif"
  };

  const headerStyle = {
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #EBEBEB"
  };

  const backButtonStyle = {
    background: "none",
    border: "none",
    color: "#1C3520",
    fontSize: "24px",
    cursor: "pointer",
    padding: "0",
    display: "flex",
    alignItems: "center"
  };

  const headerTitleStyle = {
    margin: "0",
    color: "#1C3520",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1
  };

  const contentContainerStyle = {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  };

  const sectionTitleStyle = {
    color: "#1C3520",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 0 10px 0"
  };

  const greenCardStyle = {
    backgroundColor: "#F0F5ED",
    border: "1px solid #D3E0CD",
    borderRadius: "12px",
    padding: "15px"
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#1C3520",
    display: "block",
    marginBottom: "4px"
  };

  const valueStyle = {
    fontSize: "13px",
    color: "#444"
  };

  const selectStyle = {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#CDE3B9",
    color: "#1C3520",
    fontSize: "15px",
    fontWeight: "500",
    appearance: "none",
    outline: "none",
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%231C3520\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 15px center',
    backgroundSize: '16px'
  };

  const buttonStyle = {
    width: "100%",
    backgroundColor: atualizando ? "#666" : "#2D4627",
    color: "white",
    padding: "15px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "bold",
    fontSize: "16px",
    marginTop: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px"
  };

  return (
    <PageLayout isAdmin={true}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={containerStyle}>
        <div style={headerStyle}>
          <button style={backButtonStyle} onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#1C3520" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h2 style={headerTitleStyle}>Detalhes (adm)</h2>
          <div style={{ width: "24px" }}></div>
        </div>

        <div style={contentContainerStyle}>
          
          <div>
            <h3 style={sectionTitleStyle}>Informações do Registro</h3>
            <div style={greenCardStyle}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <span style={labelStyle}>Categoria</span>
                  <span style={valueStyle}>
                    {typeof denuncia.categoria === 'object' && denuncia.categoria !== null 
                      ? denuncia.categoria.nome 
                      : (denuncia.categoria || 'Não informada')}
                  </span>
                </div>
                <div>
                  <span style={labelStyle}>Data</span>
                  <span style={valueStyle}>{formatarData(denuncia.data_criacao)}</span>
                </div>
              </div>
              <div>
                <span style={labelStyle}>Descrição</span>
                <span style={valueStyle}>{denuncia.descricao || 'Nenhuma descrição informada'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <h3 style={sectionTitleStyle}>Foto</h3>
              {urlFotoFinal ? (
                <div 
                  style={{ position: "relative", cursor: "pointer", borderRadius: "12px", overflow: "hidden" }}
                  onClick={() => setModalAberto(true)}
                >
                  <img 
                    src={urlFotoFinal} 
                    alt="Foto da denúncia" 
                    style={{ width: "100%", height: "100px", objectFit: "cover", display: "block" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/120x100?text=Erro+na+Foto";
                    }}
                  />
                  <div style={styles.imageOverlayBadge}>Toque para ampliar</div>
                </div>
              ) : (
                <div style={{ width: "100%", height: "100px", backgroundColor: "#EBEBEB", borderRadius: "12px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <span style={{ color: "#888", fontSize: "12px", fontWeight: "bold" }}>Sem Foto</span>
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={sectionTitleStyle}>Endereço</h3>
              <div style={{ ...greenCardStyle, height: "100px", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", boxSizing: "border-box", overflow: "hidden" }}>
                <span style={{ fontSize: "12px", color: "#1C3520", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {typeof endereco === 'object' && endereco !== null 
                    ? `${endereco.logradouro || 'Rua não informada'}, ${endereco.numero || 'S/N'} - ${endereco.bairro || ''}, ${endereco.cidade || ''}`
                    : endereco}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={sectionTitleStyle}>Informações do Usuário</h3>
            <div style={{ ...greenCardStyle, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              <div>
                <span style={labelStyle}>Usuário</span>
                <span style={valueStyle}>{denuncia.usuario?.nome || 'Não identificado'}</span>
              </div>
              <div>
                <span style={labelStyle}>Cidade</span>
                <span style={valueStyle}>{denuncia.endereco?.cidade || 'Não informada'}</span>
              </div>
              <div>
                <span style={labelStyle}>Contribuições</span>
                <span style={valueStyle}>{denuncia.usuario?.contribuicoes ?? 0}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={sectionTitleStyle}>Ações Administrativas</h3>
            <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <h4 style={{ fontSize: "16px", color: "#1C3520", margin: "0 0 15px 0", fontWeight: "bold" }}>Alterar Status</h4>
              
              <div style={{ display: "flex", alignItems: "center", marginBottom: "15px", gap: "10px" }}>
                <span style={{ fontSize: "14px", color: "#444" }}>Status atual:</span>
                <span style={{ 
                  backgroundColor: obterCorStatus(denuncia.status), 
                  color: "white", 
                  padding: "4px 12px", 
                  borderRadius: "12px", 
                  fontWeight: "bold", 
                  fontSize: "12px"
                }}>
                  {denuncia.status || 'Em análise'}
                </span>
              </div>
              
              <span style={{ fontSize: "14px", color: "#444", display: "block", marginBottom: "8px" }}>Selecione o novo status:</span>
              <select 
                value={novoStatus} 
                onChange={(e) => setNovoStatus(e.target.value)}
                style={selectStyle}
              >
                <option value="Em análise">Em análise</option>
                <option value="Validado">Validado</option>
                <option value="Resolvido">Resolvido</option>
                <option value="Negado">Negado</option>
              </select>

              {mensagem.texto && (
                <div style={{ 
                  padding: "10px", 
                  marginTop: "15px", 
                  borderRadius: "8px", 
                  textAlign: "center",
                  fontSize: "13px",
                  fontWeight: "bold",
                  backgroundColor: mensagem.tipo === 'sucesso' ? '#E7F0DC' : '#FFF0F4',
                  color: mensagem.tipo === 'sucesso' ? '#1C3520' : '#D8000C'
                }}>
                  {mensagem.texto}
                </div>
              )}

              <button 
                onClick={confirmarAlteracao} 
                disabled={atualizando}
                style={{
                  ...buttonStyle,
                  opacity: atualizando ? 0.7 : 1,
                  cursor: atualizando ? "not-allowed" : "pointer"
                }}
              >
                {atualizando ? (
                  <div style={{
                    width: "18px",
                    height: "18px",
                    border: "3px solid rgba(255,255,255,0.3)",
                    borderTop: "3px solid white",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite"
                  }} />
                ) : "Confirmar alteração"}
              </button>
            </div>
          </div>

        </div>
      </div>

      {modalAberto && urlFotoFinal && (
        <div style={styles.modalOverlay} onClick={() => setModalAberto(false)}>
          <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalCloseBtn} onClick={() => setModalAberto(false)}>✖</button>
            <img src={urlFotoFinal} alt="Imagem completa" style={styles.modalImage} />
          </div>
        </div>
      )}
    </PageLayout>
  );
}

const styles = {
  imageOverlayBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.65)",
    color: "#fff",
    fontSize: "10px",
    textAlign: "center",
    padding: "4px 0",
    fontWeight: "bold"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3000, 
    padding: "20px",
    boxSizing: "border-box"
  },
  modalContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "100%",
    maxHeight: "90%"
  },
  modalImage: {
    maxWidth: "100%",
    maxHeight: "80vh",
    objectFit: "contain",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
  },
  modalCloseBtn: {
    position: "absolute",
    top: "-45px",
    right: "0px",
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    fontSize: "28px",
    cursor: "pointer",
    textShadow: "0 2px 4px rgba(0,0,0,0.5)"
  }
};