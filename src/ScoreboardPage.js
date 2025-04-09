import React, { useEffect, useState } from "react";
import "./ScoreboardPage.css";
import backgroundImg from "./assets/pictures/scoreboard/scorebook-background.png";
import frameBottom from "./assets/pictures/general/frame-bottom.png";
import questionImage from "./assets/pictures/scoreboard/guest-question.png";
import arrowDown from "./assets/pictures/scoreboard/arrow-down.png";
import arrowUp from "./assets/pictures/scoreboard/arrow-up.png";
import arrowLeft from "./assets/pictures/scoreboard/arrow-left.png";
import arrowRight from "./assets/pictures/scoreboard/arrow-right.png";
import pageTurnSound from "./assets/sounds/scoreboard/page-turn.mp3";

const ScoreboardPage = ({ onLoginClick, onSignupClick, isLoggedIn }) => {
  const [myScores, setMyScores] = useState([]);
  const [topScores, setTopScores] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [myPage, setMyPage] = useState(0);
  const [topPage, setTopPage] = useState(0);
  const scoresPerPage = 35;
  const audio = new Audio(pageTurnSound);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    fetch("http://127.0.0.1:5000/get-highscores")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTopScores(data.highscores);
      });

    if (token) {
      fetch("http://127.0.0.1:5000/my-scores", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const sorted = [...data.scores].sort((a, b) => b.score - a.score);
            setMyScores(sorted);
          }
        });
    }
  }, [isLoggedIn]);

  const handlePageChange = (type, direction) => {
    audio.play();
    setTimeout(() => {
      if (type === "my") {
        setMyPage((prev) => Math.max(0, prev + direction));
      } else if (type === "top") {
        setTopPage((prev) => Math.max(0, prev + direction));
      }
    }, 1000);
  };

  const toggleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const myPaginated = myScores.slice(myPage * scoresPerPage, (myPage + 1) * scoresPerPage);
  const topPaginated = topScores.slice(topPage * scoresPerPage, (topPage + 1) * scoresPerPage);

  return (
    <div className="scoreboard-page-wrapper">
      <div className="scoreboard-background-wrapper">
        <img src={backgroundImg} alt="Notebook" className="scoreboard-background-image" />
        <div className="scoreboard-overlay">
          <div className="score-column left">
            {isAuthenticated ? (
              <>
                <div className="score-header"><h1>My Scores</h1></div>
                {myPaginated.map((entry, index) => (
                  <div key={index} className="score-entry">
                    <div className="score-line">
                      #{myPage * scoresPerPage + index + 1} — {entry.score} points
                      <img
                        src={expandedIndex === index ? arrowUp : arrowDown}
                        alt="toggle"
                        className="expand-icon"
                        onClick={() => toggleExpand(index)}
                      />
                    </div>
                    {expandedIndex === index && (
                      <div className="score-details">
                        Played: {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
                <div className="arrows">
                  {myPage > 0 && (
                    <img
                      src={arrowLeft}
                      className="arrow-button"
                      onClick={() => handlePageChange("my", -1)}
                      alt="Previous"
                    />
                  )}
                  {myScores.length > (myPage + 1) * scoresPerPage && (
                    <img
                      src={arrowRight}
                      className="arrow-button"
                      onClick={() => handlePageChange("my", 1)}
                      alt="Next"
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="guest-prompt-wrapper">
                <img src={questionImage} alt="Guest" className="guest-image" />
                <div className="guest-text">
                  Please <span onClick={onLoginClick}>log in</span> or{" "}
                  <span onClick={onSignupClick}>sign up</span> to view your scores
                </div>
              </div>
            )}
          </div>

          <div className="score-column right">
            <div className="score-header"><h1>Top Players</h1></div>
            {topPaginated.map((entry, index) => (
              <div key={index} className="score-entry">
                #{topPage * scoresPerPage + index + 1} — {entry.email || "Unknown"}: {entry.score} points
              </div>
            ))}
            <div className="arrows">
              {topPage > 0 && (
                <img
                  src={arrowLeft}
                  className="arrow-button"
                  onClick={() => handlePageChange("top", -1)}
                  alt="Previous"
                />
              )}
              {topScores.length > (topPage + 1) * scoresPerPage && (
                <img
                  src={arrowRight}
                  className="arrow-button"
                  onClick={() => handlePageChange("top", 1)}
                  alt="Next"
                />
              )}
            </div>
          </div>
        </div>
        <img src={frameBottom} alt="Frame Bottom" className="frame-bottom scoreboard-frame" />
      </div>
    </div>
  );
};

export default ScoreboardPage;
