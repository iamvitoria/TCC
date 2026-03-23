import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; 
import Register from "./pages/Register";
import Home from "./pages/Home"; 
import Profile from "./pages/Profile"; 
import Contributions from "./pages/Contributions"; 
import Achievements from "./pages/Achievements"; 
import Evaluation from "./pages/Evaluation"; 
import Report from './pages/Report';
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} /> 
        <Route path="/perfil" element={<Profile />} />
        <Route path="/contribuicoes" element={<Contributions />} />
        <Route path="/conquistas" element={<Achievements />} />
        <Route path="/avaliacao" element={<Evaluation />} />
        <Route path="/denuncia" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;