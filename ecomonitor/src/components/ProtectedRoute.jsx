import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = sessionStorage.getItem("token");
  const perfil = sessionStorage.getItem("perfilUsuario");
  const modoVisitante = sessionStorage.getItem("modoVisitante") === "true";

  if (!token && !modoVisitante) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && perfil !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;