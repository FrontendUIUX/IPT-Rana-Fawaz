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
    };

    function findTables() {
      instance.headerTable = container.querySelector(".grid-column-header-table");
      instance.bodyTable = container.querySelector(".grid-content-table");
      instance.headerWrapper = container.querySelector(".grid-column-headers-wrapper");
      instance.scrollWrapper = container.querySelector(".scroll-wrapper");
      return !!instance.headerTable && !!instance.bodyTable;
    }

    function measureAndApply() {
      if (!findTables()) return;

      const { headerTable, bodyTable, scrollWrapper, headerWrapper } = instance;

      const headerCells = headerTable.querySelectorAll("th");
      if (!headerCells.length) return;

      const widths = Array.from(headerCells).map(th => th.scrollWidth);

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

      function styleCells(cells, isHeader = false) {
        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          if (!cell) continue;
          const inner = cell.querySelector("div, span, *") || cell;
          setImportant(inner, "white-space", "nowrap");
          setImportant(inner, "overflow", "visible");
          setImportant(inner, "text-overflow", "clip");
          setImportant(inner, "width", "auto");
          setImportant(inner, "box-sizing", "border-box");
          if (isHeader) {
            setImportant(inner, "display", "flex");
            setImportant(inner, "min-height", "20px");
          }
        }
      }

      styleCells(headerTable.querySelectorAll("th, td, .grid-column-header-cell"), true);
      bodyTable.querySelectorAll("tbody tr").forEach(row => {
        styleCells(row.querySelectorAll("td"));
      });

      if (scrollWrapper && headerWrapper) {
        headerWrapper.scrollLeft = scrollWrapper.scrollLeft;
        scrollWrapper.addEventListener("scroll", () => {
          headerWrapper.scrollLeft = scrollWrapper.scrollLeft;
        }, { passive: true });
      }
    }

    const debounced = debounce(measureAndApply, DEBOUNCE_MS);

    // Observe this container for dynamically added content
    instance.observer = new MutationObserver(debounced);
    instance.observer.observe(container, { childList: true, subtree: true });

    // Run once immediately
    debounced();

    instances.set(container, instance);
    return instance;
  }

  function scanForNewTables() {
    document.querySelectorAll(".grid-column-header-table").forEach(ht => {
      const container = ht.closest(".grid-body") || ht.closest(".grid") || ht.closest(".grid-edit-templates") || document.body;
      createInstance(container);
    });
    document.querySelectorAll(".grid-content-table").forEach(bt => {
      const container = bt.closest(".grid-body") || bt.closest(".grid") || bt.closest(".grid-edit-templates") || document.body;
      createInstance(container);
    });
  }

  // Observe the body for dynamically added tables
  const globalObserver = new MutationObserver(debounce(scanForNewTables, 150));
  globalObserver.observe(document.body, { childList: true, subtree: true });

  // Initial scan
  scanForNewTables();

  console.info("✅ Grid headers synced dynamically. Window resize not handled, MutationObserver active for new tables.");
})();
