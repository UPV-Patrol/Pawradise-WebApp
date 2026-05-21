 const url = 'https://api.sheety.co/85a55f8b29766adc4f5ce134fee89905/paWradiseAppApi/animals';

        fetch(url)
            .then(res => res.json())
            .then(details => {
                const container = document.getElementById('animal-container');
                container.innerHTML = '';

                const animals = details.animals;
                
                animals.forEach(animal => {
                    const pfp = animal.profilePic;
                    const name = animal.name;
                    const nickname = animal.nickname;

                    const type = animal.type;
                    const sex = animal.sex;
                    const seen = animal.location;

                    const traits = animal.traitsAndPersonality;

                    const card = document.createElement('div');
                    card.className = 'animal-card';
                    card.innerHTML = `
                        <img src="${pfp}" alt="${name}"> 
                        <h2>${name} (${nickname})</h2>
                        <p>${type}</p>
                        <p>Usually seen at: ${seen}</p>
                        added here
                        <p>${sex} 
                        <p><strong>Traits and Personality:</strong></p>
                        <p>${traits}</p>
                    `
                    container.appendChild(card);
                });
            })
