import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";

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
    if (lat && lng) {
      map.setView([lat, lng], 15);
    }
  }, [lat, lng, map]);

  return null;
};

const LocationPicker = ({ localizacao, setLocalizacao }) => {
  useMapEvents({
    click(e) {
      setLocalizacao({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    }
  });

  return (
    <Marker
      position={[localizacao.lat, localizacao.lng]}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const pos = e.target.getLatLng();

          setLocalizacao({
            lat: pos.lat,
            lng: pos.lng
          });
        }
      }}
    />
  );
};

const Report = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [localizacao, setLocalizacao] = useState({ lat: null, lng: null });
  // eslint-disable-next-line no-unused-vars
  const [modalAberto, setModalAberto] = useState(false);

  // Busca localização atual
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocalizacao({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    });
  }, []);

  // Busca categorias do banco
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
      setMensagem({
        texto: "Preencha a foto, categoria e aguarde o GPS!",
        tipo: "erro"
      });
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      setMensagem({
        texto: "Você precisa estar logado!",
        tipo: "erro"
      });
      return;
    }

    setEnviando(true);

    try {
      // eslint-disable-next-line no-unused-vars
      let enderecoTexto = "Endereço não identificado";
      let cidadeTexto = "Cidade não identificada";
      let cepTexto = "00000-000";
      let logradouroTexto = "Não identificado";
      let numeroTexto = "S/N";
      let bairroTexto = "Não identificado";

      try {
        const responseGeo = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${localizacao.lat}&lon=${localizacao.lng}`
        );

        const dataGeo = await responseGeo.json();
        const address = dataGeo.address || {};

        // Extraindo cada pedacinho do endereço retornado pelo mapa
        cidadeTexto = address.city || address.town || address.village || "Desconhecida";
        cepTexto = address.postcode || "00000-000";
        logradouroTexto = address.road || "Não identificado";
        numeroTexto = address.house_number || "S/N";
        bairroTexto = address.suburb || address.neighbourhood || "Não identificado";

      } catch (geoError) {
        console.error("Erro ao buscar endereço:", geoError);
      }

      // Agora sim, enviando os dados com os nomes EXATOS que o backend exige
      const formData = new FormData();
      formData.append("categoria_id", categoria);
      formData.append("descricao", descricao);
      formData.append("latitude", localizacao.lat);
      formData.append("longitude", localizacao.lng);
      
      // Enviando o endereço fatiado
      formData.append("cep", cepTexto);
      formData.append("logradouro", logradouroTexto);
      formData.append("numero", numeroTexto);
      formData.append("bairro", bairroTexto);
      formData.append("cidade", cidadeTexto);
      
      formData.append("foto", foto);

      const response = await fetch(`${API_URL}/registros`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setMensagem({
          texto: "Registro enviado com sucesso!",
          tipo: "sucesso"
        });

        setTimeout(() => navigate("/home"), 2000);
      } else {
        setMensagem({
          texto: "Erro ao enviar registro.",
          tipo: "erro"
        });
      }
    } catch {
      setMensagem({
        texto: "Erro de conexão com o servidor.",
        tipo: "erro"
      });
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
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFotoChange}
        />

        <div
          style={{
            ...styles.uploadBox,
            border: preview ? "none" : styles.uploadBox.border
          }}
          onClick={() => {
            if (!preview) fileInputRef.current.click();
          }}
        >
          {preview ? (
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
              <img
                src={preview}
                alt="preview"
                style={styles.preview}
                onClick={() => setModalAberto(true)}
              />
              <div style={styles.miniBadge}>Toque para ampliar / trocar</div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2D4627"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              <span style={styles.uploadText}>Tirar foto ou importar</span>
            </div>
          )}
        </div>

        <label style={styles.label}>Categoria</label>

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          style={styles.select}
        >
          <option value="" disabled>
            Escolha a Categoria
          </option>

          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nome}
            </option>
          ))}
        </select>

        <label style={styles.label}>Localização</label>

        <div style={styles.locationCard}>
          <div style={styles.map}>
            {localizacao.lat && (
              <MapContainer
                center={[localizacao.lat, localizacao.lng]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker
                  localizacao={localizacao}
                  setLocalizacao={setLocalizacao}
                />
                <RecenterMap lat={localizacao.lat} lng={localizacao.lng} />
              </MapContainer>
            )}
          </div>

          <div style={styles.locationText}>
            <strong>Localização (toque ou arraste para ajustar)</strong>
            <span>
              {localizacao.lat
                ? `${localizacao.lat.toFixed(4)}, ${localizacao.lng.toFixed(4)}`
                : "Carregando..."}
            </span>
          </div>
        </div>

        <label style={styles.label}>Descrição opcional</label>

        <textarea
          placeholder="Descreva o problema em detalhes..."
          style={styles.textarea}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        {mensagem.texto && (
          <div
            style={{
              padding: "10px",
              borderRadius: "8px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "14px",
              backgroundColor:
                mensagem.tipo === "sucesso" ? "#DFF2BF" : "#FFD2D2",
              color: mensagem.tipo === "sucesso" ? "#2D4627" : "#D8000C"
            }}
          >
            {mensagem.texto}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={enviando}
          style={styles.button}
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
    gap: 14
  },
  label: {
    fontWeight: "600",
    color: "#2D4627"
  },
uploadBox: {
    border: "2px dashed #8DAF73",
    backgroundColor: "#E7F0DC",
    borderRadius: 15,
    height: 140,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer" 
  },
  uploadText: {
    fontWeight: "600",
    color: "#2D4627"
  },
  preview: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  miniBadge: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "white",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "11px"
  },
  select: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ddd"
  },
  locationCard: {
    display: "flex",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #ddd"
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
    justifyContent: "center"
  },
  textarea: {
    borderRadius: 10,
    border: "1px solid #ddd",
    padding: 12,
    height: 90
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
    alignItems: "center"    
  }
};

export default Report;