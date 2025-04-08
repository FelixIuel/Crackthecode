import React, { useState, useEffect } from "react";
import "./ScoreboardPage.css";

import backgroundImg from "./assets/pictures/scoreboard/scorebook-background.png";
import frameBottom from "./assets/pictures/general/frame-bottom.png";
import loginImage from "./assets/pictures/scoreboard/question-man.png";

import pageTurnSound from "./assets/sounds/scoreboard/page-turn.mp3";

const scoresPerPage = 35;

const ScoreboardPage = ({
  onLoginClick,
  onSignupClick,
  showLoginModal,
  showSignupModal,
  setShowLoginModal,
  setShowSignupModal
}) => {
  const [topScores, setTopScores] = useState([]);
  const [myScores, setMyScores] = useState([]);
  const [topPage, setTopPage] = useState(0);
  const [myPage, setMyPage] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const audio = new Audio(pageTurnSound);

  useEffect(() => {
    fetch("http://localhost:5000/get-highscores")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTopScores(data.highscores);
        }
      });

    const token = localStorage.getItem("token");
    if (token && token !== "null" && token !== "undefined") {
      setIsLoggedIn(true);
      fetch("http://localhost:5000/my-scores", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setMyScores(data.scores);
          }
        })
        .catch(err => console.error("Failed to fetch user scores", err));
    }
  }, []);

  const handlePageChange = (type, direction) => {
    audio.play();
    setTimeout(() => {
      if (type === "top") {
        setTopPage(prev => Math.max(0, prev + direction));
      } else {
        setMyPage(prev => Math.max(0, prev + direction));
      }
    }, 1000);
  };

  const paginated = (list, page) =>
    list.slice(page * scoresPerPage, (page + 1) * scoresPerPage);

  return (
    <div className="scoreboard-page-wrapper">
      <div className="scoreboard-background-wrapper">
        <img
          src={backgroundImg}
          alt="Notebook"
          className="scoreboard-background-image"
        />

        <div className="scoreboard-overlay">
          {/* My Scores or login prompt */}
          <div className="score-column left">
            {isLoggedIn ? (
              <>
                <div className="score-header">
                  <h1>My Scores</h1>
                </div>
                {paginated(myScores, myPage).map((entry, i) => (
                  <div key={i} className="score-entry">
                    #{myPage * scoresPerPage + i + 1} — {entry.score} points
                  </div>
                ))}
                <div className="arrows">
                  {myPage > 0 && (
                    <img
                      src="/arrow-left.png"
                      alt="Back"
                      className="arrow-button"
                      onClick={() => handlePageChange("my", -1)}
                    />
                  )}
                  {myScores.length > (myPage + 1) * scoresPerPage && (
                    <img
                      src="/arrow-right.png"
                      alt="Next"
                      className="arrow-button"
                      onClick={() => handlePageChange("my", 1)}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="login-placeholder">
                <img
                  src={loginImage}
                  alt="Login Placeholder"
                  className="login-image"
                />
                <p className="login-prompt-text">
                  Please <span onClick={onLoginClick} className="link">log in</span> or <span onClick={onSignupClick} className="link">sign up</span> to view your scores
                </p>
              </div>
            )}
          </div>

          {/* Top Scores */}
          <div className="score-column right">
            <div className="score-header">
              <h1>Top Players</h1>
            </div>
            {paginated(topScores, topPage).map((entry, i) => (
              <div key={i} className="score-entry">
                #{topPage * scoresPerPage + i + 1} — {entry.email || "Unknown"}: {entry.score} points
              </div>
            ))}
            <div className="arrows">
              {topPage > 0 && (
                <img
                  src="/arrow-left.png"
                  alt="Back"
                  className="arrow-button"
                  onClick={() => handlePageChange("top", -1)}
                />
              )}
              {topScores.length > (topPage + 1) * scoresPerPage && (
                <img
                  src="/arrow-right.png"
                  alt="Next"
                  className="arrow-button"
                  onClick={() => handlePageChange("top", 1)}
                />
              )}
            </div>
          </div>
        </div>

        <img
          src={frameBottom}
          alt="Frame Bottom"
          className="frame-bottom scoreboard-frame"
        />
      </div>
    </div>
  );
};

export default ScoreboardPage;
