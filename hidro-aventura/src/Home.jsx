// src/Home.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './Home.css';

const Home = ({ onStartGame }) => {
    const [selectedOption, setSelectedOption] = useState(0); 

    const menuOptions = [
        { label: "INICIAR JOGO", action: onStartGame },
        { label: "SOBRE O TCC", action: () => alert("Informações sobre o TCC e a pesquisa...") },
        { label: "CONTROLES", action: () => alert("Use setas para mover, barra de espaço para pular.") },
    ];

    const handleKeyDown = useCallback((event) => {
        if (event.key === 'ArrowUp') {
            setSelectedOption(prev => Math.max(0, prev - 1));
        } else if (event.key === 'ArrowDown') {
            setSelectedOption(prev => Math.min(menuOptions.length - 1, prev + 1));
        } else if (event.key === 'Enter') {
            menuOptions[selectedOption].action();
        }
    }, [selectedOption, menuOptions]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className="home-screen">
            <div className="main-title">HIDRO-AVENTURA</div>
            <div className="subtitle">O Desafio do Gestor Hídrico</div>
            
            <div className="home-player">💧</div> 

            <div className="menu-options">
                {menuOptions.map((option, index) => (
                    <p 
                        key={index} 
                        className={index === selectedOption ? 'start-game-option selected' : 'start-game-option'}
                        onClick={option.action}
                        onMouseEnter={() => setSelectedOption(index)}
                    >
                        {index === selectedOption ? '➡️ ' : ' '} {option.label}
                    </p>
                ))}
            </div>

            <div className="ground"></div> 

            <footer>
                <p>TCC Sistemas de Informação | UFSM</p>
                <p>Mundo 1-1</p>
            </footer>
        </div>
    );
};

export default Home;