(function() {
  const DEBOUNCE_MS = 70;

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

  // ===== JS for syncing headers and body =====
  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  function setImportant(el, prop, value) {
    try { el.style.setProperty(prop, value, "important"); } 
    catch(e) { el.style[prop] = value; }
  }

  const instances = new Map();

  function createInstance(container) {
    if (!container || instances.has(container)) return;
    const instance = { container, headerTable:null, bodyTable:null, headerWrapper:null, scrollWrapper:null, observer:null };

    function findTables() {
      instance.headerTable = container.querySelector(".grid-column-header-table");
      instance.bodyTable = container.querySelector(".grid-content-table");
      instance.headerWrapper = container.querySelector(".grid-column-headers-wrapper");
      instance.scrollWrapper = container.querySelector(".scroll-wrapper");
      return !!instance.headerTable && !!instance.bodyTable;
    }

    function syncWidths() {
      requestAnimationFrame(() => {
        if (!findTables()) return false;
        const { headerTable, bodyTable } = instance;
        const headerCols = headerTable.querySelectorAll("col");
        const bodyCols = bodyTable.querySelectorAll("col");

        if (headerCols.length && bodyCols.length) {
          headerCols.forEach((hCol, i) => {
            const width = hCol.getBoundingClientRect().width;
            if (bodyCols[i]) {
              setImportant(bodyCols[i], "width", width + "px");
              setImportant(bodyCols[i], "min-width", width + "px");
            }
          });
        }

        setImportant(bodyTable, "width", headerTable.getBoundingClientRect().width + "px");

        if (instance.scrollWrapper && instance.headerWrapper) {
          instance.headerWrapper.scrollLeft = instance.scrollWrapper.scrollLeft;
        }
      });
    }

    const debouncedSync = debounce(syncWidths, DEBOUNCE_MS);

    function attachInstanceObserver() {
      if (instance.observer) try { instance.observer.disconnect(); } catch(e){}
      instance.observer = new MutationObserver(debouncedSync);
      instance.observer.observe(container || document.body, { childList:true, subtree:true });
      window.addEventListener("resize", debouncedSync, { passive:true });

      if (instance.scrollWrapper && instance.headerWrapper) {
        instance.scrollWrapper.addEventListener("scroll", () => {
          if(instance.headerWrapper) instance.headerWrapper.scrollLeft = instance.scrollWrapper.scrollLeft;
        }, { passive:true });
      }
    }

    debouncedSync();
    attachInstanceObserver();
    instances.set(container, instance);
    return instance;
  }

  function scanForGrids() {
    const headerTables = Array.from(document.querySelectorAll(".grid-column-header-table"));
    headerTables.forEach(ht => createInstance(ht.closest(".grid-body") || ht.closest(".grid") || ht.closest(".grid-edit-templates") || document.body));
    const bodyTables = Array.from(document.querySelectorAll(".grid-content-table"));
    bodyTables.forEach(bt => createInstance(bt.closest(".grid-body") || bt.closest(".grid") || bt.closest(".grid-edit-templates") || document.body));
  }

  const globalObserver = new MutationObserver(debounce(scanForGrids, 150));
  globalObserver.observe(document.body, { childList:true, subtree:true });

  scanForGrids();
  window.__syncAllGridHeaders = function() {
    scanForGrids();
    instances.forEach(inst => { try{ if(inst && (inst.headerTable || inst.bodyTable)) createInstance(inst.container); }catch(e){} });
  };

  console.info("✅ Grid header/body alignment with CSS injected and JS synced (Nintex/K2 ready).");
})();
