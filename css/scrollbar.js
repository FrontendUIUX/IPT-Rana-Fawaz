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

      // Take the maximum width
      const finalWidth = Math.max(headerWidth, bodyWidth);

      // Apply width to both header and body cell
      th.style.width = `${finalWidth}px`;
      firstRowCells[i].style.width = `${finalWidth}px`;
    }
  });
}

// Observe changes in the table body
const tableBody = document.querySelector(".theme-entry .grid .grid-body");

if (tableBody) {
  const observer = new MutationObserver(() => {
    syncHeaderWidths();
  });

  observer.observe(tableBody, { childList: true, subtree: true });

  // Initial sync
  syncHeaderWidths();

  // Also run on window resize
  window.addEventListener("resize", syncHeaderWidths);
}
