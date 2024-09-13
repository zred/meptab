import json
import requests
from models import VocabularyCreate

# Load the JSON file
with open('data/vocabulary.json', 'r', encoding='utf-8') as file:
    vocabulary_data = json.load(file)

# Validate and convert the data using the VocabularyCreate model
validated_data = [VocabularyCreate(**item).dict() for item in vocabulary_data]

# API endpoint
url = 'http://localhost:8000/api/upload_vocabulary'

# Send POST request to the API
response = requests.post(url, json=validated_data)

# Check the response
if response.status_code == 200:
    print("Vocabulary uploaded successfully!")
else:
    print(f"Error uploading vocabulary. Status code: {response.status_code}")
    print(f"Response: {response.text}")