function syncHeaderWidths() {
  const table = document.querySelector(".theme-entry .grid .grid-body table");
  const headerCells = document.querySelectorAll(
    ".theme-entry .grid .grid-column-headers th"
  );

  if (!table || !headerCells.length) return;

  const bodyRows = table.querySelectorAll("tr");
  if (!bodyRows.length) return;

  // Determine the max width for each column
  headerCells.forEach((th, i) => {
    let maxWidth = th.getBoundingClientRect().width;

    bodyRows.forEach((row) => {
      const cell = row.querySelectorAll("td")[i];
      if (cell) {
        const cellWidth = cell.getBoundingClientRect().width;
        if (cellWidth > maxWidth) maxWidth = cellWidth;
      }
    });

    // Apply width to header and all body cells in this column
    th.style.width = `${maxWidth}px`;
    bodyRows.forEach((row) => {
      const cell = row.querySelectorAll("td")[i];
      if (cell) cell.style.width = `${maxWidth}px`;
    });
  });
}

// Observe the entire table for dynamic changes
const tableContainer = document.querySelector(".theme-entry .grid");
if (tableContainer) {
  const observer = new MutationObserver(() => {
    syncHeaderWidths();
  });

  observer.observe(tableContainer, { childList: true, subtree: true });

  // Initial sync
  syncHeaderWidths();

  // Resize support
  window.addEventListener("resize", syncHeaderWidths);
}
