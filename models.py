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
        if not re.match(r'^[\u4e00-\u9fff]+$', v):
            raise ValueError('Mandarin must contain only Chinese characters')
        return v

    @validator('english')
    def validate_english(cls, v):
        if not re.match(r'^[a-zA-Z\s\-()]+$', v):
            raise ValueError('English must contain only Latin characters, spaces, hyphens, and parentheses')
        return v

    @validator('pinyin')
    def validate_pinyin(cls, v):
        if not re.match(r'^[a-zA-Z\s]+$', v):
            raise ValueError('Pinyin must contain only Latin characters and spaces')
        if not all(char in 'āáǎàēéěèīíǐìōóǒòūúǔùüǖǘǚǜ' or char.isalpha() or char.isspace() for char in v):
            raise ValueError('Pinyin must use valid tone marks')
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