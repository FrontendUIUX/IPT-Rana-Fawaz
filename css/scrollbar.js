(function () {
  const DEBOUNCE_MS = 70;

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

    function styleAndSync() {
      if (!findTables()) return;

      const { headerTable, bodyTable } = instance;

      // Style header cells (but do NOT set display:block)
      headerTable.querySelectorAll("th, td, .grid-column-header-cell").forEach(cell => {
        setImportant(cell, "white-space", "nowrap");
        setImportant(cell, "overflow", "visible");
        setImportant(cell, "text-overflow", "clip");
        setImportant(cell, "width", "auto");
        setImportant(cell, "min-height", "20px");
        setImportant(cell, "vertical-align", "middle");
        setImportant(cell, "box-sizing", "border-box");
      });

      // Style body cells
      bodyTable.querySelectorAll("td, th").forEach(cell => {
        setImportant(cell, "white-space", "nowrap");
        setImportant(cell, "overflow", "visible");
        setImportant(cell, "text-overflow", "clip");
        setImportant(cell, "width", "auto");
        setImportant(cell, "box-sizing", "border-box");
        setImportant(cell, "vertical-align", "middle");
      });

      // Sync <col> widths
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

      // Sync total width
      const totalWidth = headerTable.getBoundingClientRect().width;
      setImportant(headerTable, "width", totalWidth + "px");
      setImportant(bodyTable, "width", totalWidth + "px");

      // Sync horizontal scroll
      if (instance.scrollWrapper && instance.headerWrapper) {
        instance.headerWrapper.scrollLeft = instance.scrollWrapper.scrollLeft;
      }
    }

    const debounced = debounce(styleAndSync, DEBOUNCE_MS);

    function attachObserver() {
      if (instance.observer) try { instance.observer.disconnect(); } catch(e) {}
      instance.observer = new MutationObserver(debounced);
      instance.observer.observe(container || document.body, { childList:true, subtree:true });
      window.addEventListener("resize", debounced, { passive:true });

      if (instance.scrollWrapper && instance.headerWrapper) {
        instance.scrollWrapper.addEventListener("scroll", () => {
          instance.headerWrapper.scrollLeft = instance.scrollWrapper.scrollLeft;
        }, { passive:true });
      }
    }

    debounced();
    attachObserver();
    instances.set(container, instance);
    return instance;
  }

  function scanForGrids() {
    document.querySelectorAll(".grid-column-header-table").forEach(ht => {
      const container = ht.closest(".grid-body") || ht.closest(".grid") || ht.closest(".grid-edit-templates") || document.body;
      createInstance(container);
    });
    document.querySelectorAll(".grid-content-table").forEach(bt => {
      const container = bt.closest(".grid-body") || bt.closest(".grid") || bt.closest(".grid-edit-templates") || document.body;
      createInstance(container);
    });
  }

  const globalObserver = new MutationObserver(debounce(scanForGrids, 150));
  globalObserver.observe(document.body, { childList:true, subtree:true });

  scanForGrids();

  window.__syncAllGridHeaders = function() {
    scanForGrids();
    instances.forEach(inst => {
      try { if(inst && (inst.headerTable || inst.bodyTable)) createInstance(inst.container); } catch(e) {}
    });
  };

  console.info("✅ Grid header/body styled and synced via JS without breaking column layout.");
})();
