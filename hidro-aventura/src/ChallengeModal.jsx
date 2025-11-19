// src/ChallengeModal.jsx
import React from 'react';
import './ChallengeModal.css';

const ChallengeModal = ({ challenge, onAnswer, onClose }) => {
    if (!challenge) return null;

    const { question, options, correctAnswer, type } = challenge;

    const handleAnswer = (answer) => {
        const isCorrect = answer === correctAnswer;
        onAnswer(isCorrect); 
    };

    return (
        <div className="modal-backdrop">
            <div className="challenge-modal">
                <h3>{type} - Desafio!</h3>
                <p><strong>{question}</strong></p>
                <div className="options-container">
                    {options.map((option, index) => (
                        <button key={index} onClick={() => handleAnswer(option)}>
                            {option}
                        </button>
                    ))}
                </div>
                <button className="close-btn" onClick={onClose}>
                    Pular Questão (Penalidade)
                </button>
            </div>
        </div>
    );
};

export default ChallengeModal;