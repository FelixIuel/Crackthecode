//this script is for the chat window component in Crack the Code
//this script handles the chat UI and logic for both group and private chats

//imports for script
import React, { useEffect, useState, useRef } from 'react';
import './ChatWindow.css';

// ChatWindow component handles chat UI and logic for group or private chat
const ChatWindow = ({ target, type, onClose }) => {
  const [messages, setMessages] = useState([]); // State to hold chat messages
  const [newMessage, setNewMessage] = useState(''); // State for new message input
  const token = localStorage.getItem('token') || '';
  const messagesEndRef = useRef(null); // ensure it scrolls to the bottom when new messages arrive

  // Fetch messages initially and every 5 seconds to simulate real-time updates
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [target, type]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages from the backend in app.py
  const fetchMessages = () => {
    fetch(`http://localhost:5000/chat/${type}/${target}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch messages');
        return res.json();
      })
      .then(data => {
        if (data.success) setMessages(data.messages);
      })
      .catch(err => console.error('Error fetching messages:', err));
  };

  // Send a new message to the backend in app.py
  const handleSend = () => {
    if (!newMessage.trim()) return; // Don't send empty messages
    fetch(`http://localhost:5000/chat/${type}/${target}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message: newMessage })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNewMessage(''); // Clear input
          fetchMessages();   // Refresh messages
        }
      });
  };

  // Scroll chat to the bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return ( // return of the chat-edi - returns the chat window UI
    <div className="chat-overlay">
      <div className="chat-window">
        <div className="chat-header">
          <h3>{type === 'group' ? `Group: ${target}` : `Chat with ${target}`}</h3>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>
        <div className="chat-messages">
          {messages.length > 0 ? (
            messages.map((msg, i) => (
              <div key={i} className="chat-message">
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))
          ) : (
            <div>No messages yet</div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input-area">
          <input
            type="text"
            placeholder="Type message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
