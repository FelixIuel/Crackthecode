import React, { useState } from "react";
import './FriendsBox.css';

const FriendsBox = () => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [groups, setGroups] = useState(["Dark Alley Club"]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [userFound, setUserFound] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');

  // Function to remove a friend
  const handleRemoveFriend = (friend) => {
    setFriends(friends.filter((f) => f !== friend));
  };

  // Function to accept a friend request
  const handleAccept = (user) => {
    setFriends([...friends, user]);
    setRequests(requests.filter((req) => req !== user));
  };

  // Function to decline a friend request
  const handleDecline = (user) => {
    setRequests(requests.filter((req) => req !== user));
  };

  // Function to search users
  const handleSearch = () => {
    if (!searchQuery.trim()) return; // Avoid sending empty search queries

    setStatusMessage('Searching...');
    
    fetch(`http://localhost:5000/search-users/${searchQuery}`, {  // Adjust API route as needed
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.users.length > 0) {
          setSearchResults(data.users);
          setUserFound(true);
          setStatusMessage(`${data.users.length} user(s) found.`);
        } else {
          setSearchResults([]);
          setUserFound(false);
          setStatusMessage('No users found');
        }
      })
      .catch((error) => {
        console.error("Search failed", error);
        setStatusMessage("Something went wrong. Try again.");
      });
  };

  // Function to send a friend request
  const handleSendRequest = (username) => {
    setIsSending(true);
    fetch('http://localhost:5000/send-friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
      .then(res => res.json())
      .then(data => {
        setIsSending(false);
        if (data.success) {
          setStatusMessage(`Friend request sent to ${username}`);
        } else {
          setStatusMessage(`Failed to send request to ${username}`);
        }
      })
      .catch((error) => {
        console.error("Request failed", error);
        setIsSending(false);
        setStatusMessage("Something went wrong while sending the request.");
      });
  };

  // Function to join a group
  const handleJoinGroup = () => {
    if (joinCode.trim()) {
      setGroups([...groups, `Group ${groups.length + 1}`]);
      setJoinCode("");
    }
  };

  // Function to create a new group
  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setGroups([...groups, newGroupName]);
      setGroupCode(code);
      setNewGroupName("");
    }
  };

  // Handle search results
  const filteredFriends = friends.filter((f) =>
    f.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="noir-box friends-box">
      <div className="section-header">
        <h2>Connections</h2>
      </div>

      {/* Add Friends Section */}
      <div className="section">
        <div className="section-title">
          <input
            type="text"
            placeholder="Add friends and send request"
            className="friend-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Trigger search on pressing Enter
          />
          <button 
            onClick={handleSearch} 
            disabled={isSending} 
            className="send-button"
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>

        <div className="status-message">{statusMessage}</div>

        {userFound && (
          <div className="search-results">
            {searchResults.map((user) => (
              <div key={user.username} className="user-item">
                {user.username}
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

      {/* Friends Section */}
      <div className="section">
        <h3>Friends</h3>
        {filteredFriends.length ? (
          filteredFriends.map((f) => (
            <div key={f} className="friend-item">
              {f}
              <button onClick={() => handleRemoveFriend(f)} className="remove-btn">Remove</button>
            </div>
          ))
        ) : (
          <p className="dim">No friends yet</p>
        )}
      </div>

      {/* Requests Section */}
      <div className="section">
        <h3>Requests</h3>
        {requests.length ? (
          requests.map((r) => (
            <div key={r} className="request-item">
              {r}
              <div className="request-buttons">
                <button onClick={() => handleAccept(r)}>✔</button>
                <button onClick={() => handleDecline(r)}>✖</button>
              </div>
            </div>
          ))
        ) : (
          <p className="dim">No requests</p>
        )}
      </div>

      {/* Groups Section */}
      <div className="section">
        <h3>Groups</h3>
        {groups.map((g, i) => (
          <div key={i} className="group-item">{g}</div>
        ))}
        <div className="group-join">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Enter group code"
          />
          <button onClick={handleJoinGroup}>Join</button>
        </div>
        <div className="group-create">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="New group name"
          />
          <button onClick={handleCreateGroup}>Create</button>
          {groupCode && (
            <p className="group-code-msg">Your group code: <strong>{groupCode}</strong></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsBox;
