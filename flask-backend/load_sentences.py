import random
import string
from pymongo import MongoClient

# Connect to local MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["crackthecode"]
collection = db["sentences"]

# Clears previous data (optional – for testing)
collection.delete_many({})

# Sample iconic sentences
sentences = [
    {
        "sentence": "Winter is coming",
        "category": "TV Show",
        "hint": "House Stark’s motto",
        "revealedLetters": ["I", "N", "G"]
    },
    {
        "sentence": "To be or not to be",
        "category": "Literature",
        "hint": "Famous Shakespeare quote",
        "revealedLetters": ["O", "T", "E"]
    },
    {
        "sentence": "May the force be with you",
        "category": "Movie",
        "hint": "Classic line from a galaxy far, far away",
        "revealedLetters": ["E", "H", "Y"]
    },
    {
        "sentence": "Elementary my dear Watson",
        "category": "Literature",
        "hint": "Sherlock Holmes catchphrase",
        "revealedLetters": ["A", "R", "E"]
    },
    {
        "sentence": "Houston we have a problem",
        "category": "History",
        "hint": "Apollo 13 mission quote",
        "revealedLetters": ["O", "E", "L"]
    }
]

def generate_letter_map(sentence):
    letters = set(c.upper() for c in sentence if c.isalpha())
    available_numbers = list(range(10, 99))  # Use 2-digit codes for fun
    random.shuffle(available_numbers)
    return {letter: available_numbers[i] for i, letter in enumerate(letters)}

# Insert sentences
for entry in sentences:
    entry["letterMap"] = generate_letter_map(entry["sentence"])
    collection.insert_one(entry)

print("Sentences loaded into MongoDB")
