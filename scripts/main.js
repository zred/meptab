import { renderTable } from './renderTable.js';
import { addSearchFunctionality } from './search.js';
import { initializeToggleTable } from './toggleTable.js';
import { initializeFlashCards } from './flashCards.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const toggleFlashCards = await initializeFlashCards();
        await renderTable(toggleFlashCards);
        await addSearchFunctionality();
        await initializeToggleTable();
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
});