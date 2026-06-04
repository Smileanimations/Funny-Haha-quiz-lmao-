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

export async function updateFilteredMonsters(filteredMonsters) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const store = db.transaction('filtered_monsters', 'readwrite').objectStore('filtered_monsters');
        const request = store.put({id: 1, filtered_monsters: filteredMonsters });
        request.onsuccess = function() {
            resolve(request.result);
        };
        request.onerror = function() {
            reject(request.error);
        };
    });
}

export async function loadFilteredMonsters() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const store = db.transaction('filtered_monsters', 'readonly').objectStore('filtered_monsters');
        const request = store.get(1);
        request.onsuccess = function() {
            resolve(request.result);
        };
        request.onerror = function() {
            reject(request.error);
        };
    });
}