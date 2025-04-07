import React, { useState } from "react";
import "./ScoreboardPage.css";

import backgroundImg from "./assets/pictures/scoreboard/scorebook-background.png";
import frameBottom from "./assets/pictures/general/frame-bottom.png";
import myIcon from "./assets/pictures/scoreboard/my-icon.png";
import globalIcon from "./assets/pictures/scoreboard/global-icon.png";
import pageTurnSound from "./assets/sounds/scoreboard/page-turn.mp3";

// Fake data
const generateFakeScores = (label = "Top", count = 25) =>
  Array.from({ length: count }, (_, i) => ({
    name: `${label} ${i + 1}`,
    score: Math.floor(Math.random() * 100),
  }));

const myScores = generateFakeScores("Me", 25);
const topScores = generateFakeScores("Top", 25);
const scoresPerPage = 10;

const ScoreboardPage = () => {
  const [myPage, setMyPage] = useState(0);
  const [topPage, setTopPage] = useState(0);
  const audio = new Audio(pageTurnSound);

  const handlePageChange = (type, direction) => {
    audio.play();
    if (type === "my") {
      setMyPage((prev) => Math.max(0, prev + direction));
    } else if (type === "top") {
      setTopPage((prev) => Math.max(0, prev + direction));
    }
  };

  const paginated = (list, page) =>
    list.slice(page * scoresPerPage, (page + 1) * scoresPerPage);

  return (
    <div className="scoreboard-page-wrapper">
      <div
        className="scoreboard-background"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div className="scoreboard-container">
          {/* LEFT COLUMN */}
          <div className="score-column left">
            <div className="score-header">
              <img src={myIcon} alt="My Scores" className="header-icon" />
            </div>
            {paginated(myScores, myPage).map((entry, i) => (
              <div key={i} className="score-entry">
                #{myPage * scoresPerPage + i + 1} — {entry.score} points
              </div>
            ))}
            <div className="arrows">
              {myPage > 0 && (
                <div
                  className="arrow-button left-arrow"
                  onClick={() => handlePageChange("my", -1)}
                >
                  ◀
                </div>
              )}
              {myScores.length > (myPage + 1) * scoresPerPage && (
                <div
                  className="arrow-button right-arrow"
                  onClick={() => handlePageChange("my", 1)}
                >
                  ▶
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="score-column right">
            <div className="score-header">
              <img src={globalIcon} alt="Top Players" className="header-icon" />
            </div>
            {paginated(topScores, topPage).map((entry, i) => (
              <div key={i} className="score-entry">
                #{topPage * scoresPerPage + i + 1} — {entry.name}: {entry.score} points
              </div>
            ))}
            <div className="arrows">
              {topPage > 0 && (
                <div
                  className="arrow-button left-arrow"
                  onClick={() => handlePageChange("top", -1)}
                >
                  ◀
                </div>
              )}
              {topScores.length > (topPage + 1) * scoresPerPage && (
                <div
                  className="arrow-button right-arrow"
                  onClick={() => handlePageChange("top", 1)}
                >
                  ▶
                </div>
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
