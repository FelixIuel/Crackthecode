// This scripts is for displays and allows editing of the user's profile info ("About Me" box) on the user page.
// Used in UserPage.js

// React imports
import React, { useState, useEffect, useRef } from 'react';
import './UserInfoBox.css';

const UserInfoBox = () => {
  // State for user data fetched from backend
  const [userData, setUserData] = useState(null);
  // State to toggle edit mode for the "About Me" section
  const [isEditing, setIsEditing] = useState(false);
  // Temporary state for editing the "About Me" text
  const [tempAbout, setTempAbout] = useState("");
  // Ref for the hidden file input (profile picture upload)
  const fileInputRef = useRef(null);

  // Fetch user profile data when component mounts
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

  // Save the edited "About Me" text to the backend
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
        // Update local state with new about text
        setUserData({ ...userData, about: tempAbout });
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to save about:", err);
    }
  };

  // Trigger the hidden file input when profile picture area is clicked
  const handleUploadClick = () => fileInputRef.current.click();

  // Handle profile picture file selection and upload to backend
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
        // Update local state with new profile picture path
        setUserData({ ...userData, picture: data.picture });
      }
    } catch (err) {
      console.error("Failed to upload picture:", err);
    }
  };

  // Show loading state while fetching user data
  if (!userData) return <div className="noir-box">Loading...</div>;

  return (
    <div className="noir-box user-info-box">
      <h2>Detective Profile</h2>

      {/* Profile picture and basic info */}
      <div className="profile-section">
        <div className="profile-pic-wrapper" onClick={handleUploadClick}>
          {userData.picture ? (
            // Show profile picture if available
            <img src={`http://localhost:5000${userData.picture}`} alt="Profile" />
          ) : (
            // Otherwise, show upload placeholder
            <span className="upload-placeholder">Upload</span>
          )}
          {/* Hidden file input for uploading new profile picture */}
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

      {/* About Me section */}
      <div className="about-me-section">
        <label><strong>About Me:</strong></label>
        {isEditing ? (
          // Edit mode: show textarea and save button
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
          // View mode: show about text and edit button
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
