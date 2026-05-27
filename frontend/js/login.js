const form = document.getElementById('login-form');
console.log(form);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("submit works");

    // clear old errors
    document.getElementById('email-error').textContent = '';
    document.getElementById('password-error').textContent = '';
    document.getElementById('form-error').textContent = '';

    // get new inputted values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},  // ensures backend receives a json format to handle
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {         // do backend message handling
            if (data.message.includes('email')) {
                document.getElementById('email-error').textContent = data.message;
                document.getElementById('email-error').classList.add('active');
            } else if (data.message.includes('password')) {
                document.getElementById('password-error').textContent = data.message;
                document.getElementById('password-error').classList.add('active');
            } else {
                document.getElementById('form-error').textContent = data.message;
                document.getElementById('form-error').classList.add('active');
            }
            return;
        }

        // success redirect
        window.location.href = '/home.html';

    } catch (err) {
        document.getElementById('form-error').textContent = 'Server error. Please try again.';
    }
});