document.addEventListener("DOMContentLoaded", function () {
    var passwordInput = document.querySelector('input[name="Confirm Password Text Box OBB_textbox"]');
    if (passwordInput) {

        passwordInput.type = 'password';
        var wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        wrapper.style.display = "inline-block"; 

        passwordInput.parentNode.insertBefore(wrapper, passwordInput);
   
        wrapper.appendChild(passwordInput);

    
        var eyeIcon = document.createElement("i");
        eyeIcon.className = "fa-solid fa-eye";
        eyeIcon.style.position = "absolute";
        eyeIcon.style.top = "50%";
        eyeIcon.style.right = "10px";
        eyeIcon.style.transform = "translateY(-50%)";
        eyeIcon.style.cursor = "pointer";
        eyeIcon.style.color = "#888";
        eyeIcon.style.fontSize = "1.1em";
        wrapper.appendChild(eyeIcon);
        passwordInput.style.paddingRight = "30px";
        eyeIcon.addEventListener("click", function () {
            var isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            eyeIcon.classList.toggle("fa-eye");
            eyeIcon.classList.toggle("fa-eye-slash");
        });
    }
});
