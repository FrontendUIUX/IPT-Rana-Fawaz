document.addEventListener("DOMContentLoaded", () => {
  // Start with boot class
  document.body.classList.add("boot");

  // Wait for all important elements before running animation
  waitForElements(
    [".navbarBrand img", ".sidebar", ".form", ".theme-entry", ".slider", "[name='OBB_header']"],
    (logo, sidebar, form, theme, slider, header) => {

      // Step 0: header hidden at start
      if (header) header.style.opacity = 0;

      // Step 1 → sidebar + logo
      setTimeout(() => {
        document.body.classList.add("s1");
      }, 200);

      // Step 2 → header fades in
      setTimeout(() => {
        document.body.classList.add("s2");
      }, 1400);

      // Step 3 → page children + slider
      setTimeout(() => {
        document.body.classList.add("s3");
      }, 2600);

      // Step 4 → cleanup classes, persist header
      setTimeout(() => {
        document.body.classList.remove("boot", "s1", "s2", "s3");
        document.body.classList.add("header-visible"); // make header stay visible
        document.body.style.overflow = "";
      }, 4000);

    }
  );
});

// Utility: wait for all selectors to exist before callback
function waitForElements(selectors, callback) {
  const elements = selectors.map(sel => document.querySelector(sel));
  if (elements.every(el => el)) {
    callback(...elements);
  } else {
    requestAnimationFrame(() => waitForElements(selectors, callback));
  }
}
