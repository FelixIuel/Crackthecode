import React, { useEffect, useState } from "react";
import "./DailyStreakBox.css";

const DailyStreakBox = () => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    const streakData = {
      current: 4,
      longest: 10,
    };

    setCurrentStreak(streakData.current);
    setLongestStreak(streakData.longest);
  }, []);

  return (
    <div className="noir-box streak-box">
      <h2>Daily Streak</h2>
      <div className="streak-metrics">
        <div className="streak-item">
          <span className="label">Current:</span>
          <span className="value">{currentStreak} day{currentStreak !== 1 ? "s" : ""}</span>
        </div>
        <div className="streak-item">
          <span className="label">Longest:</span>
          <span className="value">{longestStreak} day{longestStreak !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </div>
  );
};

export default DailyStreakBox;
