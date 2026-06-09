let db;

function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('funny-haha-quiz', 7);
        request.onupgradeneeded = function(event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains('stats')) {
                console.log("Creating stats store")
                createStatsStore(db);
            }
            if (!db.objectStoreNames.contains('games')) {
                console.log("Creating games store")
                createGamesStore(db);
            }
            if (!db.objectStoreNames.contains('monsters_guessed')) {
                console.log("Creating monsters store")
                createMonstersStore(db);
            }
            if (!db.objectStoreNames.contains('filtered_monsters')) {
                console.log("Creating filter store")
                createFilterStore(db);
            }
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            console.log('Database opened successfully');
            resolve(db);
        };
        
        request.onerror = function(event) {
            console.error('Error opening database:', event.target.error);
            reject(event.target.error);
        };
    });
}

function createStatsStore(db) {
    const statsStore = db.createObjectStore('stats', { keyPath: 'id', autoIncrement: true });
    statsStore.createIndex('total_attempts', 'total_attempts', { unique: false });
    statsStore.createIndex('total_wins', 'total_wins', { unique: false });
    statsStore.createIndex('total_losses', 'total_losses', { unique: false });
    statsStore.createIndex('total_games', 'total_games', { unique: false });
    statsStore.createIndex('average_attempt', 'average_attempt', { unique: false });
    const request = statsStore.add({ total_attempts: 0, total_wins: 0, total_losses: 0, total_games: 0, average_attempt: 0 });
    request.onsuccess = function() {
        console.log('Initial stats added successfully');
    };
    request.onerror = function() {
        console.error('Error adding initial stats:', request.error);
    };
}

function createGamesStore(db) {
    const gamesStore = db.createObjectStore('games', { keyPath: 'id', autoIncrement: true });
    gamesStore.createIndex('monster_name', 'monster_name', { unique: false });
    gamesStore.createIndex('attempts', 'attempts', { unique: false });
    gamesStore.createIndex('gave_up', 'gave_up', { unique: false });
    gamesStore.createIndex('timestamp', 'timestamp', { unique: false });
}

function createMonstersStore(db) {
    const monstersStore = db.createObjectStore('monsters_guessed', { keyPath: 'id', autoIncrement: true });
    monstersStore.createIndex('monster_id', 'monster_id', { unique: true });
    monstersStore.createIndex('name', 'name', { unique: false });
    monstersStore.createIndex('attempts', 'attempts', { unique: false });
}

function createFilterStore(db) {
    const filterStore = db.createObjectStore('filtered_monsters', { keyPath: 'id', autoIncrement: true });
    filterStore.createIndex(`filtered_monsters`, `filtered_monsters`, { unique: false });
}

export function getStats() {
    if (!db) {
        console.error('Database not initialized');
        return null;
    }
    return new Promise((resolve, reject) => {
        const store = db.transaction('stats', 'readonly').objectStore('stats');
        const request = store.get(1);
        request.onsuccess = function() {
            resolve(request.result);
        };
        request.onerror = function() {
            reject(request.error);
        };
    });
}

initIndexedDB().then(() => {
    console.log('IndexedDB initialized successfully');
}).catch(error => {
    console.error('Error initializing IndexedDB:', error);
});
