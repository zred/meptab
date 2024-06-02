import json

# Load the current JSON file
with open('vocabulary.json', 'r', encoding='utf-8') as file:
    current_data = json.load(file)

# New JSON structure template
new_data = {
    "categories": []
}

# Mapping of old table names to new category IDs and names
table_mapping = {
    "positionsTable": {"id": "positions", "name": "Positions and Directions"},
    "colorsTable": {"id": "colors", "name": "Colors"},
    "polarDescriptorsTable": {"id": "polar_descriptors", "name": "Polar Descriptors"},
    "actionsTable": {"id": "actions", "name": "Actions"},
    "texturesTable": {"id": "textures", "name": "Textures"},
    "landformsTable": {"id": "landforms", "name": "Landforms"}
}

# Iterate over each table and convert to the new structure
for table_name, category_info in table_mapping.items():
    if table_name in current_data:
        new_data["categories"].append({
            "id": category_info["id"],
            "name": category_info["name"],
            "data": current_data[table_name]
        })

# Save the new JSON structure to a file
with open('new_vocabulary.json', 'w', encoding='utf-8') as file:
    json.dump(new_data, file, ensure_ascii=False, indent=2)

print('Conversion complete. New JSON saved to new_vocabulary.json')
