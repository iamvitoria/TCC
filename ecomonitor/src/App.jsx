import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // Mudou de Start para Login
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* A tela inicial agora é o LOGIN */}
        <Route path="/" element={<Login />} />
        
        {/* Rotas secundárias */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<div style={{color:'white', textAlign:'center', marginTop:50}}>Tela de Cadastro</div>} />
        <Route path="/home" element={<div style={{color:'white', textAlign:'center', marginTop:50}}>Home do Sistema</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;