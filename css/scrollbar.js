function syncHeaderWidths() {
  const headerTable = document.querySelector('.grid-column-header-table');
  const bodyTable = document.querySelector('.grid-content-table');

  if (!headerTable || !bodyTable) return;

  const headerCols = headerTable.querySelectorAll('col');
  const bodyCols = bodyTable.querySelectorAll('col');

  if (headerCols.length !== bodyCols.length) return;

  for (let i = 0; i < headerCols.length; i++) {
    const width = bodyCols[i].getBoundingClientRect().width;
    headerCols[i].style.width = `${width}px`;
  }
}

// Call once and on window resize
syncHeaderWidths();
window.addEventListener('resize', syncHeaderWidths);

// Optional: keep header in sync while scrolling horizontally
const scrollWrapper = document.querySelector('.scroll-wrapper');
scrollWrapper.addEventListener('scroll', () => {
  const headerWrapper = document.querySelector('.grid-column-headers-wrapper');
  headerWrapper.scrollLeft = scrollWrapper.scrollLeft;
});
