function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('funny-haha-quiz', 7);
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        request.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

export async function getStats() {
        const db = await openDB();
    return new Promise((resolve, reject) => {
        const get = db.transaction('stats', 'readonly').objectStore('stats');
        const request = get.get(1);

        request.onsuccess = function() {
            resolve(request.result);
        };
        request.onerror = function() {
            reject(request.error);
        };
    });
}

export async function updateStats(attempts, gaveUp) {
        const db = await openDB();
    return new Promise((resolve, reject) => {
        const store = db.transaction('stats', 'readwrite').objectStore('stats');
        const request = store.get(1);

        request.onsuccess = function() {
            const stats = request.result;
            stats.total_attempts += attempts;
            stats.total_games += 1;
            if (gaveUp) {
                stats.total_losses += 1;
            } else {
                stats.total_wins += 1;
            }
            stats.average_attempt = stats.total_attempts / stats.total_games;
            const updateRequest = store.put(stats);
            updateRequest.onsuccess = function() {
                resolve(updateRequest.result);
            };
            updateRequest.onerror = function() {
                reject(updateRequest.error);
            };
        };
        request.onerror = function() {
            reject(request.error);
        };
    });
}