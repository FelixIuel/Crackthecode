import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import hintCharacter from "./assets/pictures/gamepage/hint-character.png";

const DailyLetterPuzzle = ({ onLoginClick, onSignupClick, isLoggedIn }) => {
  const sentence = "Daily sentence is here";
  const category = "Daily Puzzle";
  const hint = "This is your only shot!";
  const letterMapping = {}; // Empty for now – can add later if needed
  const revealedLetters = [];

  const [userInput, setUserInput] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState("");

  const inputRefs = useRef([]);
  const timeoutRefs = useRef({});

  const correctLetters = sentence.replace(/[^a-zA-Z]/g, "").split("");
  const words = sentence.split(" ");

  useEffect(() => {
    const cleanSentence = sentence.replace(/[^a-zA-Z]/g, "");
    const initialInput = Array(cleanSentence.length).fill("");

    revealedLetters.forEach((letter) => {
      for (let i = 0; i < cleanSentence.length; i++) {
        if (cleanSentence[i].toLowerCase() === letter.toLowerCase()) {
          initialInput[i] = letter.toLowerCase();
        }
      }
    });

    setUserInput(initialInput);
    inputRefs.current = [];
    timeoutRefs.current = {};
  }, []);

  const handleChange = (index, value) => {
    if (/^[a-zA-Z]?$/.test(value)) {
      const newInput = [...userInput];
      const lowercase = value.toLowerCase();
      newInput[index] = lowercase;
      setUserInput(newInput);

      const correctLetter = correctLetters[index]?.toLowerCase();

      if (lowercase === correctLetter) {
        if (timeoutRefs.current[index]) {
          clearTimeout(timeoutRefs.current[index]);
          delete timeoutRefs.current[index];
        }

        const nextIndex = newInput.findIndex((val, i) => i > index && val === "");
        if (nextIndex !== -1 && inputRefs.current[nextIndex]) {
          inputRefs.current[nextIndex].focus();
        }

        const fullInput = newInput.join("").toLowerCase();
        const correctAnswer = correctLetters.join("").toLowerCase();
        if (fullInput === correctAnswer) {
          setIsCorrect(true);
        }

        return;
      }

      setLives((prev) => {
        const updated = Math.max(prev - 1, 0);
        if (updated === 0) setGameOver(true);
        return updated;
      });

      if (timeoutRefs.current[index]) {
        clearTimeout(timeoutRefs.current[index]);
      }

      timeoutRefs.current[index] = setTimeout(() => {
        setUserInput((prevInput) => {
          const updated = [...prevInput];
          if (updated[index]?.toLowerCase() !== correctLetter) {
            updated[index] = "";
          }
          return updated;
        });
        delete timeoutRefs.current[index];
      }, 1000);
    }
  };

  const showBogusHint = () => {
    setHintText("Try your best!");
    setShowHint(true);
    setTimeout(() => setShowHint(false), 3000);
  };

  let letterIndex = 0;

  return (
    <div className="game-wrapper">
      {gameOver && <div className="game-overlay"></div>}

      <div className="game-area">
        <div className="game-header">
          <h2 className="category">{category}</h2>
          <p className="hint">{hint}</p>
        </div>

        <div className="input-container">
          {words.map((word, wordIndex) => (
            <React.Fragment key={wordIndex}>
              <div className="word-group">
                {word.split("").map((char, i) => {
                  const isLetter = /[a-zA-Z]/.test(char);
                  let currentLetterIndex = null;

                  if (isLetter) {
                    currentLetterIndex = letterIndex;
                    letterIndex++;
                  }

                  return isLetter ? (
                    <div key={`${wordIndex}-${i}`} className="input-box">
                      <input
                        ref={(el) => (inputRefs.current[currentLetterIndex] = el)}
                        type="text"
                        disabled={gameOver}
                        className={
                          userInput[currentLetterIndex] &&
                          userInput[currentLetterIndex].toLowerCase() ===
                            correctLetters[currentLetterIndex]?.toLowerCase()
                            ? "correct-input"
                            : userInput[currentLetterIndex] &&
                              userInput[currentLetterIndex].toLowerCase() !==
                                correctLetters[currentLetterIndex]?.toLowerCase()
                            ? "incorrect"
                            : ""
                        }
                        readOnly={
                          userInput[currentLetterIndex] &&
                          userInput[currentLetterIndex].toLowerCase() ===
                            correctLetters[currentLetterIndex]?.toLowerCase()
                        }
                        maxLength="1"
                        value={userInput[currentLetterIndex]}
                        onChange={(e) =>
                          handleChange(currentLetterIndex, e.target.value)
                        }
                      />
                      <span className="number-label">
                        {letterMapping[char.toLowerCase()] || ""}
                      </span>
                      {userInput[currentLetterIndex] &&
                        userInput[currentLetterIndex].toLowerCase() !==
                          correctLetters[currentLetterIndex]?.toLowerCase() && (
                          <span className="error-text">Wrong!</span>
                        )}
                    </div>
                  ) : null;
                })}
              </div>
              {wordIndex < words.length - 1 && (
                <div className="space-box">&nbsp;&nbsp;&nbsp;</div>
              )}
            </React.Fragment>
          ))}
        </div>

        {isCorrect && <div className="success-message">Correct!</div>}

        {gameOver && (
          <div className="game-over-screen full-screen">
            <h2>Game Over!</h2>
            <p>You lost all your lives. Try again tomorrow!</p>
          </div>
        )}
      </div>

      <div className="life-bar centered">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className={`heart ${i < lives ? "full" : "empty"}`}>
            &#10084;
          </span>
        ))}
      </div>

      <div className="hint-character" onClick={showBogusHint}>
        <img
          src={hintCharacter}
          alt="Hint Character"
          className="hint-image"
        />
        <div className="hint-text">Ask me</div>
        {showHint && <div className="speech-bubble">{hintText}</div>}
      </div>
    </div>
  );
};

export default DailyLetterPuzzle;
