import React, { useState } from "react";
import "./App.css";

const sentence = "winter is comming";
const category = "Category: Popular catchphrase";
const hint = "Hint: From HBO";
const generateLetterMapping = () => {
    const mapping = {};
    const usedNumbers = new Set();
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    
    alphabet.forEach(letter => {
        let randomNum;
        do {
            randomNum = Math.floor(Math.random() * 26) + 1;
        } while (usedNumbers.has(randomNum));
        
        mapping[letter] = randomNum;
        usedNumbers.add(randomNum);
    });
    
    return mapping;
};

const letterMapping = generateLetterMapping();

const bogusHints = [
    "Try typing 'do a barrel roll'!", 
    "Maybe the answer is 'password123'?",
    "Have you tried turning it off and on again?",
    "42 is always the answer!",
    "Just mash the keyboard and hope for the best!",
    "Try pressing me again",
    "I dont know, im just a floating head"
];

const words = sentence.split(" ");
const filteredSentence = sentence.replace(/[^a-zA-Z]/g, "");

const LetterPuzzle = () => {
    const [userInput, setUserInput] = useState(Array(filteredSentence.length).fill(""));
    const [isCorrect, setIsCorrect] = useState(false);
    const [lives, setLives] = useState(10);
    const [gameOver, setGameOver] = useState(false);
    const [playerName, setPlayerName] = useState("");
    const [showHint, setShowHint] = useState(false);
    const [hintText, setHintText] = useState("");
    const correctLetters = filteredSentence.split("");
    let letterIndex = 0;

    const handleChange = (index, value) => {
        if (/^[a-zA-Z]?$/.test(value)) {
            const newInput = [...userInput];
            newInput[index] = value;
            setUserInput(newInput);
            
            if (value && value.toLowerCase() !== correctLetters[index]) {
                setLives((prevLives) => {
                    const newLives = Math.max(prevLives - 1, 0);
                    if (newLives === 0) setGameOver(true);
                    return newLives;
                });
            }
            
            // Check if all letters are correct
            if (newInput.join("").toLowerCase() === filteredSentence.toLowerCase()) {
                setIsCorrect(true);
            }
        }
    };

    const showBogusHint = () => {
        setHintText(bogusHints[Math.floor(Math.random() * bogusHints.length)]);
        setShowHint(true);
        setTimeout(() => setShowHint(false), 3000);
    };

    return (
        <div className="game-wrapper">
            <div className="game-area">
                <div className="game-header">
                    <h2 className="category">{category}</h2>
                    <p className="hint">{hint}</p>
                </div>
                <div className="input-container">
                    {words.map((word, wordIndex) => (
                        <div key={wordIndex} className="word-group">
                            {word.split("").map((letter, i) => {
                                const currentLetterIndex = letterIndex++;
                                return (
                                    <div key={`${wordIndex}-${i}`} className="input-box">
                                        <input 
                                            type="text" 
                                            disabled={gameOver} 
                                            className={userInput[currentLetterIndex] && userInput[currentLetterIndex].toLowerCase() === correctLetters[currentLetterIndex] ? "correct-input" : userInput[currentLetterIndex] && userInput[currentLetterIndex].toLowerCase() !== correctLetters[currentLetterIndex] ? "incorrect" : ""} 
                                            readOnly={userInput[currentLetterIndex] && userInput[currentLetterIndex].toLowerCase() === correctLetters[currentLetterIndex]} 
                                            maxLength="1" 
                                            value={userInput[currentLetterIndex]} 
                                            onChange={(e) => handleChange(currentLetterIndex, e.target.value.toLowerCase())} 
                                        />
                                        <span className="number-label">{letterMapping[letter] || " "}</span>
                                        {userInput[currentLetterIndex] && userInput[currentLetterIndex].toLowerCase() !== correctLetters[currentLetterIndex] && (
                                            <span className="error-text">Wrong!</span>
                                        )}
                                    </div>
                                );
                            })}
                            <div className="space-box"></div>
                        </div>
                    ))}
                </div>
            {isCorrect && <div className="success-message">Correct!</div>}
            {gameOver && (
                <div className="game-over-screen full-screen">
                    <h2>Game Over!</h2>
                    <p>Your score: {userInput.filter(letter => letter !== "").length}</p>
                    <input 
                        type="text" 
                        placeholder="Enter your name" 
                        value={playerName} 
                        onChange={(e) => setPlayerName(e.target.value)} 
                    />
                    <button onClick={() => console.log(`Saving score for ${playerName}`)}>Submit Score</button>
                </div>
            )}
            </div>
            <div className="life-bar centered">
                {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i} className={`heart ${i < lives ? "full" : "empty"}`}>&#10084;</span>
                ))}
            </div>
            {/* Hint Character */}
            <div className="hint-character" onClick={showBogusHint}>
    <img src="/hint-character.png" alt="Hint Character" className="hint-image" />
    <div className="hint-text">Ask me</div>
    {showHint && <div className="speech-bubble">{hintText}</div>}
</div>


        </div>
    );
};

export default LetterPuzzle;
