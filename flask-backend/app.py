from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from datetime import datetime
import random
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/crackthecode"
mongo = PyMongo(app)

# JWT and bcrypt setup
app.config["JWT_SECRET_KEY"] = "your_jwt_secret_key"  # Change this to a more secure key
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

@app.route('/')
def home():
    return "Flask backend is live ✅"

# Get a random puzzle
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

# Check a guessed letter
@app.route('/check-letter', methods=['POST'])
def check_letter():
    data = request.json
    sentence = data.get("sentence", "").upper()
    letter = data.get("letter", "").upper()

    if not sentence or not letter:
        return jsonify({"error": "Missing sentence or letter"}), 400

    # Get all positions where the guessed letter appears
    positions = [i for i, char in enumerate(sentence) if char == letter]

    return jsonify({
        "correct": len(positions) > 0,
        "positions": positions,
        "loseLife": len(positions) == 0  # true if letter not found
    })

@app.route('/check-box-letter', methods=['POST'])
def check_box_letter():
    data = request.json
    letter_map = data.get("letterMap", {})
    number_code = data.get("numberCode")
    guessed_letter = data.get("letter", "").upper()

    if not letter_map or number_code is None or not guessed_letter:
        return jsonify({"error": "Missing letter, numberCode, or letterMap"}), 400

    # Find the correct letter that matches the number code
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

    return jsonify({
        "solved": solved
    })

@app.route('/submit-score', methods=['POST'])
def submit_score():
    data = request.json
    name = data.get("name", "").strip()
    score = data.get("score")

    if not name or score is None:
        return jsonify({"error": "Missing name or score"}), 400

    mongo.db.scores.insert_one({
        "name": name,
        "score": score,
        "timestamp": datetime.utcnow()
    })

    return jsonify({"message": "Score submitted!"})

@app.route('/get-highscores', methods=['GET'])
def get_highscores():
    scores = mongo.db.scores.find().sort("score", -1).limit(10)
    result = []

    for s in scores:
        result.append({
            "name": s["name"],
            "score": s["score"]
        })

    return jsonify(result)

# Signup route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Check if user already exists
    user = mongo.db.users.find_one({"email": email})
    if user:
        return jsonify({"error": "User already exists"}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Create new user in MongoDB
    mongo.db.users.insert_one({"email": email, "password": hashed_password})

    return jsonify({"message": "User created successfully!"}), 201


# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Find user by email
    user = mongo.db.users.find_one({"email": email})
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Create JWT token
    access_token = create_access_token(identity=email)

    return jsonify(access_token=access_token), 200


# Protected route example (only accessible by authenticated users)
@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    # Get the current user's email from the JWT token
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


if __name__ == '__main__':
    app.run(debug=True)
