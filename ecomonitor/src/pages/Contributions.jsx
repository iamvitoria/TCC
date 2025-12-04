import React from "react";
import { Header } from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import { Heart, TreePine, Droplets, ArrowUpRight } from "lucide-react";

const Contributions = () => {
  // Dados fictícios para simular histórico
  const history = [
    { id: 1, title: "Apoio ao Reflorestamento", date: "Hoje", amount: "R$ 50,00", icon: <TreePine size={20} color="#78A64B" /> },
    { id: 2, title: "ONG Águas Limpas", date: "12/10", amount: "R$ 30,00", icon: <Droplets size={20} color="#00a8ff" /> },
    { id: 3, title: "Resgate de Fauna", date: "05/09", amount: "R$ 20,00", icon: <Heart size={20} color="#ff6b6b" /> },
  ];

  return (
    <div className="screen-layout">
      
      {/* 1. TOPO */}
      <Header title="Minhas Contribuições" />

      {/* 2. CONTEÚDO (Com scroll vertical) */}
      <div className="content-scrollable">
        
        {/* Card de Impacto Total */}
        <div className="impact-card">
          <div className="impact-header">
            <span>Total Contribuído</span>
            <Heart size={20} fill="white" stroke="none" />
          </div>
          <h2 className="impact-value">R$ 100,00</h2>
          <p className="impact-subtitle">Você já ajudou 3 projetos este ano!</p>
        </div>

        {/* Título da Lista */}
        <h3 className="section-title">Histórico Recente</h3>

        {/* Lista de Contribuições */}
        <div className="contributions-list">
          {history.map((item) => (
            <div key={item.id} className="contribution-item">
              <div className="item-icon-box">
                {item.icon}
              </div>
              <div className="item-info">
                <span className="item-title">{item.title}</span>
                <span className="item-date">{item.date}</span>
              </div>
              <div className="item-amount">
                {item.amount}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 3. NAVBAR */}
      <Navbar />
      
    </div>
  );
};

export default Contributions;