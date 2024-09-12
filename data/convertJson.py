import json
import os

# List of current JSON files (excluding dataFiles.json)
json_files = [
    "actions.json", "colors.json", "fruits.json", "landforms.json",
    "polar_descriptors.json", "positions.json", "textures.json",
    "vegetables.json", "weather.json"
]

# New vocabulary structure
new_vocabulary = []

# Function to add a word to the new vocabulary
def add_word(word, context):
    existing_word = next((item for item in new_vocabulary if item["mandarin"] == word["mandarin"]), None)
    if existing_word:
        if context not in existing_word["contexts"]:
            existing_word["contexts"].append(context)
    else:
        word["contexts"] = [context]
        new_vocabulary.append(word)

# Process each JSON file
for file_name in json_files:
    with open(file_name, 'r', encoding='utf-8') as file:
        data = json.load(file)
        context = data["id"]
        for word in data["data"]:
            add_word(word, context)

# Sort the vocabulary by mandarin characters
new_vocabulary.sort(key=lambda x: x["mandarin"])

# Save the new vocabulary to a file
with open('vocabulary.json', 'w', encoding='utf-8') as file:
    json.dump(new_vocabulary, file, ensure_ascii=False, indent=2)

print("Conversion complete. New vocabulary saved to vocabulary.json")
