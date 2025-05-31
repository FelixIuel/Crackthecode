import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GamePage from './GamePage';
import ExplanationPage from './ExplanationPage';
import ScoreboardPage from './ScoreboardPage';
import DailyPuzzlePage from './DailyPuzzlePage';
import CategoriesPage from './CategoriesPage';
import UserPage from './User/UserPage';
import Header from './Header';
import PublicUserPage from './User/PublicUserPage';
import angryImage from './assets/pictures/general/fullscreen-warning.png';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [notFullscreen, setNotFullscreen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginClick = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleSignupClick = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token.trim() && token !== "null" && token !== "undefined") {
      setIsLoggedIn(true);
    }

    const checkFullscreen = () => {
      const isFullscreen = window.innerWidth >= 1024 && window.innerHeight >= 640;
      setNotFullscreen(!isFullscreen);
    };

    checkFullscreen();
    window.addEventListener('resize', checkFullscreen);
    return () => window.removeEventListener('resize', checkFullscreen);
  }, []);

  return (
    <Router>
      <div>
        <Header
          onLoginClick={handleLoginClick}
          onSignupClick={handleSignupClick}
          showLoginModal={showLogin}
          setShowLoginModal={setShowLogin}
          showSignupModal={showSignup}
          setShowSignupModal={setShowSignup}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />

        {notFullscreen && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'black',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}>
            <img src={angryImage} alt="Fullscreen Warning" style={{ maxWidth: '400px', marginBottom: '20px' }} />
            <p style={{
              fontSize: '20px',
              fontFamily: 'sans-serif',
              textAlign: 'center'
            }}>
              For the best experience, please switch to full screen.
            </p>
          </div>
        )}

        <Routes>
          <Route path="/" element={<GamePage onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} isLoggedIn={isLoggedIn} />} />
          <Route path="/explanation" element={<ExplanationPage />} />
          <Route path="/scoreboard" element={<ScoreboardPage onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} isLoggedIn={isLoggedIn} />} />
          <Route path="/daily" element={<DailyPuzzlePage onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} isLoggedIn={isLoggedIn} />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/user/:username" element={<PublicUserPage />} />
          <Route path="/profile" element={<UserPage onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} isLoggedIn={isLoggedIn} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
