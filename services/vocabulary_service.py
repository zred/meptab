from sqlmodel import select
from models import Vocabulary, VocabularyCreate
from database import get_session
from fastapi import Depends

class VocabularyService:
    def __init__(self, session=Depends(get_session)):
        self.session = session

    async def get_all_vocabulary(self):
        vocabulary = await self.session.exec(select(Vocabulary))
        return vocabulary.all()

    async def create_vocabulary(self, vocabulary_list: list[VocabularyCreate]):
        for new_word in vocabulary_list:
            existing_word = await self.session.exec(select(Vocabulary).where(Vocabulary.mandarin == new_word.mandarin))
            existing_word = existing_word.first()
            if existing_word:
                existing_word.contexts = list(set(existing_word.contexts + new_word.contexts))
                existing_word.english = new_word.english
                existing_word.pinyin = new_word.pinyin
            else:
                new_vocabulary = Vocabulary(**new_word.dict())
                self.session.add(new_vocabulary)
        await self.session.commit()
