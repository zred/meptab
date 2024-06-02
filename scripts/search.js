export function addSearchFunctionality() {
  const searchInput = document.getElementById('searchInput');

  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const tables = document.querySelectorAll('tbody');

    tables.forEach(table => {
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        const cells = Array.from(row.children);
        const match = cells.some(cell => cell.textContent.toLowerCase().includes(query));
        row.style.display = match ? '' : 'none';
      });
    });
  });
}
