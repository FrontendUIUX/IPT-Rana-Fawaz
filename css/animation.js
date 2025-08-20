function waitForElements(selectors, callback) {
  const elements = selectors.map(sel => document.querySelector(sel));
  if (elements.every(el => el)) {
    callback(...elements);
  } else {
    requestAnimationFrame(() => waitForElements(selectors, callback));
  }
}

// Usage:
waitForElements(
  [".navbarBrand img", ".sidebar", ".form", ".theme-entry", ".slider"],
  (logo, sidebar, pageBody, body, slider) => {

    // --- Initial states ---
    body.style.background = "#000000";
    body.style.overflow = "hidden";

    logo.style.opacity = "0"; // only opacity, no transforms

    sidebar.style.position = "relative";
    sidebar.style.transform = "translateX(-100%)";
    
    slider.style.opacity = "0";
    slider.style.transform = "translateY(50px)";

    pageBody.style.opacity = "0";
    pageBody.style.transform = "translateY(50px)";

    // --- Add shine overlay ---
    const shine = document.createElement("div");
    shine.style.position = "absolute";
    shine.style.top = "0";
    shine.style.left = "-100%";
    shine.style.width = "100%";
    shine.style.height = "100%";
    shine.style.background = "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)";
    shine.style.pointerEvents = "none";
    shine.style.mixBlendMode = "screen";
    shine.style.transform = "translate(0,0)";
    logo.parentElement.style.position = "relative";
    logo.parentElement.appendChild(shine);

    // --- Header pinning (robust for any nesting) ---
    const header = pageBody.querySelector('[name="OBB_header"]');
    const isDesktop = window.matchMedia('(min-width: 992px)').matches;
    let headerPlaceholder = null;
    if (header) {
      const rect = header.getBoundingClientRect();

      // placeholder keeps layout from collapsing while header is fixed
      headerPlaceholder = document.createElement('div');
      headerPlaceholder.style.height = rect.height + 'px';
      headerPlaceholder.style.width = '100%';
      header.parentNode.insertBefore(headerPlaceholder, header);

      // pin header
      header.style.position = 'fixed';
      header.style.top = '0';
      header.style.left = '0';
      header.style.zIndex = '999';
      // width per your CSS at >=992px
      header.style.width = isDesktop ? 'calc(100vw - 15rem)' : '100vw';
      header.style.height = '6rem';
      header.style.paddingTop = '1rem';
      header.style.paddingBottom = '1rem';
    }

    function animate({duration, draw, timing, callback}) {
      const start = performance.now();
      requestAnimationFrame(function frame(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;
        if (timeFraction < 0) timeFraction = 0;
        const progress = timing(timeFraction);
        draw(progress);
        if (timeFraction < 1) requestAnimationFrame(frame);
        else if (callback) callback();
      });
    }

    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const easeInOut = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;

    // --- 1️⃣ Shine diagonally first ---
    animate({
      duration: 600,
      timing: easeInOut,
      draw: progress => {
        const shineX = -100 + 200*progress;
        const shineY = -100 + 200*progress;
        shine.style.transform = `translate(${shineX}%, ${shineY}%)`;
      },
      callback: () => {
        shine.style.opacity = 0;
        body.style.background = "#ffffff";

// --- 2️⃣ Sidebar slides in + logo fades in ---
animate({
  duration: 800,
  timing: easeOut,
  draw: progress => {
    sidebar.style.transform = `translateX(${ -100 + 100*progress }%)`;
    logo.style.opacity = progress;
  },
  callback: () => {
    sidebar.style.transform = "";
    sidebar.style.position = "fixed";

    // Clean up shine and inline styles on logo
    if (shine && shine.parentElement) shine.remove();
    logo.removeAttribute("style");
    if (logo.parentElement) logo.parentElement.removeAttribute("style");

    // --- 3️⃣ Page children (excluding header) + slider slide up together ---
    const pageChildren = Array.from(pageBody.children).filter(
      el => el !== header
    );

    animate({
      duration: 800,
      timing: easeOut,
      draw: progress => {
        pageChildren.forEach(child => {
          child.style.opacity = progress;
          child.style.transform = `translateY(${50*(1-progress)}px)`;
        });
        slider.style.opacity = progress;
        slider.style.transform = `translateY(${50*(1-progress)}px)`;
      },
      callback: () => {
        // ✅ Reset inline CSS
        pageChildren.forEach(child => {
          child.style.transform = "";
          child.style.opacity = "";
        });
        slider.style.transform = "";
        slider.style.opacity = "";

        // unpin header and remove placeholder
        if (header) {
          header.removeAttribute('style'); // back to stylesheet
          if (headerPlaceholder && headerPlaceholder.parentNode) {
            headerPlaceholder.parentNode.removeChild(headerPlaceholder);
          }
        }

        body.style.overflowY = "auto";
        body.style.backgroundColor = "";
        body.style.backgroundImage = "";
        body.style.backgroundRepeat = "";
        body.style.backgroundSize = "";
        body.style.backgroundPosition = "";
      }
    });
  }
});
 }
    });
});
