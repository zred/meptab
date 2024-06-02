import { renderTable } from './renderTable.js';
import { initializeToggleTable } from './toggleTable.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeToggleTable();
  renderTable();
});
