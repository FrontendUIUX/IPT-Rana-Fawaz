window.addEventListener("load", () => {
  const logo = document.querySelector(".navbarBrand img");
  const sidebar = document.querySelector(".sidebar");
  const pageBody = document.querySelector(".body.sidebarVisible");
  const body = document.body;

  if (!logo || !sidebar || !pageBody) return;

  // --- Initial states ---
  body.style.background = "#fff";
  body.style.overflow = "hidden";

  logo.style.position = "relative";
  logo.style.opacity = "0";
  logo.style.transform = "translateY(-20px) scale(1.2)";

  sidebar.style.position = "relative";
  sidebar.style.transform = "translateX(-100%)";

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

  // --- Animation helpers ---
  function animate({duration, draw, timing, callback}) {
    const start = performance.now();
    requestAnimationFrame(function animateFrame(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;

      const progress = timing(timeFraction);
      draw(progress);

      if (timeFraction < 1) {
        requestAnimationFrame(animateFrame);
      } else if (callback) {
        callback();
      }
    });
  }

  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeInOut = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;

  // --- 1️⃣ Logo fade-in + vertical motion ---
  animate({
    duration: 500,
    timing: easeOut,
    draw: progress => {
      logo.style.opacity = progress;
      logo.style.transform = `translateY(${ -20 + 20*progress }px) scale(${ 1.2 - 0.2*progress })`;
    },
    callback: () => {

      // --- 2️⃣ Shine diagonally across logo ---
      animate({
        duration: 600,
        timing: easeInOut,
        draw: progress => {
          const shineX = -100 + 200*progress; // -100% to +100%
          const shineY = -100 + 200*progress; // -100% to +100%
          shine.style.transform = `translate(${shineX}%, ${shineY}%)`;
        },
        callback: () => {
          // Remove shine
          shine.style.opacity = 0;

          // --- 3️⃣ Sidebar slides in ---
          animate({
            duration: 800,
            timing: easeOut,
            draw: progress => {
              sidebar.style.transform = `translateX(${ -100 + 100*progress }%)`;
            },
            callback: () => {

              // --- 4️⃣ Logo moves into sidebar ---
              const sidebarLeft = sidebar.getBoundingClientRect().left;
              const logoRect = logo.getBoundingClientRect();
              const deltaX = sidebarLeft - logoRect.left + 10;
              animate({
                duration: 800,
                timing: easeOut,
                draw: progress => {
                  logo.style.transform = `translateX(${deltaX*progress}px) scale(${0.8 + 0.2*(1-progress)})`;
                },
                callback: () => {

                  // --- 5️⃣ Body slides up ---
                  animate({
                    duration: 800,
                    timing: easeOut,
                    draw: progress => {
                      pageBody.style.opacity = progress;
                      pageBody.style.transform = `translateY(${50*(1-progress)}px)`;
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });

});
