import React from 'react';
import somethingImage from './assets/pictures/howtoplay/Something.png';

function ExplanationPage() {
  return (
    <div style={{ padding: "40px", color: "#fff", fontFamily: "'Courier New', Courier, monospace" }}>
      <h1>How to Play</h1>
      <p>Here’s an explanation of the game... this is a test</p>
      <p>Here’s an explanation of the game...</p>

      <div className="something-pic" style={{ textAlign: 'center', marginTop: '30px' }}>
        <img
          src={somethingImage}
          alt="Something"
          style={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
          }}
        />
      </div>
    </div>
  );
}

export default ExplanationPage;
