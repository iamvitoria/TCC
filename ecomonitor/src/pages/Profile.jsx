import React, { useState, useEffect, useRef } from "react"; 
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import API_URL from "../config";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 

  const [carregando, setCarregando] = useState(true);
  const [perfil, setPerfil] = useState({
    nome: "",
    email: "",
    pontuacao: 0,
    foto_perfil: null,
    posicao_ranking: "-",
    cidade_ranking: "Sua região", 
    denuncias: 0,
    conquistas: []
  });

  const [modalEditAberto, setModalEditAberto] = useState(false);
  const [modalInfoAberto, setModalInfoAberto] = useState(false);

  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCidade, setEditCidade] = useState(""); 

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [enviandoForm, setEnviandoForm] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ texto: "", tipo: "" });

  useEffect(() => {
    const buscarDadosPerfil = async () => {
      const token = sessionStorage.getItem("token") || localStorage.getItem("meuToken"); 
      
      if (!token) {
        navigate("/"); 
        return;
      }

      try {
        const respostaPerfil = await fetch(`${API_URL}/perfil`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (respostaPerfil.ok) {
          const dados = await respostaPerfil.json();
          
          let posicaoLocalCalculada = "-";

          try {
            const respostaRanking = await fetch(`${API_URL}/ranking`, {
              headers: { "Authorization": `Bearer ${token}` }
            });
            if (respostaRanking.ok) {
              const dadosRanking = await respostaRanking.json();
              const listaLocal = dadosRanking.local || [];
              
              const indexNoRankingLocal = listaLocal.findIndex(
                (item) => item.nome === dados.nome || item.email === dados.email
              );

              if (indexNoRankingLocal !== -1) {
                const itemLocal = listaLocal[indexNoRankingLocal];
                posicaoLocalCalculada = itemLocal.posicao || itemLocal.rank || itemLocal.ranking || (indexNoRankingLocal + 1);
              }
            }
          } catch (errRanking) {
            console.error("Erro ao calcular posição local pelo ranking:", errRanking);
          }

          const dadosCarregados = {
            nome: dados.nome || "Usuário",
            email: dados.email || "",
            pontuacao: dados.pontuacao || 0,
            foto_perfil: dados.foto_perfil || null,
            posicao_ranking: posicaoLocalCalculada !== "-" ? posicaoLocalCalculada : (dados.posicao_ranking || dados.posicao || "-"),
            cidade_ranking: dados.cidade || dados.regiao || "Sua cidade", 
            denuncias: dados.total_registros ?? 0,
            conquistas: dados.conquistas || []
          };

          setPerfil(dadosCarregados);

          setEditNome(dadosCarregados.nome);
          setEditEmail(dadosCarregados.email);
          setEditCidade(dadosCarregados.cidade_ranking);
        } else {
          if(respostaPerfil.status === 401) navigate("/");
        }
      } catch (erro) {
        console.error("Erro ao carregar perfil:", erro);
      } finally {
        setCarregando(false);
      }
    };

    buscarDadosPerfil();
  }, [navigate]);

  const handleTrocarFoto = async (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;
    const formData = new FormData();
    formData.append("foto", arquivo);
    const token = sessionStorage.getItem("token") || localStorage.getItem("meuToken");
    try {
      const resposta = await fetch(`${API_URL}/perfil/foto`,{
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });
      if (resposta.ok) {
        const dados = await resposta.json();
        setPerfil(prev => ({ ...prev, foto_perfil: dados.foto_perfil }));
      }
    } catch (erro) { console.error(erro); }
  };

  const handleSalvarPerfil = async () => {
    if (!editNome.trim() || !editEmail.trim() || !editCidade.trim()) {
      setStatusMsg({ texto: "Nome, e-mail e cidade são obrigatórios.", tipo: "erro" });
      return;
    }

    if ((senhaAtual && !novaSenha) || (!senhaAtual && novaSenha)) {
      setStatusMsg({ texto: "Para alterar a senha, preencha a senha atual e a nova senha.", tipo: "erro" });
      return;
    }

    setEnviandoForm(true);
    setStatusMsg({ texto: "", tipo: "" });
    const token = sessionStorage.getItem("token") || localStorage.getItem("meuToken");

    try {
      // 1. Atualizar Dados do Perfil
      const respostaPerfil = await fetch(`${API_URL}/perfil/editar`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          nome: editNome,
          email: editEmail,
          cidade: editCidade 
        })
      });

      if (!respostaPerfil.ok) {
        const dadosErro = await respostaPerfil.json();
        throw new Error(dadosErro.detail || "Erro ao atualizar dados do perfil.");
      }

      // 2. Se informou senhas, atualizar a senha também
      if (senhaAtual && novaSenha) {
        const respostaSenha = await fetch(`${API_URL}/perfil/senha`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ senha_atual: senhaAtual, nova_senha: novaSenha })
        });

        if (!respostaSenha.ok) {
          const dadosErro = await respostaSenha.json();
          throw new Error(dadosErro.detail || "Perfil atualizado, mas erro ao alterar a senha.");
        }
      }

      setPerfil(prev => ({ 
        ...prev, 
        nome: editNome, 
        email: editEmail, 
        cidade_ranking: editCidade 
      }));

      setStatusMsg({ texto: "Perfil atualizado com sucesso!", tipo: "sucesso" });
      setSenhaAtual("");
      setNovaSenha("");
      
      setTimeout(() => {
        setModalEditAberto(false);
        setStatusMsg({ texto: "", tipo: "" });
      }, 1500);

    } catch (error) {
      setStatusMsg({ texto: error.message || "Erro na conexão com o servidor.", tipo: "erro" });
    } finally {
      setEnviandoForm(false);
    }
  };

  const abrirModalEdit = () => {
    setStatusMsg({ texto: "", tipo: "" });
    setEditNome(perfil.nome);
    setEditEmail(perfil.email);
    setEditCidade(perfil.cidade_ranking);
    setSenhaAtual("");
    setNovaSenha("");
    setModalEditAberto(true);
  };

  const fazerLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("meuToken"); 
    navigate("/");
  };

  const styles = {
    container: { display: "flex", flexDirection: "column", height: "100vh", overflowY: "auto", backgroundColor: "#1C3520", boxSizing: "border-box" },
    topSection: { display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 20px 30px 20px", width: "100%", boxSizing: "border-box" },
    blob: { width: "140px", height: "140px", backgroundColor: "#7FB04B", borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "15px", position: "relative", cursor: "pointer", overflow: "hidden" },
    profilePic: { width: "100%", height: "100%", objectFit: "cover" },
    name: { color: "white", fontSize: "22px", fontWeight: "bold", margin: "0 0 5px 0", textAlign: "center" },
    location: { color: "#7FB04B", fontSize: "18px", margin: "0 0 20px 0", fontWeight: "normal", textAlign: "center" },
    progressBg: { width: "100%", maxWidth: "320px", height: "8px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "4px", marginBottom: "25px", overflow: "hidden" },
    progressFill: { width: `${Math.min((perfil.pontuacao / 5050) * 100, 100)}%`, height: "100%", backgroundColor: "#7FB04B", borderRadius: "4px", transition: "width 0.5s ease-in-out" },
    statsRow: { display: "flex", gap: "10px", width: "100%", maxWidth: "320px" },
    statCard: { backgroundColor: "#2D4627", borderRadius: "10px", padding: "15px 5px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
    statValue: { color: "white", fontSize: "20px", fontWeight: "bold", marginBottom: "5px" },
    statLabel: { color: "white", fontSize: "10px", fontWeight: "300", textAlign: "center" },
    bottomSection: { backgroundColor: "white", borderTopLeftRadius: "25px", borderTopRightRadius: "25px", flex: 1, width: "100%", padding: "25px 20px 140px 20px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "15px" },
    achievementsTitle: { margin: 0, fontSize: "16px", color: "#1C3520", fontWeight: "bold" },
    achievementCard: { backgroundColor: "#E7F0DC", borderRadius: "10px", padding: "15px", flex: 1, textAlign: "center", color: "#1C3520", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70px" },
    btnEdit: { width: "100%", padding: "15px", borderRadius: "10px", fontSize: "18px", backgroundColor: "#1C3520", color: "white", border: "none", cursor: "pointer" },
    btnInfo: { width: "100%", padding: "15px", borderRadius: "10px", fontSize: "16px", backgroundColor: "#E7F0DC", color: "#1C3520", border: "none", cursor: "pointer", fontWeight: "600" },
    btnLogout: { width: "100%", padding: "15px", borderRadius: "10px", fontSize: "18px", backgroundColor: "#FFF0F4", color: "#D8000C", border: "none", cursor: "pointer" },
    overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" },
    modal: { backgroundColor: "white", borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "380px", maxHeight: "85vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px", boxSizing: "border-box" },
    modalTitle: { margin: "0 0 5px 0", fontSize: "20px", color: "#1C3520", fontWeight: "bold" },
    sectionDivider: { borderTop: "1px solid #E5E7EB", margin: "10px 0 5px 0", paddingTop: "10px", fontWeight: "bold", fontSize: "13px", color: "#1C3520" },
    fieldGroup: { display: "flex", flexDirection: "column", gap: "4px" },
    fieldLabel: { fontSize: "12px", fontWeight: "bold", color: "#1C3520" },
    input: { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "15px", boxSizing: "border-box", outline: "none", color: "#333" },
    modalButtons: { display: "flex", gap: "10px", marginTop: "10px" },
    btnCancel: { flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: "#f9f9f9", color: "#333", fontSize: "16px", fontWeight: "600", cursor: "pointer" },
    btnSave: { flex: 1, padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#1C3520", color: "white", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" },
    infoBox: { fontSize: "14px", color: "#333", lineHeight: "1.5", display: "flex", flexDirection: "column", gap: "12px" },
    infoItem: { backgroundColor: "#F4F6F3", padding: "12px", borderRadius: "8px", borderLeft: "4px solid #7FB04B" }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes modalSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .modal-spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: #fff; animation: modalSpin 0.8s linear infinite; }
      `}</style>

      <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={handleTrocarFoto} />

      <div style={styles.topSection}>
        <div style={styles.blob} onClick={() => fileInputRef.current.click()}>
          {perfil.foto_perfil ? (
            <img src={perfil.foto_perfil} alt="Perfil" style={styles.profilePic} />
          ) : (
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#1C3520" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>

        <h2 style={styles.name}>{carregando ? "Carregando..." : perfil.nome}</h2>
        <h3 style={styles.location}>{carregando ? "..." : perfil.cidade_ranking}</h3>

        <div style={styles.progressBg}>
          <div style={{ ...styles.progressFill, width: `${Math.min((perfil.pontuacao / 5050) * 100, 100)}%` }}></div>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{perfil.denuncias}</span>
            <span style={styles.statLabel}>Registro(s)</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>
              {perfil.posicao_ranking}{!isNaN(perfil.posicao_ranking) && perfil.posicao_ranking !== "-" ? "º" : ""}
            </span>
            <span style={styles.statLabel}>Ranking local</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{perfil.pontuacao}</span>
            <span style={styles.statLabel}>Pontos</span>
          </div>
        </div>
      </div>

      <div style={styles.bottomSection}>
        <div onClick={() => navigate('/conquistas')} style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
          <h3 style={styles.achievementsTitle}>Últimas conquistas</h3>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C3520" strokeWidth="2"><path d="M9 18L15 12L9 6"/></svg>
        </div>

        <div style={{display: 'flex', gap: '15px'}}>
          {perfil.conquistas.length > 0 ? (
            perfil.conquistas.slice(-2).map((c, i) => (
              <div key={i} style={styles.achievementCard}>
                {typeof c === 'string' ? c : c.nome}
              </div>
            ))
          ) : (
            <div style={{...styles.achievementCard, backgroundColor: "#F4F6F3", color: "#666"}}>
              Nenhuma conquista
            </div>
          )}
        </div>

        <button style={styles.btnEdit} onClick={abrirModalEdit}>Editar perfil</button>
        <button style={styles.btnInfo} onClick={() => setModalInfoAberto(true)}>Para onde vai seu registro?</button>
        <button style={styles.btnLogout} onClick={fazerLogout}>Sair</button>
      </div>
      
      <Navbar isAdmin={false} />

      {/* Modal de Editar Perfil (Com opção de Alterar Senha inclusa) */}
      {modalEditAberto && (
        <div style={styles.overlay} onClick={() => !enviandoForm && setModalEditAberto(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Editar Perfil</h3>
            
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>Nome</label>
              <input 
                type="text" 
                style={styles.input} 
                value={editNome}
                onChange={(e) => setEditNome(e.target.value)}
                disabled={enviandoForm}
                placeholder="Seu nome"
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>E-mail</label>
              <input 
                type="email" 
                style={styles.input} 
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                disabled={enviandoForm}
                placeholder="Seu e-mail"
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>Cidade</label>
              <input 
                type="text" 
                style={styles.input} 
                value={editCidade}
                onChange={(e) => setEditCidade(e.target.value)}
                disabled={enviandoForm}
                placeholder="Sua cidade"
              />
            </div>

            <div style={styles.sectionDivider}>Alterar Senha (opcional)</div>

            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>Senha Atual</label>
              <input 
                type="password" 
                style={styles.input} 
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                disabled={enviandoForm}
                placeholder="Preencha apenas se quiser alterar"
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>Nova Senha</label>
              <input 
                type="password" 
                style={styles.input} 
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                disabled={enviandoForm}
                placeholder="Nova senha"
              />
            </div>

            {statusMsg.texto && (
              <span style={{ 
                fontSize: "14px", 
                fontWeight: "600", 
                textAlign: "center",
                color: statusMsg.tipo === "sucesso" ? "#2D4627" : "#D8000C" 
              }}>
                {statusMsg.texto}
              </span>
            )}

            <div style={styles.modalButtons}>
              <button style={styles.btnCancel} onClick={() => setModalEditAberto(false)} disabled={enviandoForm}>
                Cancelar
              </button>
              <button style={styles.btnSave} onClick={handleSalvarPerfil} disabled={enviandoForm}>
                {enviandoForm ? <div className="modal-spinner"></div> : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Informativo: Para Onde Vai Seu Registro */}
      {modalInfoAberto && (
        <div style={styles.overlay} onClick={() => setModalInfoAberto(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Para Onde Vai Seu Registro?</h3>
            
            <div style={styles.infoBox}>
              <div style={styles.infoItem}>
                <strong>🏢 Órgãos de Fiscalização Ambiental:</strong>
                <p style={{ margin: "4px 0 0 0" }}>
                  Os registros e denúncias são consolidados e direcionados aos órgãos públicos competentes responsáveis pela fiscalização da sua região.
                </p>
              </div>

              <div style={styles.infoItem}>
                <strong>📊 Gestão e Monitoramento Urbano:</strong>
                <p style={{ margin: "4px 0 0 0" }}>
                  As informações alimentam o sistema de dados ambientais, auxiliando gestores públicos no planejamento de intervenções e tomada de decisão.
                </p>
              </div>

              <div style={styles.infoItem}>
                <strong>🌱 Incentivo a Práticas Sustentáveis:</strong>
                <p style={{ margin: "4px 0 0 0" }}>
                  Cada registro contribui para mapear ocorrências, engajar a comunidade local e promover a conscientização e sustentabilidade.
                </p>
              </div>
            </div>

            <button 
              style={{ ...styles.btnEdit, marginTop: "10px" }} 
              onClick={() => setModalInfoAberto(false)}
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;