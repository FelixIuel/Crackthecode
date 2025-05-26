import React, { useEffect, useState } from "react";
import './GroupsBox.css';

const GroupsBox = ({ onChat }) => {
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupPassword, setNewGroupPassword] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [joiningGroup, setJoiningGroup] = useState('');
  const [groupMembers, setGroupMembers] = useState({});
  const [currentUser, setCurrentUser] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchGroups();
    fetchCurrentUser();
  }, []);

  const fetchGroups = () => {
    fetch('http://localhost:5000/my-groups', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setGroups(data.groups);
      });
  };

  const fetchCurrentUser = () => {
    fetch('http://localhost:5000/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setCurrentUser(data.user);
      });
  };

  const handleGroupSearch = () => {
    fetch(`http://localhost:5000/search-groups/${searchQuery}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setSearchResults(data.groups);
        else setSearchResults([]);
      });
  };

  const handleCreateGroup = () => {
    fetch('http://localhost:5000/create-group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: newGroupName, password: newGroupPassword })
    })
      .then(res => res.json())
      .then(data => {
        setStatusMessage(data.message);
        fetchGroups();
      });
  };

  const handleJoinGroup = (groupname) => {
    fetch('http://localhost:5000/join-group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: groupname, password: joinPassword })
    })
      .then(res => res.json())
      .then(data => {
        setStatusMessage(data.message);
        fetchGroups();
      });
  };

  const toggleMembers = (groupname) => {
    if (groupMembers[groupname]) {
      setGroupMembers(prev => {
        const copy = { ...prev };
        delete copy[groupname];
        return copy;
      });
    } else {
      fetch(`http://localhost:5000/group-members/${groupname}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setGroupMembers(prev => ({ ...prev, [groupname]: data.members }));
        });
    }
  };

  const handleKick = (groupname, username) => {
    fetch('http://localhost:5000/remove-member', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ group: groupname, username })
    })
      .then(res => res.json())
      .then(() => toggleMembers(groupname));
  };

  return (
    <div className="groups-box">
      <h3>Groups</h3>

      <div className="group-search">
        <input
          type="text"
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGroupSearch()}
        />
        <button onClick={handleGroupSearch}>Search</button>
      </div>

      {searchResults.map(group => (
        <div key={group.name} className="group-item">
          {group.name}
          <input
            type="password"
            placeholder="Password"
            value={joiningGroup === group.name ? joinPassword : ''}
            onChange={(e) => {
              setJoiningGroup(group.name);
              setJoinPassword(e.target.value);
            }}
          />
          <button onClick={() => handleJoinGroup(group.name)}>Join</button>
        </div>
      ))}

      <div className="group-create">
        <input
          type="text"
          placeholder="New group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={newGroupPassword}
          onChange={(e) => setNewGroupPassword(e.target.value)}
        />
        <button onClick={handleCreateGroup}>Create</button>
      </div>

      <div className="my-groups">
        {groups.map(group => (
          <div key={group.name} className="group-owned">
            <strong>{group.name}</strong>
            <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
              <button onClick={() => toggleMembers(group.name)}>Members</button>
              <button onClick={() => onChat(group.name)}>Chat</button>
            </div>
            {groupMembers[group.name] && (
              <ul>
                {groupMembers[group.name].map(user => (
                  <li key={user}>
                    {user}
                    {group.admin === currentUser && user !== currentUser && (
                      <button onClick={() => handleKick(group.name, user)}>Kick</button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {statusMessage && <p className="dim">{statusMessage}</p>}
    </div>
  );
};

export default GroupsBox;
