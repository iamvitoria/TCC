import React, { useEffect } from 'react';
import API_URL from "./config"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; 
import Register from "./pages/Register";
import Home from "./pages/Home"; 
import Profile from "./pages/Profile"; 
import Map from "./pages/Map";
import Achievements from "./pages/Achievements"; 
import Ranking from './pages/Ranking';
import Report from './pages/Report';
import ReportDetails from "./pages/ReportDetails";
import AdminDashboard from './pages/AdminDashboard';
import AdminReportDetails from './pages/AdminReportDetails';
import AdminPerfil from './pages/AdminPerfil';
import "./App.css";

function App() {

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then(() => console.log("Servidor aquecido"))
      .catch(() => console.log("Servidor ainda acordando"));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} /> 
        <Route path="/perfil" element={<Profile />} />
        <Route path="/mapa" element={<Map />} />
        <Route path="/conquistas" element={<Achievements />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/denuncia" element={<Report />} />
        <Route path="/report-details/:id" element={<ReportDetails />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/denuncia/:id" element={<AdminReportDetails />} />
        <Route path="/admin-perfil" element={<AdminPerfil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;