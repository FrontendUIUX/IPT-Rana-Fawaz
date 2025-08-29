document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("boot");

  waitForElements(
    [".navbarBrand img", ".sidebar", ".form", ".theme-entry", ".slider", "[name='OBB_header']"],
    () => {
      // Step 1 → sidebar + logo
      setTimeout(() => {
        document.body.classList.add("s1");
      }, 200);

      // Step 2 → page children + slider
      setTimeout(() => {
        document.body.classList.add("s3");
      }, 2600);

      // Step 3 → cleanup after full animation
      setTimeout(() => {
        document.body.classList.remove("boot", "s1", "s3");
        document.body.classList.add("boot-done");
        document.body.style.overflow = "";

        // 🔑 Wait for boot-done transition to finish
        document.body.addEventListener("transitionend", function handler(e) {
          if (e.target === document.body) {
            document.body.classList.add("header-fadein");
            document.body.removeEventListener("transitionend", handler);
          }
        });
      }, 4000);
    }
  );
});


function waitForElements(selectors, callback) {
  const elements = selectors.map(sel => document.querySelector(sel));
  if (elements.every(el => el)) {
    callback(...elements);
  } else {
    requestAnimationFrame(() => waitForElements(selectors, callback));
  }
}
