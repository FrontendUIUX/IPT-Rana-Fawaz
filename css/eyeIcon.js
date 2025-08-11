document.addEventListener("DOMContentLoaded", function () {
  var passwordInput = document.querySelector('input[name="Confirm Password Text Box OBB_textbox"]');
  if (!passwordInput) return;


  passwordInput.type = 'password';


  var eyeIcon = document.createElement("i");
  eyeIcon.className = "fa-solid fa-eye";
  eyeIcon.style.position = "absolute";
  eyeIcon.style.cursor = "pointer";
  eyeIcon.style.color = "#888";
  eyeIcon.style.fontSize = "1.1em";
  eyeIcon.style.top = "50%";
  eyeIcon.style.transform = "translateY(-50%)";


  passwordInput.parentNode.style.position = "relative"; 
  passwordInput.style.paddingRight = "30px";            
  passwordInput.parentNode.appendChild(eyeIcon);


  eyeIcon.style.right = "10px";

  eyeIcon.addEventListener("click", function () {
    var isPwd = passwordInput.type === 'password';
    passwordInput.type = isPwd ? 'text' : 'password';
    eyeIcon.classList.toggle("fa-eye");
    eyeIcon.classList.toggle("fa-eye-slash");
  });
});
