from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)  # ✅ Allow frontend to connect (CORS fix)

# MongoDB connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/crackthecode"
mongo = PyMongo(app)

# JWT + Bcrypt setup
app.config["JWT_SECRET_KEY"] = "your_jwt_secret_key"  # 🔒 Replace with a secure key later
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

@app.route('/')
def home():
    return "Flask backend is live ✅"

# ================== USER AUTH ===================

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    existing_user = mongo.db.users.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    mongo.db.users.insert_one({"email": email, "password": hashed_password})

    return jsonify({"message": "User created successfully!"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = mongo.db.users.find_one({"email": email})
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=email)
    return jsonify(access_token=token), 200

@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

# ================== GAME ROUTES ===================

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

@app.route('/check-letter', methods=['POST'])
def check_letter():
    data = request.json
    sentence = data.get("sentence", "").upper()
    letter = data.get("letter", "").upper()

    if not sentence or not letter:
        return jsonify({"error": "Missing sentence or letter"}), 400

    positions = [i for i, char in enumerate(sentence) if char == letter]
    return jsonify({
        "correct": len(positions) > 0,
        "positions": positions,
        "loseLife": len(positions) == 0
    })

@app.route('/check-box-letter', methods=['POST'])
def check_box_letter():
    data = request.json
    letter_map = data.get("letterMap", {})
    number_code = data.get("numberCode")
    guessed_letter = data.get("letter", "").upper()

    if not letter_map or number_code is None or not guessed_letter:
        return jsonify({"error": "Missing letter, numberCode, or letterMap"}), 400

    correct_letter = next(
        (letter for letter, code in letter_map.items() if code == number_code),
        None
    )
    is_correct = guessed_letter == correct_letter

    return jsonify({
        "correct": is_correct,
        "loseLife": not is_correct
    })

@app.route('/check-sentence-complete', methods=['POST'])
def check_sentence_complete():
    data = request.json
    correct = data.get("sentence", "").strip().upper()
    current = data.get("playerSentence", "").strip().upper()

    if not correct or not current:
        return jsonify({"error": "Missing sentence data"}), 400

    solved = correct == current
    return jsonify({ "solved": solved })

@app.route('/submit-score', methods=['POST'])
@jwt_required()
def submit_score():
    current_user = get_jwt_identity()
    data = request.json
    score = data.get("score")

    if score is None:
        return jsonify({"error": "Missing score"}), 400

    mongo.db.scores.insert_one({
        "email": current_user,
        "score": score,
        "timestamp": datetime.utcnow()
    })

    return jsonify({"message": "Score submitted!"}), 200

@app.route('/get-highscores', methods=['GET'])
def get_highscores():
    scores = mongo.db.scores.find().sort("score", -1).limit(10)
    result = [{"name": s["name"], "score": s["score"]} for s in scores]
    return jsonify(result)

# ================== Hints ===================
@app.route('/get-bogus-hint', methods=['GET'])
def get_bogus_hint():
    hints = list(mongo.db.hints.find())
    if not hints:
        return jsonify({"text": "No hints found."}), 404
    hint = random.choice(hints)
    return jsonify(hint)

# ================== RUN ===================

if __name__ == '__main__':
    app.run(debug=True)


