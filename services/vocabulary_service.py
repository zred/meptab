from sqlmodel import select
from models import Vocabulary, VocabularyCreate
from database import get_session
from fastapi import Depends

class VocabularyService:
    def __init__(self, session=Depends(get_session)):
        self.session = session

    async def get_all_vocabulary(self):
        try:
            async with self.session as session:
                result = await session.execute(select(Vocabulary))
                return result.scalars().all()
        except Exception as e:
            print(f"Error in get_all_vocabulary: {str(e)}")  # Add this line for debugging
            raise

    async def create_vocabulary(self, vocabulary_list: list[VocabularyCreate]):
        async with self.session as session:
            for new_word in vocabulary_list:
                result = await session.execute(select(Vocabulary).where(Vocabulary.mandarin == new_word.mandarin))
                existing_word = result.scalar_one_or_none()
                if existing_word:
                    existing_word.contexts = list(set(existing_word.contexts + new_word.contexts))
                    existing_word.english = new_word.english
                    existing_word.pinyin = new_word.pinyin
                else:
                    new_vocabulary = Vocabulary(**new_word.dict())
                    session.add(new_vocabulary)
            await session.commit()
