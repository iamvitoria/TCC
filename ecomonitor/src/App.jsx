import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; 
import Register from "./pages/Register"; // <--- IMPORTANTE: Importe o arquivo novo
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Inicial */}
        <Route path="/" element={<Login />} />
        
        {/* Rotas */}
        <Route path="/login" element={<Login />} />
        
        {/* Agora a rota register aponta para o componente Register */}
        <Route path="/register" element={<Register />} /> 
        
        <Route path="/home" element={<div style={{color:'white', textAlign:'center', marginTop:50}}>Home do Sistema</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;