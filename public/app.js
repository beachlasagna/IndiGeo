const socket = io();

// DOM Elements
const startGameButton = document.getElementById('startGame');
const distanceList = document.getElementById('distanceList');
const cityGuessInput = document.getElementById('cityGuess');
const submitGuessButton = document.getElementById('submitGuess');
const revealAnswerButton = document.getElementById('revealAnswer');
const streakMessage = document.getElementById('streakMessage');
const wrongGuessMessage = document.getElementById('wrongGuessMessage');
const leaderboardList = document.getElementById('leaderboardList');
const gameArea = document.getElementById('gameArea');

let hiddenCity = '';
let streak = 0; // Track the player's streak

// Start Game
startGameButton.onclick = () => {
    socket.emit('startGame');
};

// Receive Game Data
socket.on('gameData', (data) => {

    hiddenCity = data.hiddenCity; // Store the hidden city
    distanceList.innerHTML = ''; // Clear previous distances
    streak = 0; // Reset streak

    data.distances.forEach(({ city, distance }) => {
        const li = document.createElement('li');
        li.className = 'distance-item';
        li.innerHTML = `${city}: ${distance} km`;
        distanceList.appendChild(li);
    });

    gameArea.style.display = 'block';
    streakMessage.style.display = 'none';
    wrongGuessMessage.style.display = 'none';
    initMap(data.distances); // Initialize the map with hint cities
});

// Initialize Map
function initMap(distances) {
    const cityCoordinates = {
        "Delhi": [28.7041, 77.1025],
        "Mumbai": [19.0760, 72.8777],
        "Kolkata": [22.5726, 88.3639],
        "Chennai": [13.0827, 80.2707],
        "Bangalore": [12.9716, 77.5946],
        "Hyderabad": [17.3850, 78.4867],
        "Ahmedabad": [23.0225, 72.5714],
        // Add more cities as needed
    };

    const map = L.map('map');
    map.setView([20.5937, 78.9629], 5); // Centered on India

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Mark only the hint cities on the map
    distances.forEach(({ city }) => {
        L.marker(cityCoordinates[city]).addTo(map).bindPopup(city);
    });
}

// Handle Guess Submission
submitGuessButton.onclick = () => {
    const guess = cityGuessInput.value.trim();
    if (guess) {
        socket.emit('guess', guess);
        cityGuessInput.value = ''; // Clear input
    }
};

// Receive Guess Results
socket.on('correctGuess', (newStreak) => {
    streak = newStreak;
    streakMessage.innerHTML = `Correct! Your streak is now ${streak}.`;
    streakMessage.style.display = 'block';
    wrongGuessMessage.style.display = 'none';
});

socket.on('wrongGuess', (hiddenCity) => {
    wrongGuessMessage.innerHTML = `Wrong! The hidden city was ${hiddenCity}.`;
    wrongGuessMessage.style.display = 'block';
    streakMessage.style.display = 'none';
});

// Reveal Answer
revealAnswerButton.onclick = () => {
    socket.emit('reveal');
};

socket.on('revealCity', (hiddenCity) => {
    wrongGuessMessage.innerHTML = `The hidden city was: ${hiddenCity}.`;
    wrongGuessMessage.style.display = 'block';
    streakMessage.style.display = 'none';
});

// Submit Score to Leaderboard
function submitScore() {
    const name = prompt("Enter your name for the leaderboard:");
    if (name) {
        socket.emit('submitScore', name);
    }
}

// Receive and Update Leaderboard
socket.on('leaderboard', (leaderboard) => {
    leaderboardList.innerHTML = '';
    leaderboard.forEach(player => {
        const li = document.createElement('li');
        li.className = 'leaderboard-item';
        li.innerHTML = `${player.name}: ${player.streak}`;
        leaderboardList.appendChild(li);
    });
});

// Prompt for submitting score at the end of the game
socket.on('gameEnded', () => {
    submitScore();
});
