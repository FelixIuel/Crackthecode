import React, { useState, useEffect, useRef } from 'react';
import './UserInfoBox.css';

const UserInfoBox = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempAbout, setTempAbout] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/user-profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setUserData(data.user);
          setTempAbout(data.user.about || "");
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5000/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ about: tempAbout }),
      });

      const data = await res.json();
      if (data.success) {
        setUserData({ ...userData, about: tempAbout });
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to save about:", err);
    }
  };

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("picture", file);

    try {
      const res = await fetch("http://localhost:5000/upload-picture", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setUserData({ ...userData, picture: data.picture });
      }
    } catch (err) {
      console.error("Failed to upload picture:", err);
    }
  };

  if (!userData) return <div className="noir-box">Loading...</div>;

  return (
    <div className="noir-box user-info-box">
      <h2>Detective Profile</h2>

      <div className="profile-section">
        <div className="profile-pic-wrapper" onClick={handleUploadClick}>
          {userData.picture ? (
            <img src={`http://localhost:5000${userData.picture}`} alt="Profile" />
          ) : (
            <span className="upload-placeholder">Upload</span>
          )}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <div className="user-details">
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Joined:</strong> {userData.joined || "Unknown"}</p>
        </div>
      </div>

      <div className="about-me-section">
        <label><strong>About Me:</strong></label>
        {isEditing ? (
          <>
            <textarea
              value={tempAbout}
              onChange={(e) => setTempAbout(e.target.value)}
              maxLength={240}
              className="about-textarea"
            />
            <div className="char-counter">{tempAbout.length} / 240</div>
            <button className="edit-save-btn" onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            <div className="about-static-box">{userData.about || "No description yet."}</div>
            <button className="edit-save-btn" onClick={() => setIsEditing(true)}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserInfoBox;
