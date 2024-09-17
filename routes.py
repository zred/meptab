from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import FileResponse
from fastapi.templating import Jinja2Templates
from typing import List
from models import VocabularyCreate
from services.vocabulary_service import VocabularyService
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_session
from logging_config import log_to_endpoint, log_message, LogCreate

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
        await log_to_endpoint("INFO", "Successfully fetched vocabulary")
        return vocabulary
    except Exception as e:
        await log_to_endpoint("ERROR", f"Error fetching vocabulary: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/upload_vocabulary")
async def upload_vocabulary(vocabulary_list: List[VocabularyCreate], vocabulary_service: VocabularyService = Depends()):
    try:
        await vocabulary_service.create_vocabulary(vocabulary_list)
        await log_to_endpoint("INFO", "Vocabulary uploaded and merged successfully")
        return {"message": "Vocabulary uploaded and merged successfully"}
    except Exception as e:
        await log_to_endpoint("ERROR", f"Error processing vocabulary: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the vocabulary: {str(e)}")

@router.get("/upload_vocabulary")
async def upload_vocabulary_page(request: Request):
    return templates.TemplateResponse("upload_vocabulary.html", {"request": request})

@router.get("/create_vocabulary")
async def create_vocabulary_page(request: Request):
    return templates.TemplateResponse("create_vocabulary.html", {"request": request})

@router.post("/api/log")
async def api_log_message(log_data: LogCreate, session: AsyncSession = Depends(get_session)):
    return await log_message(log_data, session)
