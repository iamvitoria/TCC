import React, { useState } from "react";
import { Header } from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import { Star, Send, User } from "lucide-react";

const Evaluation = () => {
  const [rating, setRating] = useState(0); // Estado para guardar a nota (0 a 5)
  const [hover, setHover] = useState(0);   // Efeito visual ao passar o mouse

  // Mock de avaliações anteriores
  const reviews = [
    { id: 1, name: "Ana Silva", stars: 5, text: "O aplicativo me ajudou muito a encontrar pontos de coleta!", date: "Há 2 dias" },
    { id: 2, name: "Carlos Souza", stars: 4, text: "Muito bom, mas poderia ter mais mapas.", date: "Há 1 semana" },
    { id: 3, name: "Mariana Lima", stars: 5, text: "Adorei as conquistas! Incentiva muito.", date: "Há 2 semanas" },
  ];

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }
    alert(`Obrigado pela avaliação de ${rating} estrelas!`);
    setRating(0); // Reseta
  };

  return (
    <div className="screen-layout">
      
      {/* 1. TOPO */}
      <Header title="Avaliações" />

      {/* 2. CONTEÚDO */}
      <div className="content-scrollable">
        
        {/* CARD DE AVALIAR */}
        <div className="evaluation-card">
          <h3 className="eval-title">O que você está achando?</h3>
          <p className="eval-subtitle">Sua opinião é muito importante para nós.</p>

          {/* Estrelas Interativas */}
          <div className="star-rating">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <button
                  key={index}
                  type="button"
                  className="star-btn"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(rating)}
                >
                  <Star 
                    size={32} 
                    fill={starValue <= (hover || rating) ? "#FFD700" : "none"} 
                    color={starValue <= (hover || rating) ? "#FFD700" : "#ccc"} 
                  />
                </button>
              );
            })}
          </div>

          {/* Campo de Texto */}
          <textarea 
            className="eval-textarea" 
            placeholder="Deixe seu comentário aqui..."
            rows="4"
          ></textarea>

          {/* Botão Enviar */}
          <button className="btn-primary" onClick={handleSubmit}>
            Enviar Feedback <Send size={18} style={{marginLeft: 8}} />
          </button>
        </div>

        {/* LISTA DE AVALIAÇÕES RECENTES */}
        <h3 className="section-title">Comentários Recentes</h3>

        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="user-avatar-small">
                  <User size={16} color="#555" />
                </div>
                <div className="user-info">
                  <span className="user-name-review">{review.name}</span>
                  <div className="user-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < review.stars ? "#FFD700" : "none"} color={i < review.stars ? "#FFD700" : "#ccc"} />
                    ))}
                  </div>
                </div>
                <span className="review-date">{review.date}</span>
              </div>
              <p className="review-text">"{review.text}"</p>
            </div>
          ))}
        </div>

      </div>

      {/* 3. NAVBAR */}
      <Navbar />
      
    </div>
  );
};

export default Evaluation;