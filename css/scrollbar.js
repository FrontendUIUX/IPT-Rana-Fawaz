function syncHeaderWidths() {
  const table = document.querySelector(".theme-entry .grid .grid-body table");
  const headerCells = document.querySelectorAll(
    ".theme-entry .grid .grid-column-headers th"
  );

  if (!table || !headerCells.length) return;

  const bodyRows = table.querySelectorAll("tr");
  if (!bodyRows.length) return; // don't run until body has rows

  headerCells.forEach((th, i) => {
    let headerWidth = th.getBoundingClientRect().width;
    let bodyWidth = 0;

    bodyRows.forEach((row) => {
      const cell = row.querySelectorAll("td")[i];
      if (cell) {
        const w = cell.getBoundingClientRect().width;
        if (w > bodyWidth) bodyWidth = w;
      }
    });

    const finalWidth = Math.max(headerWidth, bodyWidth);
    th.style.width = `${finalWidth}px`;

    bodyRows.forEach((row) => {
      const cell = row.querySelectorAll("td")[i];
      if (cell) cell.style.width = `${finalWidth}px`;
    });
  });
}
