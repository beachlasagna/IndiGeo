const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

// Cities with their coordinates
const cities = {
    "Delhi": { lat: 28.7041, lon: 77.1025 },
    "Mumbai": { lat: 19.0760, lon: 72.8777 },
    "Kolkata": { lat: 22.5726, lon: 88.3639 },
    "Chennai": { lat: 13.0827, lon: 80.2707 },
    "Bangalore": { lat: 12.9716, lon: 77.5946 },
    "Hyderabad": { lat: 17.3850, lon: 78.4867 },
    "Ahmedabad": { lat: 23.0225, lon: 72.5714 },
    // Add more cities as needed
};

// Function to calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// Leaderboard
let leaderboard = [];

io.on('connection', (socket) => {
    let hiddenCity = '';
    let streak = 0;

    socket.on('startGame', () => {
        const cityNames = Object.keys(cities);
        hiddenCity = cityNames[Math.floor(Math.random() * cityNames.length)];

        const distances = cityNames.filter(city => city !== hiddenCity).map(city => ({
            city: city,
            distance: calculateDistance(
                cities[hiddenCity].lat,
                cities[hiddenCity].lon,
                cities[city].lat,
                cities[city].lon
            ).toFixed(0)
        })).slice(0, 7); // Get distances to 7 cities

        socket.emit('gameData', { hiddenCity, distances });
    });

    socket.on('guess', (guess) => {
        if (guess === hiddenCity) {
            streak++;
            socket.emit('correctGuess', streak);
        } else {
            socket.emit('wrongGuess', hiddenCity);
        }
    });

    socket.on('reveal', () => {
        socket.emit('revealCity', hiddenCity);
    });

    socket.on('submitScore', (name) => {
        leaderboard.push({ name, streak });
        leaderboard.sort((a, b) => b.streak - a.streak);
        socket.emit('leaderboard', leaderboard.slice(0, 5)); // Top 5 players
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.use(express.static('public'));

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Error handling
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
