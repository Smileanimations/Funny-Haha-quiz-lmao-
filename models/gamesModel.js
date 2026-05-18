import db from "../db.js";

// Selects the necessary data from the games table and returns it as an array of objects
export function getGames() {
    const getGamesStmt = db.prepare(
        "SELECT monster_name, attempts, gave_up, timestamp FROM games"
    );
    return getGamesStmt.all();
}

// Inserts a new game record into the games table with the provided monster name, attempts, and gave up status
// @param {string} monsterName - The name of the monster that was played against
// @param {number} attempts - The number of attempts taken to defeat the monster
// @param {boolean} gaveUp - A boolean indicating whether the player gave up or not
export function updateGames(monsterName, attempts, gaveUp) {
    const updateGamesTableStmt = db.prepare(
        "INSERT INTO games (monster_name, attempts, gave_up) VALUES (?, ?, ?)"
    );
    updateGamesTableStmt.run(monsterName, attempts, gaveUp ? 1 : 0);
}
