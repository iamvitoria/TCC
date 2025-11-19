// src/App.jsx (VERSÃO FINAL COM SIDE-SCROLLING)
import React, { useState, useEffect, useCallback } from 'react';
import Home from './Home'; 
import Player from './Player';
import ChallengeModal from './ChallengeModal';
import './App.css'; 

// =================================================================
// DADOS DO JOGO (CHALLENGES)
// =================================================================
const CHALLENGES = [
    { id: 1, position: 300, type: 'Desmatamento', icon: '🌳➡️🚫',
      question: "Qual o principal efeito do desmatamento na infiltração da água no solo?", 
      options: ["Aumenta drasticamente", "Permanece o mesmo", "Diminui drasticamente"],
      correctAnswer: "Diminui drasticamente",
      resolved: false // Adicionado para garantir que o estado inicial é false
    },
    { id: 2, position: 650, type: 'Urbanização', icon: '🏙️',
      question: "A urbanização excessiva leva a qual problema hídrico?", 
      options: ["Escassez de água subterrânea", "Aumento da Taxa de Evaporação", "Aumento do Risco de Enchentes"],
      correctAnswer: "Aumento do Risco de Enchentes",
      resolved: false
    },
    { id: 3, position: 950, type: 'Poluição', icon: '☣️',
      question: "Qual a melhor forma de combater a poluição hídrica por esgoto doméstico?", 
      options: ["Aumentar o consumo de água", "Construir Estações de Tratamento (ETE)", "Simplesmente desviar o rio"],
      correctAnswer: "Construir Estações de Tratamento (ETE)",
      resolved: false
    },
    // Adicione mais desafios aqui para estender o jogo
    { id: 4, position: 1300, type: 'Uso Ineficiente', icon: '🚿',
        question: "A agricultura é o setor que mais consome água no Brasil. Qual prática ajuda a reduzir esse consumo?", 
        options: ["Irrigação por gotejamento", "Irrigação por inundação", "Não irrigar"],
        correctAnswer: "Irrigação por gotejamento",
        resolved: false
    },
    { id: 5, position: 1700, type: 'Vitória!', icon: '🏁',
        question: "Parabéns! Você concluiu a fase! Clique em fechar para ver seu resultado final.", 
        options: ["Fechar"],
        correctAnswer: "Fechar",
        resolved: false
    },
];

