from typing import List
from sqlmodel import SQLModel, Field
from pydantic import validator
import re
from sqlalchemy import Column, JSON

class VocabularyBase(SQLModel):
    mandarin: str
    english: str
    pinyin: str
    contexts: List[str] = Field(sa_column=Column(JSON))

    @validator('mandarin')
    def validate_mandarin(cls, v):
        if not v.strip():
            raise ValueError('Mandarin field cannot be empty')
        return v

    @validator('english')
    def validate_english(cls, v):
        if not v.strip():
            raise ValueError('English field cannot be empty')
        return v

    @validator('pinyin')
    def validate_pinyin(cls, v):
        if not v.strip():
            raise ValueError('Pinyin field cannot be empty')
        return v

    @validator('contexts')
    def validate_contexts(cls, v):
        if not v:
            raise ValueError('At least one context must be provided')
        if not all(isinstance(context, str) and context.strip() for context in v):
            raise ValueError('All contexts must be non-empty strings')
        return v

class Vocabulary(VocabularyBase, table=True):
    id: int = Field(default=None, primary_key=True)

class VocabularyCreate(VocabularyBase):
    pass