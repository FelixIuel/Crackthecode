import React, { useEffect, useState } from 'react';
import './UserPage.css';
import { useNavigate } from 'react-router-dom';

import UserInfoBox from './UserInfoBox';
import FriendsBox from './FriendsBox';
import StreakBox from './DailyStreakBox';
import StampsBox from './StampsBox';
import GroupsBox from './GroupsBox';
import ChatWindow from './ChatWindow';

import guestImage from '../assets/pictures/general/Daily-sentence-Picture.png';
import backgroundImg from '../assets/pictures/userpage/user-background.png';

// Main user profile page
const UserPage = ({ onLoginClick, onSignupClick, isLoggedIn }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chatTarget, setChatTarget] = useState(null); // Who we're chatting with
  const [chatType, setChatType] = useState('friend'); // 'friend' or 'group'
  const [searchInput, setSearchInput] = useState('');
  const [loadError, setLoadError] = useState(false); // <-- NEW
  const navigate = useNavigate();

  // Check authentication status on mount or login state change
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined" || token.trim() === "") {
      setIsAuthenticated(false);
      setLoadError(false);
      return;
    }
    // Check token validity with backend
    fetch("http://localhost:5000/user-profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsAuthenticated(true);
          setLoadError(false);
        } else {
          setIsAuthenticated(true); // Still treat as logged in, but show error
          setLoadError(true);
        }
      })
      .catch(() => {
        setIsAuthenticated(true);
        setLoadError(true);
      });
  }, [isLoggedIn]);

  // Show login/signup prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{
        backgroundColor: "black", color: "white", minHeight: "100vh",
        display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center", padding: "40px", textAlign: "center"
      }}>
        <img src={guestImage} alt="Detective Login Required"
             style={{ width: "280px", maxWidth: "90%", marginBottom: "30px" }} />
        <p style={{ fontSize: "20px", fontWeight: "bold", maxWidth: "600px", lineHeight: "1.5" }}>
          To access your profile, please{" "}
          <span onClick={onLoginClick} style={{ color: "#00BFFF", textDecoration: "underline", cursor: "pointer" }}>log in</span>{" "}
          or{" "}
          <span onClick={onSignupClick} style={{ color: "#32CD32", textDecoration: "underline", cursor: "pointer" }}>sign up</span>.
        </p>
      </div>
    );
  }

  // Main profile UI
  return (
    <div
      className="user-page-wrapper"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        fontFamily: '"Courier New", Courier, monospace',
      }}
    >
      <div className="profile-container">
        <div className="parchment-box two-column-layout">
          <div className="left-column">
            {loadError && (
              <div className="error-message" style={{ color: "red", margin: "16px 0" }}>
                Could not load your profile data. Try logging out and in again.
              </div>
            )}
            <UserInfoBox />
            <FriendsBox
              onChat={(user) => {
                setChatTarget(user);
                setChatType('friend');
              }}
            />
            <GroupsBox
              onChat={(group) => {
                setChatTarget(group);
                setChatType('group');
              }}
            />
          </div>
          <div className="right-column">
            <StreakBox />
            <StampsBox />
            {/* Simple user search */}
            <div className="search-other-users">
              <h3>Search for other profiles</h3>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter username..."
                  className="friend-search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/user/${searchInput}`)}
                />
                <button
                  className="send-button"
                  onClick={() => navigate(`/user/${searchInput}`)}
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat overlay appears when a chat target is set */}
      {chatTarget && (
        <div className="chat-overlay">
          <ChatWindow
            target={chatTarget}
            type={chatType}
            onClose={() => setChatTarget(null)}
          />
        </div>
      )}
    </div>
  );
};

export default UserPage;