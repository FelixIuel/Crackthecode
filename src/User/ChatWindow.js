import React, { useEffect, useState, useRef } from 'react'; // React is used throughout the component
import './ChatWindow.css';

const ChatWindow = ({ target, type, onClose }) => { // onClose is used in the close button
  const [messages, setMessages] = useState([]); // setMessages is used to update messages
  const [newMessage, setNewMessage] = useState(''); // newMessage and setNewMessage are used in the input and handleSend
  const token = localStorage.getItem('token') || '';
  const messagesEndRef = useRef(null); // messagesEndRef is used to scroll to the bottom

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [target, type]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSend = () => { // handleSend is used for sending messages
    if (!newMessage.trim()) return;
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
          setNewMessage('');
          fetchMessages();
        }
      });
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
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
