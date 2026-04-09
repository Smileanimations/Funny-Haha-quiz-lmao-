import db from "../db.js";

export function getGames() {
    const getGamesStmt = db.prepare(
        "SELECT monster_name, attempts, gave_up, timestamp FROM games"
    );
    return getGamesStmt.all();
}

export function updateGames(monsterName, attempts, gaveUp) {
    const updateGamesTableStmt = db.prepare(
        "INSERT INTO games (monster_name, attempts, gave_up) VALUES (?, ?, ?)"
    );
    updateGamesTableStmt.run(monsterName, attempts, gaveUp ? 1 : 0);
}
