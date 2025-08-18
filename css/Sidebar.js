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
    if (!input) return;


    if (!input.parentNode.classList.contains("floating-label-wrapper")) {
      const wrapper = document.createElement("div");
      wrapper.classList.add("floating-label-wrapper");
      wrapper.style.position = "relative";
      wrapper.style.display = "inline-block";
      wrapper.style.width = "100%";
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
    }
    const wrapper = input.parentNode;

    if (!input.id) {
      input.id = 'input_' + Math.random().toString(36).substr(2, 9);
    }


    input._userTyped = false;

 
    let label = wrapper.querySelector("label.floating-label");
    if (!label) {
      let wmText = "Enter value";
      try {
        const dataOptions = input.getAttribute("data-options");
        if (dataOptions) {
          const parsed = JSON.parse(dataOptions.replace(/&quot;/g, '"'));
          wmText = parsed.waterMarkText || wmText;
        }
      } catch (e) {}

      label = document.createElement("label");
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
        transition: "all 0.3s ease",
        backgroundColor: "white",
        padding: "0 0.2rem",
        opacity: "1"
      });
      wrapper.appendChild(label);
    }

    const originalBorder = input.style.border || "1px solid #ccc";
    input.style.transition = "border-color 0.3s ease";

    function floatLabel() {
      label.style.top = "0";          
      label.style.fontSize = "0.75rem"; 
      label.style.color = "var(--aqua)";
      input.style.borderColor = "var(--aqua)";
    }

    function resetLabel() {
      if (!input.value || input.value.trim() === "") {
        // Animate back inside
        label.style.top = "50%";
        label.style.fontSize = "1rem";
        label.style.color = "#aaa";
        input.style.border = originalBorder;

        setTimeout(() => {
          if (!input.value || input.value.trim() === "") {
            label.remove(); 
            input._userTyped = false;
          }
        }, 300);
      } else {
        floatLabel();
      }
    }

    input.addEventListener("focus", () => {
   
      if (!wrapper.querySelector("label.floating-label")) {
        addFloatingLabel(input);
        return;
      }
      floatLabel();
    });

    input.addEventListener("input", () => {
      input._userTyped = true;
      floatLabel();
    });

    input.addEventListener("blur", resetLabel);

   
    if (input.value && input.value.trim() !== "") {
      floatLabel();
      input._userTyped = true;
    }
  }

  document.addEventListener("click", function(e) {
    const input = e.target.closest('html:not(.designer) [name*="OBB_textbox"]');
    if (input) addFloatingLabel(input);
  });

});
