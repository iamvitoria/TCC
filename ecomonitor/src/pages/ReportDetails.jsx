import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLayout from "../components/PageLayout/PageLayout";
import Navbar from "../components/Navbar/Navbar.jsx";
import API_URL from "../config";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const spinnerStyle = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
  }
`;

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const ReportDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  const [currentDenuncia, setCurrentDenuncia] = useState(
      location.state?.registroSelecionado
  );
  const [historicoReal, setHistoricoReal] = useState([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(true);
  const [enderecoExibido, setEnderecoExibido] = useState(currentDenuncia?.endereco || "Buscando localização...");

  const [editando, setEditando] = useState(false);
  const [categorias, setCategorias] = useState([]); 
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [endereco, setEndereco] = useState("");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  
  const [modalAberto, setModalAberto] = useState(false);

  // 1. Busca categorias do banco ao carregar a página
  useEffect(() => {
    const buscarCategorias = async () => {
      try {
        const response = await fetch(`${API_URL}/categorias`);
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };
    buscarCategorias();
  }, []);

  // 2. Preenche os estados iniciais quando a denúncia for carregada
  useEffect(() => {
    if (currentDenuncia) {
      const catIdInicial = typeof currentDenuncia.categoria === 'object' && currentDenuncia.categoria !== null
        ? currentDenuncia.categoria.id 
        : (currentDenuncia.categoria_id || currentDenuncia.categoria || "");
        
      setCategoria(catIdInicial);
      setDescricao(currentDenuncia.descricao || currentDenuncia.relato || "");
      
      // ✅ FORMATA PARA TEXTO ANTES DE COLOCAR NO INPUT
      const endFormatado = typeof currentDenuncia.endereco === 'object' && currentDenuncia.endereco !== null
        ? `${currentDenuncia.endereco.logradouro || ""}, ${currentDenuncia.endereco.numero || ""}`
        : (currentDenuncia.endereco || "");
      setEndereco(endFormatado);
      
      setPreview(currentDenuncia.foto_url || currentDenuncia.foto || null);
    }
  }, [currentDenuncia]);

  useEffect(() => {
    const buscarHistorico = async () => {
      if (!currentDenuncia?.id) return;
      try {
        // CORREÇÃO DE ROTA: Atualizando de denúncias para registros conforme nova API
        const response = await fetch(`${API_URL}/registros/${currentDenuncia.id}/historico`);
        if (response.ok) {
          const data = await response.json();
          setHistoricoReal(data);
        }
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setCarregandoHistorico(false);
      }
    };
    buscarHistorico();
  }, [currentDenuncia?.id]);

  useEffect(() => {
    if (!currentDenuncia?.endereco && currentDenuncia?.latitude && currentDenuncia?.longitude) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentDenuncia.latitude}&lon=${currentDenuncia.longitude}&zoom=18&addressdetails=1`)
        .then(res => res.json())
        .then(data => {
          if (data && data.address) {
            const rua = data.address.road || data.address.pedestrian || "Rua não identificada";
            const numero = data.address.house_number ? `, ${data.address.house_number}` : "";
            const bairro = data.address.suburb || data.address.neighbourhood ? ` - ${data.address.suburb || data.address.neighbourhood}` : "";
            const textoFinal = `${rua}${numero}${bairro}`;
            setEnderecoExibido(textoFinal);
            setEndereco(textoFinal);
          }
        })
        .catch(() => setEnderecoExibido("Endereço indisponível"));
    }
  }, [currentDenuncia]);

  if (!currentDenuncia) return null;

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSalvarEdicao = async () => {
    setMensagem({ texto: "", tipo: "" });
    const token = sessionStorage.getItem("token");

    if (!token) {
      setMensagem({ texto: "Você precisa estar logado!", tipo: "erro" });
      return;
    }

    setSalvando(true);
    const formData = new FormData();
    formData.append("categoria_id", categoria); 
    formData.append("descricao", descricao);
    formData.append("endereco", endereco);
    if (foto) {
      formData.append("foto", foto);
    }

    try {
      // CORREÇÃO DE ROTA: Ajustando endpoint para registros se aplicável
      const endpoint = `${API_URL}/registros/${currentDenuncia.id}`;
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const dadosAtualizados = await response.json();
        
        setCurrentDenuncia(prev => ({
          ...prev,
          ...dadosAtualizados.registro, // Assumindo que o back retorna "registro" agora
          foto_url: foto ? preview : (prev.foto_url || prev.foto)
        }));

        setMensagem({ texto: "Registro atualizado com sucesso!", tipo: "sucesso" });
        setTimeout(() => {
          setEditando(false);
          setMensagem({ texto: "", tipo: "" });
        }, 1500);
      } else {
        const erroData = await response.json();
        const msgErro = Array.isArray(erroData.detail) 
            ? "Erro de validação: Verifique os dados enviados." 
            : (erroData.detail || "Erro ao atualizar o registro.");
            
        setMensagem({ texto: msgErro, tipo: "erro" });
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMensagem({ texto: "Erro de conexão com o servidor.", tipo: "erro" });
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelar = () => {
    const catIdInicial = typeof currentDenuncia.categoria === 'object' && currentDenuncia.categoria !== null
      ? currentDenuncia.categoria.id 
      : (currentDenuncia.categoria_id || currentDenuncia.categoria || "");
      
    setCategoria(catIdInicial);
    setDescricao(currentDenuncia.descricao || currentDenuncia.relato || "");
    setEndereco(currentDenuncia.endereco || enderecoExibido);
    setFoto(null);
    setPreview(currentDenuncia.foto_url || currentDenuncia.foto || null);
    setMensagem({ texto: "", tipo: "" });
    setEditando(false);
  };

  // 3. CORREÇÃO: Trata se a categoria for um objeto para evitar o erro do React Child
  const obterNomeDaCategoria = () => {
    // Se a categoria já vier do backend como o objeto { id, nome }
    if (typeof currentDenuncia.categoria === 'object' && currentDenuncia.categoria !== null) {
      return currentDenuncia.categoria.nome;
    }

    // Se já carregou do /categorias
    if (categorias.length > 0) {
      const catEncontrada = categorias.find(
        (c) => String(c.id) === String(currentDenuncia.categoria_id) || String(c.nome) === String(currentDenuncia.categoria)
      );
      if (catEncontrada) return catEncontrada.nome;
    }
    
    // Fallback: garante que se passar daqui, é string. Se for objeto e caiu aqui por bug, força string para não quebrar a tela
    return currentDenuncia.categoria_nome || 
           (typeof currentDenuncia.categoria === 'string' ? currentDenuncia.categoria : "Categoria desconhecida");
  };

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : "pendente";
    let bgColor = "#888888";
    if (s === "validado" || s === "aceito") bgColor = "#7FB04B";
    else if (s === "resolvido" || s === "resolvida") bgColor = "#3B75A3";
    else if (s === "cancelado" || s === "rejeitado") bgColor = "#D9534F";
    else if (s === "pendente" || s.includes("análise")) bgColor = "#D59A53";

    return (
      <span style={{ ...styles.statusBadge, backgroundColor: bgColor }}>
        {status || "Pendente"}
      </span>
    );
  };

  const formatarData = (dataIso) => {
    const dataAlvo = dataIso || currentDenuncia?.data_criacao || currentDenuncia?.data || currentDenuncia?.created_at;
    if (!dataAlvo) return "Data indisponível";
    const date = new Date(dataAlvo);
    return isNaN(date.getTime()) ? "Data indisponível" : date.toLocaleDateString("pt-BR");
  };

  const formatarHora = (dataIso) => {
    const dataAlvo = dataIso || currentDenuncia?.data_criacao || currentDenuncia?.data || currentDenuncia?.created_at;
    if (!dataAlvo) return "--:--";
    const date = new Date(dataAlvo);
    return isNaN(date.getTime()) ? "--:--" : date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <PageLayout>
      <style>{spinnerStyle}</style>
      <div style={styles.statusBarPlaceholder}></div>
      
      <div style={styles.headerContainer}>
        <button style={styles.backButton} onClick={() => (editando ? handleCancelar() : navigate(-1))}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#2D4627" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 style={styles.headerTitle}>Detalhes do Registro</h2>
        <div style={{ width: "24px" }}></div>
      </div>

      <div style={styles.whiteCardContainer}>
        
        <section>
          <h3 style={styles.sectionTitle}>Dados gerais</h3>
          <div style={{ ...styles.grayCardBox, ...styles.dataGeneralRow }}>
            <div style={styles.dataColumn}>
              <span style={styles.dataLabel}>Categoria</span>
              {editando ? (
                // 4. Select com as opções dinâmicas do banco
                <select 
                  value={categoria} 
                  onChange={(e) => setCategoria(e.target.value)}
                  style={styles.selectInput}
                >
                  <option value="" disabled>Escolha a Categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              ) : (
                <span style={styles.dataValue}>
                  {obterNomeDaCategoria()}
                </span>
              )}
            </div>
            <div style={styles.dataColumn}>
              <span style={styles.dataLabel}>Data</span>
              <span style={styles.dataValue}>{formatarData()}</span>
            </div>
            <div style={{ ...styles.dataColumn, alignItems: "center" }}>
              <span style={styles.dataLabel}>Status</span>
              {getStatusBadge(currentDenuncia.status)}
            </div>
          </div>
        </section>

        <section>
          <h3 style={styles.sectionTitle}>Descrição completa</h3>
          <div style={styles.grayCardBox}>
            {editando ? (
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                style={styles.textareaInput}
                placeholder="Modifique os detalhes do problema..."
              />
            ) : (
              <p style={{ margin: 0, fontSize: "14px", color: "#444", lineHeight: "1.5" }}>
                {currentDenuncia.descricao || currentDenuncia.relato || "Nenhuma descrição detalhada fornecida pelo usuário."}
              </p>
            )}
          </div>
        </section>

        <section>
          <h3 style={styles.sectionTitle}>Imagens</h3>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            style={{ display: "none" }} 
            onChange={handleFotoChange} 
          />
          <div style={styles.imageRow}>
            <div 
              style={{ ...styles.imageWrapper, cursor: "pointer" }}
              onClick={() => { 
                if (editando) {
                  fileInputRef.current.click();
                } else {
                  setModalAberto(true);
                }
              }}
            >
              <img 
                src={preview} 
                alt="Denúncia" 
                style={styles.imageItem}
                onError={(e) => { e.target.src = "https://placehold.co/120x100?text=Sem+Foto"; }}
              />
              <div style={styles.imageOverlayBadge}>
                {editando ? "Trocar Imagem" : "Toque para ampliar"}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 style={styles.sectionTitle}>Localização capturada</h3>
          <div style={styles.locationRow}>
            <div style={styles.mapContainerWrapper}>
              {currentDenuncia.latitude && currentDenuncia.longitude && (
                <MapContainer center={[currentDenuncia.latitude, currentDenuncia.longitude]} zoom={16} style={{ height: "100%", width: "100%" }} zoomControl={false} dragging={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[currentDenuncia.latitude, currentDenuncia.longitude]} />
                </MapContainer>
              )}
            </div>
            <div style={styles.addressColumn}>
              {editando ? (
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  style={styles.textInputAddress}
                  placeholder="Edite o endereço do local..."
                />
              ) : (
                <span>
                  {typeof currentDenuncia.endereco === 'object' && currentDenuncia.endereco !== null
                    ? `${currentDenuncia.endereco.logradouro || ""}, ${currentDenuncia.endereco.numero || ""} - ${currentDenuncia.endereco.bairro || ""}`
                    : (currentDenuncia.endereco || enderecoExibido)}
                </span>
              )}
            </div>
          </div>
        </section>

        <section>
          <h3 style={styles.sectionTitle}>Histórico</h3>
          <div style={styles.timelineContainer}>
            {carregandoHistorico ? (
              <p>Carregando...</p>
            ) : historicoReal.length > 0 ? (
              historicoReal.map((item, index) => (
                <div key={index} style={styles.timelineItemRow}>
                  <div style={styles.timelineDateColumn}>
                    <div>{formatarData(item.data_registro || item.data)}</div>
                    <div style={{ fontSize: "11px" }}>{formatarHora(item.data_registro || item.data)}</div>
                  </div>
                  <div style={styles.timelineGraphicColumn}>
                    <div style={styles.timelineDot}></div>
                    {index !== historicoReal.length - 1 && <div style={styles.timelineLine}></div>}
                  </div>
                  <div style={styles.timelineTextColumn}>{item.texto || item.descricao}</div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "13px", color: "#666" }}>Aguardando análise da prefeitura.</p>
            )}
          </div>
        </section>

        {!editando ? (
          <button style={styles.primaryEditBtn} onClick={() => setEditando(true)}>
            Editar registro
          </button>
        ) : (
          <>
            {mensagem.texto && (
              <div style={{
                ...styles.messageBox,
                backgroundColor: mensagem.tipo === "sucesso" ? "#DFF2BF" : "#FFD2D2",
                color: mensagem.tipo === "sucesso" ? "#2D4627" : "#D8000C"
              }}>
                {mensagem.texto}
              </div>
            )}

            <div style={styles.actionRow}>
              <button style={styles.saveFormBtnInline} onClick={handleSalvarEdicao} disabled={salvando}>
                {salvando ? <div className="spinner"></div> : "Salvar Alterações"}
              </button>
              <button style={styles.cancelFormBtnInline} onClick={handleCancelar}>
                Cancelar
              </button>
            </div>
          </>
        )}

        <div style={{ height: "80px" }}></div>
      </div>

      {modalAberto && (
        <div style={styles.modalOverlay} onClick={() => setModalAberto(false)}>
          <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalCloseBtn} onClick={() => setModalAberto(false)}>✖</button>
            <img src={preview} alt="Imagem completa" style={styles.modalImage} />
          </div>
        </div>
      )}

      <Navbar isAdmin={false} />
    </PageLayout>
  );
};

