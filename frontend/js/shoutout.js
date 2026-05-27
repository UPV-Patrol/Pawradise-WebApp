window.addEventListener('DOMContentLoaded', async () => {
    const sponsorList = document.getElementById('sponsor-list');

    try {
        const response = await fetch('/api/sponsor/approvedSponsors');
        const sponsors = await response.json();

        if (!response.ok) {
            sponsorList.innerHTML = '<p>Failed to load sponsors.</p>';
            return;
        }

        sponsorList.innerHTML = sponsors.map(sponsor => `<li>${sponsor.username}</li>`).join('');

    } catch (err) {
        console.error(err);
        sponsorList.innerHTML = '<p>Server error.</p>';
    }
});