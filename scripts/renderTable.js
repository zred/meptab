import { fetchVocabulary } from './fetchVocabulary.js';

export async function renderTable() {
  const vocabulary = await fetchVocabulary();
  
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
    vocabulary[category].forEach(word => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${word.mandarin}</td><td>${word.english}</td><td>${word.pinyin}</td>`;
      tableBody.appendChild(row);
    });
  });
}
