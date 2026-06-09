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

export async function getMonsters() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const store = db.transaction('monsters_guessed', 'readonly').objectStore('monsters_guessed');
        const request = store.getAll();
        request.onsuccess = function() {
            const sorted = request.result.sort((a, b) => b.attempts - a.attempts);
            resolve(sorted);
        };
        request.onerror = function() {
            reject(request.error);
        };
    });
}

export async function updateMonsters(guessedMonsters) {
    const db = await openDB();
    const monsters = await getMonsters();
    return new Promise((resolve, reject) => {
        for (const monster of guessedMonsters) {
            const store = db.transaction('monsters_guessed', 'readwrite').objectStore('monsters_guessed');
            const request = store.getAll();
            request.onsuccess = function() {
                const data = request.result.find(m => m.name === monster.name);
                if (!data) {
                    const addRequest = store.add({ name: monster.name, attempts: 1 });
                    addRequest.onsuccess = function() {
                        console.log("Monster added: ", monster);
                        resolve(addRequest.result);
                    };
                    addRequest.onerror = function() {
                        console.error("Error adding monster: ", monster, addRequest.error);
                        reject(addRequest.error);
                    };
                    return;
                }

                data.attempts += 1;
                const updateRequest = store.put(data);
                updateRequest.onsuccess = function() {
                    resolve(updateRequest.result);
                };
                updateRequest.onerror = function() {
                    console.error("Error updating monster: ", data, updateRequest.error);
                    reject(updateRequest.error);
                };
            };
            request.onerror = function() {
                console.error("Error fetching monster: ", monster.name, request.error);
                reject(request.error);
            };
        }
    });
}