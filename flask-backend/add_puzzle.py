import pymongo
import random
import string

# Setup MongoDB connection
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["crackthecode"]
collection = db["sentences"]

def generate_letter_map():
    alphabet = list(string.ascii_lowercase)
    numbers = random.sample(range(1, 27), 26)
    return {letter: numbers[i] for i, letter in enumerate(alphabet)}

def get_revealed_letters(sentence, count=3):
    letters = list(set([char.lower() for char in sentence if char.isalpha()]))
    revealed = random.sample(letters, min(count, len(letters)))
    return revealed

def main():
    while True:
        print("\n--- Add New Puzzle ---")
        sentence = input("Enter the sentence: ").strip()
        category = input("Enter the category: ").strip()
        hint = input("Enter the hint: ").strip()

        letter_map = generate_letter_map()
        revealed_letters = get_revealed_letters(sentence, random.randint(2, 4))

        # Show preview
        print("\n--- Preview ---")
        print(f"Sentence: {sentence}")
        print(f"Category: {category}")
        print(f"Hint: {hint}")
        print(f"Revealed Letters: {revealed_letters}")
        print("----------------------")

        confirm = input("Is this correct? (y/n): ").strip().lower()
        if confirm == 'y':
            doc = {
                "sentence": sentence,
                "category": category,
                "hint": hint,
                "letterMap": letter_map,
                "revealedLetters": revealed_letters
            }
            collection.insert_one(doc)
            print("Puzzle added to the database!")
        else:
            print("Puzzle was not added to the database!")

if __name__ == "__main__":
    main()
