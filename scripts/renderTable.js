import { fetchVocabulary } from './fetchVocabulary.js';

export async function renderTable() {
  try {
    const vocabulary = await fetchVocabulary();

    if (!vocabulary || !Array.isArray(vocabulary)) {
      throw new Error('Vocabulary data is empty or not in the expected format');
    }

    const container = document.getElementById('tablesContainer');
    container.innerHTML = ''; // Clear existing tables

    vocabulary.forEach(category => {
      // Add an h2 tag for the category name
      const caption = document.createElement('h2');
      caption.textContent = category.name;
      caption.classList.add('toggle-header'); // Add a class for toggling
      container.appendChild(caption);

      const table = document.createElement('table');
      table.innerHTML = `
        <thead>
          <tr>
            <th>Mandarin</th>
            <th>English</th>
            <th>Pinyin</th>
          </tr>
        </thead>
        <tbody id="${category.id}TableBody">
        </tbody>
      `;

      const tableBody = table.querySelector(`#${category.id}TableBody`);

      category.data.forEach(word => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${word.mandarin}</td><td>${word.english}</td><td>${word.pinyin}</td>`;
        tableBody.appendChild(row);
      });

      container.appendChild(table);
    });

  } catch (error) {
    console.error('Failed to render table:', error);
  }
}
