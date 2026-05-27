//DESCRIPTION: blocks those not logged in from viewing page
window.addEventListener('DOMContentLoaded', async () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');

    function bootUserOut() {
        if (loadingScreen) loadingScreen.style.display = 'none'; 
        if (mainContent) mainContent.style.display = 'none';
        window.location.href = '/login.html?error=login_required';
    }

    try {
        const response = await fetch('/api/user/auth-status');
        if (!response.ok) {
            bootUserOut();
            return;
        }

        const data = await response.json();

        if (!data.isLoggedIn) {
            bootUserOut();
        } else {
            const publicNavItems = document.querySelectorAll('.public-nav');
            const adminNavItems = document.querySelectorAll('.admin-nav');
            const greetingItem = document.getElementById('user-greeting');
            const logoutItem = document.getElementById('user-logout');
            const loginSection = document.getElementById('login-section');

            // hide the standard login button if user is logged in
            if (loginSection) {
                loginSection.style.display = 'none';
            }

            //update header greeting text dynamically and shows it
            if (greetingItem && data.user && data.user.username) {
                greetingItem.textContent = `HI, ${data.user.username.toUpperCase()}`;
                greetingItem.style.display = 'block'; // Makes greeting visible
            }

            // show logout to the authenticated user
            if (logoutItem) {
                logoutItem.style.display = 'block'; 
            }

            if (data.user && data.user.role === 'admin') {
                publicNavItems.forEach(item => item.style.display = 'none'); // hide our animals and sponsor pet
                adminNavItems.forEach(item => item.style.display = 'block'); // Shows dashboard
            } else {
                publicNavItems.forEach(item => item.style.display = 'block'); 
                adminNavItems.forEach(item => item.style.display = 'none');  
            }


            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    if (mainContent) mainContent.style.opacity = '1';
                }, 300);
            } else if (mainContent) {
                mainContent.style.opacity = '1';
            }
        }
    } catch (error) {
        console.error('encountered server crash:', error);
        //kick out if server crash sadaskd aaaaaa
        bootUserOut();
    }
});