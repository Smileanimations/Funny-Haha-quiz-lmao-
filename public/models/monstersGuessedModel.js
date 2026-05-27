function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('funny-haha-quiz', 3);
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        request.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

export async function getMonsters() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const store = db.transaction('monsters_guessed', 'readonly').objectStore('monsters_guessed');
        const request = store.get(1);
        request.onsuccess = function() {
            resolve(request.result);
        };
        request.onerror = function() {
            reject(request.error);
        };
    });
}

export async function updateMonsters(monsterId, monsterName, attempts) {
    const db = await openDB();
    const monsters = getMonsters();
    return new Promise((resolve, reject) => {
        const store = db.transaction('monsters_guessed', 'readwrite').objectStore('monsters_guessed');
        const request = store.get(monsterId);
        if (request.result) {
            const monster = request.result;
            monster.attempts += attempts;
            const updateRequest = store.put(monster);
            updateRequest.onsuccess = function() {
                resolve(updateRequest.result);
            };
            updateRequest.onerror = function() {
                reject(updateRequest.error);
            };
        } else {
            const addRequest = store.add({ monster_id: monsterId, name: monsterName, attempts: attempts });
            addRequest.onsuccess = function() {
                resolve(addRequest.result);
            };
            addRequest.onerror = function() {
                reject(addRequest.error);
            };
        }
    });
}