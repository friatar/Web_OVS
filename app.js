const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

let votes = {
    'Candidate 1': 0,
    'Candidate 2': 0,
    'Candidate 3': 0
};
let registeredVoters = [];
let votedVoters = [];

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
// Endpoint for registration
app.post('/register', (req, res) => {
    const { name, age } = req.body;

    if (age < 18) {
        return res.status(400).send('You must be at least 18 to vote.');
    }

    if (registeredVoters.includes(name)) {
        return res.status(400).send('You are already registered.');
    }

    registeredVoters.push(name);
    console.log(`Registered voter: ${name}, Age: ${age}`);
    res.send('Registration successful!');
});

// Endpoint to cast a vote
app.post('/vote', (req, res) => {
    const { candidate, name } = req.body;

    if (!registeredVoters.includes(name)) {
        return res.status(400).send('You are not registered. Please register before voting.');
    }

    if (votedVoters.includes(name)) {
        return res.status(400).send('You have already voted.');
    }

    if (votes[candidate] !== undefined) {
        votes[candidate] += 1;
        votedVoters.push(name);
        res.send(`Vote cast for ${candidate}`);
    } else {
        res.status(400).send('Invalid candidate.');
    }
});

app.get('/results', (req, res) => {
    res.json(votes);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
