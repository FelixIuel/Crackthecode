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

const UserPage = ({ onLoginClick, onSignupClick, isLoggedIn }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chatTarget, setChatTarget] = useState(null);
  const [chatType, setChatType] = useState('friend');
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(
      !!token && token !== "null" && token !== "undefined" && token.trim() !== ""
    );
  }, [isLoggedIn]);

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
