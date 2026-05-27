// DESCRIPTION: handles showing or hiding of password

function togglePassword() {
    // Select all inputs that are passwords
    const passwordFields = [
        document.getElementById("password"),
        document.getElementById("confirm-pass") //for signup only since login doesnt need re-entering of pw
    ];
    const toggleText = document.querySelector(".toggle-password");

    //show password i
    passwordFields.forEach(field => {
        if (field) { 
            field.type = field.type === "password" ? "text" : "password";
        }
    });

    //update base on input type
    toggleText.textContent = passwordFields[0].type === "password" ? "Show" : "Hide";
}