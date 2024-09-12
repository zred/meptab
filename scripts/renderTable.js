import { fetchVocabulary } from './fetchVocabulary.js';

export async function renderTable(toggleFlashCards) {
  try {
    const vocabulary = await fetchVocabulary();

    if (!vocabulary || !Array.isArray(vocabulary)) {
      throw new Error('Vocabulary data is empty or not in the expected format');
    }

    const container = document.getElementById('tablesContainer');
    container.innerHTML = ''; // Clear existing tables

    // Add flashcard button at the top
    const flashcardButton = document.createElement('button');
    flashcardButton.textContent = 'Practice Flashcards';
    flashcardButton.classList.add('flashcard-button');
    flashcardButton.addEventListener('click', () => toggleFlashCards());
    container.appendChild(flashcardButton);

    // Get unique contexts
    const contexts = [...new Set(vocabulary.flatMap(word => word.contexts))];

    contexts.forEach(context => {
      const caption = document.createElement('h2');
      caption.textContent = context;
      caption.classList.add('toggle-header');
      container.appendChild(caption);

      const table = document.createElement('table');
      table.id = `${context}Table`;
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

