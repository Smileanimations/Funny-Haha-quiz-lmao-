import express from 'express';
import path from 'path';
import Database from 'better-sqlite3';
import { stat } from 'fs';

const app = express();
const db = new Database('stats.db');
createDatabase()

const publicPath = path.join(path.resolve(), 'public');
const hunterPath = path.join(path.resolve(), 'masterhunter');
const statsPath = path.join(path.resolve(), 'statistics');
const modulesPath = path.join(path.resolve(), 'modules');
const dataPath = path.join(path.resolve(), 'data');
const imagePath = path.join(path.resolve(), 'images');

const getStatsStmt = db.prepare(
  "SELECT total_attempts, total_wins, total_losses, average_attempt FROM stats WHERE id = 1"
);

const updateAttemptsStmt = db.prepare(
  "UPDATE stats SET total_attempts = total_attempts + ?, average_attempt = ? WHERE id = 1"
);

const updateWinsStmt = db.prepare(
    "UPDATE stats SET total_wins = total_wins + 1 WHERE id = 1"
);

const updateLossesStmt = db.prepare(
    "UPDATE stats SET total_losses = total_losses + 1 WHERE id = 1"
);

// Function that creates the database and the table if it doesnt exist, also inserts a few rows if the table is empty.
function createDatabase() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            total_attempts INTEGER DEFAULT 0,
            total_wins INTEGER DEFAULT 0,
            total_losses INTEGER DEFAULT 0,
            average_attempt REAL DEFAULT 0
        )
    `);
    const row = db.prepare("SELECT * FROM stats").get();
    if (!row) {
        db.prepare("INSERT INTO stats (total_attempts, total_wins, total_losses, average_attempt) VALUES (0, 0, 0, 0)").run();
    }
    console.log("Database and table created successfully: ", row);
}

app.use(express.json());
app.use(express.static(publicPath));
app.use('/Modules', express.static(modulesPath));
app.use('/Data', express.static(dataPath));
app.use('/Images', express.static(imagePath));
app.use('/masterhunter', express.static(hunterPath));
app.use('/statistics', express.static(statsPath));

app.get('/stats', (req, res) => {
    const stats = getStatsStmt.get();
    res.json(stats);
});

// Endpoint to update the stats in the database, it takes the attempts and gaveUp values from the request body and updates the total_attempts, average_attempt, total_wins and total_losses in the database accordingly.
app.post('/update-attempts', (req, res) => {
    const { attempts, gaveUp } = req.body;
    const stats = getStatsStmt.get();
    if (stats.average_attempt != 0) {
        const newAverage = (stats.average_attempt * stats.total_attempts + attempts) / (stats.total_attempts + 1);
        updateAttemptsStmt.run(attempts, newAverage);
    } else {
        updateAttemptsStmt.run(attempts, attempts);
    }

    if (gaveUp == true) {
        updateLossesStmt.run();
    } else {
        updateWinsStmt.run();
    }
    res.json({ message: 'Stats updated successfully'});
    console.log(stats, gaveUp);
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

