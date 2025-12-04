import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; 
import Register from "./pages/Register";
import Home from "./pages/Home"; // <--- Importe a Home nova
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Inicial (Login) */}
        <Route path="/" element={<Login />} />
        
        {/* Rotas de Autenticação */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rota Principal */}
        <Route path="/home" element={<Home />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;