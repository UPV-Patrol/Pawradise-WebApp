// DESCRIPTION: loads navbar and footer, handles auth display and logout

fetch("./navbar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("navbar").innerHTML = data;
        checkAuth();
    });

fetch("./footer.html")
    .then(res => res.text())
    .then(data => {
        const footer = document.getElementById("footer");
        if (footer) footer.innerHTML = data;
    });

async function checkAuth() {
    try {
        const response = await fetch('/api/user/auth-status', {
            credentials: 'include'
        });

        // not logged= default navbar
        if (!response.ok) return;

        const data = await response.json();
        if (!data.isLoggedIn) return;

        const user = data.user;

        // hide login/signup since user is logged in
        const loginSection = document.getElementById('login-section');
        if (loginSection) loginSection.style.display = 'none';

        // show username 
        const greetingItem = document.getElementById('user-greeting');
        if (greetingItem) {
            greetingItem.textContent = `Hi ${user.username.toUpperCase()}!`;
            greetingItem.style.display = 'block';
        }

        // show logout btn
        const logoutItem = document.getElementById('user-logout');
        if (logoutItem) logoutItem.style.display = 'block';

        //show admin dashboard        
        if (user.role === 'admin') {
            document.querySelectorAll('.admin-nav').forEach(el => el.style.display = 'block');
            document.querySelectorAll('.public-nav').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.user-nav').forEach(el => el.style.display = 'none');
        } else {
            // show: user dashboard, hide admin nav
            document.querySelectorAll('.user-nav').forEach(el => el.style.display = 'block');
            document.querySelectorAll('.public-nav').forEach(el => el.style.display = 'block');
            document.querySelectorAll('.admin-nav').forEach(el => el.style.display = 'none');
        }

    } catch (err) {
        console.error('checkAuth error:', err);
    }
}

async function logout() {
    try {
        const res = await fetch('/api/user/logout', {
            method: 'POST',
            credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
            window.location.href = '/home.html';
        }
    } catch (err) {
        console.error('Logout error:', err);
        window.location.href = '/home.html';
    }
}