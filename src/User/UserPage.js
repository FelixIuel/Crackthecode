import React, { useEffect, useState } from 'react';
import './UserPage.css';

import UserInfoBox from './UserInfoBox';
import FriendsBox from './FriendsBox';
import StreakBox from './DailyStreakBox';
import StampsBox from './StampsBox';

import guestImage from '../assets/pictures/general/Daily-sentence-Picture.png';
import backgroundImg from '../assets/pictures/userpage/user-background.png';

const UserPage = ({ onLoginClick, onSignupClick }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token && token !== "null" && token !== "undefined" && token.trim() !== "");
  }, []);

  if (!isAuthenticated) {
    return (
      <div
        style={{
          backgroundColor: "black",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <img
          src={guestImage}
          alt="Detective Login Required"
          style={{ width: "280px", maxWidth: "90%", marginBottom: "30px" }}
        />
        <p style={{ fontSize: "20px", fontWeight: "bold", maxWidth: "600px", lineHeight: "1.5" }}>
          To access your profile, please{" "}
          <span onClick={onLoginClick} style={{ color: "#00BFFF", textDecoration: "underline", cursor: "pointer" }}>
            log in
          </span>{" "}
          or{" "}
          <span onClick={onSignupClick} style={{ color: "#32CD32", textDecoration: "underline", cursor: "pointer" }}>
            sign up
          </span>.
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
            <FriendsBox />
          </div>
          <div className="right-column">
            <StreakBox />
            <StampsBox />
            <div className="search-other-users">
              <h3>Search for other profiles</h3>
              <input type="text" placeholder="Enter username..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
