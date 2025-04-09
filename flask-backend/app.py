from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from flask_cors import CORS
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

# MongoDB Config
app.config["MONGO_URI"] = "mongodb://localhost:27017/crackthecode"
mongo = PyMongo(app)

# Auth & JWT Setup
app.config["JWT_SECRET_KEY"] = "your_jwt_secret_key"
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

@app.route('/')
def home():
    return "Flask backend is live ✅"

# ========== AUTH ==========

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "error": "Email and password are required"}), 400

    existing_user = mongo.db.users.find_one({"email": email})
    if existing_user:
        return jsonify({"success": False, "error": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    mongo.db.users.insert_one({"email": email, "password": hashed_password})

    return jsonify({"success": True, "message": "User created successfully!"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "error": "Email and password are required"}), 400

    user = mongo.db.users.find_one({"email": email})
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({"success": False, "error": "Invalid email or password"}), 401

    token = create_access_token(identity=email)
    return jsonify({"success": True, "access_token": token}), 200

@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    return jsonify({"success": True, "user": current_user}), 200

# ========== SCORES ==========

@app.route('/submit-score', methods=['POST'])
@jwt_required()
def submit_score():
    current_user = get_jwt_identity()
    data = request.json
    score = data.get("score")
    timestamp = data.get("timestamp")
    session_id = data.get("sessionId")

    if score is None or session_id is None:
        return jsonify({"success": False, "error": "Missing score or sessionId"}), 400

    # Prevent duplicate submission
    existing = mongo.db.scores.find_one({
        "email": current_user,
        "sessionId": session_id
    })

    if existing:
        return jsonify({"success": False, "error": "Score already submitted for this session"}), 409

    mongo.db.scores.insert_one({
        "email": current_user,
        "score": score,
        "timestamp": timestamp or datetime.utcnow().isoformat(),
        "sessionId": session_id
    })

    return jsonify({"success": True, "message": "Score submitted!"}), 200

@app.route('/get-highscores', methods=['GET'])
def get_highscores():
    # Use aggregation to get each user's best score
    pipeline = [
        {"$group": {
            "_id": "$email",
            "best_score": {"$max": "$score"},
            "timestamp": {"$first": "$timestamp"}
        }},
        {"$sort": {"best_score": -1}},
        {"$limit": 250}
    ]

    scores = list(mongo.db.scores.aggregate(pipeline))
    result = [
        {
            "email": s["_id"],
            "score": s["best_score"],
            "timestamp": s.get("timestamp", "")
        }
        for s in scores
    ]
    return jsonify({"success": True, "highscores": result}), 200


@app.route('/my-scores', methods=['GET'])
@jwt_required()
def get_my_scores():
    current_user = get_jwt_identity()
    scores = list(mongo.db.scores.find({"email": current_user}).sort("score", -1))
    result = []
    for s in scores:
        result.append({
            "score": s.get("score", 0),
            "timestamp": s.get("timestamp", "")
        })
    return jsonify({"success": True, "scores": result}), 200

# ========== PUZZLE & HINTS ==========

@app.route('/get-puzzle')
def get_puzzle():
    sentences = list(mongo.db.sentences.find())
    if not sentences:
        return jsonify({"error": "No puzzles found"}), 404

    puzzle = random.choice(sentences)
    return jsonify({
        "category": puzzle["category"],
        "hint": puzzle["hint"],
        "sentence": puzzle["sentence"],
        "revealedLetters": puzzle["revealedLetters"],
        "letterMap": puzzle["letterMap"]
    })

@app.route('/get-bogus-hint', methods=['GET'])
def get_bogus_hint():
    hints = list(mongo.db.hints.find())
    if not hints:
        return jsonify({"text": "No hints found."}), 404
    hint = random.choice(hints)
    return jsonify(hint)

# ========== START APP ==========

if __name__ == '__main__':
    app.run(debug=True)
