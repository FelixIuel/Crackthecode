import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import GamePage from './GamePage';
import ExplanationPage from './ExplanationPage';
import ScoreboardPage from './ScoreboardPage';
import DailyPuzzlePage from './DailyPuzzlePage';
import CategoriesPage from './CategoriesPage';
import UserPage from './User/UserPage';
import Header from './Header';

import angryImage from './assets/pictures/general/fullscreen-warning.png';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [notFullscreen, setNotFullscreen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "null" && token !== "undefined" && token.trim() !== "") {
      setIsLoggedIn(true);
    }

    const checkFullscreen = () => {
      const minWidth = 1024;
      const minHeight = 640;
      const isFullscreen = window.innerWidth >= minWidth && window.innerHeight >= minHeight;
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
              fontSize: '22px',
              fontFamily: "'Courier New', Courier, monospace",
              textAlign: 'center'
            }}>
              Please put me back in full screen
            </p>
          </div>
        )}

        <Routes>
          <Route path="/" element={
            <GamePage
              onLoginClick={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
              onSignupClick={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
              isLoggedIn={isLoggedIn}
            />
          } />
          <Route path="/explanation" element={<ExplanationPage />} />
          <Route path="/scoreboard" element={
            <ScoreboardPage
              onLoginClick={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
              onSignupClick={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
              isLoggedIn={isLoggedIn}
            />
          } />
          <Route path="/daily" element={
            <DailyPuzzlePage
              onLoginClick={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
              onSignupClick={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
              isLoggedIn={isLoggedIn}
            />
          } />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/profile" element={
            <UserPage
              onLoginClick={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
              onSignupClick={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
              isLoggedIn={isLoggedIn}
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
