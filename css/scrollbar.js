(function () {
  const MAX_SAMPLE_ROWS = 200;
  const DEBOUNCE_MS = 70;
  const HORIZONTAL_PADDING = 16;

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

  function forceStyleRecursive(el, styles) {
    if (!el) return;
    for (const prop in styles) {
      setImportant(el, prop, styles[prop]);
    }
    Array.from(el.children).forEach((child) => forceStyleRecursive(child, styles));
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

      const colCount = headerCols.length || headerCells.length;
      if (!colCount) return false;

      const widths = new Array(colCount).fill(0);

      headerCells.forEach((cell, i) => {
        if (!cell) return;
        widths[i] = Math.max(widths[i], ceil(cell.scrollWidth + HORIZONTAL_PADDING));
      });

      for (let i = 0; i < colCount; i++) {
        if (!widths[i] || widths[i] < 30) widths[i] = 30;
      }

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

      // Force styles recursively for headers
      headerCells.forEach((cell) => {
        forceStyleRecursive(cell, {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          whiteSpace: "nowrap",
          overflow: "visible",
          textOverflow: "clip",
          maxWidth: "none",
          width: "auto",
          boxSizing: "border-box",
          paddingLeft: HORIZONTAL_PADDING / 2 + "px",
          paddingRight: HORIZONTAL_PADDING / 2 + "px",
          verticalAlign: "middle",
          minHeight: "20px",
        });
      });

      // Force styles recursively for body rows
      const bodyRows = bodyTable.querySelectorAll("tbody tr");
      bodyRows.forEach((row) => {
        const tds = row.querySelectorAll("td");
        tds.forEach((td, i) => {
          forceStyleRecursive(td, {
            width: widths[i] + "px",
            minWidth: widths[i] + "px",
            whiteSpace: "nowrap",
            textAlign: "center",
            paddingLeft: HORIZONTAL_PADDING / 2 + "px",
            paddingRight: HORIZONTAL_PADDING / 2 + "px",
          });
        });
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

  console.info(
    "Grid header sync script initialized (forced styles applied). Use window.__syncAllGridHeaders() to force-run."
  );
})();
