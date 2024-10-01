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
    "Pune": { lat: 18.5204, lon: 73.8567 },
    "Jaipur": { lat: 26.9124, lon: 75.7873 },
    "Surat": { lat: 21.1702, lon: 72.8311 },
    "Lucknow": { lat: 26.8467, lon: 80.9462 },
    "Kanpur": { lat: 26.4478, lon: 80.3463 },
    "Nagpur": { lat: 21.1458, lon: 79.0882 },
    "Visakhapatnam": { lat: 17.6868, lon: 83.2185 },
    "Vadodara": { lat: 22.3072, lon: 73.1812 },
    "Indore": { lat: 22.7196, lon: 75.8577 },
    "Bhopal": { lat: 23.2599, lon: 77.4126 },
    "Coimbatore": { lat: 11.0168, lon: 76.9558 },
    "Patna": { lat: 25.5941, lon: 85.1376 },
    "Kochi": { lat: 9.9312, lon: 76.2673 },
    "Nashik": { lat: 19.9975, lon: 73.7898 },
    "Agra": { lat: 27.1767, lon: 78.0081 },
    "Ranchi": { lat: 23.3562, lon: 85.3348 },
    "Aurangabad": { lat: 19.8762, lon: 75.3433 },
    "Thane": { lat: 19.2183, lon: 72.9781 },
    "Meerut": { lat: 28.9845, lon: 77.7068 },
    "Faridabad": { lat: 28.4082, lon: 77.3178 },
    "Noida": { lat: 28.5355, lon: 77.3910 },
    "Mysore": { lat: 12.2958, lon: 76.6393 },
    "Dehradun": { lat: 30.3165, lon: 78.0322 },
    "Udaipur": { lat: 24.5714, lon: 73.6915 },
    "Vijayawada": { lat: 16.5062, lon: 80.6480 },
    "Jodhpur": { lat: 26.2389, lon: 73.0243 },
    "Gwalior": { lat: 26.2183, lon: 78.1820 },
    "Tirupati": { lat: 13.6288, lon: 79.4192 },
    "Kota": { lat: 25.2138, lon: 75.8648 },
    "Durgapur": { lat: 23.5254, lon: 88.5030 },
    "Bhavnagar": { lat: 21.7502, lon: 72.1414 },
    "Srinagar": { lat: 34.0836, lon: 74.7973 },
    "Kozhikode": { lat: 11.2588, lon: 75.7804 },
    "Raipur": { lat: 21.2514, lon: 81.6296 },
    "Amritsar": { lat: 31.6340, lon: 74.8723 },
    "Bhubaneswar": { lat: 20.2961, lon: 85.8245 },
    "Jabalpur": { lat: 23.1815, lon: 79.9550 },
    "Bhuj": { lat: 23.2407, lon: 68.7471 },
    "Ludhiana": { lat: 30.9009, lon: 75.8573 },
    "Silchar": { lat: 24.8232, lon: 92.7749 },
    "Kurnool": { lat: 15.8281, lon: 78.0469 },
    "Kalyan": { lat: 19.2185, lon: 73.1558 },
    "Jammu": { lat: 32.7266, lon: 74.8570 },
    "Raurkela": { lat: 22.2596, lon: 84.7910 },
    "Bilaspur": { lat: 22.0792, lon: 82.1497 },
    "Puducherry": { lat: 11.9416, lon: 79.8083 },
    "Agartala": { lat: 23.8290, lon: 91.2863 },
    "Gangtok": { lat: 27.3389, lon: 88.6139 },
    "Imphal": { lat: 24.8170, lon: 93.9368 },
    "Itanagar": { lat: 27.1026, lon: 93.6054 },
    "Aizawl": { lat: 23.1645, lon: 92.9376 },
    "Shillong": { lat: 25.5788, lon: 91.8933 },
    "Dimapur": { lat: 25.9085, lon: 93.7194 },
    "Kohima": { lat: 25.6708, lon: 94.1122 },
    "Tawang": { lat: 27.5544, lon: 91.8683 },
    "Siliguri": { lat: 26.7272, lon: 88.5959 },
    "Dibrugarh": { lat: 27.4858, lon: 94.9056 },
    "Tinsukia": { lat: 27.4956, lon: 95.3462 },
    "Tezpur": { lat: 26.6586, lon: 92.8189 },
    "Bongaigaon": { lat: 26.4665, lon: 90.5695 },
    "Kolkata": { lat: 22.5726, lon: 88.3639 },
    "Nagaon": { lat: 26.3295, lon: 92.6452 },
    "Haldwani": { lat: 29.2185, lon: 79.5192 },
    "Mangaluru": { lat: 12.9141, lon: 74.8560 },
    "Panchkula": { lat: 30.7052, lon: 76.8546 },
    "Saharanpur": { lat: 29.9691, lon: 77.5480 },
    "Jind": { lat: 29.3167, lon: 76.3116 },
    "Firozabad": { lat: 27.1579, lon: 78.3953 },
    "Muzaffarpur": { lat: 26.1184, lon: 85.3585 },
    "Sambhal": { lat: 28.5476, lon: 78.5464 },
    "Khalilabad": { lat: 26.7405, lon: 82.2007 },
    "Shahjahanpur": { lat: 27.1008, lon: 79.9037 },
    "Hapur": { lat: 28.7464, lon: 78.0564 },
    "Jammu": { lat: 32.7266, lon: 74.8570 },
    "Udhampur": { lat: 32.9363, lon: 75.3087 },
    "Kargil": { lat: 34.5566, lon: 76.1419 },

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
    let playerName = '';

    // Start the game
    socket.on('startGame', (name) => {
        playerName = name;  // Store player's name
        const cityNames = Object.keys(cities);
        hiddenCity = cityNames[Math.floor(Math.random() * cityNames.length)];

        const distances = cityNames.filter(city => city !== hiddenCity).map(city => ({
            city: city,
            distance: calculateDistance(
                cities[hiddenCity].lat,
                cities[hiddenCity].lon,
                cities[city].lat,
                cities[city].lon
            ).toFixed(2)
        })).slice(0, 7); // Get distances to 7 cities

        socket.emit('gameData', { hiddenCity, distances });
    });

    // Handle player guess
    socket.on('guess', (guess) => {
        if (guess === hiddenCity) {
            streak++;
            socket.emit('correctGuess', streak);
        } else {
            socket.emit('wrongGuess', hiddenCity);
        }
    });

    // Reveal the hidden city
    socket.on('reveal', () => {
        socket.emit('revealCity', hiddenCity);
    });

    // Submit score to leaderboard
    socket.on('submitScore', () => {
        leaderboard.push({ name: playerName, streak });
        leaderboard.sort((a, b) => b.streak - a.streak); // Sort leaderboard by streak
        io.emit('leaderboard', leaderboard.slice(0, 5)); // Send top 5 scores to all clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.use(express.static('public'));

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
