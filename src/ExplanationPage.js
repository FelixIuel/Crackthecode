import React, { useState } from 'react';
import './ExplanationPage.css';

import backgroundImg from './assets/pictures/howtoplay/howtoplay-background.png';
import felixImg from './assets/pictures/howtoplay/felix-holmes.png';
import phoneImg from './assets/pictures/howtoplay/phone.png';

import slide1 from './assets/pictures/howtoplay/slide1.png';
import slide2 from './assets/pictures/howtoplay/slide2.png';
import slide3 from './assets/pictures/howtoplay/slide3.png';
import slide4 from './assets/pictures/howtoplay/slide4.png';
import slide5 from './assets/pictures/howtoplay/slide5.png';

const ExplanationPage = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [callText, setCallText] = useState("Call the Detective");

  const slides = [slide1, slide2, slide3, slide4, slide5];

  const handlePrev = () => setSlideIndex((slideIndex - 1 + slides.length) % slides.length);
  const handleNext = () => setSlideIndex((slideIndex + 1) % slides.length);

  const callDetective = async () => {
    try {
      const res = await fetch("http://localhost:5000/phoneline");
      const data = await res.json();
      if (data.success) {
        setCallText(data.message);
      } else {
        setCallText("Something went wrong on the line...");
      }
    } catch (err) {
      setCallText("The line's dead. Try again later.");
    }

    // Reset message after 4 seconds
    setTimeout(() => {
      setCallText("Call the Detective");
    }, 8000);
  };

  return (
    <div className="explanation-page-wrapper">
      <img src={backgroundImg} alt="Board Background" className="explanation-background-image" />

      <div className="explanation-overlay">
        <div className="explanation-box-container">

          {/* === Memo Box === */}
          <div className="note-box memo-box parchment-box">
            <img src={felixImg} alt="Felix Holmes" className="felix-image" />
            <h3><u>Memo – Confidential</u></h3>
            <p><strong>From the desk of Detective Felix Holmes</strong></p>
            <p><em>To the new assistant,</em></p>
            <p>
              You made it. Good. <br />
              Hope you’ve got a strong stomach — and thicker skin. This job isn’t about glory. It’s about grit.
            </p>
            <p>
              I’m Felix Holmes. Name might ring a bell. If it doesn’t — it will.
            </p>
            <p>
              There’s a storm brewing in this city. A syndicate slicker than oil and twice as slippery is painting the streets with crimes so clean, they don’t leave prints. No blood. No witnesses. Just one thing at every scene: a code. Twisted. Precise. Mocking.
            </p>
            <p>
              I need you cracking them — fast. Every second wasted is another lead gone cold.
            </p>
            <p><em>Don’t disappoint me.<br />– F.H.</em></p>
            <p><em>PS: My secretary gives hints. Just ask him.</em></p>
          </div>

          {/* === How to Play Box === */}
          <div className="note-box play-box parchment-box">
            <div className="slideshow">
              <button onClick={handlePrev} className="slide-btn">←</button>
              <img src={slides[slideIndex]} alt={`Slide ${slideIndex + 1}`} className="slide-image" />
              <button onClick={handleNext} className="slide-btn">→</button>
            </div>

            <div className="play-text">
              <h2><u>How to Play</u></h2>
              <p>Your goal is to crack a hidden word or phrase based on a clue and letter layout. The theme could be anything from movies to history.</p>
              <ul>
                <li>Click letters to guess what goes where</li>
                <li>Correct guesses turn green</li>
                <li>Wrong guesses cost you a life</li>
                <li>Lose all lives and the puzzle is lost!</li>
                <li>Score high by solving fast and with few mistakes</li>
                <li>Numbers below boxes show where a letter belongs</li>
              </ul>
              <p>Good luck, detective.</p>
            </div>

            <div className="call-detective" onClick={callDetective}>
              <img src={phoneImg} alt="Call Phone" className="phone-icon rotating-phone" />
              <p>{callText}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExplanationPage;