function App() {
    // ESTADOS GERAIS
    const [gameStarted, setGameStarted] = useState(false); 
    
    // ESTADOS DO JOGO
    const PLAYER_FIXED_X = 200; // Posição fixa do jogador na tela (em pixels)
    const [scrollOffset, setScrollOffset] = useState(0); // Movimento do cenário (scroll)

    const [isJumping, setIsJumping] = useState(false);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [gameScore, setGameScore] = useState(0);
    const [gameMessage, setGameMessage] = useState("Use as setas (← →) e barra de espaço (pular).");

    const startGame = () => setGameStarted(true); 

    // =================================================================
    // LÓGICA DE DETECÇÃO DE DESAFIO (COLISÃO SIMULADA)
    // =================================================================
    const checkChallenge = useCallback((currentWorldPosition) => {
        const playerWidth = 40;
        const collisionRange = 40; 
        
        // Loop que usa a posição real do jogador no mundo (FixedX + Offset)
        for (const challenge of CHALLENGES) {
            const distance = Math.abs(currentWorldPosition - challenge.position);
            
            if (distance < playerWidth + collisionRange && activeChallenge === null) {
                const isResolved = challenge.resolved; 
                if (!isResolved) {
                    setActiveChallenge(challenge);
                    setGameMessage(`🚨 Obstáculo de ${challenge.type}! Responda para prosseguir.`);
                    return true;
                }
            }
        }
        return false;
    }, [activeChallenge]);

    // =================================================================
    // LÓGICA DE MOVIMENTO E TECLADO
    // =================================================================
    const handleKeyDown = useCallback((event) => {
        // Bloqueia movimento se houver um modal ativo ou o jogo não tiver começado
        if (activeChallenge || !gameStarted) return; 

        if (event.key === 'ArrowRight') {
            // Move o cenário para a esquerda (scroll positivo)
            const moveStep = 30;
            const newOffset = scrollOffset + moveStep; 
            setScrollOffset(newOffset);
            
            // Posição Real no Mundo = Posição Fixa + Scroll já percorrido
            const currentWorldPosition = PLAYER_FIXED_X + newOffset;
            checkChallenge(currentWorldPosition);
            
        } else if (event.key === 'ArrowLeft') {
            // Move o cenário para a direita (scroll negativo), limitado a 0
            const moveStep = 30;
            const newOffset = Math.max(0, scrollOffset - moveStep); 
            setScrollOffset(newOffset);

            const currentWorldPosition = PLAYER_FIXED_X + newOffset;
            checkChallenge(currentWorldPosition);
            
        } else if (event.key === ' ' && !isJumping) {
            // Pulo
            setIsJumping(true);
            setTimeout(() => setIsJumping(false), 600); 
        }
    }, [scrollOffset, isJumping, activeChallenge, checkChallenge, gameStarted, PLAYER_FIXED_X]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // =================================================================
    // FUNÇÕES DO MODAL (APÓS RESPOSTA)
    // =================================================================
    // No src/App.jsx

    const handleAnswer = (isCorrect) => {
        if (isCorrect) {
            setGameScore(prev => prev + 100);
            setGameMessage(`🎉 Resposta Correta! +100 Pontos.`);
            
            // Marca como resolvido para não travar mais
            const challengeIndex = CHALLENGES.findIndex(c => c.id === activeChallenge.id);
            if(challengeIndex !== -1) {
                CHALLENGES[challengeIndex].resolved = true;
            }
        } else {
            setGameMessage("❌ Resposta Incorreta. Você foi empurrado para trás!");
            setGameScore(prev => Math.max(0, prev - 50));
            
            // --- A MÁGICA AQUI ---
            // Empurra o jogador 100px para trás para sair da colisão
            setScrollOffset(prev => Math.max(0, prev - 100)); 
        }
        setActiveChallenge(null); 
    };

    const handleCloseModal = () => {
        setGameMessage("Você fugiu do desafio e recuou.");
        setGameScore(prev => Math.max(0, prev - 20));
        
        // --- A MÁGICA AQUI TAMBÉM ---
        // Empurra para trás ao fechar
        setScrollOffset(prev => Math.max(0, prev - 100)); 
        
        setActiveChallenge(null);
    };

    // =================================================================
    // RENDERIZAÇÃO CONDICIONAL
    // =================================================================

    if (!gameStarted) {
        return <Home onStartGame={startGame} />; 
    }

    // Se gameStarted for true, renderiza o Jogo
    return (
        <div className="game-screen">
            <div className="hud">
                <p>Status: {gameMessage}</p>
                <p>Pontuação: {gameScore}</p>
            </div>
            
            {/* O MUNDO (Cenário e Obstáculos) */}
            <div 
                className="world"
                style={{ transform: `translateX(-${scrollOffset}px)` }} 
            >
                {/* O PLAYER NÃO PODE FICAR AQUI DENTRO! */}
                
                {/* Marcadores de Desafio (Obstáculos Visuais) */}
                {CHALLENGES.map(c => (
                    <div 
                        key={c.id} 
                        className={`obstacle ${c.resolved ? 'resolved' : ''}`} 
                        style={{ left: `${c.position}px` }} 
                        title={`Obstáculo: ${c.type}`}
                    >
                        {c.resolved ? '✅' : c.icon}
                    </div>
                ))}
            </div>

            {/* --- A CORREÇÃO: O Player fica FORA do world --- */}
            {/* Assim ele fica fixo na tela (200px) enquanto o mundo roda por trás */}
            <Player position={PLAYER_FIXED_X} isJumping={isJumping} /> 

            <ChallengeModal 
                challenge={activeChallenge} 
                onAnswer={handleAnswer} 
                onClose={handleCloseModal}
            />
        </div>
    );
}

export default App;