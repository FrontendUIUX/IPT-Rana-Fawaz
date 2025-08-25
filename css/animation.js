document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('boot');
});

function waitForElements(selectors, callback) {
  const elements = selectors.map(sel => document.querySelector(sel));
  if (elements.every(el => el)) {
    callback(...elements);
  } else {
    requestAnimationFrame(() => waitForElements(selectors, callback));
  }
}

waitForElements(
  [".navbarBrand img", ".sidebar", ".form", ".theme-entry", ".slider", "[name='OBB_header']"],
  () => {

    // --- Step 1: delay slightly before starting ---
    setTimeout(() => {
      document.body.classList.add('s1'); // logo + sidebar
    }, 200); 

    setTimeout(() => {
      document.body.classList.add('s2'); // header slides independently
    }, 1000); 

    setTimeout(() => {
      document.body.classList.add('s3'); // page children + slider
    }, 1700); 

    setTimeout(() => {
      // reset all classes after animation
      document.body.classList.remove('boot', 's1', 's2', 's3');
      document.body.style.overflow = '';
    }, 3000);
  }
);