const styles = {
  statusBarPlaceholder: { backgroundColor: "#1C3520", height: "30px", width: "100%" },
  headerContainer: { backgroundColor: "#fff", display: "flex", alignItems: "center", padding: "20px" },
  backButton: { background: "none", border: "none", cursor: "pointer" },
  headerTitle: { margin: 0, color: "#2D4627", fontSize: "20px", fontWeight: "bold", textAlign: "center", flex: 1 },
  whiteCardContainer: { backgroundColor: "#fff", borderTopLeftRadius: "25px", borderTopRightRadius: "25px", padding: "20px", flex: 1, display: "flex", flexDirection: "column", gap: "25px" },
  sectionTitle: { color: "#2D4627", fontSize: "18px", fontWeight: "bold", margin: "0 0 12px 0" },
  grayCardBox: { backgroundColor: "#F0F0F0", borderRadius: "15px", padding: "15px" },
  dataGeneralRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  dataColumn: { display: "flex", flexDirection: "column", gap: "5px", flex: 1 },
  dataLabel: { fontSize: "12px", fontWeight: "bold", color: "#2D4627" },
  dataValue: { fontSize: "13px", color: "#444" },
  statusBadge: { color: "white", padding: "5px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" },
  imageRow: { display: "flex", gap: "10px" },
  imageWrapper: { position: "relative", width: "120px", height: "100px", overflow: "hidden", borderRadius: "15px" },
  imageItem: { width: "100%", height: "100%", objectFit: "cover" },
  imageOverlayBadge: { position: "absolute", bottom: 0, left: 0, width: "100%", backgroundColor: "rgba(0,0,0,0.65)", color: "#fff", fontSize: "11px", textAlign: "center", padding: "6px 0", fontWeight: "bold" },
  locationRow: { backgroundColor: "#F0F0F0", borderRadius: "15px", display: "flex", height: "90px", overflow: "hidden" },
  mapContainerWrapper: { width: "35%", height: "100%" },
  addressColumn: { flex: 1, padding: "10px", fontSize: "12px", color: "#444", display: "flex", alignItems: "center" },
  timelineContainer: { display: "flex", flexDirection: "column" },
  timelineItemRow: { display: "flex", gap: "10px" },
  timelineDateColumn: { width: "70px", textAlign: "right", fontSize: "12px", color: "#444" },
  timelineGraphicColumn: { display: "flex", flexDirection: "column", alignItems: "center" },
  timelineDot: { width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#2D4627" },
  timelineLine: { width: "2px", flex: 1, backgroundColor: "#2D4627" },
  timelineTextColumn: { flex: 1, fontSize: "13px", color: "#2D4627", paddingBottom: "20px" },
  
  primaryEditBtn: { width: "100%", backgroundColor: "#1C3520", color: "white", border: "none", padding: "16px", borderRadius: "14px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" },
  actionRow: { display: "flex", gap: "10px", width: "100%" },
  saveFormBtnInline: { flex: 2, backgroundColor: "#2D4627", color: "white", padding: "14px", borderRadius: "12px", border: "none", fontSize: "15px", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" },
  cancelFormBtnInline: { flex: 1, backgroundColor: "#F0F0F0", color: "#D9534F", padding: "14px", borderRadius: "12px", border: "1px solid #D9534F", fontSize: "15px", fontWeight: "bold", cursor: "pointer" },
  selectInput: { padding: "6px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "13px", color: "#333", backgroundColor: "#fff", width: "100%", maxWidth: "150px" },
  textareaInput: { width: "100%", height: "80px", border: "1px solid #ccc", borderRadius: "10px", padding: "10px", boxSizing: "border-box", fontSize: "13px", color: "#444", fontFamily: "inherit" },
  textInputAddress: { width: "100%", border: "1px solid #ccc", borderRadius: "8px", padding: "8px", fontSize: "12px", color: "#333", boxSizing: "border-box" },
  messageBox: { padding: "12px", borderRadius: "8px", textAlign: "center", fontWeight: "bold", fontSize: "14px", width: "100%", boxSizing: "border-box", marginBottom: "5px" },

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

export default ReportDetails;