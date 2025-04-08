import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GamePage from './GamePage';
import ExplanationPage from './ExplanationPage';
import ScoreboardPage from './ScoreboardPage';
import Header from './Header';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <Router>
      <div>
        <Header
          onLoginClick={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
          onSignupClick={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          showLoginModal={showLogin}
          setShowLoginModal={setShowLogin}
          showSignupModal={showSignup}
          setShowSignupModal={setShowSignup}
        />

        <Routes>
          <Route
            path="/"
            element={
              <GamePage
                onLoginClick={() => {
                  setShowSignup(false);
                  setShowLogin(true);
                }}
                onSignupClick={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                }}
              />
            }
          />
          <Route path="/explanation" element={<ExplanationPage />} />
          <Route path="/scoreboard" element={<ScoreboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
