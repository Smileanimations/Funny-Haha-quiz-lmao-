import db from "../db.js";

// Prepares the SQL statements for updating the total attempts.
const updateAttemptsStmt = db.prepare(
  "UPDATE stats SET total_attempts = total_attempts + ?, average_attempt = ? WHERE id = 1"
);

// Prepares the SQL statements for updating the total wins.
const updateWinsStmt = db.prepare(
    "UPDATE stats SET total_wins = total_wins + 1 WHERE id = 1"
);

// Prepares the SQL statements for updating the total losses.
const updateLossesStmt = db.prepare(
    "UPDATE stats SET total_losses = total_losses + 1 WHERE id = 1"
);

// Prepares the SQL statements for updating the total games played.
const updateGamesPlayedStmt = db.prepare(
    "UPDATE stats SET total_games = total_games + 1 WHERE id = 1"
);

// Selects the data from the stats table and returns it
export function getStats() {
    const getStatsStmt = db.prepare(
        "SELECT total_attempts, total_wins, total_losses, total_games, average_attempt FROM stats WHERE id = 1"
    );
    return getStatsStmt.get();
}

// Updates the statistics in the stats table with the provided attempts and gave up status. It updates the total attempts, total wins, total losses, total games played, and average attempts.
// @param {int} attempts is the number of attempts it took to guess the monster.
// @param {boolean} gaveUp is whether the player gave up or not, it is used to update the stats with a loss when the player gives up.
export function updateStats(attempts, gaveUp) {
    const stats = getStats();

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

    updateGamesPlayedStmt.run();
}