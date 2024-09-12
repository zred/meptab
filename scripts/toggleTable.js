export function initializeToggleTable() {
    const headers = document.querySelectorAll('h2.toggle-header');

    for (const header of headers) {
        header.addEventListener('click', function() {
            const table = this.nextElementSibling;
            if (table && table.tagName.toLowerCase() === 'table') {
                const isVisible = table.style.display !== 'none';
                table.style.display = isVisible ? 'none' : 'table';
            }
        });
    }
}
