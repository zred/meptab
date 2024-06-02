import { fetchVocabulary } from './fetchVocabulary.js';

export async function renderTable() {
  try {
    const vocabulary = await fetchVocabulary();
    
    if (!vocabulary) {
      throw new Error('Vocabulary data is empty');
    }

    const tableIds = [
      'positionsTableBody', 'colorsTableBody', 'polarDescriptorsTableBody',
      'actionsTableBody', 'texturesTableBody', 'landformsTableBody'
    ];
    
    const categories = [
      'positionsTable', 'colorsTable', 'polarDescriptorsTable',
      'actionsTable', 'texturesTable', 'landformsTable'
    ];
    
    categories.forEach((category, index) => {
      const tableBody = document.getElementById(tableIds[index]);
      if (tableBody) {
        tableBody.innerHTML = ''; // Clear existing rows
        vocabulary[category].forEach(word => {
          const row = document.createElement('tr');
          row.innerHTML = `<td>${word.mandarin}</td><td>${word.english}</td><td>${word.pinyin}</td>`;
          tableBody.appendChild(row);
        });
      }
    });
  } catch (error) {
    console.error('Failed to render table:', error);
  }
}
