import React, { useState, useRef, useEffect } from "react";
import PageLayout from "../components/PageLayout/PageLayout";
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

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
  const fileInputRef = useRef(null);
  
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" }); 

  const [localizacao, setLocalizacao] = useState({
    lat: null,
    lng: null,
    carregando: true,
    erro: null
  });

  const handleFotoChange = (event) => {
    const arquivo = event.target.files[0];
    if (arquivo) {
      setFoto(arquivo);
      setPreview(URL.createObjectURL(arquivo));
    }
  };

  const obterPosicao = () => {
    setLocalizacao(prev => ({ ...prev, carregando: true, erro: null }));
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (posicao) => {
          setLocalizacao({
            lat: posicao.coords.latitude,
            lng: posicao.coords.longitude,
            carregando: false,
            erro: null
          });
        },
        (erro) => {
          console.error(erro);
          setLocalizacao(prev => ({ ...prev, carregando: false, erro: "Erro ao obter GPS." }));
        },
        { enableHighAccuracy: true, timeout: 15000 }
      );
    } else {
      setLocalizacao(prev => ({ ...prev, carregando: false, erro: "GPS não suportado." }));
    }
  };

  useEffect(() => {
    obterPosicao();
  }, []);

  const handleSubmit = async () => {
    setMensagem({ texto: "", tipo: "" });

    if (!foto || !categoria || !localizacao.lat) {
      setMensagem({ texto: "⚠️ Preencha: Foto, Categoria e aguarde o GPS!", tipo: "erro" });
      return;
    }
    
    const token = localStorage.getItem("meuToken");
    if (!token) {
      setMensagem({ texto: "❌ Você precisa estar logado!", tipo: "erro" });
      return;
    }

    setEnviando(true);

    const formData = new FormData();
    formData.append("categoria", categoria);
    formData.append("descricao", descricao);
    formData.append("latitude", localizacao.lat);
    formData.append("longitude", localizacao.lng);
    formData.append("foto", foto);

    try {
      const response = await fetch("https://ecomonitor-api.onrender.com/denuncias", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMensagem({ texto: `🎉 Denúncia enviada! Você ganhou ${data.pontos_ganhos} pontos!`, tipo: "sucesso" });
        setFoto(null); setPreview(null); setCategoria(""); setDescricao("");
        
        setTimeout(() => {
          setMensagem({ texto: "", tipo: "" });
        }, 5000);
      } else {
        const erroData = await response.json();
        setMensagem({ texto: `Erro: ${erroData.detail || "Tente novamente."}`, tipo: "erro" });
      }
    } catch (error) {
      setMensagem({ texto: "Erro de conexão com o servidor.", tipo: "erro" });
    } finally {
      setEnviando(false);
    }
  };

  const containerStyle = { display: "flex", flexDirection: "column", padding: "20px 5%", gap: "15px", paddingBottom: "120px" };
  const uploadBoxStyle = {
    border: preview ? "none" : "2px dashed #78A64B", borderRadius: "15px", backgroundColor: preview ? "transparent" : "#F1F8E9",
    height: "170px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", cursor: "pointer", overflow: "hidden"
  };
  const locationCardStyle = { display: "flex", backgroundColor: "#7FB04B", borderRadius: "10px", overflow: "hidden", height: "100px", width: "100%" };
  const inputStyle = { width: "100%", backgroundColor: "#7FB04B", color: "white", border: "none", borderRadius: "10px", padding: "12px", appearance: "none" };

  const mensagemStyle = {
    padding: "10px",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "14px",
    backgroundColor: mensagem.tipo === "sucesso" ? "#DFF2BF" : "#FFD2D2",
    color: mensagem.tipo === "sucesso" ? "#2D4627" : "#D8000C",
  };

  return (
    <PageLayout title="Nova denúncia">
      <div style={containerStyle}>
        
        <input 
          type="file" accept="image/*" capture="environment" 
          style={{ display: "none" }} ref={fileInputRef} onChange={handleFotoChange} 
        />

        <div style={uploadBoxStyle} onClick={() => fileInputRef.current.click()}>
          {preview ? (
            <img src={preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <>
              <span style={{ fontSize: "50px" }}>📸</span>
              <span style={{color: "#2D4627", fontWeight: "bold"}}>Tirar Foto do Local</span>
            </>
          )}
        </div>

        <select style={inputStyle} value={categoria} onChange={(e) => setCategoria(e.target.value)}>
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

        <div style={locationCardStyle}>
          <div style={{ width: "40%", backgroundColor: "#ddd", position: "relative" }}>
            {localizacao.lat ? (
              <MapContainer 
                center={[localizacao.lat, localizacao.lng]} 
                zoom={15} zoomControl={false} dragging={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[localizacao.lat, localizacao.lng]} />
                <RecenterMap lat={localizacao.lat} lng={localizacao.lng} />
              </MapContainer>
            ) : (
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>📍</div>
            )}
          </div>
          
          <div style={{ padding: "10px", color: "white", fontSize: "11px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {localizacao.carregando ? <strong>🛰️ Buscando sinal...</strong> : (
              <>
                <strong>{localizacao.erro || "Localização Ativa"}</strong>
                <span>Lat: {localizacao.lat?.toFixed(5)}</span>
                <span>Lng: {localizacao.lng?.toFixed(5)}</span>
                <span onClick={obterPosicao} style={{textDecoration: 'underline', marginTop: "5px", cursor: "pointer"}}>Atualizar GPS</span>
              </>
            )}
          </div>
        </div>

        <textarea 
          placeholder="Descrição opcional..." 
          style={{ backgroundColor: "#89B65B", border: "none", borderRadius: "10px", padding: "12px", color: "white", height: "80px" }}
          value={descricao} onChange={(e) => setDescricao(e.target.value)}
        />

        {mensagem.texto && (
          <div style={mensagemStyle}>
            {mensagem.texto}
          </div>
        )}

        <button 
          style={{ 
            backgroundColor: enviando ? "#5c7556" : "#2D4627", 
            color: "white", 
            border: "none", 
            borderRadius: "10px", 
            padding: "15px", 
            fontSize: "18px", 
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            cursor: enviando ? "not-allowed" : "pointer",
            opacity: enviando ? 0.8 : 1
          }}
          onClick={handleSubmit}
          disabled={enviando}
        >
          {enviando ? (
            <>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
              <div style={{
                border: "3px solid rgba(255,255,255,0.3)",
                borderTop: "3px solid white",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                animation: "spin 1s linear infinite"
              }} />
              Enviando...
            </>
          ) : (
            "Enviar Denúncia"
          )}
        </button>

      </div>
    </PageLayout>
  );
};

export default Report;