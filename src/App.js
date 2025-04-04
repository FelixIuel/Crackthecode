import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GamePage from './GamePage';
import ExplanationPage from './ExplanationPage';
import ScoreboardPage from './ScoreboardPage';
import Header from './Header';

function App() {
  return (
    <Router>
      <div>
        {/* Use the header in every page */}
        <Header />
        
        {/* Set up the routes using Routes (not Switch) */}
        <Routes>
          <Route exact path="/" element={<GamePage />} />
          <Route path="/explanation" element={<ExplanationPage />} />
          <Route path="/scoreboard" element={<ScoreboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
