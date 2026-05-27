const API_URL = 'https://api.sheety.co/75d3553f2e826a63182e3944fd7db05e/paWradiseAppApi/animals';
// EDIT:  optimized api calls, now it calls it every 1 hour instead of each time the user loads this page. IM NOT PAYING 9 DOLLARS

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

    console.log("Fetching  animal list from Sheety API");
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

async function loadAnimals() {
    try {
        const container = document.getElementById('animal-container');
        container.innerHTML = '';
        const animals = await getAnimalsData();

        if (!animals || animals.length === 0) {
            container.innerHTML = '<p>No animals found.</p>';
            return;
        }

        animals.forEach(animal => {
            const card = createAnimalCard(animal);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading animals:', error);
        const container = document.getElementById('animal-container');
        container.innerHTML = '<div class="empty-state"><p>Error loading animals. Please try again.</p></div>';
    }
}

//og card element code
function createAnimalCard(animal) {
    const card = document.createElement('div');
    card.className = 'animal-card';
    card.dataset.animalId = animal.id;

    const pfp = animal.profilePic;
    const name = animal.name;
    const type = animal.type;

    // truncate traits if too long
    const traitsPreview = animal.traitsAndPersonality 
        ? animal.traitsAndPersonality.substring(0, 100) + (animal.traitsAndPersonality.length > 100 ? '...' : '')
        : 'No traits listed';

    
    card.innerHTML = `
        <div class="card-image">
            <img src="${pfp}" alt="${name}" onerror="this.src='images/errorr.jpeg'">
        </div>
        <div class="card-content">
            <div class="card-header">
                <h2 class="card-name">${name}</h2>
            </div>
            <div class="basic-info">
                <div class="info-item">
                    <span class="info-value">${type}</span>
                </div>
            </div>
            <div class="traits-preview">
                <p>${traitsPreview}</p>
            </div>
            <a href="profile.html?id=${animal.id}" class="view-profile-btn">GET TO KNOW ME</a>
        </div>
    `;

    return card;
}

// load animals when page is ready
document.addEventListener('DOMContentLoaded', loadAnimals);

// /* fetch and display all animals as cards */
// async function loadAnimals() {
//     try {
//         const response = await fetch(API_URL);
//         const data = await response.json();
//         const container = document.getElementById('animal-container');
//         container.innerHTML = '';

//         const animals = data.animals;

//         if (!animals || animals.length === 0) {
//             container.innerHTML = '<div class="empty-state"><p>No animals found.</p></div>';
//             return;
//         }

//         animals.forEach(animal => {
//             const card = createAnimalCard(animal);
//             container.appendChild(card);
//         });

//         // attachCardClickListeners();
//     } catch (error) {
//         console.error('Error loading animals:', error);
//         const container = document.getElementById('animal-container');
//         container.innerHTML = '<div class="empty-state"><p>Error loading animals. Please try again.</p></div>';
//     }
// }

// /* create an animal card element */
// function createAnimalCard(animal) {
//     const card = document.createElement('div');
//     card.className = 'animal-card';
//     card.dataset.animalId = animal.id;

//     const pfp = animal.profilePic;
//     const name = animal.name;
//     const nickname = animal.nickname;

//     const type = animal.type;
//     const sex = animal.sex;
//     const seen = animal.location;

//     // truncate traits if too long
//     const traitsPreview = animal.traitsAndPersonality 
//         ? animal.traitsAndPersonality.substring(0, 100) + (animal.traitsAndPersonality.length > 100 ? '...' : '')
//         : 'No traits listed';

//     card.innerHTML = `
//         <div class="card-image">
//             <img src="${pfp}" alt="${name}" onerror="this.src='images/placeholder.jpeg'">
//         </div>
//         <div class="card-content">
//             <div class="card-header">
//                 <h2 class="card-name">${name}</h2>
//             </div>
//             <div class="basic-info">
//                 <div class="info-item">
//                     <span class="info-value">${type}</span>
//                 </div>
//             </div>
//             <div class="traits-preview">
//                 <p>${traitsPreview}</p>
//             </div>
//             <a href="profile.html?id=${animal.id}" class="view-profile-btn">GET TO KNOW ME</a>
//         </div>
//     `;

//     return card;
// }

// /* attach click listeners to cards and buttons */
// // function attachCardClickListeners() {
// //     document.querySelectorAll('.animal-card').forEach(card => {
// //         const button = card.querySelector('.view-profile-btn');
        
// //         button.addEventListener('click', (e) => {
// //             e.stopPropagation();
// //             const animalId = button.dataset.animalId;
// //             navigateToAnimalPage(animalId);
// //         });

// //         // also allow clicking the card itself (excluding button)
// //         card.addEventListener('click', (e) => {
// //             if (e.target.closest('.view-profile-btn')) return;
// //             const animalId = card.dataset.animalId;
// //             navigateToAnimalPage(animalId);
// //         });
// //     });
// // }

// /* navigate to individual animal page using animalId */
// function navigateToAnimalPage(animalId) {
//     window.location.href = `animal.html?id=${animalId}`;
// }

// // load animals when page is ready
// document.addEventListener('DOMContentLoaded', loadAnimals);