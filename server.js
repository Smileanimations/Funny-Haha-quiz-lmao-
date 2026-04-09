import express from 'express';
import path from 'path';
import { getStats, updateStats } from './models/statsModel.js';
import { getGames, updateGames } from './models/gamesModel.js';
import { getMonsters, updateMonsters } from './models/monstersGuessedModel.js';

const app = express();
const publicPath = path.join(path.resolve(), 'public');
const hunterPath = path.join(path.resolve(), 'masterhunter');
const statsPath = path.join(path.resolve(), 'statistics');
const modulesPath = path.join(path.resolve(), 'modules');
const dataPath = path.join(path.resolve(), 'data');
const imagePath = path.join(path.resolve(), 'images');

app.use(express.json());
app.use(express.static(publicPath));
app.use('/Modules', express.static(modulesPath));
app.use('/Data', express.static(dataPath));
app.use('/Images', express.static(imagePath));
app.use('/masterhunter', express.static(hunterPath));
app.use('/statistics', express.static(statsPath));

app.get('/stats', (req, res) => {
    const stats = getStats();
    res.json(stats);
});

app.get('/games', (req, res) => {
    const games = getGames();
    res.json(games);
});

app.get('/monsters-guessed', (req, res) => {
    const monsters = getMonsters();
    res.json(monsters);
});
    
// Endpoint to update the stats in the database, it takes the attempts and gaveUp values from the request body and updates the total_attempts, average_attempt, total_wins and total_losses in the database accordingly.
app.post('/update-stats', (req, res) => {
    const { attempts, gaveUp, monster, guessedMonsters } = req.body;
    updateStats(attempts, gaveUp);

    updateGames(monster, attempts, gaveUp ? 1 : 0);

    for (const monsters of guessedMonsters) {
        for (const monster in monsters) {
            updateMonsters(monsters[monster].id, monsters[monster].name);
        }
    }

    res.json({ message: 'Stats updated successfully'});
});

app.get(['/masterhunter'], (req, res) => {
    res.sendFile(path.join(hunterPath, 'masterhunter.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/statistics', (req, res) => {
    res.sendFile(path.join(statsPath, 'statistics.html'));
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
