import React, { useEffect, useState } from "react";
import "./DailyStreakBox.css";

const DailyStreakBox = () => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    const cached = localStorage.getItem("userStreak");
    if (cached) {
      const parsed = JSON.parse(cached);
      setCurrentStreak(parsed.current || 0);
      setLongestStreak(parsed.longest || 0);
    }

    const fetchStreak = async () => {
      try {
        const res = await fetch("http://localhost:5000/user-profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (data.success && data.user.streak) {
          setCurrentStreak(data.user.streak.current || 0);
          setLongestStreak(data.user.streak.longest || 0);
        }
      } catch (err) {
        console.error("Failed to fetch streak info:", err);
      }
    };

    fetchStreak();
  }, []);

  return (
    <div className="noir-box streak-box">
      <h2>Daily Streak</h2>
      <div className="streak-metrics">
        <div className="streak-item">
          <span className="label">Current:</span>
          <span className="value">
            {currentStreak} day{currentStreak !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="streak-item">
          <span className="label">Longest:</span>
          <span className="value">
            {longestStreak} day{longestStreak !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DailyStreakBox;
