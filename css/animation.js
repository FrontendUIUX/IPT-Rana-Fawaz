document.addEventListener("DOMContentLoaded", () => {
  // Start with boot class
  document.body.classList.add("boot");

  waitForElements(
    [".navbarBrand img", ".sidebar", ".form", ".theme-entry", ".slider", "[name='OBB_header']"],
    (logo, sidebar, form, theme, slider, header) => {

      // Step 1 → sidebar + logo
      setTimeout(() => {
        document.body.classList.add("s1");
      }, 200);

      // Step 2 → form + slider animation
      setTimeout(() => {
        document.body.classList.add("s3");
      }, 1400);

      // Step 3 → header fade-in after everything else
      setTimeout(() => {
        document.body.classList.add("s4"); // new step for header only
      }, 2600);

      // Step 4 → cleanup classes
      setTimeout(() => {
        document.body.classList.remove("boot", "s1", "s3");
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
