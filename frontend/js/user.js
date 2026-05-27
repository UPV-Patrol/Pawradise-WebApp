// DESCRIPTION: handles user dashboard — loads sponsorships and favorited animals

const SHEETY_URL = 'https://api.sheety.co/85a55f8b29766adc4f5ce134fee89905/paWradiseAppApi/animals';

document.addEventListener('DOMContentLoaded', () => {
    loadUsername();
    loadMySponshorships();
    loadFavorites();
});

async function loadUsername() {
    try {
        const response = await fetch('/api/user/auth-status', { credentials: 'include' });
        const data = await response.json();

        if (data.isLoggedIn && data.user) {
            document.getElementById('display-username').textContent = data.user.username;
        }
    } catch (err) {
        console.error('Error loading username:', err);
    }
}


async function loadMySponshorships() {
    const container = document.getElementById('sponsorship-list');

    try {
        const response = await fetch('/api/user/my-sponsorships', { credentials: 'include' });
        const result = await response.json();

        if (!result.success || result.data.length === 0) {
            container.innerHTML = `
                <p class="empty-text">no sponsorship yet</p>
                <a href="sponsor.html" class="action-btn">Sponsor a Pet Now</a>
            `;
            return;
        }

        container.innerHTML = '';

        result.data.forEach(row => {
            const formattedDate = new Date(row.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            const card = document.createElement('div');
            card.className = 'sponsorship-card';

            card.innerHTML = `
                <div class="sponsorship-card-header">
                    <span class="sponsorship-pet"> ${row.target_pets}</span>
                    <!-- status badge class changes color: status-pending, status-verified, status-denied -->
                    <span class="status-badge status-${row.status}">${row.status}</span>
                </div>
                <div class="sponsorship-card-body">
                    <p><strong>Month:</strong> ${row.sponsorship_month}</p>
                    <p><strong>Amount:</strong> ₱${parseFloat(row.amount).toFixed(2)}</p>
                    <p><strong>Date Submitted:</strong> ${formattedDate}</p>
                    <a href="/uploads/sponsorship/${row.proof_img}" target="_blank" class="proof-link">
                        View Proof of Payment
                    </a>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error('Error loading sponsorships:', err);
        container.innerHTML = '<p class="empty-text">Error loading sponsorships.</p>';
    }
}


//TODO:
async function loadFavorites() {
    const grid = document.getElementById('favorites-grid');

    try {
        const favResponse = await fetch('/api/user/favorites', { credentials: 'include' });
        const favResult = await favResponse.json();

        if (!favResult.success || favResult.data.length === 0) {
            grid.innerHTML = `
                <p class="empty-text">aww, you are heartless.</p>
                <a href="listings.html" class="action-btn">Browse Animals</a>
            `;
            return;
        }

        const favoritedIds = favResult.data.map(f => f.animal_id);

        // get all animals from sheety
        const sheetyResponse = await fetch(SHEETY_URL);
        const sheetyData = await sheetyResponse.json();
        const allAnimals = sheetyData.animals;

        // filter to only the ones the user favorited
        const favoritedAnimals = allAnimals.filter(a => favoritedIds.includes(a.id));

        if (favoritedAnimals.length === 0) {
            grid.innerHTML = '<p class="empty-text">No matching animals found.</p>';
            return;
        }

        grid.innerHTML = '';

        favoritedAnimals.forEach(animal => {
            const card = document.createElement('div');
            card.className = 'favorite-card';
            card.innerHTML = `
                <img src="${animal.profilePic}" alt="${animal.name}"
                     onerror="this.src='images/placeholder.jpeg'">
                <div class="favorite-card-info">
                    <h3>${animal.name}</h3>
                    <p>${animal.type} · ${animal.sex}</p>
                    <button class="unfav-btn" onclick="removeFavorite(${animal.id}, this)">
                        ❤️ Remove
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (err) {
        console.error('Error loading favorites:', err);
        grid.innerHTML = '<p class="empty-text">Error loading favorites.</p>';
    }
}

// remove a favorited animal
async function removeFavorite(animalId, btn) {
    try {
        const response = await fetch(`/api/user/favorites/${animalId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        const result = await response.json();

        if (result.success) {
            // remove card without reloading the page
            btn.closest('.favorite-card').remove();

            // if no favorites left, show empty 
            const grid = document.getElementById('favorites-grid');
            if (grid.children.length === 0) {
                grid.innerHTML = '<p class="empty-text">No favorite animals yet.</p>';
            }
        }
    } catch (err) {
        console.error('Remove favorite error:', err);
    }
}