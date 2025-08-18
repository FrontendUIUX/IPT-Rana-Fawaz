(function () {
  try {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if ((saved && saved === 'dark') || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark-mode');
    }
  } catch(e) {}
})();

document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver((mutations, obs) => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      obs.disconnect();

      const menuSection = sidebar.querySelector(".sidebar-section.topic");
      if (!menuSection) return;

      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      wrapper.style.width = "100%";
      wrapper.style.display = "flex";
      wrapper.style.alignItems = "center";

      menuSection.parentNode.insertBefore(wrapper, menuSection);
      wrapper.appendChild(menuSection);

      const toggleButton = document.createElement("button");
      toggleButton.id = "toggleSidebarBtn";
      toggleButton.innerHTML = `
        <svg class="toggle-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M13.4697 5.46967C13.7626 5.17678 14.2374 5.17678 14.5303 5.46967L20.5303 11.4697C20.8232 11.7626 20.8232 12.2374 20.5303 12.5303L14.5303 18.5303C14.2374 18.8232 13.7626 18.8232 13.4697 18.5303C13.1768 18.2374 13.1768 17.7626 13.4697 17.4697L18.1893 12.75H4C3.58579 12.75 3.25 12.4142 3.25 12C3.25 11.5858 3.58579 11.25 4 11.25H18.1893L13.4697 6.53033C13.1768 6.23744 13.1768 5.76256 13.4697 5.46967Z"
            fill="#ffffff"></path>
        </svg>
      `;
      Object.assign(toggleButton.style, {
        border: "none",
        background: "transparent",
        cursor: "pointer",
        marginLeft: "auto",
        marginTop: "4rem",
        marginBottom: "2rem",
        display: "flex",
        alignItems: "center",
        transition: "transform 0.3s ease"
      });

      wrapper.appendChild(toggleButton);

  
      toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("hidden");
        document.body.classList.toggle("sidebar-close");

        const arrow = toggleButton.querySelector(".toggle-arrow");
        if (document.body.classList.contains("sidebar-close")) {
          arrow.style.transform = "rotate(0deg)"; 
        } else {
          arrow.style.transform = "rotate(180deg)";
        }
      });

      toggleButton.querySelector(".toggle-arrow").style.transform = "rotate(180deg)";
    }
  });
    

  observer.observe(document.body, { childList: true, subtree: true });
});

ddocument.addEventListener("DOMContentLoaded", function () {

  function addFloatingLabel(input) {
    if (!input) return;

 
    let wrapper = input.parentNode;
    if (!wrapper.classList.contains("floating-label-wrapper")) {
      wrapper = document.createElement("div");
      wrapper.classList.add("floating-label-wrapper");
      wrapper.style.position = "relative";
      wrapper.style.display = "inline-block";
      wrapper.style.width = "100%";
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
    }


    if (!input.id) input.id = 'input_' + Math.random().toString(36).substr(2, 9);

    const originalBorder = input.style.border || "1px solid #ccc";
    input.style.transition = "border-color 0.3s ease";


    function createLabel() {
      const existing = wrapper.querySelector("label.floating-label");
      if (existing) existing.remove();

      let wmText = "Enter value";
      try {
        const dataOptions = input.getAttribute("data-options");
        if (dataOptions) {
          const parsed = JSON.parse(dataOptions.replace(/&quot;/g, '"'));
          wmText = parsed.waterMarkText || wmText;
        }
      } catch (e) {}

      const label = document.createElement("label");
      label.classList.add("floating-label");
      label.setAttribute("for", input.id);
      label.innerText = wmText;

    
      Object.assign(label.style, {
        position: "absolute",
        left: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#aaa",
        pointerEvents: "none",
        fontFamily: "var(--regularFont)",
        fontSize: "1rem",
        fontWeight: "normal",
        transition: "top 0.5s ease, font-size 0.5s ease, color 0.5s ease, opacity 0.5s ease",
        backgroundColor: "white",
        padding: "0 0.2rem",
        opacity: "0"
      });

      wrapper.appendChild(label);

   
      requestAnimationFrame(() => {
        label.style.top = "0";        
        label.style.fontSize = "0.75rem"; 
        label.style.color = "var(--aqua)";
        label.style.opacity = "1";     
      });

      return label;
    }

    let typedDuringFocus = false;
    let label;

    function floatLabel() {
      if (!label) return;
      label.style.top = "0";
      label.style.fontSize = "0.75rem";
      label.style.color = "var(--aqua)";
      label.style.opacity = "1"; 
      input.style.borderColor = "var(--aqua)";
    }

    function resetLabel() {
      if (!typedDuringFocus) {

        label.style.top = "50%";
        label.style.fontSize = "1rem";
        label.style.color = "#aaa";
        label.style.opacity = "0";
        input.style.border = originalBorder;

        setTimeout(() => {
          if (!typedDuringFocus) label.remove();
          label = null;
        }, 500);
      }
    }

    input.addEventListener("focus", () => {
      typedDuringFocus = false;
      label = createLabel();
      floatLabel();
    });

    input.addEventListener("input", () => {
      typedDuringFocus = true;
      floatLabel();

    
      if (input.value.trim() === "") typedDuringFocus = false;
    });

    input.addEventListener("blur", resetLabel);
  }

  document.addEventListener("click", function(e) {
    const input = e.target.closest('html:not(.designer) [name*="OBB_textbox"]');
    if (input) addFloatingLabel(input);
  });

});
