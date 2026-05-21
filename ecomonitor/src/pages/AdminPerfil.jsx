import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import API_URL from "../config";

export default function AdminPerfil() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 

  const [carregandoFoto, setCarregandoFoto] = useState(false);
  const [enviandoEdit, setEnviandoEdit] = useState(false);
  
  const [modalEditAberto, setModalEditAberto] = useState(false);
  const [modalSenhaAberto, setModalSenhaAberto] = useState(false);

  const [adminData, setAdminData] = useState({
    nome: "Carregando...",
    cargo: "", 
    regiao: "",
    email: "", 
    foto_perfil: null,
    estatisticas: {
      resolvidas: "-",
      pendentes: "-"
    }
  });

  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCargo, setEditCargo] = useState("");
  const [editRegiao, setEditRegiao] = useState("");
  
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const buscarPerfil = async () => {
    const token = localStorage.getItem("token") || localStorage.getItem("meuToken");
    
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const resposta = await fetch(`${API_URL}/perfil`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        
        setAdminData({
          nome: dados.nome || "Administrador",
          email: dados.email || "",
          cargo: dados.cargo || "", 
          regiao: dados.regiao || dados.cidade || "Santa Maria",
          foto_perfil: dados.foto_perfil 
            ? (dados.foto_perfil.startsWith('http') ? dados.foto_perfil : `${API_URL}/${dados.foto_perfil}`)
            : null,
          estatisticas: {
            resolvidas: dados.estatisticas?.resolvidas ?? 0,
            pendentes: dados.estatisticas?.pendentes ?? 0
          }
        });
      }
    } catch (erro) {
      console.error("Erro ao buscar perfil do admin:", erro);
    }
  };

  useEffect(() => {
    buscarPerfil();
  }, [navigate]);

  const handleFotoClick = () => {
    if (!carregandoFoto) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    setCarregandoFoto(true);
    const formData = new FormData();
    formData.append("foto", arquivo);

    const token = localStorage.getItem("token") || localStorage.getItem("meuToken");

    try {
      const resposta = await fetch(`${API_URL}/perfil/foto`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (resposta.ok) {
        buscarPerfil();
      } else {
        alert("Erro ao enviar a foto.");
      }
    } catch (erro) {
      console.error("Erro no upload:", erro);
    } finally {
      setCarregandoFoto(false);
    }
  };

  const abrirModalEdicao = () => {
    setStatusMsg("");
    setEditNome(adminData.nome);
    setEditEmail(adminData.email);
    setEditCargo(adminData.cargo);
    setEditRegiao(adminData.regiao);
    setModalEditAberto(true);
  };

  const handleSalvarEdicao = async () => {
    if (!editNome || !editEmail || !editCargo || !editRegiao) {
      setStatusMsg("Todos os campos são obrigatórios.");
      return;
    }

    setEnviandoEdit(true);
    const token = localStorage.getItem("token") || localStorage.getItem("meuToken");

    try {
      const resposta = await fetch(`${API_URL}/perfil/editar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          nome: editNome, 
          email: editEmail, 
          cargo: editCargo, 
          cidade: editRegiao 
        })
      });

      if (resposta.ok) {
        setStatusMsg("Perfil atualizado com sucesso.");
        setAdminData(prev => ({
          ...prev,
          nome: editNome,
          email: editEmail,
          cargo: editCargo,
          regiao: editRegiao
        }));
        
        setTimeout(() => {
          setModalEditAberto(false);
          setStatusMsg("");
        }, 1200);
      } else {
        const resultado = await resposta.json();
        setStatusMsg(resultado.detail || "Erro ao salvar alterações.");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (erro) {
      setStatusMsg("Erro de conexão com o servidor.");
    } finally {
      setEnviandoEdit(false);
    }
  };

  const abrirModalSenha = () => {
    setStatusMsg("");
    setSenhaAtual("");
    setNovaSenha("");
    setModalSenhaAberto(true);
  };

  const handleSalvarSenha = async () => {
    if (!senhaAtual || !novaSenha) {
      setStatusMsg("Preencha ambos os campos.");
      return;
    }

    setEnviandoEdit(true);
    const token = localStorage.getItem("token") || localStorage.getItem("meuToken");

    try {
      const resposta = await fetch(`${API_URL}/perfil/senha`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ senha_atual: senhaAtual, nova_senha: novaSenha })
      });

      const resultado = await resposta.json();

      if (resposta.ok) {
        setStatusMsg("Senha alterada com sucesso.");
        setTimeout(() => {
          setModalSenhaAberto(false);
          setStatusMsg("");
        }, 1200);
      } else {
        setStatusMsg(resultado.detail || "Senha atual incorreta.");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (erro) {
      setStatusMsg("Erro de conexão com o servidor.");
    } finally {
      setEnviandoEdit(false);
    }
  };

  const handleSair = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.container}>
      {/* Estilos globais injetados para a animação do spinner nos botões de salvar */}
      <style>{`
        @keyframes modalSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .modal-spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: #fff; animation: modalSpin 0.8s linear infinite; }
      `}</style>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={handleFileChange}
      />

      <div style={styles.topSection}>
        <div style={styles.blob} onClick={handleFotoClick} title="Clique para mudar a foto">
          {adminData.foto_perfil ? (
            <img src={adminData.foto_perfil} alt="perfil" style={styles.foto} />
          ) : (
            <div style={styles.fotoPlaceholder}>
              {carregandoFoto ? "..." : ""}
            </div>
          )}
        </div>

        <h2 style={styles.nome}>{adminData.nome}</h2>

        <div style={styles.infoRow}>
          <span>{adminData.cargo}</span>
          <span>{adminData.regiao}</span>
        </div>
      </div>

      <div style={styles.bottomSection}>
        
        <h3 style={styles.sectionTitle}>Registros</h3>

        <div style={styles.statsRow}>
          <div style={styles.card}>
            <strong style={styles.cardNumber}>{adminData.estatisticas.resolvidas}</strong>
            <span style={styles.cardLabel}>Resolvido(s)</span>
          </div>

          <div style={styles.card}>
            <strong style={styles.cardNumber}>{adminData.estatisticas.pendentes}</strong>
            <span style={styles.cardLabel}>Pendente(s)</span>
          </div>
        </div>

        <button style={styles.btnPrimary} onClick={abrirModalEdicao}>
          Editar perfil
        </button>
        
        <button style={styles.btnSecondary} onClick={abrirModalSenha}>
          Mudar senha
        </button>
        
        <button style={styles.btnLogout} onClick={handleSair}>
          Sair
        </button>

      </div>

      {modalEditAberto && (
        <div style={styles.overlayModal} onClick={() => !enviandoEdit && setModalEditAberto(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Editar Perfil Admin</h3>
            
            <label style={styles.modalLabel}>Nome Completo</label>
            <input type="text" value={editNome} onChange={e => setEditNome(e.target.value)} style={styles.modalInput} disabled={enviandoEdit} />
            
            <label style={styles.modalLabel}>E-mail</label>
            <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} style={styles.modalInput} disabled={enviandoEdit} />

            <label style={styles.modalLabel}>Cargo / Função</label>
            <input type="text" value={editCargo} onChange={e => setEditCargo(e.target.value)} style={styles.modalInput} disabled={enviandoEdit} />

            <label style={styles.modalLabel}>Cidade / Região</label>
            <input type="text" value={editRegiao} onChange={e => setEditRegiao(e.target.value)} style={styles.modalInput} disabled={enviandoEdit} />

            {statusMsg && <p style={styles.modalStatus}>{statusMsg}</p>}

            <div style={styles.modalButtonGroup}>
              <button onClick={() => !enviandoEdit && setModalEditAberto(false)} style={styles.modalBtnVoltar} type="button">Voltar</button>
              <button onClick={handleSalvarEdicao} style={styles.modalBtnSalvar} type="button" disabled={enviandoEdit}>
                {enviandoEdit ? <div className="modal-spinner"></div> : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalSenhaAberto && (
        <div style={styles.overlayModal} onClick={() => !enviandoEdit && setModalSenhaAberto(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Alterar Senha</h3>
            
            <label style={styles.modalLabel}>Senha Atual</label>
            <input type="password" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} style={styles.modalInput} disabled={enviandoEdit} />

            <label style={styles.modalLabel}>Nova Senha</label>
            <input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} style={styles.modalInput} disabled={enviandoEdit} />

            {statusMsg && <p style={styles.modalStatus}>{statusMsg}</p>}

            <div style={styles.modalButtonGroup}>
              <button onClick={() => !enviandoEdit && setModalSenhaAberto(false)} style={styles.modalBtnVoltar} type="button">Voltar</button>
              <button onClick={handleSalvarSenha} style={styles.modalBtnSalvar} type="button" disabled={enviandoEdit}>
                {enviandoEdit ? <div className="modal-spinner"></div> : "Alterar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar isAdmin={true} />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflowY: "auto",
    backgroundColor: "#1C3520"
  },
  topSection: {
    padding: "40px 20px 30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#7FB04B"
  },
  role: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: '500'
  },
  blob: {
    width: 140,
    height: 140,
    backgroundColor: "#7FB04B",
    borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    cursor: "pointer",
    overflow: "hidden",
    border: "4px solid #7FB04B"
  },
  foto: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  fotoPlaceholder: {
    fontSize: "40px",
    color: "white",
    fontWeight: "bold"
  },
  nome: {
    color: "white",
    fontSize: 22,
    margin: "5px 0",
    fontWeight: "bold"
  },
  infoRow: {
    display: "flex",
    gap: 30,
    color: "#7FB04B",
    fontSize: 16
  },
  bottomSection: {
    backgroundColor: "#F4F6F3",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: "30px 25px 120px",
    display: "flex",
    flexDirection: "column",
    gap: 15,
    flex: 1
  },
  sectionTitle: {
    color: "#2D4627",
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "5px"
  },
  statsRow: {
    display: "flex",
    gap: 15
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: "20px 15px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
  },
  cardNumber: {
    fontSize: "26px",
    color: "#2D4627",
    fontWeight: "bold",
    display: "block"
  },
  cardLabel: {
    fontSize: "11px",
    color: "#888",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: "4px"
  },
  btnPrimary: {
    backgroundColor: "#2D4627",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px"
  },
  btnSecondary: {
    backgroundColor: "#DCE8D5",
    color: "#2D4627",
    border: "none",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontWeight: "bold",
    cursor: "pointer"
  },
  btnLogout: {
    backgroundColor: "#F2DADA",
    color: "#A80000",
    border: "none",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontWeight: "bold",
    cursor: "pointer"
  },
  overlayModal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px"
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 360,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D4627",
    margin: "0 0 15px 0",
    textAlign: "center"
  },
  modalLabel: {
    fontSize: 12,
    color: "#555",
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 8
  },
  modalInput: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none"
  },
  modalStatus: {
    fontSize: "14px",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500"
  },
  modalButtonGroup: {
    display: "flex",
    gap: 10,
    marginTop: 20
  },
  modalBtnVoltar: {
    flex: 1,
    backgroundColor: "white",
    color: "#666",
    border: "1px solid #ccc",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  modalBtnSalvar: {
    flex: 1,
    backgroundColor: "#2D4627",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};