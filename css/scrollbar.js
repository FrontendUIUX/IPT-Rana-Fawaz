function syncHeaderWidths() {
  const headerCells = document.querySelectorAll(
    ".theme-entry .grid .grid-column-headers th"
  );
  const firstBodyRow = document.querySelector(
    ".theme-entry .grid .grid-body tr"
  );

  if (!headerCells.length || !firstBodyRow) return;

  const bodyCells = firstBodyRow.querySelectorAll("td");

  headerCells.forEach((th, i) => {
    if (bodyCells[i]) {
      const width = bodyCells[i].offsetWidth + "px";
      th.style.width = width;
      bodyCells[i].style.width = width;
    }
  });
}

// Run once on load
window.addEventListener("load", syncHeaderWidths);

// Re-run on resize (to handle window changes)
window.addEventListener("resize", syncHeaderWidths);

// Optionally re-run after data loads (if table content is dynamic)
setTimeout(syncHeaderWidths, 500);
