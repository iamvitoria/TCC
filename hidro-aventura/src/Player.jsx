// src/Player.jsx
import React from 'react';
import './Player.css';

const Player = ({ position, isJumping }) => {
    // Estilo que mantém o jogador na posição fixa (PLAYER_FIXED_X) na tela
    const playerStyle = {
        left: `${position}px`,
    };

    return (
        <div 
            className={`player ${isJumping ? 'jumping' : ''}`} 
            style={playerStyle}
        >
            💧
        </div>
    );
};

export default Player;