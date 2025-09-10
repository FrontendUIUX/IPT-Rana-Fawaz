function syncHeaderWidths() {
  const headerCells = document.querySelectorAll('.grid-column-headers th');
  const bodyRows = document.querySelectorAll('.grid-body tr');

  if (!headerCells.length || !bodyRows.length) return false;

  const colCount = headerCells.length;
  const maxWidths = Array(colCount).fill(0);

  bodyRows.forEach(row => {
    const cells = row.querySelectorAll('td');
    for (let i = 0; i < colCount; i++) {
      if (cells[i]) {
        const width = cells[i].getBoundingClientRect().width;
        if (width > maxWidths[i]) maxWidths[i] = width;
      }
    }
  });

  for (let i = 0; i < colCount; i++) {
    headerCells[i].style.width = `${maxWidths[i]}px`;
    bodyRows.forEach(row => {
      const cell = row.querySelectorAll('td')[i];
      if (cell) cell.style.width = `${maxWidths[i]}px`;
    });
  }

  return true;
}

// Keep trying until rows load
function waitForTable() {
  if (!syncHeaderWidths()) {
    setTimeout(waitForTable, 200); // retry every 200ms
  }
}

waitForTable();
window.addEventListener('resize', syncHeaderWidths);

// Scroll sync
const scrollWrapper = document.querySelector('.scroll-wrapper');
scrollWrapper?.addEventListener('scroll', () => {
  const headerWrapper = document.querySelector('.grid-column-headers-wrapper');
  if (headerWrapper) headerWrapper.scrollLeft = scrollWrapper.scrollLeft;
});
