(function() {
  const DEBOUNCE_MS = 100;

  // ===== Inject CSS =====
  const css = `
  .theme-entry .scroll-wrapper { overflow-x: hidden !important; }
  .theme-entry div .grid-body { overflow-x: scroll !important; overflow-y: hidden; }
  .theme-entry div .grid-body table {
    table-layout: auto !important;
    width: max-content !important;  
    min-width: 100% !important;    
  }
  .theme-entry div .grid-body colgroup col { width: auto !important; align-items: center !important; }
  .theme-entry .grid .grid-column-headers div, 
  .theme-entry .grid .grid-column-headers span,
  .theme-entry div .grid-body table th,
  .theme-entry div .grid-body table td {
    white-space: nowrap !important;     
    overflow: visible !important;        
    text-overflow: clip !important;     
    max-width: none !important;          
    width: auto !important;              
  }
  .theme-entry .grid .grid-column-headers div, 
  .theme-entry .grid .grid-column-headers span,
  .theme-entry div .grid-body table th > *,
  .theme-entry div.grid-body table td > * {
    max-width: none !important;
    overflow: visible !important;
    text-overflow: clip !important;
    white-space: inherit !important;
  }
  .theme-entry .grid .grid-column-header-cell-content {
    display: block !important;              
    min-height: 20px;
    vertical-align: middle;
    width: auto !important;     
    white-space: nowrap;        
    overflow: visible;           
    text-overflow: unset;        
  }
  `;
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  // ===== Debounce helper =====
  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  // ===== Sync one K2 grid container =====
  function syncK2Grid(container) {
    const headerTable = container.querySelector(".grid-column-header-table");
    const bodyTable = container.querySelector(".grid-content-table");
    if (!headerTable || !bodyTable) return;

    const headerCells = Array.from(headerTable.querySelectorAll("th"));
    const bodyRows = Array.from(bodyTable.querySelectorAll("tr"));

    // Measure header widths
    const widths = headerCells.map(th => th.getBoundingClientRect().width);

    // Apply widths to body cells
    bodyRows.forEach(row => {
      row.querySelectorAll("td").forEach((td, i) => {
        if (widths[i] != null) {
          td.style.width = widths[i] + "px";
          td.style.minWidth = widths[i] + "px";
        }
      });
    });

    // Apply widths to header cells
    headerCells.forEach((th, i) => {
      th.style.width = widths[i] + "px";
      th.style.minWidth = widths[i] + "px";
    });

    // Sync scroll
    const scrollWrapper = container.querySelector(".scroll-wrapper");
    const headerWrapper = container.querySelector(".grid-column-headers-wrapper");
    if (scrollWrapper && headerWrapper) {
      headerWrapper.scrollLeft = scrollWrapper.scrollLeft;
      scrollWrapper.addEventListener("scroll", () => {
        headerWrapper.scrollLeft = scrollWrapper.scrollLeft;
      }, { passive: true });
    }
  }

  // ===== Create instance per container =====
  const instances = new Map();

  function createInstance(container) {
    if (!container || instances.has(container)) return;
    const instance = { container, observer: null };

    const debouncedSync = debounce(() => syncK2Grid(container), DEBOUNCE_MS);

    function attachObserver() {
      if (instance.observer) try { instance.observer.disconnect(); } catch(e){}
      instance.observer = new MutationObserver(debouncedSync);
      instance.observer.observe(container || document.body, { childList: true, subtree: true });

      window.addEventListener("resize", debouncedSync, { passive:true });
    }

    debouncedSync();
    attachObserver();
    instances.set(container, instance);
    return instance;
  }

  // ===== Scan all K2 grids =====
  function scanForGrids() {
    const headerTables = Array.from(document.querySelectorAll(".grid-column-header-table"));
    headerTables.forEach(ht => {
      const container = ht.closest(".grid-body") || ht.closest(".grid") || ht.closest(".grid-edit-templates") || document.body;
      createInstance(container);
    });
    const bodyTables = Array.from(document.querySelectorAll(".grid-content-table"));
    bodyTables.forEach(bt => {
      const container = bt.closest(".grid-body") || bt.closest(".grid") || bt.closest(".grid-edit-templates") || document.body;
      createInstance(container);
    });
  }

  const globalObserver = new MutationObserver(debounce(scanForGrids, 200));
  globalObserver.observe(document.body, { childList:true, subtree:true });

  scanForGrids();
  window.__syncAllGridHeaders = function() {
    scanForGrids();
    instances.forEach(inst => { try { if(inst) createInstance(inst.container); } catch(e){} });
  };

  console.info("✅ K2 Grid header/body alignment script initialized (CSS + JS integrated).");
})();
