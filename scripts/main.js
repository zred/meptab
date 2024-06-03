import { renderTable } from './renderTable.js';
import { initializeToggleTable } from './toggleTable.js';
import { addSearchFunctionality } from './search.js';

document.addEventListener('DOMContentLoaded', () => {
  renderTable().then(() => {
    initializeToggleTable();
  });
  addSearchFunctionality();
});
