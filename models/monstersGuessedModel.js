import db from "../db";

export function getMonsters() {
    const getMonstersStmt = db.prepare(
        "SELECT * FROM monsters_guessed"
    );
    return getMonstersStmt.all();
}