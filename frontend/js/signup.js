// dynamically updates the errors once submitted

const passwordInput = document.getElementById('password');

passwordInput.addEventListener('input', () => {
    

    const password = passwordInput.value;

    updateRule('length-rule', password.length >= 8);
    updateRule('lower-rule', /[a-z]/.test(password));
    updateRule('upper-rule', /[A-Z]/.test(password));
    updateRule('number-rule', /[0-9]/.test(password));
    updateRule('symbol-rule', /[^A-Za-z0-9]/.test(password));
});

function updateRule(id, valid) {
    const element = document.getElementById(id);

    if (valid) {
        element.textContent = '✅ ' + element.textContent.slice(2);
        element.classList.add('valid');
    } else {
        element.textContent = '❌ ' + element.textContent.slice(2);
        element.classList.remove('valid');
    }
}

const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', async (e) => {

    e.preventDefault();
    // clear old errors
    document.getElementById('email-error').textContent = '';
    document.getElementById('password-error').textContent = '';
    document.getElementById('confirm-error').textContent = '';
    document.getElementById('form-error').textContent = '';

    const username = signupForm.username.value;
    const email = signupForm.email.value;
    const password = signupForm.password.value;
    const confirmPassword = signupForm.confirmPassword.value;

    try {
        const response = await fetch('/api/user/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},      // ensures backend receives a json format to handle
            body: JSON.stringify({ username, email, password, confirmPassword })
        });

        const data = await response.json();
        console.log(data)

        if (!response.ok) {         // do backend message handling; used if-else since backend only returns one error at a time...
            const message = data.message.toLowerCase();
            if (message.includes('email')) {
                document.getElementById('email-error').textContent = data.message;
            } else if (message.includes('match')) {
                document.getElementById('confirm-error').textContent = data.message;
            } else if (message.includes('password')) {
                document.getElementById('password-error').textContent = data.message;
            } else {
                const formError = document.getElementById('form-error');

                formError.textContent = data.message;
                formError.classList.add('active');
            }

            return;
        }

        // success redirect
        window.location.href = '/home.html';

    } catch (err) {
        document.getElementById('form-error').textContent = 'Server error. Please try again.';
    }
});