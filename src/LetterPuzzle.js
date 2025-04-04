import React, { useEffect, useState } from "react";
import "./App.css";

const LetterPuzzle = () => {
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

  // 🔐 Strict token check
  const rawToken = localStorage.getItem("token");
  console.log("rawToken:", rawToken);
  const token =
    rawToken &&
    rawToken !== "undefined" &&
    rawToken !== "null" &&
    rawToken.trim() !== ""
      ? rawToken
      : null;
  const isLoggedIn = !!token;

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
        setLives(10);
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
      newInput[index] = value.toLowerCase();
      setUserInput(newInput);

      if (value.toLowerCase() !== correctLetters[index].toLowerCase()) {
        setLives((prev) => {
          const updated = Math.max(prev - 1, 0);
          if (updated === 0) setGameOver(true);
          return updated;
        });

        setTimeout(() => {
          setUserInput((prevInput) => {
            const updatedInput = [...prevInput];
            updatedInput[index] = "";
            return updatedInput;
          });
        }, 2000);
      }

      const fullInput = newInput.join("").toLowerCase();
      const correctAnswer = correctLetters.join("").toLowerCase();

      if (fullInput === correctAnswer) {
        setIsCorrect(true);
        setScore((prev) => prev + 1);
        setTimeout(fetchPuzzle, 2000);
      }
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

  const submitScore = () => {
    if (!token) return;
    fetch("http://127.0.0.1:5000/submit-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ score })
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Score submitted!");
      })
      .catch((err) => {
        console.error("Failed to submit score", err);
        alert("Something went wrong saving your score.");
      });
  };

  let letterIndex = 0;

  return (
    <div className="game-wrapper">
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
              <p style={{ marginTop: "10px", color: "gray" }}>
                Log in or sign up to save your score.
              </p>
            ) : (
              <button onClick={submitScore}>Submit Score</button>
            )}
          </div>
        )}
      </div>

      <div className="life-bar centered">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={`heart ${i < lives ? "full" : "empty"}`}>&#10084;</span>
        ))}
      </div>

      <div className="hint-character" onClick={showBogusHint}>
        <img src="/hint-character.png" alt="Hint Character" className="hint-image" />
        <div className="hint-text">Ask me</div>
        {showHint && <div className="speech-bubble">{hintText}</div>}
      </div>
    </div>
  );
};

export default LetterPuzzle;
