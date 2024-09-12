import { FlashCardManager } from './FlashCardManager.js';

export async function initializeFlashCards() {
  const elements = {
    container: document.getElementById('flashCardContainer'),
    card: document.getElementById('flashCard'),
    flipButton: document.getElementById('flipCard'),
    nextButton: document.getElementById('nextCard'),
    speakButton: document.getElementById('speakCard'),
    closeButton: document.getElementById('closeFlashCards'),
    categorySelector: document.getElementById('categorySelector')
  };

  const flashCardManager = new FlashCardManager(elements);
  await flashCardManager.initialize();

  return () => flashCardManager.toggleFlashCards();
}