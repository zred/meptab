import { clearElement, createElement, appendChildren } from './domUtils.js';
import { Logger, handleError } from './logger.js';

export async function addSearchFunctionality() {
  const searchInput = document.getElementById('searchInput');
  const searchResultsTableBody = document.getElementById('searchResultsTableBody');

  if (!searchInput || !searchResultsTableBody) {
    Logger.error('Search elements not found in the DOM');
    return;
  }

  searchInput.addEventListener('input', debounce(handleSearch, 300));

  async function handleSearch() {
    try {
      const query = searchInput.value.toLowerCase().trim();
      await clearSearchResults();

      if (query === '') return;

      Logger.log(`Performing search for query: ${query}`);
      const uniqueResults = await searchTables(query);
      await displaySearchResults(uniqueResults);
    } catch (error) {
      handleError(error, 'handling search');
    }
  }

  async function clearSearchResults() {
    await clearElement(searchResultsTableBody);
  }

  async function searchTables(query) {
    const tables = document.querySelectorAll('tbody');
    const uniqueResults = new Map();

    for (const table of tables) {
      const rows = table.querySelectorAll('tr');
      for (const row of rows) {
        if (await rowMatchesQuery(row, query)) {
          await addUniqueResult(uniqueResults, row);
        }
      }
    }

    return uniqueResults;
  }

  async function rowMatchesQuery(row, query) {
    for (const cell of row.children) {
      if (cell.textContent.toLowerCase().includes(query)) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 0)); // Yield to event loop
    }
    return false;
  }

  async function addUniqueResult(uniqueResults, row) {
    const mandarin = row.children[0].textContent;
    if (!uniqueResults.has(mandarin)) {
      uniqueResults.set(mandarin, row);
    }
  }

  async function displaySearchResults(uniqueResults) {
    const fragment = document.createDocumentFragment();
    for (const row of uniqueResults.values()) {
      const newRow = row.cloneNode(true);
      await appendChildren(fragment, newRow);
    }
    await appendChildren(searchResultsTableBody, fragment);
  }
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
