import React from 'react';

const Player = ({ position, isJumping }) => {
    const style = {
        position: 'absolute',
        left: `${position}px`, // Posição horizontal fixa na tela
        bottom: isJumping ? '200px' : '15%', // 15% é a altura do chão
        fontSize: '50px',
        transition: 'bottom 0.3s ease-out', // Animação do pulo
        zIndex: 10
    };

    return <div style={style}>💧</div>;
};

export default Player;