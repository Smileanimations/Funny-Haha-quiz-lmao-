import express from 'express';
import path from 'path';
import Database from 'better-sqlite3';

const app = express();

const publicPath = path.join(path.resolve(), 'public');
const hunterPath = path.join(path.resolve(), 'masterhunter');
const modulesPath = path.join(path.resolve(), 'Modules');
const dataPath = path.join(path.resolve(), 'Data');
const imagePath = path.join(path.resolve(), 'Images');

function createDatabase() {
    const db = new Database('stats.db');

    db.exec(`
        CREATE TABLE IF NOT EXISTS stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            total_attempts INTEGER DEFAULT 0,
            total_wins INTEGER DEFAULT 0,
            total_losses INTEGER DEFAULT 0,
            average_attempt REAL DEFAULT 0
        )
    `);
}

createDatabase();

app.use(express.json());
app.use(express.static(publicPath));
app.use('/Modules', express.static(modulesPath));
app.use('/Data', express.static(dataPath));
app.use('/Images', express.static(imagePath));
app.use('/masterhunter', express.static(hunterPath));

app.get(['/masterhunter', '/masterhunter/'], (req, res) => {
    res.sendFile(path.join(hunterPath, 'masterhunter.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

