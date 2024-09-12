import { clearElement, createElement, appendChildren } from './domUtils.js';

export async function addSearchFunctionality() {
  const searchInput = document.getElementById('searchInput');
  const searchResultsTableBody = document.getElementById('searchResultsTableBody');

  searchInput.addEventListener('input', debounce(handleSearch, 300));

  async function handleSearch() {
    const query = searchInput.value.toLowerCase();
    await clearSearchResults();

    if (query === '') return;

    const uniqueResults = await searchTables(query);
    await displaySearchResults(uniqueResults);
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
