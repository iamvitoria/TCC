// Verifica se o site está rodando localmente
const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// Define a URL base dependendo do lugar
const API_BASE_URL = isLocalhost 
    ? "http://127.0.0.1:8000"  // Sua API local (FastAPI padrão)
    : "https://ecomonitor-api.onrender.com"; // Sua API no Render

export default API_BASE_URL;