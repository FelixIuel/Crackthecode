import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/pictures/general/logo192.png';

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
      setIsLoggedIn(true); // optional but helpful if auto-login after signup
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
        <div style={{
          position: 'fixed',
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#28a745',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '6px',
          zIndex: 3000,
          boxShadow: '0px 2px 10px rgba(0,0,0,0.3)',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      <header style={{
        backgroundColor: '#1f1f1f',
        padding: '1rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
              Crack The Code
            </Link>
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
          <Link to="/" style={{ marginRight: '1rem', color: 'white', textDecoration: 'none' }}>Play</Link>
          <Link to="/explanation" style={{ marginRight: '1rem', color: 'white', textDecoration: 'none' }}>How to Play</Link>
          <Link to="/scoreboard" style={{ color: 'white', textDecoration: 'none' }}>Scoreboard</Link>
        </div>

        {/* Auth Buttons */}
        <div style={{ marginLeft: 'auto' }}>
          {!isLoggedIn ? (
            <>
              <button
                onClick={onLoginClick}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007BFF',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  marginRight: '1rem'
                }}
              >
                Login
              </button>
              <button
                onClick={onSignupClick}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                color: 'white',
                backgroundColor: 'transparent',
                border: '1px solid white',
                padding: '0.5rem 1rem'
              }}
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: '2rem',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          width: '300px',
          zIndex: 2000
        }}>
          <h2 style={{ color: 'white', textAlign: 'center' }}>{isSignup ? 'Sign Up' : 'Login'}</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              marginBottom: '1rem',
              padding: '0.5rem',
              borderRadius: '4px',
              width: '100%',
              display: 'block',
              boxSizing: 'border-box',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              marginBottom: '1rem',
              padding: '0.5rem',
              borderRadius: '4px',
              width: '100%',
              display: 'block',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={isSignup ? handleSignup : handleLogin}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: isSignup ? '#28a745' : '#007BFF',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                width: '48%'
              }}
            >
              {isSignup ? 'Sign Up' : 'Login'}
            </button>
            <button
              onClick={() => {
                setShowLoginModal(false);
                setShowSignupModal(false);
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                width: '48%'
              }}
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
