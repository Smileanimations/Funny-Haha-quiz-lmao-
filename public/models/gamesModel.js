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

export async function getGames() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const get = db.transaction('games', 'readonly').objectStore('games');
        const request = get.getAll();
        request.onsuccess = function() {
            resolve(request.result);
        };
        request.onerror = function() {
            reject(request.error);
        };
    });
}

export async function updateGames(monsterName, attempts, gaveUp) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const store = db.transaction('games', 'readwrite').objectStore('games');
        const request = store.add({ monster_name: monsterName, attempts: attempts, gave_up: gaveUp ? 1 : 0, timestamp: Date.now() });
        request.onsuccess = function() {
            resolve(request.result);
        };
        request.onerror = function() {
            reject(request.error);
        }; 
    });
}