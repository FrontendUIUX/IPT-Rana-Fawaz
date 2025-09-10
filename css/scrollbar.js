function syncHeaderWidths() {
  const headerCells = document.querySelectorAll('.grid-column-headers th');
  const bodyRows = document.querySelectorAll('.grid-body tr');

  if (!headerCells.length || !bodyRows.length) return;

  const colCount = headerCells.length;

  // Initialize array to track max width for each column
  const maxWidths = Array(colCount).fill(0);

  // Loop through each row and each cell to find the widest
  bodyRows.forEach(row => {
    const cells = row.querySelectorAll('td');
    for (let i = 0; i < colCount; i++) {
      if (cells[i]) {
        const width = cells[i].getBoundingClientRect().width;
        if (width > maxWidths[i]) maxWidths[i] = width;
      }
    }
  });

  // Apply the max widths to header cells
  for (let i = 0; i < colCount; i++) {
    headerCells[i].style.width = `${maxWidths[i]}px`;
  }
}

// Call once and on window resize
syncHeaderWidths();
window.addEventListener('resize', syncHeaderWidths);

// Keep header aligned on horizontal scroll
const scrollWrapper = document.querySelector('.scroll-wrapper');
scrollWrapper.addEventListener('scroll', () => {
  const headerWrapper = document.querySelector('.grid-column-headers-wrapper');
  headerWrapper.scrollLeft = scrollWrapper.scrollLeft;
});
