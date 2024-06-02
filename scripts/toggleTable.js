export async function initializeToggleTable() {
  const headers = document.querySelectorAll('h2');

  for (const header of headers) {
    header.addEventListener('click', async function() {
      const table = this.nextElementSibling;

      if (table && table.tagName.toLowerCase() === 'table') {
        // Simulate an async operation, such as fetching data or waiting for an animation
        await new Promise(resolve => setTimeout(resolve, 0)); // Replace 0 with the desired delay in milliseconds

        table.style.display = (table.style.display === 'none' || table.style.display === '') ? 'table' : 'none';
      }
    });
  }
}
