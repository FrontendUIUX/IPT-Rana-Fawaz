document.addEventListener("DOMContentLoaded", () => {
  // Start with boot class
  document.body.classList.add("boot");

  // Force header hidden at start
  const header = document.querySelector("[name='OBB_header']");
  if (header) header.classList.add("hidden-at-start");

  // Animation sequence
  setTimeout(() => {
    document.body.classList.add("s1");
  }, 200);

  setTimeout(() => {
    document.body.classList.add("s2");
  }, 1400);

  setTimeout(() => {
    document.body.classList.add("s3");
  }, 2600);

  // End of animation → cleanup
  setTimeout(() => {
    document.body.classList.remove("boot", "s1", "s2");
    // keep s3 so header stays visible
  }, 4000);
});