import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import hintCharacter from "./assets/pictures/gamepage/hint-character.png";
import { v4 as uuidv4 } from "uuid";

const LetterPuzzle = ({ onLoginClick, onSignupClick, isLoggedIn }) => {
  const [sentence, setSentence] = useState("");
  const [category, setCategory] = useState("");
  const [hint, setHint] = useState("");
  const [letterMapping, setLetterMapping] = useState({});
  const [revealedLetters, setRevealedLetters] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lives, setLives] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState("");
  const [score, setScore] = useState(0);
  const [usedSentences, setUsedSentences] = useState([]);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [gameSessionId] = useState(uuidv4());

  const correctCount = useRef(0);
  const inputRefs = useRef([]);
  const timeoutRefs = useRef({});
  const tokenRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("token");
      if (token && token !== "undefined" && token !== "null" && token.trim() !== "") {
        tokenRef.current = token;
      }
    } else {
      tokenRef.current = null;
    }
  }, [isLoggedIn]);

  const getUniquePuzzle = async () => {
    let attempts = 0;
    while (attempts < 10) {
      const res = await fetch("http://127.0.0.1:5000/get-puzzle");
      const data = await res.json();
      if (!usedSentences.includes(data.sentence)) {
        setUsedSentences((prev) => [...prev, data.sentence]);
        return data;
      }
      attempts++;
    }
    return null;
  };

  const fetchPuzzle = () => {
    getUniquePuzzle()
      .then((data) => {
        if (!data) return;

        setSentence(data.sentence);
        setCategory(data.category);
        setHint(data.hint);

        const normalizedMap = {};
        Object.entries(data.letterMap).forEach(([key, value]) => {
          normalizedMap[key.toLowerCase()] = value;
        });
        setLetterMapping(normalizedMap);

        setRevealedLetters(data.revealedLetters || []);
        setGameOver(false);
        setIsCorrect(false);

        const cleanSentence = data.sentence.replace(/[^a-zA-Z]/g, "");
        const initialInput = Array(cleanSentence.length).fill("");

        data.revealedLetters.forEach((letter) => {
          for (let i = 0; i < cleanSentence.length; i++) {
            if (cleanSentence[i].toLowerCase() === letter.toLowerCase()) {
              initialInput[i] = letter.toLowerCase();
            }
          }
        });

        setUserInput(initialInput);
        inputRefs.current = [];
        timeoutRefs.current = {};
      })
      .catch((err) => console.error("Failed to fetch puzzle", err));
  };

  useEffect(() => {
    fetchPuzzle();
  }, []);

  const correctLetters = sentence.replace(/[^a-zA-Z]/g, "").split("");
  const words = sentence.split(" ");

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
          setScore((prev) => prev + 1);
          correctCount.current += 1;

          if (correctCount.current % 3 === 0) {
            setLives((prev) => Math.min(10, prev + 1));
          }

          setTimeout(fetchPuzzle, 2000);
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
    fetch("http://127.0.0.1:5000/get-bogus-hint")
      .then((res) => res.json())
      .then((data) => {
        setHintText(data.text || "No hint available");
        setShowHint(true);
        setTimeout(() => setShowHint(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to fetch bogus hint", err);
      });
  };

  const handlePlayAgain = () => {
    setGameOver(false);
    setUserInput([]);
    setUsedSentences([]);
    setScore(0);
    correctCount.current = 0;
    setLives(10);
    setScoreSubmitted(false);
    fetchPuzzle();
  };

  let letterIndex = 0;

  return (
    <div className="game-wrapper">
      {scoreSubmitted && (
        <div style={{
          position: "fixed",
          top: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#28a745",
          color: "white",
          padding: "10px 20px",
          borderRadius: "6px",
          fontWeight: "bold",
          zIndex: 2000
        }}>
          Score received by the Detective!
        </div>
      )}

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
            <p>Your score: {score}</p>

            {!isLoggedIn ? (
              <div style={{ marginTop: "10px", color: "gray" }}>
                Log in or sign up to save your score.<br />
                <span
                  style={{
                    color: "#007bff",
                    textDecoration: "underline",
                    cursor: "pointer",
                    marginRight: "10px"
                  }}
                  onClick={onLoginClick}
                >
                  Login
                </span>
                <span
                  style={{
                    color: "#28a745",
                    textDecoration: "underline",
                    cursor: "pointer"
                  }}
                  onClick={onSignupClick}
                >
                  Sign Up
                </span>
              </div>
            ) : (
              <button
                onClick={() => {
                  fetch("http://127.0.0.1:5000/submit-score", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${tokenRef.current}`
                    },
                    body: JSON.stringify({
                      score,
                      timestamp: new Date().toISOString(),
                      sessionId: gameSessionId,
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      setScoreSubmitted(true);
                      setTimeout(() => setScoreSubmitted(false), 3000);
                    })
                    .catch((err) => {
                      console.error("Failed to submit score", err);
                    });
                }}
              >
                Submit Score
              </button>
            )}

            <button
              onClick={handlePlayAgain}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                fontWeight: "bold"
              }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="life-bar centered">
        {Array.from({ length: 10 }).map((_, i) => (
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

export default LetterPuzzle;
