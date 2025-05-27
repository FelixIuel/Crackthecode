# CrackTheCode

A full-stack code-breaking web game built with React (frontend) and Flask (backend), using MongoDB for data storage.

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