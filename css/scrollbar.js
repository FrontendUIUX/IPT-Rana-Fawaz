(function() {
  const DEBOUNCE_MS = 100;

  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  const instances = new Map();

  function createInstance(container) {
    if (!container || instances.has(container)) return;
    const instance = { container, observer: null };

    function syncGrid() {
      const headerTable = container.querySelector(".grid-column-header-table");
      const bodyTable = container.querySelector(".grid-content-table");
      const headerWrapper = container.querySelector(".grid-column-headers-wrapper");
      const scrollWrapper = container.querySelector(".scroll-wrapper");
      if (!headerTable || !bodyTable) return;

      const headerCells = Array.from(headerTable.querySelectorAll("th"));
      if (!headerCells.length) return;

      // Measure headers widths
      const widths = headerCells.map(th => th.getBoundingClientRect().width);

      // Apply widths to each body row
      const bodyRows = Array.from(bodyTable.querySelectorAll("tr"));
      bodyRows.forEach(row => {
        const cells = Array.from(row.querySelectorAll("td"));
        cells.forEach((td, i) => {
          if (widths[i] != null) {
            td.style.width = widths[i] + "px";
            td.style.minWidth = widths[i] + "px";
          }
        });
      });

      // Apply widths to header cells to prevent misalignment
      headerCells.forEach((th, i) => {
        th.style.width = widths[i] + "px";
        th.style.minWidth = widths[i] + "px";
      });

      // Sync scroll
      if (scrollWrapper && headerWrapper) {
        headerWrapper.scrollLeft = scrollWrapper.scrollLeft;
      }
    }

    const debouncedSync = debounce(syncGrid, DEBOUNCE_MS);

    function attachObserver() {
      const observer = new MutationObserver(debouncedSync);
      observer.observe(container || document.body, { childList: true, subtree: true });
      instance.observer = observer;

      window.addEventListener("resize", debouncedSync, { passive: true });

      const scrollWrapper = container.querySelector(".scroll-wrapper");
      const headerWrapper = container.querySelector(".grid-column-headers-wrapper");
      if (scrollWrapper && headerWrapper) {
        scrollWrapper.addEventListener("scroll", () => {
          headerWrapper.scrollLeft = scrollWrapper.scrollLeft;
        }, { passive: true });
      }
    }

    debouncedSync();
    attachObserver();
    instances.set(container, instance);
    return instance;
  }

  function scanForGrids() {
    const headerTables = Array.from(document.querySelectorAll(".grid-column-header-table"));
    headerTables.forEach(ht => {
      const container = ht.closest(".grid-body") || ht.closest(".grid") || ht.closest(".grid-edit-templates") || document.body;
      createInstance(container);
    });
  }

  const globalObserver = new MutationObserver(debounce(scanForGrids, 200));
  globalObserver.observe(document.body, { childList: true, subtree: true });

  scanForGrids();

  window.__syncAllGridHeaders = function() {
    scanForGrids();
    instances.forEach(inst => { try { if(inst) createInstance(inst.container); } catch(e){} });
  };

  console.info("✅ K2 Grid header/body alignment initialized (no CSS injected, dynamic sync).");
})();
