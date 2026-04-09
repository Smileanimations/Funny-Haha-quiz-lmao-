import db from "../db.js";

const updateAttemptsStmt = db.prepare(
  "UPDATE stats SET total_attempts = total_attempts + ?, average_attempt = ? WHERE id = 1"
);

const updateWinsStmt = db.prepare(
    "UPDATE stats SET total_wins = total_wins + 1 WHERE id = 1"
);

const updateLossesStmt = db.prepare(
    "UPDATE stats SET total_losses = total_losses + 1 WHERE id = 1"
);

const updateGamesPlayedStmt = db.prepare(
    "UPDATE stats SET total_games = total_games + 1 WHERE id = 1"
);

export function getStats() {
    const getStatsStmt = db.prepare(
        "SELECT total_attempts, total_wins, total_losses, total_games, average_attempt FROM stats WHERE id = 1"
    );
    return getStatsStmt.get();
}

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