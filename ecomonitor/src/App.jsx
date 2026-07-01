import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={ <ProtectedRoute> <Home /> </ProtectedRoute>} /> 
        <Route path="/perfil" element={ <ProtectedRoute> <Profile /> </ProtectedRoute>} />
        <Route path="/mapa" element={ <ProtectedRoute> <Map /> </ProtectedRoute>} />
        <Route path="/conquistas" element={ <ProtectedRoute> <Achievements /> </ProtectedRoute>} />
        <Route path="/ranking" element={ <ProtectedRoute> <Ranking /> </ProtectedRoute>} />
        <Route path="/denuncia" element={ <ProtectedRoute> <Report /> </ProtectedRoute>} />
        <Route path="/report-details/:id" element={ <ProtectedRoute> <ReportDetails /> </ProtectedRoute>} />
        <Route path="/admin-dashboard" element={ <ProtectedRoute adminOnly={true}> <AdminDashboard /> </ProtectedRoute>} />
        <Route path="/admin/denuncia/:id" element={ <ProtectedRoute adminOnly={true}> <AdminReportDetails /> </ProtectedRoute>} />
        <Route path="/admin-perfil" element={ <ProtectedRoute adminOnly={true}> <AdminPerfil /> </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;