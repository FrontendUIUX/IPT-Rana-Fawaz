// --- Load GSAP dynamically ---
(function(){
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.14.1/gsap.min.js";
  script.onload = () => {
    // Wait for full page load
    if (document.readyState === "complete") {
      initAnimation();
    } else {
      window.addEventListener("load", initAnimation);
    }
  };
  document.head.appendChild(script);
})();

function initAnimation() {
  const logo = document.querySelector(".navbarBrand img");
  const sidebar = document.querySelector(".sidebar");
  const pageBody = document.querySelector(".body.sidebarVisible");
  const body = document.body;

  if(!logo || !sidebar || !pageBody) return;

  // --- Initial CSS states ---
  gsap.set(body, {backgroundColor: "#fff", overflow: "hidden"});
  gsap.set(logo, {opacity: 0, scale: 1.2, y: -20});
  gsap.set(sidebar, {x: "-100%", position: "relative"});
  gsap.set(pageBody, {y: 50, opacity: 0});

  // --- Add shine overlay ---
  const shine = document.createElement("div");
  shine.style.position = "absolute";
  shine.style.top = "0";
  shine.style.left = "0";
  shine.style.width = "100%";
  shine.style.height = "100%";
  shine.style.background = "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)";
  shine.style.pointerEvents = "none";
  shine.style.mixBlendMode = "screen";
  shine.style.transform = "translate(-100%, -100%)"; // start above and to the left
  logo.parentElement.style.position = "relative";
  logo.parentElement.appendChild(shine);

  // --- GSAP timeline ---
  const tl = gsap.timeline();

  // 1️⃣ Logo fades in with vertical motion
  tl.to(logo, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.5,
    ease: "power1.out"
  })

  // 2️⃣ Shine moves diagonally down then up like glass
  .to(shine, {
    x: "100%", 
    y: "100%",
    duration: 0.6,
    ease: "power2.inOut",
    yoyo: true,
    repeat: 1
  }, "-=0.3")

  // 3️⃣ Sidebar slides in (timed with logo shine)
  .to(sidebar, {x: 0, duration: 0.8, ease: "power2.out"}, "-=0.4")

  // 4️⃣ Logo moves into final sidebar position
  .to(logo, {
    x: sidebar.offsetLeft - logo.getBoundingClientRect().left + 10,
    y: 0,
    scale: 0.8,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.7")

  // 5️⃣ Body slides up
  .to(pageBody, {y: 0, opacity: 1, duration: 0.8, ease: "power2.out"}, "-=0.3")

  // 6️⃣ Remove shine overlay
  .set(shine, {opacity: 0})

  // 7️⃣ Optional: reset transforms
  .set([logo, sidebar, pageBody], {clearProps: "all"});
}
