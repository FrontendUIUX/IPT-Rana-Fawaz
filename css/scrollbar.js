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
      // Measure both header and body cell widths
      const headerWidth = th.getBoundingClientRect().width;
      const bodyWidth = firstRowCells[i].getBoundingClientRect().width;

      // Take the max width so content fits in one line
      const finalWidth = Math.max(headerWidth, bodyWidth);

      // Apply to both header and body cell
      th.style.width = `${finalWidth}px`;
      firstRowCells[i].style.width = `${finalWidth}px`;
    }
  });
}

// Run on load
window.addEventListener("load", syncHeaderWidths);

// Run on resize
window.addEventListener("resize", syncHeaderWidths);

// Optional: run after dynamic data loads
setTimeout(syncHeaderWidths, 500);
