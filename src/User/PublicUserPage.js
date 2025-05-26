import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserPage.css';
import backgroundImg from '../assets/pictures/userpage/user-background.png';

const PublicUserPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`http://localhost:5000/public-profile/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUserData(data.user);
        }
      });
  }, [username]);

  if (!userData) {
    return (
      <div className="user-page-wrapper">
        <div className="profile-container">
          <p style={{ padding: "20px" }}>Loading profile...</p>
        </div>
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
        paddingTop: '60px'
      }}
    >
      <div className="profile-container">
        <div className="parchment-box two-column-layout">
          <div className="left-column">
            <div className="noir-box user-info-box">
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px' }}>
                <button
                  onClick={() => navigate('/profile')}
                  className="send-button"
                >
                  Return to own profile
                </button>
              </div>

              <h2>Detective Profile</h2>

              <div className="profile-section">
                <div className="profile-pic-wrapper">
                  {userData.picture ? (
                    <img src={`http://localhost:5000${userData.picture}`} alt="Profile" />
                  ) : (
                    <span className="upload-placeholder">?</span>
                  )}
                </div>
                <div className="user-details">
                  <p><strong>Username:</strong> {userData.username}</p>
                  <p><strong>Joined:</strong> {userData.joined}</p>
                </div>
              </div>

              <div className="about-me-section">
                <label><strong>About Me:</strong></label>
                <div className="about-static-box">{userData.about || "No description yet."}</div>
              </div>
            </div>

            <div className="noir-box">
              <div className="section-header">
                <h3>Friends</h3>
              </div>
              <div className="section">
                {userData.friends?.length > 0 ? (
                  userData.friends.map((friend) => (
                    <div key={friend.username} className="friend-item">
                      <div className="friend-info">
                        <div className="friend-avatar-container">
                          {friend.picture ? (
                            <img
                              src={`http://localhost:5000${friend.picture}`}
                              alt="profile"
                              className="friend-avatar"
                            />
                          ) : (
                            <div className="friend-avatar placeholder">?</div>
                          )}
                        </div>
                        <span>{friend.username}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="dim"><em>No friends listed</em></p>
                )}
              </div>
            </div>
          </div>

          <div className="right-column">
            <div className="noir-box">
              <div className="section-header">
                <h3>Daily Streak</h3>
              </div>
              <div className="section">
                <p><strong>Current:</strong> {userData.streak?.current || 0} days</p>
                <p><strong>Longest:</strong> {userData.streak?.longest || 0} days</p>
              </div>
            </div>

            <div className="noir-box">
              <div className="section-header">
                <h3>Category Stamps</h3>
              </div>
              <div className="section stamps-section">
                {userData.stamps?.length > 0 ? (
                  userData.stamps.map((stamp, i) => (
                    <div key={i} className="stamp-box">{stamp}</div>
                  ))
                ) : (
                  <p className="dim"><em>No stamps yet</em></p>
                )}
              </div>
            </div>

            <div className="noir-box">
              <div className="section-header">
                <h3>Groups</h3>
              </div>
              <div className="section">
                {userData.groups?.length > 0 ? (
                  userData.groups.map((group, i) => (
                    <p key={i}>{group}</p>
                  ))
                ) : (
                  <p className="dim"><em>Not in any groups</em></p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicUserPage;
