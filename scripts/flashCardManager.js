import { initializeSpeech } from './speechSynthesis.js';
import { clearElement, createElement, appendChildren } from './domUtils.js';

export class FlashCardManager {
  constructor(elements) {
    this.elements = elements;
    this.state = {
      currentCard: null,
      isFlipped: false,
      currentVocabulary: []
    };
    this.speech = null;
  }

  async initialize() {
    this.speech = await initializeSpeech();
    this.addEventListeners();
  }

  addEventListeners() {
    this.elements.flipButton.addEventListener('click', () => this.flipCard());
    this.elements.nextButton.addEventListener('click', () => this.updateCard());
    this.elements.speakButton.addEventListener('click', () => this.speakCard());
    this.elements.closeButton.addEventListener('click', () => this.hideFlashCards());
    this.elements.card.addEventListener('click', () => this.flipCard());
    this.elements.categorySelector.addEventListener('change', () => {
      this.updateCurrentVocabulary();
      this.updateCard();
    });
  }

  async getRandomCard() {
    if (this.state.currentVocabulary.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * this.state.currentVocabulary.length);
    return this.state.currentVocabulary[randomIndex];
  }

  async updateCard() {
    this.state.currentCard = await this.getRandomCard();
    if (this.state.currentCard) {
      this.state.isFlipped = false;
      this.elements.card.textContent = this.state.currentCard.mandarin;
    } else {
      this.elements.card.textContent = "No cards available";
    }
  }

  async flipCard() {
    if (!this.state.currentCard) return;
    
    this.state.isFlipped = !this.state.isFlipped;
    this.elements.card.textContent = this.state.isFlipped 
      ? `${this.state.currentCard.english} (${this.state.currentCard.pinyin})` 
      : this.state.currentCard.mandarin;
    await new Promise(resolve => setTimeout(resolve, 0)); // Yield to event loop
  }

  async speakCard() {
    if (!this.state.currentCard) return;
    
    const textToSpeak = this.state.isFlipped ? this.state.currentCard.english : this.state.currentCard.mandarin;
    await this.speech.speak(textToSpeak, this.state.isFlipped);
  }

  async showFlashCards() {
    await this.ensureCategory();
    if (this.state.currentVocabulary.length === 0) {
      alert("No vocabulary available for the selected category.");
      return;
    }
    this.elements.container.classList.remove('hidden');
    await this.updateCard();
  }

  hideFlashCards() {
    this.elements.container.classList.add('hidden');
  }

  async toggleFlashCards() {
    if (this.elements.container.classList.contains('hidden')) {
      await this.showFlashCards();
    } else {
      this.hideFlashCards();
    }
  }

  async updateCategorySelector() {
    await clearElement(this.elements.categorySelector);
    const tables = document.querySelectorAll('table');
    for (const table of tables) {
      if (table.id !== 'searchResultsTable') {
        const option = createElement('option', { value: table.id }, table.previousElementSibling.textContent);
        await appendChildren(this.elements.categorySelector, option);
      }
    }
  }

  async updateCurrentVocabulary() {
    const selectedTableId = this.elements.categorySelector.value;
    const table = document.getElementById(selectedTableId);
    if (table) {
      this.state.currentVocabulary = await Promise.all(
        Array.from(table.querySelectorAll('tbody tr')).map(async row => ({
          mandarin: row.cells[0].textContent,
          english: row.cells[1].textContent,
          pinyin: row.cells[2].textContent
        }))
      );
    } else {
      this.state.currentVocabulary = [];
    }
  }

  async ensureCategory() {
    if (this.elements.categorySelector.options.length === 0) {
      await this.updateCategorySelector();
    }
    if (this.elements.categorySelector.value === '') {
      for (let i = 0; i < this.elements.categorySelector.options.length; i++) {
        if (this.elements.categorySelector.options[i].value !== 'searchResultsTable') {
          this.elements.categorySelector.selectedIndex = i;
          break;
        }
      }
    }
    await this.updateCurrentVocabulary();
  }
}
