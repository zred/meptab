export function addSearchFunctionality() {
  const searchInput = document.getElementById('searchInput');
  const searchResultsTableBody = document.getElementById('searchResultsTableBody');

  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    searchResultsTableBody.innerHTML = ''; // Clear previous results

    const tables = document.querySelectorAll('tbody');

    tables.forEach(table => {
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        const cells = Array.from(row.children);
        const match = cells.some(cell => cell.textContent.toLowerCase().includes(query));
        if (match) {
          const newRow = row.cloneNode(true);
          searchResultsTableBody.appendChild(newRow);
        }
      });
    });
  });
}
