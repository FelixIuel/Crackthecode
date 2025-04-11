import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/pictures/general/logo192.png';
import './Header.css';

function Header({
  onLoginClick,
  onSignupClick,
  showLoginModal,
  setShowLoginModal,
  showSignupModal,
  setShowSignupModal,
  isLoggedIn,
  setIsLoggedIn
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState("");

  const isModalOpen = showLoginModal || showSignupModal;
  const isSignup = showSignupModal;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "null" && token !== "undefined" && token.trim() !== "") {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        setIsLoggedIn(true);
        showMessage("Login successful!");
        setShowLoginModal(false);
      } else {
        showMessage("Login failed!");
      }
    } catch (error) {
      console.error('Error logging in:', error);
      showMessage("Something went wrong.");
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      showMessage(data.message || "Signup failed");
      setIsLoggedIn(true);
      setShowSignupModal(false);
    } catch (error) {
      console.error('Error signing up:', error);
      showMessage("Something went wrong.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    showMessage("Logged out");
  };

  return (
    <>
      {message && (
        <div className="header-message">{message}</div>
      )}

      <header className="main-header">
        <div className="logo-title">
          <img src={logo} alt="Logo" />
          <Link to="/">Crack The Code</Link>
        </div>

        <nav className="nav-links">
          <div className="dropdown-wrapper">
            <span className="dropdown-title">Play</span>
            <div className="dropdown-menu">
              <Link to="/" className="dropdown-item">Endless Run</Link>
              <Link to="/daily" className="dropdown-item">Daily Sentence</Link>
            </div>
          </div>

          <Link to="/explanation" className="nav-link">How to Play</Link>
          <Link to="/scoreboard" className="nav-link">Scoreboard</Link>
        </nav>

        <div className="auth-buttons">
          {!isLoggedIn ? (
            <>
              <button onClick={onLoginClick} className="login-btn">Login</button>
              <button onClick={onSignupClick} className="signup-btn">Sign Up</button>
            </>
          ) : (
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          )}
        </div>
      </header>

      {isModalOpen && (
        <div className="auth-modal">
          <h2 style={{ color: 'white', textAlign: 'center' }}>
            {isSignup ? 'Sign Up' : 'Login'}
          </h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="modal-buttons">
            <button
              onClick={isSignup ? handleSignup : handleLogin}
              className="submit-btn"
            >
              {isSignup ? 'Sign Up' : 'Login'}
            </button>
            <button
              onClick={() => {
                setShowLoginModal(false);
                setShowSignupModal(false);
              }}
              className="close-btn"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
