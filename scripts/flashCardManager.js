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

  getRandomCard() {
    return this.state.currentVocabulary[Math.floor(Math.random() * this.state.currentVocabulary.length)];
  }

  updateCard() {
    this.state.currentCard = this.getRandomCard();
    this.state.isFlipped = false;
    this.elements.card.textContent = this.state.currentCard.mandarin;
  }

  flipCard() {
    this.state.isFlipped = !this.state.isFlipped;
    this.elements.card.textContent = this.state.isFlipped 
      ? `${this.state.currentCard.english} (${this.state.currentCard.pinyin})` 
      : this.state.currentCard.mandarin;
  }

  speakCard() {
    const textToSpeak = this.state.isFlipped ? this.state.currentCard.english : this.state.currentCard.mandarin;
    this.speech.speak(textToSpeak, this.state.isFlipped);
  }

  showFlashCards() {
    this.ensureCategory();
    if (this.state.currentVocabulary.length === 0) {
      alert("No vocabulary available for the selected category.");
      return;
    }
    this.elements.container.classList.remove('hidden');
    this.updateCard();
  }

  hideFlashCards() {
    this.elements.container.classList.add('hidden');
  }

  toggleFlashCards() {
    if (this.elements.container.classList.contains('hidden')) {
      this.showFlashCards();
    } else {
      this.hideFlashCards();
    }
  }

  updateCategorySelector() {
    clearElement(this.elements.categorySelector);
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      if (table.id !== 'searchResultsTable') {
        const option = createElement('option', { value: table.id }, table.previousElementSibling.textContent);
        this.elements.categorySelector.appendChild(option);
      }
    });
  }

  updateCurrentVocabulary() {
    const selectedTableId = this.elements.categorySelector.value;
    const table = document.getElementById(selectedTableId);
    if (table) {
      this.state.currentVocabulary = Array.from(table.querySelectorAll('tbody tr')).map(row => ({
        mandarin: row.cells[0].textContent,
        english: row.cells[1].textContent,
        pinyin: row.cells[2].textContent
      }));
    } else {
      this.state.currentVocabulary = [];
    }
  }

  ensureCategory() {
    if (this.elements.categorySelector.options.length === 0) {
      this.updateCategorySelector();
    }
    if (this.elements.categorySelector.value === '') {
      for (let i = 0; i < this.elements.categorySelector.options.length; i++) {
        if (this.elements.categorySelector.options[i].value !== 'searchResultsTable') {
          this.elements.categorySelector.selectedIndex = i;
          break;
        }
      }
    }
    this.updateCurrentVocabulary();
  }
}
