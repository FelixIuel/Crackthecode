import React, { useEffect, useState } from 'react';

function ScoreboardPage() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/get-highscores')
      .then(res => res.json())
      .then(data => setScores(data));
  }, []);

  return (
    <div>
      <h1>Scoreboard</h1>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>
            {score.name}: {score.score}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ScoreboardPage;
