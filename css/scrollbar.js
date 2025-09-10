(function () {
  // CONFIG
  const POLL_INTERVAL = 200;      // ms between initial polls until table exists
  const MAX_POLL = 80;            // stop polling after MAX_POLL attempts
  const DEBOUNCE_MS = 60;        // debounce for mutation/resizes

  // HELPERS
  const ceil = (v) => Math.ceil(v || 0);
  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  // CORE: measure widest cell per column and apply widths
  function measureAndApply() {
    const headerTable = document.querySelector('.grid-column-header-table');
    const bodyTable = document.querySelector('.grid-content-table');
    const headerWrapper = document.querySelector('.grid-column-headers-wrapper');
    const scrollWrapper = document.querySelector('.scroll-wrapper');

    if (!headerTable || !bodyTable) return false;

    // Determine number of columns
    const headerCols = headerTable.querySelectorAll('col');
    const bodyCols = bodyTable.querySelectorAll('col');
    // fallback: header cell elements
    const headerCellsRaw = headerTable.querySelectorAll('.grid-column-header-cell, td, th');
    const firstBodyRow = bodyTable.querySelector('tbody tr');
    const firstBodyCells = firstBodyRow ? firstBodyRow.querySelectorAll('td') : [];

    let colCount = headerCols.length || bodyCols.length || headerCellsRaw.length || firstBodyCells.length;
    if (!colCount) return false;

    const maxWidths = new Array(colCount).fill(0);

    // 1) measure header cells (header wrappers / text nodes)
    headerTable.querySelectorAll('tr').forEach((tr) => {
      const tds = tr.querySelectorAll('td, th');
      for (let i = 0; i < colCount; i++) {
        const cell = tds[i];
        if (!cell) continue;
        // try common header inner wrappers
        const inner = cell.querySelector('.grid-column-header-cell, .grid-column-header-cell-wrapper, .grid-column-header-cell-content, .grid-column-header-text') || cell;
        maxWidths[i] = Math.max(maxWidths[i], ceil(inner.getBoundingClientRect().width));
      }
    });

    // 2) measure ALL visible body rows (use wrapper when present)
    const bodyRows = bodyTable.querySelectorAll('tbody tr');
    if (bodyRows.length) {
      bodyRows.forEach(row => {
        const tds = row.querySelectorAll('td');
        for (let i = 0; i < colCount; i++) {
          const td = tds[i];
          if (!td) continue;
          const inner = td.querySelector('.grid-content-cell-wrapper, .runtime-list-item-wrap, span, div') || td;
          maxWidths[i] = Math.max(maxWidths[i], ceil(inner.getBoundingClientRect().width));
        }
      });
    }

    // If a column still has 0, measure the td/header cell bounding as fallback
    for (let i = 0; i < colCount; i++) {
      if (maxWidths[i] === 0) {
        const hb = headerCellsRaw[i] || headerTable.querySelectorAll('td,th')[i];
        const bb = firstBodyCells[i];
        const fallbackWidth = (hb && hb.getBoundingClientRect().width) || (bb && bb.getBoundingClientRect().width) || 30;
        maxWidths[i] = Math.max(30, ceil(fallbackWidth));
      }
    }

    // 3) Apply widths to <col> elements (header & body) if present
    function applyToCols(cols) {
      if (!cols || !cols.length) return;
      for (let i = 0; i < colCount; i++) {
        if (cols[i]) {
          cols[i].style.width = maxWidths[i] + 'px';
          cols[i].style.minWidth = maxWidths[i] + 'px';
        }
      }
    }
    applyToCols(headerCols);
    applyToCols(bodyCols);

    // 4) set table widths to sum of columns (prevents table reflow due to percent widths)
    const total = maxWidths.reduce((a, b) => a + b, 0);
    headerTable.style.width = total + 'px';
    bodyTable.style.width = total + 'px';

    // 5) apply widths directly to header cell wrappers and body wrappers (makes layout stable)
    // Header cell wrappers
    const headerCellWrappers = headerTable.querySelectorAll('.grid-column-header-cell, .grid-column-header-cell-wrapper, td, th');
    headerCellWrappers.forEach((cell, idx) => {
      const i = idx;
      const w = maxWidths[i] || cell.getBoundingClientRect().width;
      cell.style.boxSizing = 'border-box';
      cell.style.minWidth = w + 'px';
      cell.style.width = w + 'px';
      cell.style.maxWidth = w + 'px';
    });

    // Body inner wrappers
    bodyRows.forEach(row => {
      const tds = row.querySelectorAll('td');
      for (let i = 0; i < colCount; i++) {
        const td = tds[i];
        if (!td) continue;
        const inner = td.querySelector('.grid-content-cell-wrapper, .runtime-list-item-wrap, div, span') || td;
        const w = maxWidths[i];
        inner.style.boxSizing = 'border-box';
        inner.style.minWidth = w + 'px';
        inner.style.width = w + 'px';
        inner.style.maxWidth = w + 'px';
      }
    });

    // 6) Sync header scroll with body scroll
    if (scrollWrapper && headerWrapper) headerWrapper.scrollLeft = scrollWrapper.scrollLeft;

    return true;
  }

  // Start: poll until tables exist, then observe parent container for changes
  let pollCount = 0;
  let containerObserver = null;
  const debouncedMeasure = debounce(() => {
    measureAndApply();
  }, DEBOUNCE_MS);

  function attachObservers() {
    // Observe a stable parent: prefer .grid-body, then .grid-body-content-wrapper, then document.body
    const container =
      document.querySelector('.grid-body') ||
      document.querySelector('.grid-body-content-wrapper') ||
      document.querySelector('.grid-body-content') ||
      document.querySelector('.grid') ||
      document.body;

    // Clean existing observer
    if (containerObserver) {
      try { containerObserver.disconnect(); } catch (e) {}
    }

    // Observe for subtree changes (tables / rows inserted or replaced)
    containerObserver = new MutationObserver(debouncedMeasure);
    containerObserver.observe(container, { childList: true, subtree: true });
    // Also re-run on window resize
    window.addEventListener('resize', debouncedMeasure, { passive: true });

    // If there is a scroll wrapper, also sync header while scrolling (passive listener)
    const scrollWrapper = document.querySelector('.scroll-wrapper');
    const headerWrapper = document.querySelector('.grid-column-headers-wrapper');
    if (scrollWrapper && headerWrapper) {
      scrollWrapper.addEventListener('scroll', () => { headerWrapper.scrollLeft = scrollWrapper.scrollLeft; }, { passive: true });
    }
  }

  function startPolling() {
    // Try measure; if not ready, retry until MAX_POLL
    if (measureAndApply()) {
      attachObservers();
      return;
    }
    pollCount++;
    if (pollCount > MAX_POLL) {
      console.warn('syncHeaderWidths: failed to find tables after polling. Check selectors/classes.');
      // still attach observers to catch late DOM changes
      attachObservers();
      return;
    }
    setTimeout(startPolling, POLL_INTERVAL);
  }

  // Auto-start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startPolling);
  } else {
    startPolling();
  }

  // Expose a global (optional) for manual forcing/debugging
  window.__syncGridHeaderWidths = () => { measureAndApply(); };
})();
