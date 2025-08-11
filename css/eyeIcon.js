document.addEventListener("DOMContentLoaded", function () {
  var passwordInput = document.querySelector('input[name="Confirm Password Text Box OBB_textbox"]');
  if (!passwordInput) return;

  passwordInput.style.boxSizing = 'border-box';
  passwordInput.type = 'password';

  var parent = passwordInput.parentNode;
  parent.style.position = 'relative';

  passwordInput.style.paddingRight = '40px';

  var eyeIcon = document.createElement("i");
  eyeIcon.className = "fa-solid fa-eye";

  eyeIcon.style.position = "absolute";
  eyeIcon.style.top = "75%";    
  eyeIcon.style.right = "8px";
  eyeIcon.style.transform = "";  
  eyeIcon.style.cursor = "pointer";
  eyeIcon.style.color = "#888";
  eyeIcon.style.fontSize = "1.1em";
  eyeIcon.style.userSelect = "none";

  parent.appendChild(eyeIcon);

  eyeIcon.addEventListener("click", function () {
    var isPwd = passwordInput.type === 'password';
    passwordInput.type = isPwd ? 'text' : 'password';
    eyeIcon.classList.toggle("fa-eye");
    eyeIcon.classList.toggle("fa-eye-slash");
  });
});

