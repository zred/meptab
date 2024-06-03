import { fetchVocabulary } from './fetchVocabulary.js';

export async function renderTable() {
  try {
    const vocabulary = await fetchVocabulary();
    if (!vocabulary.categories) {
      throw new Error('Vocabulary data is empty or not in the expected format');
    }

    const container = document.getElementById('tablesContainer');
    container.innerHTML = ''; // Clear existing tables

    vocabulary.categories.forEach(category => {
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
      const caption = document.createElement('caption');
      caption.innerText = category.name;
      table.prepend(caption);

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
