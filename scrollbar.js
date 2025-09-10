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

      const bodyRowsNodeList = bodyTable.querySelectorAll("tbody tr");
      const bodyRows = Array.from(bodyRowsNodeList).slice(0, MAX_SAMPLE_ROWS);

      if (bodyRows.length === 0) {
        instance.synced = false;
        return false;
      }

      const headerCols = headerTable.querySelectorAll("col");
      const bodyCols = bodyTable.querySelectorAll("col");
      const headerCellsRaw = headerTable.querySelectorAll(".grid-column-header-cell, td, th");
      const firstBodyRow = bodyTable.querySelector("tbody tr");
      const firstBodyCells = firstBodyRow ? firstBodyRow.querySelectorAll("td") : [];

      const colCount =
        headerCols.length ||
        bodyCols.length ||
        headerCellsRaw.length ||
        firstBodyCells.length;
      if (!colCount) return false;

      const maxWidths = new Array(colCount).fill(0);

      // measure headers
      headerTable.querySelectorAll("tr").forEach((tr) => {
        const tds = tr.querySelectorAll("td, th");
        for (let i = 0; i < colCount; i++) {
          const cell = tds[i];
          if (!cell) continue;
          const inner =
            cell.querySelector(
              ".grid-column-header-cell, .grid-column-header-cell-wrapper, .grid-column-header-cell-content, .grid-column-header-text"
            ) || cell;
          maxWidths[i] = Math.max(maxWidths[i], ceil(inner.getBoundingClientRect().width));
        }
      });

      // measure body
      bodyRows.forEach((row) => {
        const tds = row.querySelectorAll("td");
        for (let i = 0; i < colCount; i++) {
          const td = tds[i];
          if (!td) continue;
          const inner =
            td.querySelector(".grid-content-cell-wrapper, .runtime-list-item-wrap, span, div") || td;
          maxWidths[i] = Math.max(maxWidths[i], ceil(inner.getBoundingClientRect().width));
        }
      });

      // fallback widths
      for (let i = 0; i < colCount; i++) {
        if (!maxWidths[i] || maxWidths[i] < 10) {
          const hb = headerCellsRaw[i] || headerTable.querySelectorAll("td,th")[i];
          const bb = firstBodyCells[i];
          const fallback =
            (hb && hb.getBoundingClientRect().width) ||
            (bb && bb.getBoundingClientRect().width) ||
            30;
          maxWidths[i] = Math.max(30, ceil(fallback));
        }
      }

      // apply to <col>
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
      setImportant(headerTable, "width", total + "px");
      setImportant(bodyTable, "width", total + "px");

      // style headers (your CSS)
      const headerWrappers = headerTable.querySelectorAll(
        ".grid-column-header-cell, .grid-column-header-cell-wrapper, td, th"
      );
      for (let i = 0; i < Math.min(headerWrappers.length, colCount); i++) {
        const cell = headerWrappers[i];
        if (!cell) continue;
        const w = maxWidths[i];
        setImportant(cell, "box-sizing", "border-box");
        setImportant(cell, "width", w + "px");
        setImportant(cell, "min-width", w + "px");
        setImportant(cell, "max-width", w + "px");
        setImportant(cell, "white-space", "nowrap");
        setImportant(cell, "overflow", "visible");
        setImportant(cell, "text-overflow", "clip");
        setImportant(cell, "max-width", "none");
        setImportant(cell, "text-align", "center");
        setImportant(cell, "vertical-align", "middle");
      }

      // style body (your CSS)
      bodyRows.forEach((row) => {
        const tds = row.querySelectorAll("td");
        for (let i = 0; i < colCount; i++) {
          const td = tds[i];
          if (!td) continue;
          const inner =
            td.querySelector(".grid-content-cell-wrapper, .runtime-list-item-wrap, div, span") || td;
          const w = maxWidths[i];
          setImportant(inner, "box-sizing", "border-box");
          setImportant(inner, "width", w + "px");
          setImportant(inner, "min-width", w + "px");
          setImportant(inner, "max-width", w + "px");
          setImportant(inner, "white-space", "nowrap");
          setImportant(inner, "overflow", "visible");
          setImportant(inner, "text-overflow", "clip");
          setImportant(inner, "max-width", "none");
          setImportant(inner, "text-align", "center");
          setImportant(inner, "vertical-align", "middle");
        }
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

  console.info("Grid header sync script initialized. Use window.__syncAllGridHeaders() to force-run.");
})();
