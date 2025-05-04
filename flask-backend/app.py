from flask import Flask, jsonify, request, send_from_directory
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from flask_cors import CORS
from datetime import datetime
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import os
import random
import requests
import re

# ====== Load environment variables ======
load_dotenv()

# ====== Initialize Flask app ======
app = Flask(__name__)
CORS(app)

# ====== Config ======
app.config["MONGO_URI"] = "mongodb://localhost:27017/crackthecode"
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "default_dev_secret")

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# ====== Serve Uploaded Pictures ======
@app.route('/static/uploads/<filename>')
def serve_upload(filename):
    return send_from_directory('static/uploads', filename)

# ====== ROOT ======
@app.route('/')
def home():
    return "✅ Flask backend is running!"

# ====== AUTH ======
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"success": False, "error": "Username and password required"}), 400
    if mongo.db.users.find_one({"username": username}):
        return jsonify({"success": False, "error": "User already exists"}), 409
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    mongo.db.users.insert_one({
        "username": username,
        "password": hashed_password,
        "about": "This is your start text",
        "picture": "",
        "streak": {"current": 0, "longest": 0},
        "stamps": [],
        "joined": datetime.utcnow().strftime("%d.%m.%Y")
    })
    return jsonify({"success": True, "message": "User created"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    user = mongo.db.users.find_one({"username": username})
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({"success": False, "error": "Invalid credentials"}), 401
    token = create_access_token(identity=username)
    return jsonify({"success": True, "access_token": token}), 200

# ====== PROFILE ======
@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    return jsonify({"success": True, "user": current_user}), 200

@app.route('/user-profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    current_user = get_jwt_identity()
    user = mongo.db.users.find_one({"username": current_user}, {"_id": 0, "password": 0})
    if not user:
        return jsonify({"success": False, "error": "User not found"}), 404
    return jsonify({"success": True, "user": user}), 200

@app.route('/update-profile', methods=['POST'])
@jwt_required()
def update_profile():
    current_user = get_jwt_identity()
    about = request.json.get("about")
    if about is None:
        return jsonify({"success": False, "error": "Missing 'about' field"}), 400
    mongo.db.users.update_one({"username": current_user}, {"$set": {"about": about}})
    return jsonify({"success": True}), 200

@app.route('/upload-picture', methods=['POST'])
@jwt_required()
def upload_picture():
    current_user = get_jwt_identity()
    picture_file = request.files.get("picture")
    if not picture_file:
        return jsonify({"success": False, "error": "No picture uploaded"}), 400

    # Remove old picture if it exists
    user = mongo.db.users.find_one({"username": current_user})
    if user and user.get("picture"):
        old_filename = user["picture"].replace("/static/uploads/", "")
        old_path = os.path.join("static", "uploads", old_filename)
        if os.path.exists(old_path):
            os.remove(old_path)

    # Save new picture
    upload_dir = os.path.join("static", "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    filename = secure_filename(f"{current_user}_{picture_file.filename}")
    filepath = os.path.join(upload_dir, filename)
    picture_file.save(filepath)

    image_url = f"/static/uploads/{filename}"
    mongo.db.users.update_one({"username": current_user}, {"$set": {"picture": image_url}})
    return jsonify({"success": True, "picture": image_url}), 200

# ====== SCORES ======
@app.route('/submit-score', methods=['POST'])
@jwt_required()
def submit_score():
    current_user = get_jwt_identity()
    data = request.json
    score = data.get("score")
    session_id = data.get("sessionId")
    if not score or not session_id:
        return jsonify({"success": False, "error": "Missing score or sessionId"}), 400
    if mongo.db.scores.find_one({"username": current_user, "sessionId": session_id}):
        return jsonify({"success": False, "error": "Score already submitted"}), 409
    mongo.db.scores.insert_one({
        "username": current_user,
        "score": score,
        "sessionId": session_id,
        "timestamp": data.get("timestamp", datetime.utcnow().isoformat())
    })
    return jsonify({"success": True, "message": "Score submitted"}), 200

@app.route('/get-highscores', methods=['GET'])
def get_highscores():
    scores = list(mongo.db.scores.aggregate([
        {"$group": {
            "_id": "$username",
            "best_score": {"$max": "$score"},
            "timestamp": {"$first": "$timestamp"}
        }},
        {"$sort": {"best_score": -1}},
        {"$limit": 250}
    ]))
    return jsonify({"success": True, "highscores": [
        {"username": s["_id"], "score": s["best_score"], "timestamp": s["timestamp"]} for s in scores
    ]})

@app.route('/my-scores', methods=['GET'])
@jwt_required()
def get_my_scores():
    current_user = get_jwt_identity()
    scores = list(mongo.db.scores.find({"username": current_user}).sort("score", -1))
    return jsonify({"success": True, "scores": [
        {"score": s["score"], "timestamp": s.get("timestamp", "")} for s in scores
    ]})

# ====== DAILY PUZZLE ======
@app.route('/daily-puzzle', methods=['GET'])
@jwt_required()
def get_daily_puzzle():
    current_user = get_jwt_identity()
    today = datetime.utcnow().strftime('%Y-%m-%d')

    existing_attempt = mongo.db.daily_attempts.find_one({"username": current_user, "date": today})
    if existing_attempt:
        return jsonify({"error": "Already played today"}), 403

    existing_puzzle = mongo.db.daily_sentence.find_one({"date": today})
    if not existing_puzzle:
        try:
            response = requests.get("https://zenquotes.io/api/random")
            quote_data = response.json()[0]
            raw_sentence = quote_data.get("q", "")
            clean_sentence = re.sub(r"[^a-zA-Z ]", "", raw_sentence)

            unique_letters = sorted(set(clean_sentence.replace(" ", "").lower()))
            letter_map = {char: str(i + 1) for i, char in enumerate(unique_letters)}
            revealed_letters = random.sample(unique_letters, min(2, len(unique_letters)))

            doc = {
                "date": today,
                "sentence": clean_sentence,
                "hint": f"By {quote_data.get('a', 'Unknown')}",
                "revealedLetters": revealed_letters,
                "letterMap": letter_map
            }
            mongo.db.daily_sentence.insert_one(doc)
        except Exception as e:
            return jsonify({"error": "Failed to generate daily puzzle", "details": str(e)}), 500
    else:
        doc = existing_puzzle

    mongo.db.daily_attempts.insert_one({"username": current_user, "date": today})
    return jsonify(doc)

# ====== ENDLESS GAME PUZZLES ======
@app.route('/get-puzzle', methods=['GET'])
def get_puzzle():
    sentences = list(mongo.db.sentences.find())
    if not sentences:
        return jsonify({"error": "No puzzles found"}), 404
    puzzle = random.choice(sentences)
    return jsonify({
        "category": puzzle.get("category", "General"),
        "hint": puzzle.get("hint", ""),
        "sentence": puzzle.get("sentence", ""),
        "revealedLetters": puzzle.get("revealedLetters", []),
        "letterMap": puzzle.get("letterMap", {})
    })

# ====== CATEGORY PUZZLES ======
@app.route('/get-category/<category>', methods=['GET'])
def get_category_puzzles(category):
    try:
        collection_map = {
            "DOTA": "Dota",
            "EARTH": "Earth",
            "LORUM IPSUM": "LORUM_IPSUM",
            "MEDSOE": "Medsoe",
            "SCIENCE": "Science"
        }
        if category not in collection_map:
            return jsonify({"error": f"Unknown category '{category}'"}), 404
        collection_name = collection_map[category]
        docs = list(mongo.db[collection_name].find({}, {'_id': 0}))
        return jsonify(docs), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch category puzzles", "details": str(e)}), 500

# ====== FRIENDS ======
@app.route('/send-friend-request', methods=['POST'])
@jwt_required()
def send_friend_request():
    current_user = get_jwt_identity()
    data = request.json
    target_user = data.get("username")
    
    if not target_user:
        return jsonify({"success": False, "error": "Target username is required"}), 400
    
    if mongo.db.users.find_one({"username": target_user}) is None:
        return jsonify({"success": False, "error": "User not found"}), 404

    if mongo.db.users.find_one({"username": current_user, "friends.username": target_user}):
        return jsonify({"success": False, "error": "You are already friends with this user"}), 400
    
    if mongo.db.users.find_one({"username": current_user, "sentRequests.username": target_user}):
        return jsonify({"success": False, "error": "Friend request already sent"}), 400
    
    mongo.db.users.update_one({"username": current_user}, {"$push": {"sentRequests": {"username": target_user}}})
    mongo.db.users.update_one({"username": target_user}, {"$push": {"friendRequests": {"username": current_user}}})
    
    return jsonify({"success": True, "message": "Friend request sent"}), 200

@app.route('/friend-requests', methods=['GET'])
@jwt_required()
def get_friend_requests():
    current_user = get_jwt_identity()
    user = mongo.db.users.find_one({"username": current_user}, {"_id": 0, "friendRequests": 1})
    
    if not user:
        return jsonify({"success": False, "error": "User not found"}), 404
    
    return jsonify({"success": True, "friend_requests": user.get("friendRequests", [])}), 200

@app.route('/accept-friend-request', methods=['POST'])
@jwt_required()
def accept_friend_request():
    current_user = get_jwt_identity()
    data = request.json
    sender = data.get("username")
    
    if not sender:
        return jsonify({"success": False, "error": "Sender username is required"}), 400

    mongo.db.users.update_one({"username": current_user}, {"$push": {"friends": {"username": sender}}})
    mongo.db.users.update_one({"username": sender}, {"$push": {"friends": {"username": current_user}}})

    mongo.db.users.update_one({"username": current_user}, {"$pull": {"friendRequests": {"username": sender}}})
    mongo.db.users.update_one({"username": sender}, {"$pull": {"sentRequests": {"username": current_user}}})

    return jsonify({"success": True, "message": "Friend request accepted"}), 200

@app.route('/deny-friend-request', methods=['POST'])
@jwt_required()
def deny_friend_request():
    current_user = get_jwt_identity()
    data = request.json
    sender = data.get("username")
    
    if not sender:
        return jsonify({"success": False, "error": "Sender username is required"}), 400

    mongo.db.users.update_one({"username": current_user}, {"$pull": {"friendRequests": {"username": sender}}})
    mongo.db.users.update_one({"username": sender}, {"$pull": {"sentRequests": {"username": current_user}}})

    return jsonify({"success": True, "message": "Friend request denied"}), 200

@app.route('/get-friends', methods=['GET'])
@jwt_required()
def get_friends():
    current_user = get_jwt_identity()
    user = mongo.db.users.find_one({"username": current_user}, {"_id": 0, "friends": 1})

    if not user:
        return jsonify({"success": False, "error": "User not found"}), 404
    
    return jsonify({"success": True, "friends": user.get("friends", [])}), 200

@app.route('/remove-friend', methods=['POST'])
@jwt_required()
def remove_friend():
    current_user = get_jwt_identity()
    data = request.json
    friend_username = data.get("username")
    
    if not friend_username:
        return jsonify({"success": False, "error": "Friend's username is required"}), 400
    
    mongo.db.users.update_one({"username": current_user}, {"$pull": {"friends": {"username": friend_username}}})
    mongo.db.users.update_one({"username": friend_username}, {"$pull": {"friends": {"username": current_user}}})

    return jsonify({"success": True, "message": "Friend removed"}), 200

# ====== FUN STUFF ======
@app.route('/get-bogus-hint', methods=['GET'])
def get_bogus_hint():
    hints = list(mongo.db.hints.find())
    if not hints:
        return jsonify({"text": "No hints found."}), 404
    return jsonify(random.choice(hints))

@app.route('/phoneline', methods=['GET'])
def get_random_phone_line():
    lines = list(mongo.db.phonelines.find())
    if not lines:
        return jsonify({"success": False, "message": "No phone lines found."}), 404
    return jsonify({"success": True, "message": random.choice(lines).get("message", "")})

# ====== START ======
if __name__ == '__main__':
    print("✅ Starting Flask app on http://127.0.0.1:5000")
    app.run(debug=True)
