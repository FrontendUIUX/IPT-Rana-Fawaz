function syncHeaderWidths() {
  const headerCells = document.querySelectorAll(
    ".theme-entry .grid .grid-column-headers th"
  );
  const bodyRows = document.querySelectorAll(
    ".theme-entry .grid .grid-body tr"
  );

  if (!headerCells.length || !bodyRows.length) return;

  const firstRowCells = bodyRows[0].querySelectorAll("td");

  headerCells.forEach((th, i) => {
    if (firstRowCells[i]) {
      // Use getBoundingClientRect for accurate width
      const bodyCellWidth = firstRowCells[i].getBoundingClientRect().width;

      // Apply width to header and body cell
      th.style.width = `${bodyCellWidth}px`;
      firstRowCells[i].style.width = `${bodyCellWidth}px`;
    }
  });
}

// Run on load
window.addEventListener("load", syncHeaderWidths);

// Run on window resize
window.addEventListener("resize", syncHeaderWidths);

// Optional: run after dynamic data loads
setTimeout(syncHeaderWidths, 500);
