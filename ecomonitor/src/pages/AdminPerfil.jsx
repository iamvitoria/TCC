import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import API_URL from "../config";

export default function AdminPerfil() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 

  const [carregando, setCarregando] = useState(true);
  const [adminData, setAdminData] = useState({
    nome: "",
    cargo: "",
    regiao: "",
    foto_perfil: null,
    estatisticas: {
      resolvidas: 0,
      pendentes: 0
    }
  });

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
          cargo: dados.cargo || "Analista Ambiental",
          regiao: dados.regiao || dados.cidade || "Santa Maria",
          foto_perfil: dados.foto_perfil 
            ? (dados.foto_perfil.startsWith('http') ? dados.foto_perfil : `${API_URL}/${dados.foto_perfil}`)
            : null,
          estatisticas: {
            resolvidas: dados.estatisticas?.resolvidas || 0,
            pendentes: dados.estatisticas?.pendentes || 0
          }
        });
      }
    } catch (erro) {
      console.error("Erro ao buscar perfil do admin:", erro);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarPerfil();
  }, [navigate]);

  const handleFotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

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
    }
  };

  const handleSair = () => {
    localStorage.clear();
    navigate("/");
  };

  if (carregando) {
    return (
      <div style={{ ...styles.container, justifyContent: 'center', alignItems: 'center', color: 'white' }}>
        <p>Carregando perfil do administrador...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={handleFileChange}
      />

      <div style={styles.topSection}>
        <span style={styles.role}>Administrador</span>

        <div style={styles.blob} onClick={handleFotoClick} title="Clique para mudar a foto">
          {adminData.foto_perfil ? (
            <img src={adminData.foto_perfil} alt="perfil" style={styles.foto} />
          ) : (
            <div style={styles.fotoPlaceholder}>+</div>
          )}
        </div>

        <h2 style={styles.nome}>{adminData.nome}</h2>

        <div style={styles.infoRow}>
          <span>{adminData.cargo}</span>
          <span>{adminData.regiao}</span>
        </div>
      </div>

      <div style={styles.bottomSection}>
        
        <h3 style={styles.sectionTitle}>Denúncias</h3>

        <div style={styles.statsRow}>
          <div style={styles.card}>
            <strong style={styles.cardNumber}>{adminData.estatisticas.resolvidas}</strong>
            <span style={styles.cardLabel}>Resolvidas</span>
          </div>

          <div style={styles.card}>
            <strong style={styles.cardNumber}>{adminData.estatisticas.pendentes}</strong>
            <span style={styles.cardLabel}>Pendentes</span>
          </div>
        </div>

        <button style={styles.btnPrimary} onClick={() => navigate('/editar-perfil-admin')}>Editar perfil</button>
        <button style={styles.btnSecondary}>Mudar senha</button>
        <button style={styles.btnLogout} onClick={handleSair}>Sair</button>

      </div>

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
  }
};