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
    clearElement(searchResultsTableBody);
  }

  async function searchTables(query) {
    const tables = document.querySelectorAll('tbody');
    const uniqueResults = new Map();

    for (const table of tables) {
      const rows = table.querySelectorAll('tr');
      for (const row of rows) {
        if (rowMatchesQuery(row, query)) {
          addUniqueResult(uniqueResults, row);
        }
      }
    }

    return uniqueResults;
  }

  function rowMatchesQuery(row, query) {
    return Array.from(row.children).some(cell => cell.textContent.toLowerCase().includes(query));
  }

  function addUniqueResult(uniqueResults, row) {
    const mandarin = row.children[0].textContent;
    if (!uniqueResults.has(mandarin)) {
      uniqueResults.set(mandarin, row);
    }
  }

  async function displaySearchResults(uniqueResults) {
    const fragment = document.createDocumentFragment();
    uniqueResults.forEach((row) => {
      const newRow = row.cloneNode(true);
      fragment.appendChild(newRow);
    });
    searchResultsTableBody.appendChild(fragment);
  }
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
