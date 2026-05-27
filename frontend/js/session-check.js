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
        //kick out if server crash
        bootUserOut();
    }
});