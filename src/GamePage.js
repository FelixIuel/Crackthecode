import React, { useEffect, useRef, useState } from "react";
import LetterPuzzle from "./LetterPuzzle";

function GamePage({ onLoginClick, onSignupClick }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); // Start muted

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/GamePage-Background.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        paddingTop: "80px",
        position: "relative"
      }}
    >
      {/* 🎵 Music toggle */}
      <div
        onClick={toggleMusic}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          textAlign: "center",
          cursor: "pointer"
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            textShadow: "1px 1px 3px black",
            marginBottom: "5px"
          }}
        >
          Turn music {isPlaying ? "off" : "on"}
        </div>
        <img
          src={isPlaying ? "/speaker-on.png" : "/speaker-off.png"}
          alt="Toggle Music"
          style={{ width: "32px", height: "32px" }}
        />
      </div>

      {/* 🎧 Audio */}
      <audio ref={audioRef} loop>
        <source src="/game-theme.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className="container">
        <LetterPuzzle
          onLoginClick={onLoginClick}
          onSignupClick={onSignupClick}
        />
      </div>

      <img
        src="/frame-bottom.png"
        alt="Bottom Frame"
        className="frame-bottom"
      />
    </div>
  );
}

export default GamePage;
