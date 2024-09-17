import { renderTable } from './renderTable.js';
import { addSearchFunctionality } from './search.js';
import { initializeFlashCards } from './flashCards.js';
import { Logger, handleError } from './logger.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        Logger.log('Application starting');
        const flashCardManager = await initializeFlashCards();
        await renderTable();
        await addSearchFunctionality();

        const practiceFlashcardsButton = document.getElementById('practiceFlashcards');
        if (practiceFlashcardsButton) {
            practiceFlashcardsButton.addEventListener('click', () => flashCardManager.toggleFlashCards());
        }

        const contextSelector = document.getElementById('contextSelector');
        const tablesContainer = document.getElementById('tablesContainer');

        if (contextSelector) {
            contextSelector.addEventListener('change', () => {
                const selectedContext = contextSelector.value;
                tablesContainer.classList.toggle('hidden', !selectedContext);

                const headers = tablesContainer.querySelectorAll('h2.toggle-header');
                const tables = tablesContainer.querySelectorAll('table');

                headers.forEach(header => {
                    header.classList.toggle('hidden', header.textContent !== selectedContext);
                });

                tables.forEach(table => {
                    table.classList.toggle('hidden', table.id !== `${selectedContext}Table`);
                });

                if (selectedContext) {
                    const selectedHeader = tablesContainer.querySelector(`h2.toggle-header:not(.hidden)`);
                    const selectedTable = tablesContainer.querySelector(`table:not(.hidden)`);
                    if (selectedHeader && selectedTable) {
                        selectedHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        }
    } catch (error) {
        handleError(error, 'application initialization');
    }
});