import React from 'react';
import './ExplanationPage.css';

import backgroundImg from './assets/pictures/howtoplay/howtoplay-background.png';
import frameBottom from './assets/pictures/general/frame-bottom.png';
import felixPortrait from './assets/pictures/howtoplay/felix-holmes.png'; // Update path as needed

const ExplanationPage = () => {
  return (
    <div className="explanation-page-wrapper">
      <div className="explanation-background-wrapper">
        <img src={backgroundImg} alt="Board Background" className="explanation-background-image" />

        <div className="explanation-overlay">
          <div className="explanation-box-container">

            {/* LEFT MEMO */}
            <div className="note-box small-note scrollable">
              <img src={felixPortrait} alt="Detective Felix Holmes" className="felix-portrait" />
              <div className="memo-text">
                <h2>Memo – Confidential</h2>
                <p><strong>From the desk of Detective Felix Holmes</strong></p>
                <p><em>To the new assistant,</em></p>
                <p>
                  You made it. Good.<br />
                  Hope you’ve got a strong stomach — and thicker skin.<br />
                  This job isn’t about glory. It’s about grit.
                </p>
                <p>
                  I’m Felix Holmes. Name might ring a bell.<br />
                  If it doesn’t — it will.
                </p>
                <p>
                  There’s a storm brewing in this city. A syndicate slicker than oil and twice as slippery is painting the streets with crimes so clean, they don’t leave prints.
                  No blood. No witnesses. Just one thing at every scene: a code. Twisted. Precise. Mocking. Like they want me to follow.
                </p>
                <p>
                  I’ve cracked hundreds. These… these are different. This isn’t just some puzzle game. It’s a challenge. Personal.
                </p>
                <p>
                  You were brought in because I can’t waste time holding the magnifying glass. I need you breaking their riddles before the next body drops.
                </p>
                <p>
                  Every code cracked is a lead. Every second lost? Another crime they get away with.
                </p>
                <p><strong>So if you're in this for fun — walk away now. But if you're ready to get your hands dirty… welcome to the hunt.</strong></p>
                <p><em>Don’t disappoint me.<br />— F.H.</em></p>
                <p><em>PS my sectary is to give you hints, just ask him</em></p>
              </div>
            </div>

            {/* RIGHT - HOW TO PLAY */}
            <div className="note-box large-note">
              <h2>How to Play</h2>
              <p>
                Your goal is to crack a hidden word or phrase based on a given clue and letter layout.
                The theme could be anything from movies to historical facts.
              </p>
              <ul>
                <li>Click letters to guess what goes where</li>
                <li>Correct guesses turn green</li>
                <li>Wrong guesses cost you a life</li>
                <li>Lose all lives and the puzzle is lost!</li>
                <li>Score high by solving fast and with few mistakes</li>
              </ul>
              <p>Good luck, detective.</p>
            </div>
          </div>
        </div>

        <img src={frameBottom} alt="Frame Bottom" className="frame-bottom" />
      </div>
    </div>
  );
};

export default ExplanationPage;
