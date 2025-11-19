import React from 'react';
import './App.css'; // Reusa as fontes

const ChallengeModal = ({ challenge, onAnswer, onClose }) => {
    if (!challenge) return null;

    // Estilo inline simples para o modal (janela flutuante)
    const overlayStyle = {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', 
        justifyContent: 'center', alignItems: 'center', zIndex: 1000
    };

    const modalStyle = {
        backgroundColor: '#fff', padding: '20px', borderRadius: '10px',
        maxWidth: '500px', textAlign: 'center', border: '4px solid #000',
        fontFamily: '"Press Start 2P", cursive'
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h3 style={{color: '#d32f2f', fontSize: '14px'}}>{challenge.type}</h3>
                <p style={{fontSize: '12px', lineHeight: '20px', margin: '20px 0'}}>
                    {challenge.question}
                </p>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    {challenge.options.map((option, index) => (
                        <button 
                            key={index}
                            onClick={() => {
                                if(option === "Fechar") onClose();
                                else onAnswer(option === challenge.correctAnswer);
                            }}
                            style={{
                                padding: '10px', cursor: 'pointer', 
                                fontFamily: 'inherit', fontSize: '10px',
                                backgroundColor: '#eee', border: '2px solid #333'
                            }}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChallengeModal;