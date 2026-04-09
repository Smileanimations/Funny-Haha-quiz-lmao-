import Database from 'better-sqlite3';

const db = new Database('stats.db');

function createDatabase() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            total_attempts INTEGER DEFAULT 0,
            total_wins INTEGER DEFAULT 0,
            total_losses INTEGER DEFAULT 0,
            total_games INTEGER DEFAULT 0,
            average_attempt REAL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            monster_name TEXT,
            attempts INTEGER,
            gave_up BOOLEAN,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS monsters_guessed (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            monster_id INTEGER,
            name TEXT,
            attempts INTEGER
        );
    `);
    const row = db.prepare("SELECT * FROM stats").get();
    if (!row) {
        db.prepare("INSERT INTO stats (total_attempts, total_wins, total_losses, total_games, average_attempt) VALUES (0, 0, 0, 0, 0)").run();
    }
    console.log("Database and table created successfully: ", row);
}

createDatabase();

export default db;
