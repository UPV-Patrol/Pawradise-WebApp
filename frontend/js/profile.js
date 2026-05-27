const API_URL = 'https://api.sheety.co/75d3553f2e826a63182e3944fd7db05e/paWradiseAppApi/animals';
// EDIT: optimized api calls, now it calls it every 1 hour instead of each time the user loads this page. IM NOT PAYING 9 DOLLARS

async function getAnimalsData() {
    const cacheKey = 'paWradiseAnimals';
    const cacheTimeKey = 'paWradiseAnimalsTime';
    const maxAge = 60 * 60 * 1000;

    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(cacheTimeKey);
    const now = Date.now();

    if (cachedData && cachedTime && (now - cachedTime < maxAge)) {
        console.log("Loading Animal List (from memory) ");
        return JSON.parse(cachedData);
    }

    console.log("Fetching animal list from Sheety API");
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data && data.animals) {
            localStorage.setItem(cacheKey, JSON.stringify(data.animals));
            localStorage.setItem(cacheTimeKey, now.toString());
            return data.animals;
        }
        throw new Error("Invalid API response format");
    } catch (error) {
        console.error('Error fetching API, attempting expired cache rollback:', error);
        // if error, return expired local data
        return cachedData ? JSON.parse(cachedData) : [];
    }
}

/* get specific animal id */
async function loadAnimalProfile() {
    const params = new URLSearchParams(window.location.search);
    const animalId = params.get('id');

    if (!animalId) {
        document.getElementById('animal-profile').innerHTML = '<p>Animal not found.</p>';
        return;
    }

    try {

        const animals = await getAnimalsData();
        const animal = animals.find(a => String(a.id) === String(animalId));

        if (!animal) {
            document.getElementById('animal-profile').innerHTML = '<p>Animal not found.</p>';
            return;
        }

        getProfile(animal);
    } catch (error) {
        console.error('Error loading profile:', error);
        document.getElementById('animal-profile').innerHTML = '<p>Error loading profile.</p>';
    }
}

function getProfile(animal) {
    const traits = animal.traitsAndPersonality
        ? animal.traitsAndPersonality.split(',').map(t => `<li>− ${t.trim()}</li>`).join('')
        : '<li>No traits listed</li>';

    const neuteredChecked = animal['isNeutered/Spayed'] ? 'checked' : '';

    document.getElementById('animal-profile').innerHTML = `
        <div class="profile-top">
            <div class="profile-pic">
                <img src="${animal.profilePic}" alt="${animal.name}" onerror="this.src='images/error.jpeg'">
            </div>
            <div class="profile-info">
                <div class="profile-name-row">
                    <h1 class="profile-name">${animal.name}</h1>
                    <br>
                    <p class="profile-nickname">Also known as: ${animal.nickname}</p>
                </div>
                <p class="profile-meta"><strong>AGE:</strong> ${animal.age || 'Unknown'}</p>
                <p class="profile-meta"><strong>SEX:</strong> ${animal.sex || 'Unknown'}</p>
                <hr class="profile-divider">
                <ul class="profile-traits">${traits}</ul>
            </div>
        </div>

        <!-- Medical History -->
        <div class="profile-section">
            <div class="section-header">
                <span class="section-title">MEDICAL HISTORY</span>
            </div>
            <div class="section-body">
                <div class="medical-row">
                    <input type="checkbox" ${animal.isVaccinated ? 'checked' : ''} disabled>
                    <span class="medical-label">Vaccinated?</span>
                </div>
                <div class="medical-row">
                    <input type="checkbox" ${neuteredChecked} disabled>
                    <span class="medical-label">Neutered/Spayed?</span>
                </div>
                <div class="medical-row">
                    <input type="checkbox" ${animal.isDewormed ? 'checked' : ''} disabled>
                    <span class="medical-label">Dewormed?</span>
                    <span class="medical-note">${animal.dewormBrand || ''}</span>
                </div>
            </div> 
        </div>

        <!-- Gallery -->
        <div class="profile-section">
            <div class="section-header">
                <span class="section-title">GALLERY</span>
            </div>
            <div class="section-body">
                <div class="gallery-grid">
                    ${(animal.gallery || []).slice(0, 8).map(img => `
                        <div class="gallery-item">
                            <img src="${img}" alt="gallery photo" onerror="this.src='images/placeholder.jpeg'">
                        </div>
                    `).join('') || Array(8).fill('<div class="gallery-item gallery-placeholder"></div>').join('')}
                </div>
                <div class="gallery-btn-row">
                    <button class="view-more-btn">View More</button>
                </div>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', loadAnimalProfile);
