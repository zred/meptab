// Function to generate a table row
function generateRow(cells) {
  return cells.map(cell => `<td>${cell}</td>`).join('');
}

// Function to generate a table
function generateTable(category) {
  let tableHTML = `<table id="${category.id}"><thead><tr>`;
  const headers = ["Mandarin", "English", "Pinyin"];
  
  headers.forEach(header => {
    tableHTML += `<th>${header}</th>`;
  });
  tableHTML += `</tr></thead><tbody>`;
  
  category.data.forEach(entry => {
    const row = [entry.mandarin, entry.english, entry.pinyin];
    tableHTML += `<tr>${generateRow(row)}</tr>`;
  });
  
  tableHTML += `</tbody></table>`;
  return tableHTML;
}

// Function to render all tables
function renderTables(data) {
  const container = document.getElementById('table-container');
  data.categories.forEach(category => {
    container.innerHTML += `<h2>${category.name}</h2>`;
    container.innerHTML += generateTable(category);
  });
}

// Fetch and render tables on page load
fetch('../data/new_vocabulary.json')
  .then(response => response.json())
  .then(data => renderTables(data))
  .catch(error => console.error('Error loading vocabulary data:', error));
