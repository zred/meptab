import { fetchVocabulary } from './fetchVocabulary.js';

export async function renderTable() {
  try {
    const vocabulary = await fetchVocabulary();

    if (!vocabulary || !Array.isArray(vocabulary)) {
      throw new Error('Vocabulary data is empty or not in the expected format');
    }

    const container = document.getElementById('tablesContainer');
    if (!container) {
      throw new Error('Tables container not found');
    }

    container.classList.remove('hidden'); // Ensure the container is not hidden
    container.innerHTML = ''; // Clear existing tables

    const contextSelector = document.getElementById('contextSelector');
    if (!contextSelector) {
      throw new Error('Context selector not found');
    }

    contextSelector.innerHTML = '<option value="">Select Context</option>'; // Clear existing options

    // Get unique contexts
    const contexts = [...new Set(vocabulary.flatMap(word => word.contexts))];

    contexts.forEach(context => {
      // Add context to selector
      const option = document.createElement('option');
      option.value = context;
      option.textContent = context;
      contextSelector.appendChild(option);

      const heading = document.createElement('h2');
      heading.textContent = context;
      heading.classList.add('toggle-header', 'hidden');
      container.appendChild(heading);

      const table = document.createElement('table');
      table.id = `${context}Table`;
      table.classList.add('hidden'); // Hide table by default
      table.innerHTML = `
        <thead>
          <tr>
            <th>Mandarin</th>
            <th>English</th>
            <th>Pinyin</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      `;

      const tableBody = table.querySelector('tbody');

      vocabulary.forEach(word => {
        if (word.contexts.includes(context)) {
          const row = document.createElement('tr');
          row.innerHTML = `<td>${word.mandarin}</td><td>${word.english}</td><td>${word.pinyin}</td>`;
          tableBody.appendChild(row);
        }
      });

      container.appendChild(table);
    });

  } catch (error) {
    console.error('Failed to render table:', error);
  }
}

