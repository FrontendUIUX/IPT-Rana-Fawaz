(function () {
  const DEBOUNCE_MS = 70;
  const instances = new Map();

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  function setImportant(el, prop, value) {
    try {
      el.style.setProperty(prop, value, "important");
    } catch (e) {
      el.style[prop] = value;
    }
  }

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

      // Skip if already synced
      if (instance.headerTable.dataset.gridSynced === "true") return;

      const headerTable = instance.headerTable;
      const bodyTable = instance.bodyTable;
      const scrollWrapper = instance.scrollWrapper;
      const headerWrapper = instance.headerWrapper;

      const headerCells = headerTable.querySelectorAll("th");
      const colCount = headerCells.length;
      if (!colCount) return false;

      // Measure widths
      const widths = Array.from(headerCells).map(th => th.scrollWidth);

      // Apply <col> widths
      function applyCols(table) {
        let colgroup = table.querySelector("colgroup");
        if (!colgroup) {
          colgroup = document.createElement("colgroup");
          widths.forEach(() => colgroup.appendChild(document.createElement("col")));
          table.insertBefore(colgroup, table.firstChild);
        }
        colgroup.querySelectorAll("col").forEach((col, i) => {
          setImportant(col, "width", widths[i] + "px");
          setImportant(col, "min-width", widths[i] + "px");
        });
      }

      applyCols(headerTable);
      applyCols(bodyTable);

      const totalWidth = widths.reduce((a, b) => a + b, 0);
      setImportant(headerTable, "width", totalWidth + "px");
      setImportant(bodyTable, "width", totalWidth + "px");

      // Style cells
      function styleCells(cells, isHeader = false) {
        for (let i = 0; i < cells.length; i++) {
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
            setImportant(inner, "display", "table-cell");
            setImportant(inner, "vertical-align", "middle");
            setImportant(inner, "min-height", "20px");
            setImportant(inner, "width", "max-content");
          }
        }
      }

      styleCells(headerTable.querySelectorAll("th, td, .grid-column-header-cell"), true);
      bodyTable.querySelectorAll("tbody tr").forEach(row => {
        styleCells(row.querySelectorAll("td"));
      });

      // Sync scroll
      if (scrollWrapper && headerWrapper) {
        headerWrapper.scrollLeft = scrollWrapper.scrollLeft;
        scrollWrapper.addEventListener("scroll", () => {
          headerWrapper.scrollLeft = scrollWrapper.scrollLeft;
        }, { passive: true });
      }

      // Mark tables as synced
      headerTable.dataset.gridSynced = "true";
      bodyTable.dataset.gridSynced = "true";
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
    }

    debouncedSync();
    attachInstanceObserver();
    instances.set(container, instance);
    return instance;
  }

  function scanForGrids() {
    document.querySelectorAll(".grid-column-header-table").forEach(ht => {
      if (ht.dataset.gridSynced === "true") return;
      const container = ht.closest(".grid-body") || ht.closest(".grid") || ht.closest(".grid-edit-templates") || document.body;
      createInstance(container);
    });
    document.querySelectorAll(".grid-content-table").forEach(bt => {
      if (bt.dataset.gridSynced === "true") return;
      const container = bt.closest(".grid-body") || bt.closest(".grid") || bt.closest(".grid-edit-templates") || document.body;
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
        if (inst && (inst.headerTable || inst.bodyTable)) createInstance(inst.container);
      } catch (e) {}
    });
  };

  console.info(
    "✅ Grid header sync initialized. Already-synced tables are skipped. Use window.__syncAllGridHeaders() to force-run."
  );
})();
