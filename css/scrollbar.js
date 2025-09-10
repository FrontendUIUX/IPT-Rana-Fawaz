(function () {
  const DEFAULTS = {
    MAX_SAMPLE_ROWS: 500,
    POLL_INTERVAL: 200,
    MAX_POLL: 80,
    DEBOUNCE_MS: 80,
    WAIT_IMAGES: true,
    WAIT_FONTS: true
  };

  /* ---------- utilities ---------- */
  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }
  const ceil = v => Math.ceil(v || 0);
  function setImportant(el, prop, value) {
    try { el.style.setProperty(prop, value, 'important'); }
    catch (e) { el.style[prop] = value; }
  }
  function safeQuery(sel, root = document) {
    try { return root.querySelector(sel); } catch (e) { return null; }
  }
  function safeQueryAll(sel, root = document) {
    try { return Array.from(root.querySelectorAll(sel)); } catch (e) { return []; }
  }

  /* Wait for any images inside container to load */
  function waitForImages(container, timeout = 3000) {
    if (!DEFAULTS.WAIT_IMAGES) return Promise.resolve();
    const imgs = safeQueryAll('img', container).filter(i => i.src);
    if (!imgs.length) return Promise.resolve();
    const promises = imgs.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(res => {
        img.addEventListener('load', res, { once: true });
        img.addEventListener('error', res, { once: true });
      });
    });
    return Promise.race([
      Promise.all(promises),
      new Promise(res => setTimeout(res, timeout))
    ]);
  }

  /* Wait for fonts if available */
  function waitForFonts(timeout = 2000) {
    if (!DEFAULTS.WAIT_FONTS) return Promise.resolve();
    if (document.fonts && document.fonts.ready) {
      return Promise.race([document.fonts.ready, new Promise(res => setTimeout(res, timeout))]);
    }
    return Promise.resolve();
  }

  /* ---------- Instance & measurement logic ---------- */
  const instances = new Map();

  function createOrGetInstance(container, debug = false) {
    if (!container) return null;
    if (instances.has(container)) return instances.get(container);

    const inst = {
      container,
      headerTable: null,
      bodyTable: null,
      headerWrapper: null,
      scrollWrapper: null,
      observer: null,
      pollCount: 0,
      debug
    };
    instances.set(container, inst);
    startInstance(inst);
    return inst;
  }

  async function startInstance(inst) {
    // Poll and wait until both header + body tables exist and body has rows
    inst.pollCount = 0;
    while (inst.pollCount++ < DEFAULTS.MAX_POLL) {
      findTables(inst);
      if (inst.headerTable && inst.bodyTable) {
        // wait for fonts/images that might change layout
        await waitForFonts();
        await waitForImages(inst.container);
        // Now try measure (if body has rows)
        const rows = inst.bodyTable.querySelectorAll('tbody tr');
        if (rows.length > 0) break;
        // if no rows yet, wait a bit
      }
      await new Promise(r => setTimeout(r, DEFAULTS.POLL_INTERVAL));
    }
    // Attach observers and a debounced sync
    attachInstanceObserver(inst);
    debouncedMeasure(inst)();
  }

  function findTables(inst) {
    const c = inst.container;
    inst.headerTable = safeQuery('.grid-column-header-table', c) || safeQuery('.grid-column-header-table', document);
    inst.bodyTable = safeQuery('.grid-content-table', c) || safeQuery('.grid-content-table', document);
    inst.headerWrapper = safeQuery('.grid-column-headers-wrapper', c) || safeQuery('.grid-column-headers-wrapper', document);
    inst.scrollWrapper = safeQuery('.scroll-wrapper', c) || safeQuery('.scroll-wrapper', document);
  }

  // debounce per-instance
  function debouncedMeasure(inst) {
    if (!inst._debounced) inst._debounced = debounce(() => measureAndApply(inst), DEFAULTS.DEBOUNCE_MS);
    return inst._debounced;
  }

  async function measureAndApply(inst, opts = { debug: false }) {
    opts.debug = !!opts.debug || !!inst.debug;
    findTables(inst);
    if (opts.debug) console.group('syncGrid: measureAndApply for container', inst.container);

    if (!inst.headerTable || !inst.bodyTable) {
      if (opts.debug) console.log('no header or body table found'); 
      if (opts.debug) console.groupEnd();
      return false;
    }

    // wait briefly for fonts/images again (in case they loaded while scanning)
    await waitForFonts();
    await waitForImages(inst.container);

    const headerCols = safeQueryAll('col', inst.headerTable);
    const bodyCols = safeQueryAll('col', inst.bodyTable);

    const headerCellsRaw = safeQueryAll('.grid-column-header-cell, td, th', inst.headerTable);
    const firstBodyRow = inst.bodyTable.querySelector('tbody tr');
    const firstBodyCells = firstBodyRow ? Array.from(firstBodyRow.querySelectorAll('td')) : [];

    const colCount = headerCols.length || bodyCols.length || headerCellsRaw.length || firstBodyCells.length;
    if (!colCount) {
      if (opts.debug) console.log('colCount == 0'); if (opts.debug) console.groupEnd();
      return false;
    }

    // Collect rows (limit)
    const allBodyRows = Array.from(inst.bodyTable.querySelectorAll('tbody tr'));
    const bodyRows = allBodyRows.slice(0, DEFAULTS.MAX_SAMPLE_ROWS); // sample for perf

    // If no body rows, bail (we don't want header-only measurement)
    if (!bodyRows.length) {
      if (opts.debug) console.log('no body rows yet, skipping apply'); if (opts.debug) console.groupEnd();
      return false;
    }

    // measure max widths
    const maxWidths = new Array(colCount).fill(0);

    // measure header inner widths
    Array.from(inst.headerTable.querySelectorAll('tr')).forEach(tr => {
      const cells = Array.from(tr.querySelectorAll('td,th'));
      for (let i = 0; i < colCount; i++) {
        const cell = cells[i];
        if (!cell) continue;
        const inner = cell.querySelector('.grid-column-header-cell, .grid-column-header-cell-wrapper, .grid-column-header-cell-content, .grid-column-header-text') || cell;
        const w = ceil(inner.getBoundingClientRect().width);
        maxWidths[i] = Math.max(maxWidths[i], w);
      }
    });

    // measure body visible rows
    bodyRows.forEach(row => {
      const tds = Array.from(row.querySelectorAll('td'));
      for (let i = 0; i < colCount; i++) {
        const td = tds[i];
        if (!td) continue;
        const inner = td.querySelector('.grid-content-cell-wrapper, .runtime-list-item-wrap, span, div') || td;
        const w = ceil(inner.getBoundingClientRect().width);
        maxWidths[i] = Math.max(maxWidths[i], w);
      }
    });

    // fallback minimal widths
    for (let i = 0; i < colCount; i++) {
      if (!maxWidths[i] || maxWidths[i] < 10) {
        const hb = headerCellsRaw[i] || inst.headerTable.querySelectorAll('td,th')[i];
        const bb = firstBodyCells[i];
        const fallback = (hb && hb.getBoundingClientRect().width) || (bb && bb.getBoundingClientRect().width) || 30;
        maxWidths[i] = Math.max(30, ceil(fallback));
      }
    }

    // DEBUG: show measured widths
    if (opts.debug) {
      console.log('colCount:', colCount);
      console.log('bodyRows measured:', bodyRows.length, '/', allBodyRows.length);
      console.log('maxWidths:', maxWidths);
    }

    // Apply to <col> elements first
    function applyCols(cols) {
      if (!cols || !cols.length) return;
      for (let i = 0; i < colCount; i++) {
        if (!cols[i]) continue;
        setImportant(cols[i], 'width', maxWidths[i] + 'px');
        setImportant(cols[i], 'min-width', maxWidths[i] + 'px');
      }
    }
    applyCols(headerCols);
    applyCols(bodyCols);

    // set table width to sum (keeps header/body same total)
    const totalW = maxWidths.reduce((a, b) => a + b, 0);
    setImportant(inst.headerTable, 'width', totalW + 'px');
    setImportant(inst.bodyTable, 'width', totalW + 'px');

    // Enforce no-wrap + center alignment and apply widths to header cell wrappers
    const headerWrappers = Array.from(inst.headerTable.querySelectorAll('.grid-column-header-cell, .grid-column-header-cell-wrapper, td, th'));
    for (let i = 0; i < Math.min(headerWrappers.length, colCount); i++) {
      const cell = headerWrappers[i];
      if (!cell) continue;
      const w = maxWidths[i];
      setImportant(cell, 'box-sizing', 'border-box');
      setImportant(cell, 'width', w + 'px');
      setImportant(cell, 'min-width', w + 'px');
      setImportant(cell, 'max-width', w + 'px');
      setImportant(cell, 'white-space', 'nowrap');
      setImportant(cell, 'text-align', 'center');
      setImportant(cell, 'vertical-align', 'middle');
    }

    // Apply to body row inner wrappers
    bodyRows.forEach(row => {
      const tds = Array.from(row.querySelectorAll('td'));
      for (let i = 0; i < colCount; i++) {
        const td = tds[i];
        if (!td) continue;
        const inner = td.querySelector('.grid-content-cell-wrapper, .runtime-list-item-wrap, div, span') || td;
        const w = maxWidths[i];
        setImportant(inner, 'box-sizing', 'border-box');
        setImportant(inner, 'width', w + 'px');
        setImportant(inner, 'min-width', w + 'px');
        setImportant(inner, 'max-width', w + 'px');
        setImportant(inner, 'white-space', 'nowrap');
        setImportant(inner, 'text-align', 'center');
        setImportant(inner, 'vertical-align', 'middle');
      }
    });

    // ensure scroll wrapper allows horizontal scroll
    if (inst.scrollWrapper) {
      setImportant(inst.scrollWrapper, 'overflow-x', 'auto');
      setImportant(inst.scrollWrapper, 'overflow-y', 'hidden');
    }

    // sync header scroll with body
    if (inst.scrollWrapper && inst.headerWrapper) inst.headerWrapper.scrollLeft = inst.scrollWrapper.scrollLeft;

    inst.synced = true;
    if (opts.debug) console.log('apply complete'); if (opts.debug) console.groupEnd();
    return true;
  } // end measureAndApply

  function attachInstanceObserver(inst) {
    // detach previous
    if (inst.observer) try { inst.observer.disconnect(); } catch (e) {}
    // observe container subtree to detect table/row replacements
    const target = inst.container || document.body;
    inst.observer = new MutationObserver(debounce(() => measureAndApply(inst, { debug: inst.debug }), DEFAULTS.DEBOUNCE_MS));
    inst.observer.observe(target, { childList: true, subtree: true, attributes: false });
    // resize hook
    window.addEventListener('resize', debounce(() => measureAndApply(inst, { debug: inst.debug }), 120), { passive: true });

    // scroll sync continuous
    if (inst.scrollWrapper && inst.headerWrapper) {
      inst.scrollWrapper.addEventListener('scroll', () => {
        if (inst.headerWrapper) inst.headerWrapper.scrollLeft = inst.scrollWrapper.scrollLeft;
      }, { passive: true });
    }
  }

  /* ---------- scanning / global observer ---------- */
  function scanForContainers(debug = false) {
    // prefer containers holding both header & body (closest common ancestor)
    // try .grid-edit-templates, .grid, .grid-body, .grid-body-content-wrapper
    const candidates = Array.from(document.querySelectorAll('.grid, .grid-edit-templates, .grid-body, .grid-body-content-wrapper, .grid-body'));
    // also ensure we register at least once if library uses other wrappers
    if (!candidates.length) candidates.push(document.body);

    candidates.forEach(c => {
      // if container contains either header or body table register it
      const hasHeader = !!c.querySelector('.grid-column-header-table');
      const hasBody = !!c.querySelector('.grid-content-table');
      if (hasHeader || hasBody) createOrGetInstance(c, debug);
    });

    // also create instances for any header or body table found directly (closest ancestor)
    Array.from(document.querySelectorAll('.grid-column-header-table')).forEach(ht => {
      const container = ht.closest('.grid-body') || ht.closest('.grid') || ht.closest('.grid-edit-templates') || document.body;
      createOrGetInstance(container, debug);
    });
    Array.from(document.querySelectorAll('.grid-content-table')).forEach(bt => {
      const container = bt.closest('.grid-body') || bt.closest('.grid') || bt.closest('.grid-edit-templates') || document.body;
      createOrGetInstance(container, debug);
    });
  }

  const globalObserver = new MutationObserver(debounce(() => scanForContainers(false), 200));
  globalObserver.observe(document.body, { childList: true, subtree: true });

  // initial scan (start)
  scanForContainers(false);

  // manual debug tool
  window.__syncGridHeaderWidths = async function (opts = {}) {
    const debug = !!opts.debug;
    const containers = Array.from(instances.keys());
    if (debug) console.group('Manual sync start, instances:', containers.length);
    // run measureAndApply for each instance (force start if missing)
    containers.forEach(instContainer => {
      const inst = instances.get(instContainer);
      if (inst) {
        inst.debug = debug;
        measureAndApply(inst, { debug });
      } else {
        createOrGetInstance(instContainer, debug);
      }
    });
    // also run a global scan+create if no instances exist
    if (!containers.length) {
      scanForContainers(debug);
      if (debug) console.log('Scanned page for grids.');
    }
    if (debug) console.groupEnd();
  };

  console.info('Grid header sync (robust) initialized. Use window.__syncGridHeaderWidths({debug:true}) to run with logs.');
})();
