import React from "react";
import { Header } from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import { Trophy, Medal, Lock, Star, Zap, Award, Leaf } from "lucide-react";

const Achievements = () => {
  // Dados fictícios (Mock)
  const achievements = [
    { id: 1, title: "Primeiros Passos", desc: "Criou sua conta", icon: <Zap size={24} color="#FFD700" />, unlocked: true },
    { id: 2, title: "Observador", desc: "1ª ocorrência", icon: <Award size={24} color="#00d2d3" />, unlocked: true },
    { id: 3, title: "Guardião", desc: "5 contribuições", icon: <Medal size={24} color="#ff9f43" />, unlocked: false },
    { id: 4, title: "Influenciador", desc: "50 likes recebidos", icon: <Star size={24} color="#ff6b6b" />, unlocked: false },
    { id: 5, title: "Expert", desc: "Atingiu Nível 5", icon: <Trophy size={24} color="#5f27cd" />, unlocked: false },
    { id: 6, title: "Biólogo", desc: "Identificou 10 plantas", icon: <Leaf size={24} color="#10ac84" />, unlocked: false },
  ];

  return (
    <div className="screen-layout">
      
      {/* 1. TOPO */}
      <Header title="Conquistas" />

      {/* 2. CONTEÚDO (Com Scroll) */}
      <div className="content-scrollable">
        
        {/* Card de Nível (Dourado) */}
        <div className="level-card">
          <div className="level-info">
            <div className="level-number">
              <span>NÍVEL ATUAL</span>
              <h1>2</h1>
            </div>
            <div className="level-xp">
              <p>350 / 500 XP</p>
              <span>Faltam 150 XP para o Nível 3</span>
            </div>
          </div>
          
          {/* Barra de Progresso */}
          <div className="progress-bar-bg">
            {/* Muda a width para simular a porcentagem */}
            <div className="progress-bar-fill" style={{width: '70%'}}></div>
          </div>
        </div>

        {/* Título da Seção */}
        <h3 className="section-title">
          Medalhas ({achievements.filter(a => a.unlocked).length}/{achievements.length})
        </h3>

        {/* Grade de Conquistas */}
        <div className="achievements-grid">
          {achievements.map((item) => (
            <div key={item.id} className={`achievement-card ${item.unlocked ? 'unlocked' : 'locked'}`}>
              
              <div className="badge-icon">
                {item.unlocked ? item.icon : <Lock size={24} color="#888" />}
              </div>
              
              <div className="badge-info">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
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

export default Achievements;