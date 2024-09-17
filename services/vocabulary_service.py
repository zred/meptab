from sqlmodel import select
from models import Vocabulary, VocabularyCreate
from database import get_session
from fastapi import Depends
from logging_config import log_to_endpoint

class VocabularyService:
    def __init__(self, session=Depends(get_session)):
        self.session = session

    async def get_all_vocabulary(self):
        try:
            async with self.session as session:
                result = await session.execute(select(Vocabulary))
                await log_to_endpoint("INFO", "Successfully retrieved all vocabulary")
                return result.scalars().all()
        except Exception as e:
            await log_to_endpoint("ERROR", f"Error in get_all_vocabulary: {str(e)}")
            raise

    async def create_vocabulary(self, vocabulary_list: list[VocabularyCreate]):
        try:
            async with self.session as session:
                for new_word in vocabulary_list:
                    result = await session.execute(select(Vocabulary).where(Vocabulary.mandarin == new_word.mandarin))
                    existing_word = result.scalar_one_or_none()
                    if existing_word:
                        existing_word.contexts = list(set(existing_word.contexts + new_word.contexts))
                        existing_word.english = new_word.english
                        existing_word.pinyin = new_word.pinyin
                        await log_to_endpoint("INFO", f"Updated existing word: {new_word.mandarin}")
                    else:
                        new_vocabulary = Vocabulary(**new_word.dict())
                        session.add(new_vocabulary)
                        await log_to_endpoint("INFO", f"Added new word: {new_word.mandarin}")
                await session.commit()
            await log_to_endpoint("INFO", f"Successfully created/updated {len(vocabulary_list)} vocabulary items")
        except Exception as e:
            await log_to_endpoint("ERROR", f"Error in create_vocabulary: {str(e)}")
            raise
