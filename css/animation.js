document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("boot");

  waitForElements(
    [".navbarBrand img", ".sidebar", ".form", ".theme-entry", ".slider", "[name='OBB_header']"],
    (logo, sidebar, form, theme, slider, header) => {
      const hdr = header;
      if (!hdr) return;

      // ===== Create placeholder that reserves the header height =====
      // Ensure header can be measured even if CSS initially hides it
      const prevInlineDisplay = hdr.style.display || "";
      hdr.style.display = hdr.style.display || "block";

      const measured = hdr.getBoundingClientRect();
      let headerHeight = measured.height;
      if (!headerHeight) {
        const cs = getComputedStyle(hdr);
        headerHeight = parseFloat(cs.height) || (parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)) || 60;
      }

      // Insert placeholder and move header inside it
      const placeholder = document.createElement("div");
      placeholder.className = "obb-header-placeholder";
      placeholder.style.height = headerHeight + "px";
      placeholder.style.position = "relative";
      placeholder.style.width = "100%";

      hdr.parentNode.insertBefore(placeholder, hdr);
      placeholder.appendChild(hdr);

      // Make header absolute inside the placeholder and hide it visually
      Object.assign(hdr.style, {
        position: "fixed",
        top: "0",
        left: "16vw",
        width: "calc(100vw - 16vw)",
        height: "6vw";
        boxSizing: "border-box",
        opacity: "0",
        visibility: "hidden",
        pointerEvents: "none",
        transform: "none",
        transition: "opacity 0.6s ease"
      });

      // Restore inline display if we changed it earlier (kept header in DOM)
      if (!prevInlineDisplay) hdr.style.display = "";

      // Keep the placeholder height in sync if header's size changes later
      if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => {
          const h = hdr.getBoundingClientRect().height;
          placeholder.style.height = (h || headerHeight) + "px";
        });
        ro.observe(hdr);
        // keep reference on placeholder so you can disconnect ro later if needed:
        placeholder.__resizeObserver = ro;
      }

      // ===== Your boot animation timeline =====
      setTimeout(() => { document.body.classList.add("s1"); }, 200);     // sidebar + logo
      setTimeout(() => { document.body.classList.add("s3"); }, 2600);    // children + slider

      // cleanup after full animation
      setTimeout(() => {
        document.body.classList.remove("boot", "s1", "s3");
        document.body.classList.add("boot-done");
        document.body.style.overflow = "";

        // small buffer, then reveal header (no layout shift, placeholder already reserved)
        setTimeout(() => {
          hdr.style.visibility = "visible";
          hdr.style.opacity = "1";
          hdr.style.pointerEvents = "auto";
          document.body.classList.add("header-fadein");
          // OPTIONAL: after the header has faded in, if you prefer the header to become "static"
          // (i.e. not absolute inside placeholder), you can convert it back — but this can
          // cause a tiny reflow in some layouts. Uncomment if you want that:
          //
          // setTimeout(() => {
          //   // remove absolute positioning and leave header in normal flow
          //   hdr.style.position = "";
          //   hdr.style.top = "";
          //   hdr.style.left = "";
          //   hdr.style.width = "";
          //   // replace placeholder with header (keeps same position)
          //   placeholder.parentNode.insertBefore(hdr, placeholder);
          //   placeholder.parentNode.removeChild(placeholder);
          //   if (placeholder.__resizeObserver) placeholder.__resizeObserver.disconnect();
          // }, 800);
        }, 300);
      }, 4000);
    }
  );
});

// Utility
function waitForElements(selectors, callback) {
  const elements = selectors.map(sel => document.querySelector(sel));
  if (elements.every(el => el)) {
    callback(...elements);
  } else {
    requestAnimationFrame(() => waitForElements(selectors, callback));
  }
}
