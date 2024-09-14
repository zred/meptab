from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import FileResponse
from fastapi.templating import Jinja2Templates
from typing import List
from models import VocabularyCreate
from services.vocabulary_service import VocabularyService

router = APIRouter()

templates = Jinja2Templates(directory="templates")

@router.get("/")
async def read_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@router.get("/favicon.ico")
async def read_favicon():
    return FileResponse("favicon.ico")

@router.get("/api/vocabulary")
async def get_vocabulary(vocabulary_service: VocabularyService = Depends()):
    try:
        vocabulary = await vocabulary_service.get_all_vocabulary()
        return vocabulary
    except Exception as e:
        print(f"Error in get_vocabulary: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred while fetching vocabulary: {str(e)}")

@router.post("/api/upload_vocabulary")
async def upload_vocabulary(vocabulary_list: List[VocabularyCreate], vocabulary_service: VocabularyService = Depends()):
    try:
        await vocabulary_service.create_vocabulary(vocabulary_list)
        return {"message": "Vocabulary uploaded and merged successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the vocabulary: {str(e)}")
