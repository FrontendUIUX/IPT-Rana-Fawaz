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
    try { el.style.setProperty(prop, value, "important"); }
    catch(e) { el.style[prop] = value; }
  }

  function styleRecursive(el) {
    if (!el) return;
    setImportant(el, "white-space", "nowrap"); // no wrapping
    setImportant(el, "width", "auto");
    setImportant(el, "min-height", "20px");
    setImportant(el, "vertical-align", "middle");
    setImportant(el, "box-sizing", "border-box");

    el.childNodes.forEach(child => {
      if (child.nodeType === 1) styleRecursive(child);
    });
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

      // Style header and body cells recursively
      headerTable.querySelectorAll("th, td, .grid-column-header-cell").forEach(cell => styleRecursive(cell));
      bodyTable.querySelectorAll("td, th").forEach(cell => styleRecursive(cell));

      // Sync <col> widths
      let headerCols = headerTable.querySelectorAll("col");
      let bodyCols = bodyTable.querySelectorAll("col");

      const headerCells = headerTable.querySelectorAll("th");
      const widths = Array.from(headerCells).map(th => th.scrollWidth);

      if (!headerCols.length) {
        const colgroup = document.createElement("colgroup");
        widths.forEach(() => colgroup.appendChild(document.createElement("col")));
        headerTable.insertBefore(colgroup, headerTable.firstChild);
        headerCols = colgroup.querySelectorAll("col");
      }

      if (!bodyCols.length) {
        const colgroup = document.createElement("colgroup");
        widths.forEach(() => colgroup.appendChild(document.createElement("col")));
        bodyTable.insertBefore(colgroup, bodyTable.firstChild);
        bodyCols = colgroup.querySelectorAll("col");
      }

      headerCols.forEach((col, i) => {
        setImportant(col, "width", widths[i] + "px");
        setImportant(col, "min-width", widths[i] + "px");
      });

      bodyCols.forEach((col, i) => {
        setImportant(col, "width", widths[i] + "px");
        setImportant(col, "min-width", widths[i] + "px");
      });

      // Set total table widths
      const totalWidth = widths.reduce((a,b)=>a+b,0);
      setImportant(headerTable, "width", totalWidth + "px");
      setImportant(bodyTable, "width", totalWidth + "px");

      // Sync horizontal scroll
      if (instance.scrollWrapper && instance.headerWrapper) {
        instance.headerWrapper.scrollLeft = instance.scrollWrapper.scrollLeft;
      }
    }

    const debounced = debounce(styleAndSync, DEBOUNCE_MS);

    function attachObserver() {
      if (instance.observer) try { instance.observer.disconnect(); } catch(e){}
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

  console.info("✅ Grid header/body styled and synced with nowrap via JS only (scrollable headers).");
})();
