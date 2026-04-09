const stats = await getStatistics();
const games = await getGames();
const totalAttemptsElement = document.getElementById('total-attempts');
const averageAttemptsElement = document.getElementById('average-attempts');
const totalWinsElement = document.getElementById('total-wins');
const totalLossesElement = document.getElementById('total-losses');
const totalGamesElement = document.getElementById('total-games');
const averageWinsElement = document.getElementById('average-win');


function getStatistics() {
    return fetch('/stats')
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching statistics:', error);
            return null;
        });
}

function getGames() {
    return fetch('/games')
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching games:', error);
            return [];
        });
}

function animateValue(element, start, end, duration = 1000) {
    const startTime = performance.now();
    
    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current;
        
        if (progress < 1) requestAnimationFrame(update);
    };
    
    requestAnimationFrame(update);
}

function setStatistics() {
    animateValue(totalAttemptsElement, 0, stats.total_attempts);
    animateValue(averageAttemptsElement, 0, Math.round(stats.average_attempt));
    animateValue(totalWinsElement, 0, stats.total_wins);
    animateValue(totalLossesElement, 0, stats.total_losses);
    animateValue(totalGamesElement, 0, stats.total_games);
    if (stats.total_wins > 0) {
    const averageWin = (stats.total_wins / stats.total_games) * 100;
    animateValue(averageWinsElement, 0, Math.round(averageWin));
    } else {
    averageWinsElement.textContent = '0%';
    }
}

function setLastPlayedGames() {
    const gamesContainer = document.getElementById('games-container');
    const lastGames = games.slice(-5).reverse();

    lastGames.forEach(game => {
        const gameEntry = document.createElement('div');
        gameEntry.classList.add('flex', 'flex-row', 'game-entry', 'bg-' + (game.gave_up ? 'red' : 'green') + '-500', 'rounded-md', 'p-3', 'mb-2');
        gameEntry.innerHTML = `
            <img class="size-20 inline-block mr-3" src="/Images/Icons/${game.monster_name.replace(/ /g, '_')}_Icon.webp" alt="${game.monster_name}" onerror="this.onerror=null; this.src='/Images/Icons/Default_1_Icon.webp';">
            <div class="flex flex-col text-white inline-block">
                <p><strong>Monster:</strong> ${game.monster_name}</p>
                <p><strong>Attempts:</strong> ${game.attempts}</p>
                <p><strong>Result:</strong> ${game.gave_up ? 'Gave Up' : 'Guessed'}</p>
            </div>
        `;
        gamesContainer.appendChild(gameEntry);
    });
}

function main() {
    if (!stats) {
        totalAttemptsElement.textContent = 'Error';
        averageAttemptsElement.textContent = 'Error';
        totalWinsElement.textContent = 'Error';
        totalLossesElement.textContent = 'Error';
        totalGamesElement.textContent = 'Error';
        averageAttemptsElement.textContent = 'Error';
        return;
    }

    setStatistics();
    setLastPlayedGames();
}

main();