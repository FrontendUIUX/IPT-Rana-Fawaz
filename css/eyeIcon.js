document.addEventListener("DOMContentLoaded", function () {

  var faLink = document.createElement("link");
  faLink.rel = "stylesheet";
  faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
  document.head.appendChild(faLink);


  function addEyeToggle(inputName) {
    var passwordInput = document.querySelector(`input[name="${inputName}"]`);
    if (!passwordInput) return;

    passwordInput.style.boxSizing = 'border-box';
    passwordInput.type = 'password';

    var parent = passwordInput.parentNode;
    parent.style.position = 'relative';
    passwordInput.style.paddingRight = '40px';

    var eyeIcon = document.createElement("i");
    eyeIcon.className = "fa-solid fa-eye";
    Object.assign(eyeIcon.style, {
      position: "absolute",
      top: "60%",
      right: "25px",
      cursor: "pointer",
      fontSize: "1.1em",
      userSelect: "none"
    });

    parent.appendChild(eyeIcon);

    eyeIcon.addEventListener("click", function (event) {
      event.stopPropagation();
      passwordInput.type = 'text';
      eyeIcon.style.display = "none";
    });

    document.addEventListener("click", function (event) {
      if (!parent.contains(event.target)) {
        passwordInput.type = 'password';
        eyeIcon.style.display = "block";
      }
    });
  }


  addEyeToggle("Password Text Box OBB_textbox");
  addEyeToggle("Confirm Password Text Box OBB_textbox");
});

