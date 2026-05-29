import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { create } from 'domain';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const publicPath = path.join(__dirname, 'public');
const hunterPath = path.join(__dirname, 'masterhunter');
const statsPath = path.join(__dirname, 'statistics');
const aboutPath = path.join(__dirname, 'about');
const modulesPath = path.join(__dirname, 'modules');
const dataPath = path.join(__dirname, 'data');
const imagePath = path.join(__dirname, 'images');

app.use(express.json());
app.use(express.static(publicPath));
app.use('/Modules', express.static(modulesPath));
app.use('/Data', express.static(dataPath));
app.use('/Images', express.static(imagePath));
app.use('/masterhunter', express.static(hunterPath));
app.use('/statistics', express.static(statsPath));
app.use('/about', express.static(aboutPath));

app.get('/games', (req, res) => {
    const games = getGames();
    res.json(games);
});

app.get('/monsters-guessed', (req, res) => {
    const monsters = getMonsters();
    res.json(monsters);
});
    
app.get(['/masterhunter'], (req, res) => {
    res.sendFile(path.join(hunterPath, 'masterhunter.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/statistics', (req, res) => {
    res.sendFile(path.join(publicPath, 'statistics/statistics.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(aboutPath, 'about.html'));
});


app.listen(3000, () => {
    console.log("Server running on monstieguesser.com");
});
