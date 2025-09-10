(function () {
  const MAX_SAMPLE_ROWS = 200;
  const DEBOUNCE_MS = 70;
  const HORIZONTAL_PADDING = 16; // total padding (8px left + 8px right)

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  const ceil = (v) => Math.ceil(v || 0);

  function setImportant(el, prop, value) {
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
      const headerCells = headerTable.querySelectorAll(".grid-column-header-cell, th, td");

      const colCount = headerCols.length || headerCells.length;
      if (!colCount) return false;

      const widths = new Array(colCount).fill(0);

      // Measure header widths only
      headerCells.forEach((cell, i) => {
        if (!cell) return;
        const inner = cell.querySelector("div, span, *") || cell;
        widths[i] = Math.max(widths[i], ceil(inner.scrollWidth + HORIZONTAL_PADDING));
      });

      // Fallback in case width is too small
      for (let i = 0; i < colCount; i++) {
        if (!widths[i] || widths[i] < 30) widths[i] = 30;
      }

      // Apply widths to <col> elements
      function applyWidths(cols) {
        if (!cols) return;
        cols.forEach((col, i) => {
          if (!col) return;
          setImportant(col, "width", widths[i] + "px");
          setImportant(col, "min-width", widths[i] + "px");
        });
      }

      applyWidths(headerCols);
      applyWidths(bodyCols);

      const total = widths.reduce((a, b) => a + b, 0);
      setImportant(headerTable, "width", total + "px");
      setImportant(bodyTable, "width", total + "px");

      // Style headers: flex centering and padding
      headerCells.forEach((cell) => {
        if (!cell) return;
        setImportant(cell, "display", "flex");
        setImportant(cell, "justify-content", "center");
        setImportant(cell, "align-items", "center");
        setImportant(cell, "white-space", "nowrap");
        setImportant(cell, "overflow", "visible");
        setImportant(cell, "text-overflow", "clip");
        setImportant(cell, "max-width", "none");
        setImportant(cell, "width", "auto");
        setImportant(cell, "box-sizing", "border-box");
        setImportant(cell, "padding-left", HORIZONTAL_PADDING / 2 + "px");
        setImportant(cell, "padding-right", HORIZONTAL_PADDING / 2 + "px");
        setImportant(cell, "vertical-align", "middle");
        setImportant(cell, "min-height", "20px");
      });

      // Style body rows
      const bodyRows = bodyTable.querySelectorAll("tbody tr");
      bodyRows.forEach((row) => {
        const tds = row.querySelectorAll("td");
        tds.forEach((td, i) => {
          const inner = td.querySelector("div, span, *") || td;
          setImportant(inner, "width", widths[i] + "px");
          setImportant(inner, "min-width", widths[i] + "px");
          setImportant(inner, "white-space", "nowrap");
          setImportant(inner, "text-align", "center");
          setImportant(inner, "padding-left", HORIZONTAL_PADDING / 2 + "px");
          setImportant(inner, "padding-right", HORIZONTAL_PADDING / 2 + "px");
        });
      });

      // Sync scroll position
      if (instance.scrollWrapper && instance.headerWrapper) {
        instance.headerWrapper.scrollLeft = instance.scrollWrapper.scrollLeft;
      }

      instance.synced = true;
      return true;
    }

    const debouncedSync = debounce(measureAndApply, DEBOUNCE_MS);

    function attachInstanceObserver() {
      if (instance.observer) try { instance.observer.disconnect(); } catch (e) {}
      const obsTarget = container || document.body;
      instance.observer = new MutationObserver(debouncedSync);
      instance.observer.observe(obsTarget, { childList: true, subtree: true });
      window.addEventListener("resize", debouncedSync, { passive: true });

      if (instance.scrollWrapper && instance.headerWrapper) {
        instance.scrollWrapper.addEventListener(
          "scroll",
          () => {
            if (instance.headerWrapper)
              instance.headerWrapper.scrollLeft = instance.scrollWrapper.scrollLeft;
          },
          { passive: true }
        );
      }
    }

    debouncedSync();
    attachInstanceObserver();
    instances.set(container, instance);
    return instance;
  }

  function scanForGrids() {
    const headerTables = Array.from(document.querySelectorAll(".grid-column-header-table"));
    headerTables.forEach((ht) => {
      const container =
        ht.closest(".grid-body") ||
        ht.closest(".grid") ||
        ht.closest(".grid-edit-templates") ||
        document.body;
      createInstance(container);
    });

    const bodyTables = Array.from(document.querySelectorAll(".grid-content-table"));
    bodyTables.forEach((bt) => {
      const container =
        bt.closest(".grid-body") ||
        bt.closest(".grid") ||
        bt.closest(".grid-edit-templates") ||
        document.body;
      createInstance(container);
    });
  }

  const globalObserver = new MutationObserver(debounce(scanForGrids, 150));
  globalObserver.observe(document.body, { childList: true, subtree: true });

  scanForGrids();

  window.__syncAllGridHeaders = function () {
    scanForGrids();
    instances.forEach((inst) => {
      try {
        if (inst) (inst.headerTable || inst.bodyTable) && createInstance(inst.container);
      } catch (e) {}
    });
  };

  console.info(
    "Grid header sync script initialized. Use window.__syncAllGridHeaders() to force-run."
  );
})();
