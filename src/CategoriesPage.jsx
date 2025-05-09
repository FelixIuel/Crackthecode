import React, { useRef, useState } from "react";
import CategoriesPuzzle from "./CategoriesPuzzle";

import backgroundImg from "./assets/pictures/gamepage/GamePage-Background.png";
import speakerOnIcon from "./assets/pictures/gamepage/speaker-on.png";
import speakerOffIcon from "./assets/pictures/gamepage/speaker-off.png";
import frameBottom from "./assets/pictures/general/frame-bottom.png";
import gameTheme from "./assets/sounds/gamepage/game-theme.mp3";

import stampDota from "./assets/pictures/stamps/STAMP - DOTA.png";
import stampEarth from "./assets/pictures/stamps/STAMP - EARTH.png";
import stampLorum from "./assets/pictures/stamps/STAMP - LORUM IPSUM.png";
import stampMedsoe from "./assets/pictures/stamps/STAMP - MEDSOE.png";
import stampScience from "./assets/pictures/stamps/STAMP - SCIENCE.png";

import "./CategoriesPage.css";

const categories = [
  { name: "DOTA", image: stampDota },
  { name: "EARTH", image: stampEarth },
  { name: "LORUM IPSUM", image: stampLorum },
  { name: "MEDSOE", image: stampMedsoe },
  { name: "SCIENCE", image: stampScience },
];

function CategoriesPage({ onLoginClick, onSignupClick, isLoggedIn }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("DOTA");

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
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        paddingTop: "80px",
        paddingBottom: "40px", // <-- changed
        position: "relative", // <-- important
        overflowX: "hidden",
        overflowY: "auto",
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

      {/* CATEGORY STAMPS */}
      <div className="categories-wrapper">
        <h2 className="categories-title">Categories</h2>
        <div className="categories-stamps">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`category-stamp ${
                selectedCategory === cat.name ? "selected" : ""
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <img src={cat.image} alt={cat.name} />
              <div className="category-name">{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PUZZLE */}
      <div className="container">
        <CategoriesPuzzle selectedCategory={selectedCategory} />
      </div>
    </div>
  );
}

export default CategoriesPage;
