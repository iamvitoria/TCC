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
  const [modalSenhaAberto, setModalSenhaAberto] = useState(false);

  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCidade, setEditCidade] = useState(""); 

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [enviandoForm, setEnviandoForm] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ texto: "", tipo: "" });

  useEffect(() => {
    const buscarPerfil = async () => {
      const token = sessionStorage.getItem("token") || localStorage.getItem("meuToken"); 
      
      if (!token) {
        navigate("/"); 
        return;
      }

      try {
        const resposta = await fetch(`${API_URL}/perfil`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (resposta.ok) {
          const dados = await resposta.json();
          
          const dadosCarregados = {
            nome: dados.nome || "Usuário",
            email: dados.email || "",
            pontuacao: dados.pontuacao || 0,
            foto_perfil: dados.foto_perfil || null,
            posicao_ranking: dados.posicao_ranking || "-",
            cidade_ranking: dados.cidade || dados.regiao || "Sua cidade", 
            denuncias: dados.total_denuncias ?? dados.denuncias ?? 0,
            conquistas: dados.conquistas || []
          };

          setPerfil(dadosCarregados);

          setEditNome(dadosCarregados.nome);
          setEditEmail(dadosCarregados.email);
          setEditCidade(dadosCarregados.cidade_ranking);
        } else {
          if(resposta.status === 401) navigate("/");
        }
      } catch (erro) {
        console.error("Erro ao carregar perfil:", erro);
      } finally {
        setCarregando(false);
      }
    };

    buscarPerfil();
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
      setStatusMsg({ texto: "Todos os campos são obrigatórios.", tipo: "erro" });
      return;
    }

    setEnviandoForm(true);
    setStatusMsg({ texto: "", tipo: "" });
    const token = sessionStorage.getItem("token") || localStorage.getItem("meuToken");

    try {
      const resposta = await fetch(`${API_URL}/perfil/editar`, {
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

      if (resposta.ok) {
        setPerfil(prev => ({ 
          ...prev, 
          nome: editNome, 
          email: editEmail, 
          cidade_ranking: editCidade 
        }));
        setStatusMsg({ texto: "Perfil atualizado com sucesso!", tipo: "sucesso" });
        
        setTimeout(() => {
          setModalEditAberto(false);
          setStatusMsg({ texto: "", tipo: "" });
        }, 1500);
      } else {
        const dadosErro = await resposta.json();
        setStatusMsg({ texto: dadosErro.detail || "Erro ao atualizar perfil.", tipo: "erro" });
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setStatusMsg({ texto: "Erro na conexão com o servidor.", tipo: "erro" });
    } finally {
      setEnviandoForm(false);
    }
  };

  const handleMudarSenha = async () => {
    if (!senhaAtual || !novaSenha) {
      setStatusMsg({ texto: "Preencha todos os campos de senha.", tipo: "erro" });
      return;
    }

    setEnviandoForm(true);
    setStatusMsg({ texto: "", tipo: "" });
    const token = sessionStorage.getItem("token") || localStorage.getItem("meuToken");

    try {
      const resposta = await fetch(`${API_URL}/perfil/senha`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ senha_atual: senhaAtual, nova_senha: novaSenha })
      });

      if (resposta.ok) {
        setStatusMsg({ texto: "Senha alterada com sucesso!", tipo: "sucesso" });
        setSenhaAtual("");
        setNovaSenha("");
        setTimeout(() => {
          setModalSenhaAberto(false);
          setStatusMsg({ texto: "", tipo: "" });
        }, 1500);
      } else {
        const dadosErro = await resposta.json();
        setStatusMsg({ texto: dadosErro.detail || "Erro ao alterar senha.", tipo: "erro" });
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setStatusMsg({ texto: "Erro na conexão com o servidor.", tipo: "erro" });
    } finally {
      setEnviandoForm(false);
    }
  };

  const abrirModalEdit = () => {
    setStatusMsg({ texto: "", tipo: "" });
    setEditNome(perfil.nome);
    setEditEmail(perfil.email);
    setEditCidade(perfil.cidade_ranking);
    setModalEditAberto(true);
  };

  const abrirModalSenha = () => {
    setStatusMsg({ texto: "", tipo: "" });
    setSenhaAtual("");
    setNovaSenha("");
    setModalSenhaAberto(true);
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
    btnPass: { width: "100%", padding: "15px", borderRadius: "10px", fontSize: "18px", backgroundColor: "#E7F0DC", color: "#1C3520", border: "none", cursor: "pointer" },
    btnLogout: { width: "100%", padding: "15px", borderRadius: "10px", fontSize: "18px", backgroundColor: "#FFF0F4", color: "#D8000C", border: "none", cursor: "pointer" },
    overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" },
    modal: { backgroundColor: "white", borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "14px", boxSizing: "border-box" },
    modalTitle: { margin: "0 0 5px 0", fontSize: "20px", color: "#1C3520", fontWeight: "bold" },
    fieldGroup: { display: "flex", flexDirection: "column", gap: "4px" },
    fieldLabel: { fontSize: "12px", fontWeight: "bold", color: "#1C3520" },
    input: { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px", boxSizing: "border-box", outline: "none", color: "#333" },
    modalButtons: { display: "flex", gap: "10px", marginTop: "10px" },
    btnCancel: { flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: "#f9f9f9", color: "#333", fontSize: "16px", fontWeight: "600", cursor: "pointer" },
    btnSave: { flex: 1, padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#1C3520", color: "white", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }
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
            <span style={styles.statValue}>{perfil.posicao_ranking}º</span>
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
        <button style={styles.btnPass} onClick={abrirModalSenha}>Mudar senha</button>
        <button style={styles.btnLogout} onClick={fazerLogout}>Sair</button>
      </div>
      
      <Navbar isAdmin={false} />

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
                placeholder="Carregando nome..."
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
                placeholder="Carregando e-mail..."
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
                placeholder="Carregando cidade..."
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

      {modalSenhaAberto && (
        <div style={styles.overlay} onClick={() => !enviandoForm && setModalSenhaAberto(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Alterar Senha</h3>
            
            <input 
              type="password" 
              style={styles.input} 
              placeholder="Senha atual"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              disabled={enviandoForm}
            />

            <input 
              type="password" 
              style={styles.input} 
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              disabled={enviandoForm}
            />

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
              <button style={styles.btnCancel} onClick={() => setModalSenhaAberto(false)} disabled={enviandoForm}>
                Cancelar
              </button>
              <button style={styles.btnSave} onClick={handleMudarSenha} disabled={enviandoForm}>
                {enviandoForm ? <div className="modal-spinner"></div> : "Alterar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;