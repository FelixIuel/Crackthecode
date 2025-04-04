import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);  // State for modal visibility
  const [isSignup, setIsSignup] = useState(false);  // To toggle between Login and Signup

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
        setUser(email); // Store logged-in user
        alert('Login successful!');
        setIsModalOpen(false);  // Close the modal after login
      } else {
        alert('Login failed!');
      }
    } catch (error) {
      console.error('Error logging in:', error);
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
      alert(data.message || 'Signup failed');
      setIsModalOpen(false);  // Close the modal after sign up
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    alert('Logged out');
  };

  return (
    <header style={{
      backgroundColor: '#1f1f1f',
      padding: '1rem',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      {/* Left - Logo Section */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/logo192.png" alt="Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            Crack The Code
          </Link>
        </div>
      </div>

      {/* Center - Navigation Links */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexGrow: 1
      }}>
        <Link to="/" style={{ marginRight: '1rem', color: 'white', textDecoration: 'none' }}>Play</Link>
        <Link to="/explanation" style={{ marginRight: '1rem', color: 'white', textDecoration: 'none' }}>How to Play</Link>
        <Link to="/scoreboard" style={{ color: 'white', textDecoration: 'none' }}>Scoreboard</Link>
      </div>

      {/* Right - Login/Signup Buttons */}
      <div style={{ marginLeft: 'auto' }}>
        {!user ? (
          <div>
            <button
              onClick={() => { setIsModalOpen(true); setIsSignup(false); }}
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
              onClick={() => { setIsModalOpen(true); setIsSignup(true); }}
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
          </div>
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

      {/* Modal Popup for Login/SignUp */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '2rem',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          width: '300px',
          zIndex: '1000'
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
              borderRadius: '4px'
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
              borderRadius: '4px'
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
              onClick={() => setIsModalOpen(false)}
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
    </header>
  );
}

export default Header;
