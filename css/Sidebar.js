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

document.addEventListener("DOMContentLoaded", function () {

  function addFloatingLabel(input) {
    if (!input || input._floatingLabelApplied) return;
    input._floatingLabelApplied = true;

    var parent = input.parentNode;
    var wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";
    wrapper.style.width = "100%";

    parent.insertBefore(wrapper, input);
    wrapper.appendChild(input);

 
    var wmText = "Enter value";
    try {
      var dataOptions = input.getAttribute("data-options");
      if (dataOptions) {
        var parsed = JSON.parse(dataOptions.replace(/&quot;/g, '"'));
        wmText = parsed.waterMarkText || wmText;
      }
    } catch (e) {}

   
    const label = document.createElement("label");
    label.innerText = wmText;
    Object.assign(label.style, {
      position: "absolute",
      top: "50%",
      left: "10px",
      transform: "translateY(-50%)",
      color: "#aaa",
      pointerEvents: "none",
      fontFamily: "var(--regularFont)",
      fontSize: "1rem",
      fontWeight: "normal",
      transition: "all 0.3s ease",
      backgroundColor: "white",
      padding: "0 0.2rem",
      opacity: "0"
    });
    wrapper.appendChild(label);

    // Store original border
    const originalBorder = input.style.border || "1px solid #ccc";
    input.style.transition = "border-color 0.3s ease";

    function floatLabel() {
      label.style.top = "0";
      label.style.fontSize = "0.75rem";
      label.style.color = "var(--aqua)";
      label.style.transform = "translateY(-50%)";
      label.style.opacity = "1";
      input.style.borderColor = "var(--aqua)";
    }

    function resetLabel() {
      if (!input.value || input.value.trim() === "") {
       
        label.style.opacity = "0";
        input.style.border = originalBorder;
      } else {
    
        floatLabel();
      }
    }


    input.addEventListener("focus", floatLabel);
    input.addEventListener("input", floatLabel);
    input.addEventListener("blur", resetLabel);

  
    if (input.value && input.value.trim() !== "") {
      floatLabel();
    }
  }

  document.addEventListener("click", function(e) {
    const input = e.target.closest('html:not(.designer) [name*="OBB_textbox"]');
    if (input) addFloatingLabel(input);
  });

});

