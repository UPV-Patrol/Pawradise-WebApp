const API_URL = 'https://api.sheety.co/85a55f8b29766adc4f5ce134fee89905/paWradiseAppApi/animals';

/* fetch and display all animals as cards */
async function loadAnimals() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const container = document.getElementById('animal-container');
        container.innerHTML = '';

        const animals = data.animals;

        if (!animals || animals.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No animals found.</p></div>';
            return;
        }

        animals.forEach(animal => {
            const card = createAnimalCard(animal);
            container.appendChild(card);
        });

        attachCardClickListeners();
    } catch (error) {
        console.error('Error loading animals:', error);
        const container = document.getElementById('animal-container');
        container.innerHTML = '<div class="empty-state"><p>Error loading animals. Please try again.</p></div>';
    }
}

/* create an animal card element */
function createAnimalCard(animal) {
    const card = document.createElement('div');
    card.className = 'animal-card';
    card.dataset.animalId = animal.id;

    const pfp = animal.profilePic;
    const name = animal.name;
    const nickname = animal.nickname;

    const type = animal.type;
    const sex = animal.sex;
    const seen = animal.location;

    // truncate traits if too long
    const traitsPreview = animal.traitsAndPersonality 
        ? animal.traitsAndPersonality.substring(0, 100) + (animal.traitsAndPersonality.length > 100 ? '...' : '')
        : 'No traits listed';

    card.innerHTML = `
        <div class="card-image">
            <img src="${pfp}" alt="${name}" onerror="this.src='images/placeholder.jpeg'">
        </div>
        <div class="card-content">
            <div class="card-header">
                <h2 class="card-name">${name} (${nickname})</h2>
            </div>

            <div class="basic-info">
                <div class="info-item">
                    <span class="info-label">TYPE</span>
                    <span class="info-value">${type}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">SEX</span>
                    <span class="info-value">${sex}</span>
                </div>
            </div>

            <div class="card-location">
                Usually seen at: <strong>${seen}</strong>
            </div>

            <div class="traits-preview">
                <strong>TRAITS</strong>
                <p>${traitsPreview}</p>
            </div>

            <button class="view-profile-btn" data-animal-id="${animal.id}">
                Get to know me →
            </button>
        </div>
    `;

    return card;
}

/* attach click listeners to cards and buttons */
function attachCardClickListeners() {
    document.querySelectorAll('.animal-card').forEach(card => {
        const button = card.querySelector('.view-profile-btn');
        
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const animalId = button.dataset.animalId;
            navigateToAnimalPage(animalId);
        });

        // also allow clicking the card itself (excluding button)
        card.addEventListener('click', (e) => {
            if (e.target.closest('.view-profile-btn')) return;
            const animalId = card.dataset.animalId;
            navigateToAnimalPage(animalId);
        });
    });
}

/* navigate to individual animal page using animalId */
function navigateToAnimalPage(animalId) {
    window.location.href = `animal.html?id=${animalId}`;
}

// load animals when page is ready
document.addEventListener('DOMContentLoaded', loadAnimals);