(function () {
  const DEBOUNCE_MS = 80;
  const MIN_WIDTH = 40;   // never smaller than this
  const CELL_PADDING = 16; // total padding (left + right)

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  const ceil = (v) => Math.ceil(v || 0);

  function setImportant(el, prop, value) {
    if (!el) return;
    try {
      el.style.setProperty(prop, value, "important");
    } catch (e) {
      el.style[prop] = value;
    }
  }

  const instances = new Map();

  function createInstance(container) {
    if (!container || instances.has(container)) return;

    const instance = {
      container,
      headerTable: null,
      bodyTable: null,
      headerWrapper: null,
      scrollWrapper: null,
      observer: null,
      synced: false,
    };

    function findTables() {
      instance.headerTable = container.querySelector(".grid-column-header-table");
      instance.bodyTable = container.querySelector(".grid-content-table");
      instance.headerWrapper = container.querySelector(".grid-column-headers-wrapper");
      instance.scrollWrapper = container.querySelector(".scroll-wrapper");
      return !!instance.headerTable && !!instance.bodyTable;
    }

    function measureAndApply() {
      if (!findTables()) return false;

      const headerTable = instance.headerTable;
      const bodyTable = instance.bodyTable;

      const headerCols = headerTable.querySelectorAll("col");
      const bodyCols = bodyTable.querySelectorAll("col");
      const headerCells = headerTable.querySelectorAll("th, td, .grid-column-header-cell");
      const bodyRows = bodyTable.querySelectorAll("tbody tr");

      const colCount = headerCols.length || headerCells.length;
      if (!colCount) return false;

      const widths = new Array(colCount).fill(0);

      // --- Step 1: measure header cells ---
      headerCells.forEach((cell, i) => {
        if (!cell) return;
        const inner = cell.querySelector("*") || cell;
        const w = ceil(inner.scrollWidth + CELL_PADDING);
        widths[i] = Math.max(widths[i], w);
      });

      // --- Step 2: measure body cells too ---
      bodyRows.forEach((row) => {
        const tds = row.querySelectorAll("td");
        tds.forEach((td, i) => {
          const inner = td.querySelector("*") || td;
          const w = ceil(inner.scrollWidth + CELL_PADDING);
          widths[i] = Math.max(widths[i], w);
        });
      });

      // --- Step 3: apply min width fallback ---
      for (let i = 0; i < colCount; i++) {
        if (!widths[i] || widths[i] < MIN_WIDTH) widths[i] = MIN_WIDTH;
      }

      // --- Step 4: apply to col elements ---
      function applyCols(cols) {
        if (!cols) return;
        cols.forEach((col, i) => {
          if (!col) return;
          setImportant(col, "width", widths[i] + "px");
          setImportant(col, "min-width", widths[i] + "px");
        });
      }
      applyCols(headerCols);
      applyCols(bodyCols);

      const total = widths.reduce((a, b) => a + b, 0);
      setImportant(headerTable, "width", total + "px");
      setImportant(bodyTable, "width", total + "px");

      // --- Step 5: style all header + body cells consistently ---
      function styleCell(el) {
        if (!el) return;
        setImportant(el, "white-space", "nowrap");
        setImportant(el, "overflow", "visible");
        setImportant(el, "text-overflow", "clip");
        setImportant(el, "text-align", "center");   // horizontal centering
        setImportant(el, "vertical-align", "middle"); // vertical centering
        setImportant(el, "padding-left", CELL_PADDING / 2 + "px");
        setImportant(el, "padding-right", CELL_PADDING / 2 + "px");
        setImportant(el, "box-sizing", "border-box");
        // ✅ KEEP table-cell display (don’t override to flex!)
      }

      headerCells.forEach(styleCell);
      bodyRows.forEach((row) => row.querySelectorAll("td").forEach(styleCell));

      // --- Step 6: keep header + body scroll in sync ---
      if (instance.scrollWrapper && instance.headerWrapper) {
        instance.scrollWrapper.addEventListener(
          "scroll",
          () => (instance.headerWrapper.scrollLeft = instance.scrollWrapper.scrollLeft),
          { passive: true }
        );
      }

      instance.synced = true;
      return true;
    }

    const debouncedSync = debounce(measureAndApply, DEBOUNCE_MS);

    const obsTarget = container || document.body;
    instance.observer = new MutationObserver(debouncedSync);
    instance.observer.observe(obsTarget, { childList: true, subtree: true });
    window.addEventListener("resize", debouncedSync, { passive: true });

    debouncedSync();
    instances.set(container, instance);
    return instance;
  }

  function scanForGrids() {
    const tables = document.querySelectorAll(
      ".grid-column-header-table, .grid-content-table"
    );
    tables.forEach((t) => {
      const container =
        t.closest(".grid-body") || t.closest(".grid") || document.body;
      createInstance(container);
    });
  }

  const globalObserver = new MutationObserver(debounce(scanForGrids, 150));
  globalObserver.observe(document.body, { childList: true, subtree: true });

  scanForGrids();

  window.__syncAllGridHeaders = () => {
    scanForGrids();
    instances.forEach((inst) => {
      try {
        if (inst) inst.synced || createInstance(inst.container);
      } catch (e) {}
    });
  };

  console.info("Grid header sync script loaded.");
})();
