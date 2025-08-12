document.addEventListener("DOMContentLoaded", function () {

  var faLink = document.createElement("link");
  faLink.rel = "stylesheet";
  faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
  document.head.appendChild(faLink);

 
  var passwordInput = document.querySelector('input[name="Confirm Password Text Box OBB_textbox"]');
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
    right: "30px",
    cursor: "pointer",
    color: "#888",
    fontSize: "1.1em",
    userSelect: "none",
    transform: "translateY(-50%)"
  });

  parent.appendChild(eyeIcon);

  eyeIcon.addEventListener("click", function (event) {
    event.stopPropagation();
    var isPwd = passwordInput.type === 'password';
    passwordInput.type = isPwd ? 'text' : 'password';

    eyeIcon.classList.remove(isPwd ? "fa-eye" : "fa-eye-slash");
    eyeIcon.classList.add(isPwd ? "fa-eye-slash" : "fa-eye");
  });

  document.addEventListener("click", function (event) {
    if (!parent.contains(event.target)) {
      passwordInput.type = 'password';
      eyeIcon.classList.remove("fa-eye-slash");
      eyeIcon.classList.add("fa-eye");
    }
  });
});
