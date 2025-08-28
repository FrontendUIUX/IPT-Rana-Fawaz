document.addEventListener("DOMContentLoaded", () => {
  // Start with boot class
  document.body.classList.add("boot");

  waitForElements(
    [".navbarBrand img", ".sidebar", ".form", ".theme-entry", ".slider", "[name='OBB_header']"],
    (logo, sidebar, form, theme, slider, header) => {
      
      // Step 0: header hidden at start
      if (header) header.style.opacity = 0;

      // Step 1 → sidebar + logo
      setTimeout(() => {
        document.body.classList.add("s1");
      }, 200);

//      // Step 2 → (skip header here)
//      setTimeout(() => {
//        document.body.classList.add("s2"); // optional marker if needed
//      }, 1400);

      // Step 3 → page children + slider
      setTimeout(() => {
        document.body.classList.add("s3");
      }, 2600);

      // Step 4 → cleanup after full animation
      setTimeout(() => {
        document.body.classList.remove("boot", "s1", "s3");
        document.body.classList.add("boot-done"); // marker for finished boot
        document.body.style.overflow = "";

        // ---- Trigger separate header animation AFTER boot ----
        setTimeout(() => {
          document.body.classList.add("header-fadein");
        }, 300); // delay after boot is done
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
