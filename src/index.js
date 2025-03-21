document.addEventListener("DOMContentLoaded", () => {
    const characterBar = document.getElementById("character-bar");
    const detailedInfo = document.getElementById("detailed-info");
    const nameElement = document.getElementById("name");
    const imageElement = document.getElementById("image");
    const votesElement = document.getElementById("vote-count");
    const voteForm = document.getElementById("votes-form");
    const resetButton = document.getElementById("reset-btn");
    const newCharacterForm = document.getElementById("character-form");
    const charactername = document.getElementById("character-name");


    const baseURL = "http://localhost:3000/characters";
    let currentCharacter;

    function fetchCharacters() {
        fetch(baseURL)
            .then(response => response.json())
            .then(characters => {
                characters.forEach(addCharacterToBar);
            });
    }

    function addCharacterToBar(character) {
        const span = document.createElement("span");
        span.textContent = character.name;
        span.addEventListener("click", () => displayCharacterDetails(character));
        characterBar.appendChild(span);
    }

    function displayCharacterDetails(character) {
        currentCharacter = character;
        nameElement.textContent = character.name;
        imageElement.src = character.image;
        votesElement.textContent = character.votes;
    }

    voteForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const voteInput = document.getElementById("votes");
        const votesToAdd = parseInt(voteInput.value) || 0;
        currentCharacter.votes += votesToAdd;
        votesElement.textContent = currentCharacter.votes;
        voteInput.value = "";
        updateVotesOnServer();
    });

    resetButton.addEventListener("click", () => {
        if (currentCharacter) {
            currentCharacter.votes = 0;
            votesElement.textContent = 0;
            updateVotesOnServer();
        }
    });

    function updateVotesOnServer() {
        fetch(`${baseURL}/${currentCharacter.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ votes: currentCharacter.votes })
        });
    }

    newCharacterForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("new-name").value;
        const image = document.getElementById("new-image").value;
        const newCharacter = { name, image, votes: 0 };

        fetch(baseURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newCharacter)
        })
        .then(response => response.json())
        .then(createdCharacter => {
            addCharacterToBar(createdCharacter);
            displayCharacterDetails(createdCharacter);
        });
    });

    fetchCharacters();
});



