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

    let state = {
        currentCard: null,
        isFlipped: false,
        currentVocabulary: []
    };

    const speech = {
        synth: window.speechSynthesis,
        voices: [],
        chineseVoice: null,
        setVoices: function() {
            this.voices = this.synth.getVoices();
            this.chineseVoice = this.voices.find(voice => voice.lang.includes('zh'));
        },
        speak: function(text, isEnglish) {
            const utterance = new SpeechSynthesisUtterance(text);
            if (this.voices.length === 0) {
                this.setVoices(); // Try to set voices again if they weren't loaded initially
            }
            utterance.voice = isEnglish ? null : this.chineseVoice;
            utterance.lang = isEnglish ? 'en-US' : 'zh-CN';
            this.synth.speak(utterance);
        }
    };

    // Function to initialize voices
    function initializeVoices() {
        return new Promise((resolve) => {
            if (speech.synth.getVoices().length > 0) {
                speech.setVoices();
                resolve();
            } else {
                speech.synth.onvoiceschanged = () => {
                    speech.setVoices();
                    resolve();
                };
            }
        });
    }

    // Initialize voices
    await initializeVoices();

    function getRandomCard() {
        return state.currentVocabulary[Math.floor(Math.random() * state.currentVocabulary.length)];
    }

    function updateCard() {
        state.currentCard = getRandomCard();
        state.isFlipped = false;
        elements.card.textContent = state.currentCard.mandarin;
    }

    function flipCard() {
        state.isFlipped = !state.isFlipped;
        elements.card.textContent = state.isFlipped 
            ? `${state.currentCard.english} (${state.currentCard.pinyin})` 
            : state.currentCard.mandarin;
    }

    function speakCard() {
        const textToSpeak = state.isFlipped ? state.currentCard.english : state.currentCard.mandarin;
        speech.speak(textToSpeak, state.isFlipped);
    }

    function toggleFlashCards() {
        if (elements.container.classList.contains('hidden')) {
            ensureCategory();
            if (state.currentVocabulary.length === 0) {
                alert("No vocabulary available for the selected category.");
                return;
            }
            elements.container.classList.remove('hidden');
            updateCard();
        } else {
            elements.container.classList.add('hidden');
        }
    }

    function updateCategorySelector() {
        elements.categorySelector.innerHTML = '';
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            if (table.id !== 'searchResultsTable') {  // Exclude search results table
                const option = document.createElement('option');
                option.value = table.id;
                option.textContent = table.previousElementSibling.textContent;
                elements.categorySelector.appendChild(option);
            }
        });
    }

    function updateCurrentVocabulary() {
        const selectedTableId = elements.categorySelector.value;
        const table = document.getElementById(selectedTableId);
        if (table) {
            state.currentVocabulary = Array.from(table.querySelectorAll('tbody tr')).map(row => ({
                mandarin: row.cells[0].textContent,
                english: row.cells[1].textContent,
                pinyin: row.cells[2].textContent
            }));
        } else {
            state.currentVocabulary = [];
        }
    }

    function ensureCategory() {
        if (elements.categorySelector.options.length === 0) {
            updateCategorySelector();
        }
        if (elements.categorySelector.value === '') {
            // Find the first non-search category
            for (let i = 0; i < elements.categorySelector.options.length; i++) {
                if (elements.categorySelector.options[i].value !== 'searchResultsTable') {
                    elements.categorySelector.selectedIndex = i;
                    break;
                }
            }
        }
        updateCurrentVocabulary();
    }

    // Event listeners
    elements.flipButton.addEventListener('click', flipCard);
    elements.nextButton.addEventListener('click', updateCard);
    elements.speakButton.addEventListener('click', speakCard);
    elements.closeButton.addEventListener('click', () => elements.container.classList.add('hidden'));
    elements.card.addEventListener('click', flipCard);
    elements.categorySelector.addEventListener('change', () => {
        updateCurrentVocabulary();
        updateCard();
    });

    return toggleFlashCards;
}