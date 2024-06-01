document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('h2').forEach(function(header) {
        header.addEventListener('click', function() {
            var table = this.nextElementSibling;
            if (table && table.tagName.toLowerCase() === 'table') {
                table.style.display = (table.style.display === 'none' || table.style.display === '') ? 'table' : 'none';
            }
        });
    });
});
