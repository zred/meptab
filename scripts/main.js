import { renderTable } from './renderTable.js';
import { addSearchFunctionality } from './search.js';
import { initializeToggleTable } from './toggleTable.js';
import { initializeFlashCards } from './flashCards.js';

document.addEventListener('DOMContentLoaded', async () => {
    const toggleFlashCards = await initializeFlashCards();
    await renderTable(toggleFlashCards);
    addSearchFunctionality();
    initializeToggleTable();
});