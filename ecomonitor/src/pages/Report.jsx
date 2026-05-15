import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Navbar from "../components/Navbar/Navbar.jsx"; 
import PageLayout from "../components/PageLayout/PageLayout";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import API_URL from "../config";

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
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
};

const Report = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [localizacao, setLocalizacao] = useState({ lat: null, lng: null });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocalizacao({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    });
  }, []);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setMensagem({ texto: "", tipo: "" });

    if (!foto || !categoria || !localizacao.lat) {
      setMensagem({ texto: "Preencha a foto, categoria e aguarde o GPS!", tipo: "erro" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMensagem({ texto: "Você precisa estar logado!", tipo: "erro" });
      return;
    }

    setEnviando(true);

    try {
      let enderecoTexto = "Endereço não identificado";
      let cidadeTexto = "Cidade não identificada";

      try {
        const responseGeo = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${localizacao.lat}&lon=${localizacao.lng}`
        );
        const dataGeo = await responseGeo.json();
        
        cidadeTexto = dataGeo.address.city || dataGeo.address.town || dataGeo.address.village || "Desconhecida";
        
        enderecoTexto = dataGeo.display_name;
      } catch (geoError) {
        console.error("Erro ao buscar endereço:", geoError);
      }

      const formData = new FormData();
      formData.append("categoria", categoria);
      formData.append("descricao", descricao);
      formData.append("latitude", localizacao.lat);
      formData.append("longitude", localizacao.lng);
      formData.append("endereco", enderecoTexto); 
      formData.append("cidade", cidadeTexto); 
      formData.append("foto", foto);

      const response = await fetch(`${API_URL}/denuncias`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        setMensagem({ texto: "Registro enviado com sucesso!", tipo: "sucesso" });
        setTimeout(() => navigate("/home"), 2000);
      } else {
        setMensagem({ texto: "Erro ao enviar denúncia.", tipo: "erro" });
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMensagem({ texto: "Erro de conexão com o servidor.", tipo: "erro" });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <PageLayout title="Novo registro">
      <style>{spinnerStyle}</style>

      <div style={styles.container}>
        
        <label style={styles.label}>Foto da ocorrência</label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFotoChange}
        />

        <div style={{...styles.uploadBox, border: preview ? "none" : styles.uploadBox.border}} onClick={() => fileInputRef.current.click()}>
          {preview ? (
            <img src={preview} alt="preview" style={styles.preview} />
          ) : (
            <>
              <span style={{ fontSize: 40 }}>📷</span>
              <span style={styles.uploadText}>Tirar foto ou importar</span>
            </>
          )}
        </div>

        <label style={styles.label}>Categoria</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          style={styles.select}
        >
          <option value="" disabled>Escolha a Categoria</option>
          <option value="lixo">Descarte Irregular de lixo</option>
          <option value="desmatamento">Desmatamento</option>
          <option value="poluicao_agua">Poluição da Água</option>
          <option value="queimada">Queimada</option>
          <option value="poluicao_ar">Poluição do Ar</option>
          <option value="animais">Maus-tratos aos Animais</option>
          <option value="foco_mosquito">Foco de Mosquito</option>
          <option value="esgoto">Esgoto a Céu Aberto</option>
        </select>

        <label style={styles.label}>Localização</label>
        <div style={styles.locationCard}>
          <div style={styles.map}>
            {localizacao.lat && (
              <MapContainer
                center={[localizacao.lat, localizacao.lng]}
                zoom={15}
                dragging={false}
                zoomControl={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[localizacao.lat, localizacao.lng]} />
                <RecenterMap lat={localizacao.lat} lng={localizacao.lng} />
              </MapContainer>
            )}
          </div>
          <div style={styles.locationText}>
            <strong>Localização capturada</strong>
            <span>
              {localizacao.lat
                ? `${localizacao.lat.toFixed(4)}, ${localizacao.lng.toFixed(4)}`
                : "Carregando..."}
            </span>
          </div>
        </div>

        <label style={styles.label}>Descrição Opcional</label>
        <textarea
          placeholder="Descreva o problema em detalhes..."
          style={styles.textarea}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        {mensagem.texto && (
          <div style={{
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "14px",
            backgroundColor: mensagem.tipo === "sucesso" ? "#DFF2BF" : "#FFD2D2",
            color: mensagem.tipo === "sucesso" ? "#2D4627" : "#D8000C"
          }}>
            {mensagem.texto}
          </div>
        )}

        <button 
          onClick={handleSubmit} 
          disabled={enviando}
          style={{
            ...styles.button,
            opacity: enviando ? 0.7 : 1,
            cursor: enviando ? "not-allowed" : "pointer"
          }}
        >
          {enviando ? <div className="spinner"></div> : "Enviar Registro"}
        </button>
      </div>
      <Navbar isAdmin={false} />
    </PageLayout>
  );
};

const styles = {
  container: {
    padding: "20px",
    paddingBottom: "120px", 
    backgroundColor: "#F4F6F3",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    boxSizing: "border-box",
    width: "100%",
  },
  label: {
    fontWeight: "600",
    color: "#2D4627",
  },
  uploadBox: {
    border: "2px dashed #8DAF73",
    backgroundColor: "#E7F0DC",
    borderRadius: 15,
    height: 140, 
    overflow: "hidden", 
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  uploadText: {
    fontWeight: "600",
    color: "#2D4627"
  },
  preview: {
    width: "100%",
    height: "100%",
    objectFit: "cover", 
  },
  select: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
    backgroundColor: "#fff",
  },
  locationCard: {
    display: "flex",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
  },
  map: {
    width: "35%",
    height: 70
  },
  locationText: {
    padding: 10,
    fontSize: 12,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "#333"
  },
  textarea: {
    borderRadius: 10,
    border: "1px solid #ddd",
    padding: 12,
    height: 90,
    fontFamily: "inherit",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#2D4627",
    color: "white",
    padding: 16,
    borderRadius: 12,
    border: "none",
    fontSize: 16,
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    minHeight: "55px" 
  }
};

export default Report;