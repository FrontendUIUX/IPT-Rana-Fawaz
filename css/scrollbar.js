function syncHeaderWidths() {
  const table = document.querySelector(".theme-entry .grid .grid-body table");
  const headerCells = document.querySelectorAll(".theme-entry .grid .grid-column-headers th");

  if (!table || !headerCells.length) return;

  const bodyRows = table.querySelectorAll("tr");
  if (!bodyRows.length) return;

  headerCells.forEach((th, i) => {
    let maxWidth = th.offsetWidth; // simpler and more reliable than getBoundingClientRect

    bodyRows.forEach((row) => {
      const cell = row.querySelectorAll("td")[i];
      if (cell) {
        maxWidth = Math.max(maxWidth, cell.offsetWidth);
      }
    });

    // Apply final width to header and body cells
    th.style.width = `${maxWidth}px`;
    bodyRows.forEach((row) => {
      const cell = row.querySelectorAll("td")[i];
      if (cell) cell.style.width = `${maxWidth}px`;
    });
  });
}

// Run initially
syncHeaderWidths();

// Optional: re-run on window resize
window.addEventListener("resize", () => {
  syncHeaderWidths();
});
