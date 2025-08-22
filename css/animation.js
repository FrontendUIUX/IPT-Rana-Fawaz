 // Add the boot class ASAP so initial states apply
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

  // When everything we need exists, run the staged animation
  waitForElements(
    [".navbarBrand img", ".sidebar", ".form", ".theme-entry", ".slider", "[name='OBB_header']"],
    () => {
      // Stage 1: sidebar in + logo fade
      requestAnimationFrame(() => {
        document.body.classList.add('s1');
      });

      // Stage 2: header drops from above
      setTimeout(() => {
        document.body.classList.add('s2');
      }, 850); // slightly after stage 1 duration (.8s)

      // Stage 3: page content + theme switch slide up
      setTimeout(() => {
        document.body.classList.add('s3');
      }, 1700);

      // Cleanup: remove staging classes, restore body scrolling/background
      setTimeout(() => {
        document.body.classList.remove('boot', 's1', 's2', 's3');
        document.body.style.overflow = '';
        document.body.style.background = '';
      }, 2600);
    }
  );