fetch("/navbar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("navbar").innerHTML = data;

        checkAuth();
    });

fetch("/footer.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;
    });

async function checkAuth() {
    try {
        const response = await fetch('/api/user/auth-status', {
            credentials: 'include'
        });

        if (!response.ok) return;

        const data = await response.json();

        const profileLink =
            data.user.role === 'user'
                ? 'user.html'
                : 'admin.html';

        if (data.isLoggedIn) {
            document.getElementById('login-section').innerHTML = `
            <span><a href="${profileLink}">Hi, ${data.user.username}</a></span>
            <a href="#" onclick="logout()">LOGOUT</a>`;
        }

    } catch (err) {
        console.error(err);
    }
}

async function logout() {
    const currentPage = window.location.pathname;

    await fetch('/api/user/logout', {
        method: 'POST',
        credentials: 'include'
    });

    if (currentPage.includes("admin")) {
        window.location.href = "home.html";
    } else if (currentPage.includes("user")) {
        window.location.href = "home.html";
    } else {
        window.location.reload();
    }
}