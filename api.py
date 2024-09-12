from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Mount the static files directory
app.mount("/scripts", StaticFiles(directory="scripts"), name="scripts")
app.mount("/data", StaticFiles(directory="data"), name="data")
app.mount("/static", StaticFiles(directory="."), name="static")

@app.get("/")
async def read_index():
    return FileResponse("index.html")

@app.get("/api/vocabulary")
async def get_vocabulary():
    data_dir = "data"
    vocabulary_file = "vocabulary.json"

    try:
        with open(os.path.join(data_dir, vocabulary_file), "r", encoding="utf-8") as f:
            vocabulary = json.load(f)
        return vocabulary
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Vocabulary file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding vocabulary file")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
