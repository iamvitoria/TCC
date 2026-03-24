import React, { useState, useRef, useEffect } from "react";
import PageLayout from "../components/PageLayout/PageLayout";

const Report = () => {
  const fileInputRef = useRef(null);
  
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [localizacao, setLocalizacao] = useState({
    lat: null,
    lng: null,
    carregando: false,
    erro: null
  });

  const handleFotoChange = (event) => {
    const arquivo = event.target.files[0];
    if (arquivo) {
      setFoto(arquivo);
      setPreview(URL.createObjectURL(arquivo));
    }
  };

  const buscarGPS = () => {
    setLocalizacao({ ...localizacao, carregando: true, erro: null });
    
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
          setLocalizacao({ ...localizacao, carregando: false, erro: "Não foi possível obter a localização." });
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocalizacao({ ...localizacao, carregando: false, erro: "GPS não suportado neste navegador." });
    }
  };

  useEffect(() => {
    buscarGPS();
  }, []);

  const handleSubmit = () => {
    if (!foto || !categoria || !localizacao.lat) {
      alert("Por favor, adicione uma foto, escolha uma categoria e aguarde o GPS!");
      return;
    }
    
    console.log("Pronto para enviar:", {
      foto: foto.name,
      categoria,
      descricao,
      lat: localizacao.lat,
      lng: localizacao.lng
    });
    
    alert("Dados coletados com sucesso! (Pronto para conectar ao Backend)");
  };

  const containerStyle = {
    display: "flex", flexDirection: "column", padding: "20px 5%", 
    gap: "15px", flex: 1, paddingBottom: "120px", boxSizing: "border-box",
  };

  const uploadBoxStyle = {
    border: preview ? "none" : "2px dashed #78A64B",
    borderRadius: "15px", backgroundColor: preview ? "transparent" : "#F1F8E9",
    height: "170px", display: "flex", flexDirection: "column",
    justifyContent: "center", alignItems: "center", cursor: "pointer",
    color: "#2D4627", fontWeight: "600", marginBottom: "8px", overflow: "hidden",
    position: "relative"
  };

  const inputStyle = {
    width: "100%", backgroundColor: "#7FB04B", color: "white",
    border: "none", borderRadius: "10px", padding: "12px 15px",
    fontSize: "1rem", boxSizing: "border-box", outline: "none",
    appearance: "none", backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')",
    backgroundRepeat: "no-repeat", backgroundPosition: "right 15px top 50%",
    backgroundSize: "12px auto"
  };

  const locationCardStyle = {
    display: "flex", backgroundColor: "#7FB04B", borderRadius: "10px",
    overflow: "hidden", height: "65px", width: "100%"
  };

  const textAreaStyle = {
    backgroundColor: "#89B65B", border: "none", borderRadius: "10px",
    padding: "12px", color: "white", height: "110px", resize: "none",
    fontSize: "14px", width: "100%", boxSizing: "border-box", fontFamily: "inherit"
  };

  const submitBtnStyle = {
    backgroundColor: "#2D4627", color: "white", border: "none",
    borderRadius: "10px", padding: "14px", fontSize: "18px",
    fontWeight: "bold", marginTop: "15px", cursor: "pointer", width: "100%"
  };

  return (
    <PageLayout title="Nova denúncia">
      <style>
        {`
          .white-placeholder::placeholder { color: white; opacity: 0.8; }
          .custom-select option { background-color: #2D4627; color: white; }
        `}
      </style>

      <div style={containerStyle}>
        
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          style={{ display: "none" }} 
          ref={fileInputRef} 
          onChange={handleFotoChange} 
        />

        <div style={uploadBoxStyle} onClick={() => fileInputRef.current.click()}>
          {preview ? (
            <img src={preview} alt="Preview da Denúncia" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "15px" }} />
          ) : (
            <>
              <span style={{ fontSize: "50px", marginBottom: "5px" }}>📸</span>
              <span>Tirar Foto ou Anexar</span>
            </>
          )}
        </div>

        <select 
          style={inputStyle} 
          className="custom-select"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="" disabled>Escolha a Categoria</option>
          <option value="lixo">Descarte Irregular de Lixo</option>
          <option value="desmatamento">Desmatamento / Poda Ilegal</option>
          <option value="poluicao_agua">Poluição de Água</option>
          <option value="poluicao_ar">Poluição do Ar / Queimada</option>
          <option value="animais">Maus-tratos a Animais</option>
        </select>

        <div style={locationCardStyle}>
          <div style={{ width: "30%", backgroundColor: "#eee", display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: "hidden" }}>
             {localizacao.lat ? (
                <img 
                  src={`https://via.placeholder.com/150x100/2D4627/FFFFFF?text=${localizacao.lat.toFixed(2)},${localizacao.lng.toFixed(2)}`} 
                  alt="map coordinates" 
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
             ) : (
                <span style={{fontSize: "24px"}}>📍</span>
             )}
          </div>
          <div style={{ padding: "8px 12px", color: "white", fontSize: "12px", display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
            {localizacao.carregando ? (
              <strong>Buscando sua localização...</strong>
            ) : localizacao.erro ? (
              <strong style={{color: "#ffcccc"}}>{localizacao.erro}</strong>
            ) : localizacao.lat ? (
              <>
                <strong>Localização Capturada!</strong>
                <span style={{opacity: 0.9}}>Lat: {localizacao.lat.toFixed(4)}</span>
                <span style={{opacity: 0.9}}>Lng: {localizacao.lng.toFixed(4)}</span>
              </>
            ) : (
              <strong>Localização não encontrada</strong>
            )}
            
            <span onClick={buscarGPS} style={{textDecoration: 'underline', opacity: 0.9, marginTop: "4px", cursor: "pointer"}}>
              Atualizar GPS
            </span>
          </div>
        </div>

        <label style={{ color: "#2D4627", fontWeight: "bold", fontSize: '15px', marginTop: '5px' }}>
          Descrição Opcional
        </label>
        
        <textarea 
          className="white-placeholder"
          placeholder="Descreva o problema em detalhes..." 
          style={textAreaStyle}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <button style={submitBtnStyle} onClick={handleSubmit}>
          Enviar Denúncia
        </button>

      </div>
    </PageLayout>
  );
};

export default Report;