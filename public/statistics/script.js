import { getStats } from '/models/statsModel.js';
import { getGames } from '/models/gamesModel.js';
import { getMonsters } from '/models/monstersGuessedModel.js';

const totalAttemptsElement = document.getElementById('total-attempts');
const averageAttemptsElement = document.getElementById('average-attempts');
const totalWinsElement = document.getElementById('total-wins');
const totalLossesElement = document.getElementById('total-losses');
const totalGamesElement = document.getElementById('total-games');
const averageWinsElement = document.getElementById('average-win')
const mostguessedMonstersElement = document.getElementById('most-guessed-monsters');

const stats = await getStats();
const games = await getGames();
const monsters = await getMonsters();




// Animate the counting of statistics values
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

// Set the statistics values with animation
function setStatistics() {
    animateValue(totalAttemptsElement, 0, stats.total_attempts);
    animateValue(averageAttemptsElement, 0, stats.average_attempt);
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

// Get the last 5 played games and display them in the "Last Played Games" section
function setLastPlayedGames() {
    const gamesContainer = document.getElementById('games-container');
    const lastGames = games.slice(-5).reverse();

    lastGames.forEach(game => {
        const gameEntry = document.createElement('div');
        gameEntry.classList.add('flex', 'flex-row', 'game-entry', 'bg-' + (game.gave_up ? 'red' : 'green') + '-500', 'rounded-md', 'p-3', 'mb-2');
        gameEntry.innerHTML = `
            <img class="size-20 inline-block mr-3" src="/images/icons/${game.monster_name.replace(/ /g, '_')}_Icon.webp" alt="${game.monster_name}" onerror="this.onerror=null; this.src='/images/icons/Default_1_Icon.webp';">
            <div class="flex flex-col text-white inline-block">
                <p><strong>Monster:</strong> ${game.monster_name}</p>
                <p><strong>Attempts:</strong> ${game.attempts}</p>
                <p><strong>Result:</strong> ${game.gave_up ? 'Gave Up' : 'Guessed'}</p>
            </div>
        `;
        gamesContainer.appendChild(gameEntry);
    });
}

// Sort monsters by attempts and get the top 3 most guessed monsters
function setMostGuessedMonsters() {
    const mostGuessedMonsters = monsters.slice(0, 3);
    let bgColor = '';
    mostGuessedMonsters.forEach(monster => {
        const number = mostGuessedMonsters.indexOf(monster) + 1;
        switch (number) {
            case 1:
                bgColor = 'bg-yellow-500';
                break;
            case 2:
                bgColor = 'bg-gray-300';
                break;
            case 3:
                bgColor = 'bg-yellow-700';
                break;
        }
        const monsterEntry = document.createElement('div');
        monsterEntry.classList.add('flex', 'flex-row', 'monster-entry', bgColor, 'rounded-md', 'p-3', 'mb-2');
        monsterEntry.innerHTML = `
            <img class="size-20 inline-block mr-3" src="/images/icons/${monster.name.replace(/ /g, '_')}_Icon.webp" alt="${monster.name}" onerror="this.onerror=null; this.src='/images/icons/Default_1_Icon.webp';">
            <div class="flex flex-col text-white inline-block">
                <p><strong>Monster:</strong> ${monster.name}</p>
                <p><strong>Times Guessed:</strong> ${monster.attempts}</p>
            </div>
        `;
        mostguessedMonstersElement.appendChild(monsterEntry);
    });
}

// Main function to initialize the statistics page
async function main() {
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
    setMostGuessedMonsters();
}

main();