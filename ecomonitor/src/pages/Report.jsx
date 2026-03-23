import React from "react";
import PageLayout from "../components/PageLayout/PageLayout";

const Report = () => {
  
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    padding: "20px 5%", 
    gap: "15px",
    flex: 1,
    paddingBottom: "120px", 
    boxSizing: "border-box",
  };

  const uploadBoxStyle = {
    border: "2px dashed #78A64B",
    borderRadius: "15px",
    backgroundColor: "#F1F8E9",
    height: "170px", 
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    color: "#2D4627",
    fontWeight: "600",
    marginBottom: "8px"
  };

  const inputStyle = {
    width: "100%", 
    backgroundColor: "#7FB04B",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "12px 15px",
    fontSize: "1rem", 
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box"
  };

  const locationCardStyle = {
    display: "flex",
    backgroundColor: "#7FB04B",
    borderRadius: "10px",
    overflow: "hidden",
    height: "65px", 
    width: "100%"
  };

  const textAreaStyle = {
    backgroundColor: "#89B65B",
    border: "none",
    borderRadius: "10px",
    padding: "12px",
    color: "white", 
    height: "110px", 
    resize: "none",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit" 
  };

  const submitBtnStyle = {
    backgroundColor: "#2D4627",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "14px",
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "15px", 
    cursor: "pointer",
    width: "100%"
  };

  return (
    <PageLayout title="Nova denúncia">
      
      <style>
        {`
          .white-placeholder::placeholder {
            color: white;
            opacity: 0.8; /* Deixa o branco levemente suave */
          }
        `}
      </style>

      <div style={containerStyle}>
        
        <div style={uploadBoxStyle}>
          <span style={{ fontSize: "50px", marginBottom: "5px" }}>📸</span>
          <span>Anexar Foto</span>
        </div>

        <button style={inputStyle}>
          Categoria <span style={{fontSize: "12px"}}>▼</span>
        </button>

        <div style={locationCardStyle}>
          <div style={{ width: "30%", backgroundColor: "#eee", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <img src="https://via.placeholder.com/100x70?text=Mapa" alt="map" style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
          </div>
          <div style={{ padding: "8px 12px", color: "white", fontSize: "12px", display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
            <strong>Rua dos Andradas, 1200 - Centro</strong>
            <span style={{textDecoration: 'underline', opacity: 0.9}}>Confirmar local</span>
          </div>
        </div>

        <label style={{ color: "#2D4627", fontWeight: "bold", fontSize: '15px', marginTop: '5px' }}>
          Descrição Opcional
        </label>
        
        <textarea 
          className="white-placeholder"
          placeholder="Descreva o problema em detalhes..." 
          style={textAreaStyle}
        />

        <button style={submitBtnStyle} onClick={() => alert("Denúncia enviada com sucesso!")}>
          Enviar Denúncia
        </button>

      </div>
    </PageLayout>
  );
};

export default Report;