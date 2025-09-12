(function () {
  const MAX_SAMPLE_ROWS = 200;
  const DEBOUNCE_MS = 70;

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
      const headerCellsRaw = headerTable.querySelectorAll(".grid-column-header-cell, td, th");

      const colCount =
        headerCols.length ||
        bodyCols.length ||
        headerCellsRaw.length;
      if (!colCount) return false;

      const maxWidths = new Array(colCount).fill(0);

      // Measure only headers to determine width
      headerTable.querySelectorAll("tr").forEach((tr) => {
        const tds = tr.querySelectorAll("td, th");
        for (let i = 0; i < colCount; i++) {
          const cell = tds[i];
          if (!cell) continue;
          const inner =
            cell.querySelector(
              ".grid-column-header-cell, .grid-column-header-cell-wrapper, .grid-column-header-cell-content, .grid-column-header-text"
            ) || cell;

          maxWidths[i] = Math.max(maxWidths[i], ceil(inner.scrollWidth));
        }
      });

      // Fallback widths
      for (let i = 0; i < colCount; i++) {
        if (!maxWidths[i] || maxWidths[i] < 10) {
          const hb = headerCellsRaw[i] || headerTable.querySelectorAll("td,th")[i];
          const fallback = hb ? ceil(hb.scrollWidth) : 30;
          maxWidths[i] = Math.max(30, fallback);
        }
      }

      // Apply to <col>
      function applyCols(cols) {
        if (!cols || !cols.length) return;
        for (let i = 0; i < colCount; i++) {
          if (!cols[i]) continue;
          setImportant(cols[i], "width", maxWidths[i] + "px");
          setImportant(cols[i], "min-width", maxWidths[i] + "px");
        }
      }
      applyCols(headerCols);
      applyCols(bodyCols);

      const total = maxWidths.reduce((a, b) => a + b, 0);
      setImportant(bodyTable, "width", total + "px");

      function styleCells(cells, isHeader = false) {
        for (let i = 0; i < Math.min(cells.length, colCount); i++) {
          const cell = cells[i];
          if (!cell) continue;
          const inner = cell.querySelector("div, span, *") || cell;

          setImportant(inner, "white-space", "nowrap");
          setImportant(inner, "overflow", "visible");
          setImportant(inner, "text-overflow", "clip");
          setImportant(inner, "max-width", "none");
          setImportant(inner, "width", "auto");
          setImportant(inner, "box-sizing", "border-box");

          if (isHeader) {
            setImportant(inner, "justify-content", "center");
            setImportant(inner, "vertical-align", "middle");
            setImportant(inner, "min-height", "20px");
            setImportant(inner, "width", "max-content");

            if (inner.classList.contains("grid-column-header-cell-content")) {
              setImportant(inner, "display", "block");
              setImportant(inner, "white-space", "nowrap");
              setImportant(inner, "overflow", "visible");
              setImportant(inner, "text-overflow", "clip");
            }
            const textEl = inner.querySelector(".grid-column-header-text");
            if (textEl) {
              setImportant(textEl, "white-space", "nowrap");
              setImportant(textEl, "overflow", "visible");
              setImportant(textEl, "text-overflow", "clip");
            }
          }
        }
      }

      styleCells(headerTable.querySelectorAll("th, td, .grid-column-header-cell"), true);

      const bodyRows = bodyTable.querySelectorAll("tbody tr");
      bodyRows.forEach((row) => {
        styleCells(row.querySelectorAll("td"));
      });

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
    "✅ Grid header sync script initialized. Ignores window resize. Use window.__syncAllGridHeaders() to force-run."
  );
})();

