import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './FriendsBox.css';

const FriendsBox = ({ onChat }) => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    fetchFriends();
    fetchRequests();
  }, []);

  const fetchFriends = () => {
    fetch('http://localhost:5000/get-friends', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) setFriends(data.friends);
    });
  };

  const fetchRequests = () => {
    fetch('http://localhost:5000/friend-requests', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) setRequests(data.friend_requests);
    });
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setStatusMessage('Searching...');
    setShowSearchResults(true);

    fetch(`http://localhost:5000/search-users/${searchQuery}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.users.length > 0) {
        setSearchResults(data.users);
        setStatusMessage(`${data.users.length} user(s) found.`);
      } else {
        setSearchResults([]);
        setStatusMessage('No users found');
      }
    });
  };

  const handleSendRequest = (username) => {
    setIsSending(true);
    fetch('http://localhost:5000/send-friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ username })
    })
    .then(res => res.json())
    .then(data => {
      setIsSending(false);
      if (data.success) {
        setStatusMessage(`Friend request sent to ${username}`);
        fetchRequests();
      } else {
        setStatusMessage(`Failed to send request to ${username}`);
      }
    });
  };

  const handleAccept = (username) => {
    fetch('http://localhost:5000/accept-friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ username })
    })
    .then(res => res.json())
    .then(data => {
      setStatusMessage(data.message || 'Friend request accepted');
      fetchFriends();
      fetchRequests();
    });
  };

  const handleDecline = (username) => {
    fetch('http://localhost:5000/deny-friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ username })
    })
    .then(res => res.json())
    .then(data => {
      setStatusMessage(data.message || 'Friend request denied');
      fetchRequests();
    });
  };

  const handleRemoveFriend = (username) => {
    fetch('http://localhost:5000/remove-friend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ username })
    })
    .then(res => res.json())
    .then(data => {
      setStatusMessage(data.message || 'Friend removed');
      fetchFriends();
    });
  };

  return (
    <div className="noir-box friends-box">
      <div className="section-header">
        <h2>Connections</h2>
      </div>

      <div className="section">
        <div className="section-title">
          <input
            type="text"
            placeholder="Search for friends"
            className="friend-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} disabled={isSending} className="send-button">
            {isSending ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="status-message">{statusMessage}</div>

        {showSearchResults && (
          <div className="search-results">
            <div
              className="close-search-button"
              style={{
                backgroundColor: 'darkred',
                color: 'white',
                padding: '4px 10px',
                cursor: 'pointer',
                display: 'inline-block',
                marginBottom: '8px',
                fontWeight: 'bold',
                borderRadius: '4px'
              }}
              onClick={() => setShowSearchResults(false)}
            >
              ✖
            </div>
            {searchResults.map((user) => (
              <div key={user.username} className="user-item">
                <Link to={`/user/${user.username}`} style={{ marginRight: '10px' }}>
                  {user.username}
                </Link>
                <button
                  onClick={() => handleSendRequest(user.username)}
                  disabled={isSending}
                  className="send-request-button"
                >
                  {isSending ? 'Sending...' : 'Send Friend Request'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <h3>Friends</h3>
        {friends.length ? (
          friends.map((f) => (
            <div key={f.username} className="friend-item">
              <div className="friend-info">
                <Link to={`/user/${f.username}`} style={{ textDecoration: 'none', color: 'black' }}>
                  <div className="friend-avatar-container">
                    {f.picture ? (
                      <img
                        src={`http://localhost:5000${f.picture}`}
                        alt="profile"
                        className="friend-avatar"
                      />
                    ) : (
                      <div className="friend-avatar placeholder">?</div>
                    )}
                  </div>
                  <span>{f.username}</span>
                </Link>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="chat-btn" onClick={() => onChat(f.username, 'friend')}>Chat</button>
                <button className="remove-btn" onClick={() => handleRemoveFriend(f.username)}>Remove</button>
              </div>
            </div>
          ))
        ) : (
          <p className="dim">No friends yet</p>
        )}
      </div>

      <div className="section">
        <h3>Requests</h3>
        {requests.length ? (
          requests.map((r) => (
            <div key={r.username} className="request-item">
              {r.username}
              <div className="request-buttons">
                <button onClick={() => handleAccept(r.username)}>✔</button>
                <button onClick={() => handleDecline(r.username)}>✖</button>
              </div>
            </div>
          ))
        ) : (
          <p className="dim">No requests</p>
        )}
      </div>
    </div>
  );
};

export default FriendsBox;
