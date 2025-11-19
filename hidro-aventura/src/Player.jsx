// src/Player.jsx
import React from 'react';

const Player = ({ position, isJumping }) => {
    const style = {
        position: 'absolute',
        left: `${position}px`, 
        // Ajuste fino: Se o chão começa em 85%, sobram 15%. 
        // Se a gota voar, diminua o 15% para 12% ou 10%
        bottom: isJumping ? '250px' : '15%', 
        fontSize: '50px',
        transition: 'bottom 0.4s ease-out', // Pulo mais suave
        zIndex: 10,
        animation: isJumping ? 'none' : 'float 2s ease-in-out infinite',
        // Adiciona uma sombra para dar noção de chão
        filter: isJumping ? 'drop-shadow(0px 100px 10px rgba(0,0,0,0.2))' : 'none'
    };

    return <div style={style}>💧</div>;
};

export default Player;