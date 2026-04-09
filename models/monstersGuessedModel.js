import db from "../db.js";

export function getMonsters() {
    const getMonstersStmt = db.prepare(
        "SELECT * FROM monsters_guessed ORDER BY attempts DESC"
    );
    console.log("Getting monsters guessed: ", getMonstersStmt.all());
    return getMonstersStmt.all();
}

export function updateMonsters(monsterId, monsterName) {
    const updateMonstersTableStmt = db.prepare(
        `INSERT INTO monsters_guessed (monster_id, name, attempts)
        VALUES (?, ?, 1)
        ON CONFLICT(monster_id)
        DO UPDATE SET attempts = attempts + 1`
    );
    updateMonstersTableStmt.run(monsterId, monsterName);
}