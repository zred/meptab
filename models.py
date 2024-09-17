from typing import List
from sqlmodel import SQLModel, Field
from pydantic import field_validator, computed_field
from sqlalchemy import Column, JSON
from datetime import datetime

class VocabularyBase(SQLModel):
    mandarin: str
    english: str
    pinyin: str
    contexts: List[str] = Field(sa_column=Column(JSON))

    @field_validator('mandarin', 'english', 'pinyin')
    @classmethod
    def validate_non_empty(cls, v: str, field: str) -> str:
        if not v.strip():
            raise ValueError(f'{field.name.capitalize()} field cannot be empty')
        return v

    @field_validator('contexts')
    @classmethod
    def validate_contexts(cls, v: List[str]) -> List[str]:
        if not v or not all(isinstance(context, str) and context.strip() for context in v):
            raise ValueError('At least one non-empty context must be provided')
        return v

class Vocabulary(VocabularyBase, table=True):
    id: int = Field(default=None, primary_key=True)

class VocabularyCreate(VocabularyBase):
    pass

class LogEntry(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    timestamp: str
    level: str
    message: str

    @computed_field
    def datetime_timestamp(self) -> datetime:
        return datetime.fromisoformat(self.timestamp)

    @classmethod
    def create(cls, timestamp: datetime, level: str, message: str):
        return cls(timestamp=timestamp.isoformat(), level=level, message=message)

    def model_dump(self, *args, **kwargs):
        data = super().model_dump(*args, **kwargs)
        data['timestamp'] = self.timestamp
        return data

class LogCreate(SQLModel):
    timestamp: str
    level: str
    message: str

    @field_validator('timestamp')
    @classmethod
    def validate_timestamp(cls, v: str) -> str:
        try:
            # Remove the 'Z' and truncate to microseconds
            v = v.rstrip('Z')
            if '.' in v:
                v = v[:v.index('.') + 7]  # Keep up to 6 decimal places
            datetime.fromisoformat(v)  # Validate the format
            return v
        except ValueError:
            raise ValueError(f"Invalid timestamp format: {v}")