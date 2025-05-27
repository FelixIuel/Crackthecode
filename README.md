# CrackTheCode
CrackTheCode is a web puzzle game where players test their logic and deduction skills by decoding a hidden sentence. Each letter in the sentence is masked behind a box with a corresponding number, and players must figure out which numbers map to which letters. To assist, a theme and a clue are provided with every puzzle.

The game offers a clean and interactive UI built with React, a secure and efficient backend with Flask, and persistent data handling using MongoDB.

## Game Objective

Uncover the secret sentence by guessing the correct letter for each number-coded box. Use the theme and hint provided to make strategic deductions.

## Game Modes

1. Endless Run  
   Figure out as many sentences as possible before running out of lives. Track your score on the Scoreboard tab.

2. Daily Sentence  
   A new sentence appears each day from the ZenQuotes API. Track your daily streak and highest score on your profile page.

3. Categories  
   Complete all sentences in a category to unlock a unique stamp.

## Page Layout

- Play
  - Endless Run
  - Daily Sentence
  - Categories

- How to Play

- Scoreboard

- Profile

## Extra Features

- Customize your profile
- Add friends, join groups, and chat
---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v18+)
- [Python 3.10+](https://www.python.org/)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally
- MongoDB Database Tools (for `mongorestore`) — [download here](https://www.mongodb.com/try/download/database-tools)

---

## 🛠 Installation

### 1️: Clone the Repository

```bash
git clone https://github.com/FelixIuel/Crackthecode.git
cd Crackthecode
```

---

### 2️: Setup Flask Backend

```bash
cd flask-backend

# Create and activate virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

---

### 3️: Setup React Frontend

```bash
cd ../client  # Or wherever your React frontend is
npm install
```

---

### 4️: Import MongoDB Database (optional but recommended)

To load the game’s default data:

```bash
mongorestore --db crackthecode crackthecode-dump/crackthecode
```

> Ensure MongoDB is running locally (default port: 27017)

---

## Running the App

### Start Flask Backend

```bash
cd flask-backend
venv\Scripts\activate
python app.py
```

### Start React Frontend

```bash
cd ../client
npm start
```

---

## Access the App

Open your browser and go to:

```
http://localhost:3000
```

---

##  File Structure

- `flask-backend/`: Flask API + MongoDB integration
- `client/`: React frontend
- `crackthecode-dump/`: MongoDB database export

---
