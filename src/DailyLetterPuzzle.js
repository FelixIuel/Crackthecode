import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import hintCharacter from "./assets/pictures/gamepage/hint-character.png";
import alreadyPlayedImage from "./assets/pictures/gamepage/already-played.png";

const DailyLetterPuzzle = ({ onLoginClick, onSignupClick, isLoggedIn }) => {
  const [sentence, setSentence] = useState("");
  const [category, setCategory] = useState("Daily Puzzle");
  const [hint, setHint] = useState("Try your best!");
  const [letterMapping, setLetterMapping] = useState({});
  const [revealedLetters, setRevealedLetters] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lives, setLives] = useState(5);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [lostGame, setLostGame] = useState(false);
  const [showBlackScreen, setShowBlackScreen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState("");

  const inputRefs = useRef([]);
  const timeoutRefs = useRef({});

  useEffect(() => {
    const fetchDailyPuzzle = async () => {
      const token = localStorage.getItem("token");

      if (!token || token.trim() === "" || token === "undefined" || token === "null") return;

      try {
        const response = await fetch("http://127.0.0.1:5000/daily-puzzle", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.error) {
          if (data.error === "Already played today") {
            setTimeout(() => setShowBlackScreen(true), 500);
            setAlreadyPlayed(true);
          }
          return;
        }

        setSentence(data.sentence || "");
        setHint(data.hint || "Try your best!");
        setLetterMapping(data.letterMap || {});
        setRevealedLetters(data.revealedLetters || []);

        const cleanSentence = (data.sentence || "").replace(/[^a-zA-Z]/g, "");
        const initialInput = Array(cleanSentence.length).fill("");

        (data.revealedLetters || []).forEach((letter) => {
          for (let i = 0; i < cleanSentence.length; i++) {
            if (cleanSentence[i].toLowerCase() === letter.toLowerCase()) {
              initialInput[i] = letter.toLowerCase();
            }
          }
        });

        setUserInput(initialInput);
        inputRefs.current = [];
        timeoutRefs.current = {};

      } catch (error) {
        console.error("Failed to fetch daily puzzle:", error);
      }
    };

    fetchDailyPuzzle();
  }, []);

  useEffect(() => {
    const completePuzzle = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:5000/complete-daily-puzzle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          const profileRes = await fetch("http://127.0.0.1:5000/user-profile", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const profileData = await profileRes.json();
          if (profileData.success && profileData.user.streak) {
            localStorage.setItem("userStreak", JSON.stringify(profileData.user.streak));
          }
        }
      } catch (err) {
        console.error("Error completing puzzle:", err);
      }
    };

    if (isCorrect) {
      completePuzzle();
    }
  }, [isCorrect]);

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

        const nextIndex = newInput.findIndex((v, i) => i > index && v === "");
        if (nextIndex !== -1 && inputRefs.current[nextIndex]) {
          inputRefs.current[nextIndex].focus();
        }

        if (newInput.join("").toLowerCase() === correctLetters.join("").toLowerCase()) {
          setIsCorrect(true);
        }
        return;
      }

      setLives(prev => {
        const updated = Math.max(prev - 1, 0);
        if (updated === 0) {
          setTimeout(() => setShowBlackScreen(true), 500);
          setLostGame(true);
        }
        return updated;
      });

      if (timeoutRefs.current[index]) {
        clearTimeout(timeoutRefs.current[index]);
      }

      timeoutRefs.current[index] = setTimeout(() => {
        setUserInput(prev => {
          const updated = [...prev];
          if (updated[index] !== correctLetter) {
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
      .then(res => res.json())
      .then(data => {
        setHintText(data.text || "No hint available.");
        setShowHint(true);
        setTimeout(() => setShowHint(false), 3000);
      })
      .catch(err => {
        console.error("Failed to fetch bogus hint:", err);
      });
  };

  let letterIndex = 0;

  if (showBlackScreen) {
    return (
      <div style={{
        backgroundColor: "black",
        color: "white",
        minHeight: "calc(100vh - 80px)",
        width: "100vw",
        position: "fixed",
        top: "70px",
        left: "0",
        zIndex: "999",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "40px",
        animation: "fadeIn 1s ease forwards"
      }}>
        <img
          src={alreadyPlayedImage}
          alt="Already Played"
          style={{ width: "280px", maxWidth: "90%", marginBottom: "30px" }}
        />
        <p style={{
          fontSize: "22px",
          fontFamily: "'Courier New', Courier, monospace",
          maxWidth: "600px"
        }}>
          {alreadyPlayed ? (
            <>You already cracked today's sentence. Come back tomorrow!</>
          ) : (
            <>You lost all your lives. Try again tomorrow!</>
          )}
        </p>
      </div>
    );
  }

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
                  let idx = null;

                  if (isLetter) {
                    idx = letterIndex;
                    letterIndex++;
                  }

                  return isLetter ? (
                    <div key={`${wordIndex}-${i}`} className="input-box">
                      <input
                        ref={el => (inputRefs.current[idx] = el)}
                        type="text"
                        maxLength="1"
                        value={userInput[idx]}
                        readOnly={userInput[idx]?.toLowerCase() === correctLetters[idx]?.toLowerCase()}
                        onChange={e => handleChange(idx, e.target.value)}
                        className={
                          userInput[idx] &&
                          userInput[idx].toLowerCase() === correctLetters[idx]?.toLowerCase()
                            ? "correct-input"
                            : userInput[idx] &&
                              userInput[idx].toLowerCase() !== correctLetters[idx]?.toLowerCase()
                            ? "incorrect"
                            : ""
                        }
                        disabled={lostGame}
                      />
                      <span className="number-label">
                        {letterMapping[char.toLowerCase()] || ""}
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
              {wordIndex < words.length - 1 && <div className="space-box">&nbsp;&nbsp;&nbsp;</div>}
            </React.Fragment>
          ))}
        </div>

        {isCorrect && <div className="success-message">Correct!</div>}
      </div>

      <div className="life-bar centered">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`heart ${i < lives ? "full" : "empty"}`}>&#10084;</span>
        ))}
      </div>

      <div className="hint-character" onClick={showBogusHint}>
        <img src={hintCharacter} alt="Hint Character" className="hint-image" />
        <div className="hint-text">Ask me</div>
        {showHint && <div className="speech-bubble">{hintText}</div>}
      </div>
    </div>
  );
};

export default DailyLetterPuzzle;
