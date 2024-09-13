from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from typing import List
from models import VocabularyCreate
from services.vocabulary_service import VocabularyService

router = APIRouter()

@router.get("/")
async def read_index():
    return FileResponse("index.html")

@router.get("/favicon.ico")
async def read_favicon():
    return FileResponse("favicon.ico")

@router.get("/api/vocabulary")
async def get_vocabulary(vocabulary_service: VocabularyService = Depends()):
    try:
        vocabulary = await vocabulary_service.get_all_vocabulary()
        return vocabulary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while fetching vocabulary: {str(e)}")

@router.post("/api/upload_vocabulary")
async def upload_vocabulary(vocabulary_list: List[VocabularyCreate], vocabulary_service: VocabularyService = Depends()):
    try:
        await vocabulary_service.create_vocabulary(vocabulary_list)
        return {"message": "Vocabulary uploaded and merged successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the vocabulary: {str(e)}")
