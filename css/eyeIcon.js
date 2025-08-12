document.addEventListener("DOMContentLoaded", function () {
  var faLink = document.createElement("link");
  faLink.rel = "stylesheet";
  faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
  document.head.appendChild(faLink);

  function addEyeToggle(inputName) {
    var passwordInput = document.querySelector(`input[name="${inputName}"]`);
    if (!passwordInput) return;

    passwordInput.type = "password";
    passwordInput.style.boxSizing = "border-box";
    passwordInput.style.paddingRight = "40px";

    var parent = passwordInput.parentNode;

    var wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";
    wrapper.style.width = passwordInput.offsetWidth + "px"; 


    parent.insertBefore(wrapper, passwordInput);

    wrapper.appendChild(passwordInput);

    var eyeIcon = document.createElement("i");
    eyeIcon.className = "fa-solid fa-eye";
    Object.assign(eyeIcon.style, {
      position: "absolute",
      top: "25%",
      right: "10px",
      cursor: "pointer",
      fontSize: "1.1em",
      userSelect: "none",
    });

    wrapper.appendChild(eyeIcon);

    eyeIcon.addEventListener("click", function (event) {
      event.stopPropagation();
      passwordInput.type = "text";
      eyeIcon.style.display = "none";
      passwordInput.focus();
    });

    document.addEventListener("click", function (event) {
      if (!wrapper.contains(event.target)) {
        passwordInput.type = "password";
        eyeIcon.style.display = "block";
      }
    });
  }

  addEyeToggle("Password Text Box OBB_textbox");
  addEyeToggle("Confirm Password Text Box OBB_textbox");
});
