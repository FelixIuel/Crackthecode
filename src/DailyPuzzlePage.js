import React, { useRef, useState } from "react";
import DailyLetterPuzzle from "./DailyLetterPuzzle";

import backgroundImg from "./assets/pictures/gamepage/GamePage-Background.png";
import speakerOnIcon from "./assets/pictures/gamepage/speaker-on.png";
import speakerOffIcon from "./assets/pictures/gamepage/speaker-off.png";
import frameBottom from "./assets/pictures/general/frame-bottom.png";
import gameTheme from "./assets/sounds/gamepage/game-theme.mp3";
import detectiveImage from "./assets/pictures/general/Daily-sentence-Picture.png";

function DailyPuzzlePage({ onLoginClick, onSignupClick, isLoggedIn }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  if (!isLoggedIn) {
    return (
      <div
        style={{
          backgroundColor: "black",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <img
          src={detectiveImage}
          alt="Detective Login Required"
          style={{
            width: "280px",
            maxWidth: "90%",
            marginBottom: "30px",
          }}
        />
        <p
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            maxWidth: "600px",
            lineHeight: "1.5",
          }}
        >
          To play the Daily Sentence, you need to{" "}
          <span
            onClick={onLoginClick}
            style={{
              color: "#00BFFF",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            log in
          </span>{" "}
          or{" "}
          <span
            onClick={onSignupClick}
            style={{
              color: "#32CD32",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            sign up
          </span>
          .
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        paddingTop: "80px",
        paddingBottom: "100px",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
        height: "100vh",
      }}
    >
      {/* Music toggle */}
      <div
        onClick={toggleMusic}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            textShadow: "1px 1px 3px black",
            marginBottom: "5px",
          }}
        >
          Turn music {isPlaying ? "off" : "on"}
        </div>
        <img
          src={isPlaying ? speakerOnIcon : speakerOffIcon}
          alt="Toggle Music"
          style={{ width: "32px", height: "32px" }}
        />
      </div>

      {/* Audio */}
      <audio ref={audioRef} loop>
        <source src={gameTheme} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className="container">
        <DailyLetterPuzzle
          onLoginClick={onLoginClick}
          onSignupClick={onSignupClick}
          isLoggedIn={isLoggedIn}
        />
      </div>

      <img src={frameBottom} alt="Bottom Frame" className="frame-bottom" />
    </div>
  );
}

export default DailyPuzzlePage;
