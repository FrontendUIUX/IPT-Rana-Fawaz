document.addEventListener("DOMContentLoaded", function () {
    var passwordInput = document.querySelector('input[name="Confirm Password Text Box OBB_textbox"]');
    if (passwordInput) {

        passwordInput.type = 'password';


        var eyeIcon = document.createElement("i");
        eyeIcon.className = "fa-solid fa-eye";
        eyeIcon.style.cursor = "pointer";
        eyeIcon.style.marginLeft = "8px";


        passwordInput.insertAdjacentElement("afterend", eyeIcon);

  
        eyeIcon.addEventListener("click", function () {
            var isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            eyeIcon.classList.toggle("fa-eye");
            eyeIcon.classList.toggle("fa-eye-slash");
        });
    }
});
