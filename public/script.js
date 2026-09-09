import { searchBarClass } from "./modules/searchbar/class.js";
import { FilterContainerClass } from "./modules/filter/class.js";
import { updateStats } from "./models/statsModel.js";
import { updateGames } from "./models/gamesModel.js";
import { updateMonsters } from "./models/monstersGuessedModel.js";

let searchbar;
let filterclass;
let filterContainer;
let randomMonster;
let monsters = [];
let guessedMonsters = [];
let attempts = 0;
let backgroundColor = "green";
let filterEnabled = true
let victoryDiv;

const body = document.getElementById("body");
const mainscreen = document.getElementById("mainscreen");
const attachDiv = document.getElementById("result");
const searchbarDiv = document.getElementById("search-bar-div");
const guessDiv = document.getElementById("guessbackground");
const filterDiv = document.getElementById("filter-div");
const guessDivBackground = document.getElementById("guessbackground")
const attemptsElement = document.getElementById("attempts");
const resetButton = document.getElementById("resetbutton");
const filterButton = document.getElementById("filterbutton")

guessDivBackground.style.visibility = "hidden";

// Fetch the JSON file
fetch("./data/monsters.json")

    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(async data => {
        monsters = data.monsters;
        await createFilter();
        searchbar = new searchBarClass(document.getElementById("search-bar"), searchbarDiv, attachDiv, monsters);   // Imports the searchBarClass from the class.js file and creates a new instance of it.
        resetGame(monsters)
    })
    .catch(error => {
        console.error("Error fetching the JSON file:", error);
    });

// Function that gets a random monster from the monsters array.
// 
// param {Array} @monsters is the list of every monster that is in the JSON file.
function getRandomMonster(monsters) {
    randomMonster = monsters[Math.floor(Math.random() * monsters.length)];
    console.log("Random monster: " + randomMonster.name);
    return randomMonster;
}

// Function that clears the the search bar and results and pick a new random monster.
window.resetGame = function () {
    resetButton.classList.remove("reset-button-enabled");
    resetButton.classList.remove("bg-green");
    resetButton.classList.add("reset-button-disabled");
    resetButton.setAttribute("onclick", "");
    resetButton.innerHTML = "Give Up";
    backgroundColor = "green";
    guessDiv.innerHTML = '';
    guessDivBackground.style.visibility = "hidden";

    const filteredMonsters = filterclass.monsters ?? monsters;
    getRandomMonster(filteredMonsters);
    searchbar.updateMonsters(filteredMonsters);
    removeVictoryScreen();

    if (searchbar) {
        searchbar.searchBar.disabled = false;
    }

    attempts = 0;
    attemptsElement.innerHTML = 'Attempts: 0';
}

// Function that shows the victory screen with a red bar instead of a green one.
window.giveUp = function () {
    backgroundColor = "red";
    const gaveUp = true;
    victoryScreen(randomMonster, backgroundColor, gaveUp);

}

function enableResetButton() {
    resetButton.classList.remove("reset-button-disabled");
    resetButton.classList.add("reset-button-enabled");
    resetButton.classList.add("bg-red")
    resetButton.setAttribute("onclick", "giveUp()");
    resetButton.innerHTML = "Give Up";
}

// Function that compares the monster with the random monster and returns an array with the colors of the results.
//
// @param {Object} monster is the monster that was pressed.
function compareMonster(monster) {
    let colors = [];

    if (monster.generations == randomMonster.generations) {
        colors.push("green");
    } else {
        colors.push("red");
    }

    if (monster.class == randomMonster.class) {
        colors.push("green");
    } else {
        colors.push("red");
    }

    if (monster.species == randomMonster.species) {
        colors.push("green");
    } else {
        colors.push("red");
    }

    colors.push(compareElement(monster.element, randomMonster.element));
    colors.push(compareElement(monster.ailment, randomMonster.ailment))
    return colors;
}

// Function that compares the elements of the monster and the random monster, it does by checking each element and creating a point system and by comparing those points returns a color.
// @param {Array} monster is are the element(s) of the monster that was pressed.
// @param {Array} randommonster are the element(s) of the random monster.
function compareElement(monster, randommonster) {
    const monsterarray = monster.split(", ");
    const randommonsterarray = randommonster.split(", ");

    let wrong = 0;
    let correct = 0;

    monsterarray.forEach(element => {
        if (randommonsterarray.includes(element)) {
            correct += 1;
        } else {
            wrong += 1;
        }
    });

    if (correct === randommonsterarray.length && wrong == 0) {
        return "green";
    } else if (correct == 0 && wrong > 0) {
        return "red";
    } else {
        return "yellow"
    }

}
// Function that is called when a monster is pressed, it compares the monster with the random monster and shows the results in the results.
//
// @param {Object} monster is the monster that was pressed.
window.monsterPressed = function (monster) {
    let bottomBorder = "";
    const monsterguess = monsters.filter((monsterguess) => monsterguess.name === monster);
    guessedMonsters.push(monsterguess[0]);
    const monsterMatch = monsterguess[0];
    const compareResults = compareMonster(monsterMatch);

    attempts++;

    if (filterEnabled) {
        disableFilter()
    }

    if (attempts >= 5) {
        enableResetButton();
    }

    guessDivBackground.style.visibility = "visible";
    searchbar.removeResults();
    searchbar.searchBar.value = "";

    if (compareResults.every((result) => result.includes("green")) && monsterMatch != randomMonster) {
        bottomBorder = "yellow-border";
    } else if (monsterMatch === randomMonster) {
        victoryScreen(monsterMatch, backgroundColor);
    }

    const guessElement = document.createElement("div");
    guessElement.setAttribute("class",
        "guesses");
    guessElement.innerHTML = `
        <div class="guess-image">
            <img src="/images/icons/${monster.replace(/ /g, '_')}_Icon.webp" alt="Monster Image" onerror="this.onerror=null; this.src='/images/icons/Default_${monsterMatch.generations}_Icon.webp';"  />
        </div>

        <div>
            <h3 class="bold ${bottomBorder}">${monsterMatch.name}</h3>
            <div>
                <span class="hints bg-${compareResults[0]} bold">Gen ${monsterMatch.generations}</span>
                <span class="hints bg-${compareResults[1]} bold">${monsterMatch.class}</span>
                <span class="hints bg-${compareResults[2]} bold">${monsterMatch.species}</span>
                <span class="hints bg-${compareResults[3]} bold">${monsterMatch.element}</span>
                <span class="hints bg-${compareResults[4]} bold">${monsterMatch.ailment}</span>
            </div>
        </div>
    `
    guessDiv.prepend(guessElement);

    attemptsElement.innerHTML = `Attempts: ${attempts}`

}

// Function that creates the victory screen with the monster that was guessed correctly (Also creates when you give up).
//
// @param {Object} monster is the monster that was guessed correctly or the random monster when you give up.
//
// @param {string} backgroundColor is the color of the bar at the bottom of the victory screen, it is green when you guessed correctly and red when you give up.
//
// @param {boolean} gaveUp is whether the player gave up or not, it is used to update the stats with a loss when the player gives up. Is False by default.
function victoryScreen(monster, backgroundColor, gaveUp = false) {
    searchbar.searchBar.disabled = true;

    resetButton.classList.remove("reset-button-disabled");
    resetButton.classList.remove("bg-red");
    resetButton.classList.add("reset-button-enabled");
    resetButton.classList.add("bg-green")
    resetButton.setAttribute("onclick", "resetGame()");
    resetButton.innerHTML = "Play Again";

    victoryDiv = document.createElement("div");

    victoryDiv.setAttribute("class",
        "victory-screen"
    );

    victoryDiv.innerHTML = `
        <div class="victory-screen-div">
            <div class="victory-screen-content">
                <h1 class="victory-screen-text">And the monster was...</h1>
                <img src="/images/renders/${monster.name.replace(/ /g, '_')}_Render.webp" onerror="this.onerror=null; this.src='/images/renders/default.webp';"></img>
                <h2 class="victory-screen-text">${monster.name}</h2>
                <h3 class="victory-screen-text">${monster.class}</h3>
            </div>
            <div class="victory-screen-buttons">
                <button onclick="resetGame()" class="bg-green" id="retryButton">Retry</button>
                <button onclick="removeVictoryScreen()" id="showResultsButton">Show Results</button>
            </div>
            <div class="victory-screen-bar bg-${backgroundColor}"></div>
        </div>
    `

    mainscreen.appendChild(victoryDiv);
    enableFilter();

    

    insertStats(attempts, gaveUp, monster.name, guessedMonsters);
}

// Function that removes the victory screen.	
window.removeVictoryScreen = function () {
    if (victoryDiv) {
        victoryDiv.remove();
    }
}

// Function that updates the statistics in the database with the number of attempts and whether the player gave up or not.
//
// @param {int} attempts is the number of attempts it took to guess the monster.
//
// @param {boolean} gaveUp is whether the player gave up or not, it is used to update the stats with a loss when the player gives up.
// @param {string} monsterName is the name of the monster for which to update stats.
async function insertStats(attempts, gaveUp, monsterName, guessedMonsters) {
    console.log("Updating stats with attempts: " + attempts);
    try {
        await updateStats(attempts, gaveUp);
        console.log("Stats updated successfully");
    } catch (error) {
        console.error("Error updating stats:", error);
    }

    try {        
        await updateGames(monsterName, attempts, gaveUp);
        console.log("Games updated successfully");
    } catch (error) {
        console.error("Error updating games:", error);
    }

    try {
        console.log("Updating monsters guessed with: ", guessedMonsters);
        await updateMonsters(guessedMonsters);
    } catch (error) {
        console.error("Error updating monsters guessed:", error);
    }
}

// \/ Everything under this line deals with the filter \/

async function createFilter() {
    // Imports the FilterContainerClass from the class.js file and creates a new instance of it.
    filterclass = new FilterContainerClass(monsters);
    await filterclass.init()

    filterContainer = filterclass.buildContainer();
    body.appendChild(filterContainer);
    filterContainer.style.visibility = "hidden"
    filterclass.monsters = filterclass.checkFilteredMonsters(filterclass.originalMonsters)
}

window.instanceFilterMenu = function () {
    filterContainer.style.visibility = "visible";
    filterButton.setAttribute("onclick", "closeFilter()")
}

window.closeFilter = function () {
    filterContainer.style.visibility = "hidden";
    filterButton.setAttribute("onclick", "instanceFilterMenu()")
}

 window.saveChanges = function () {
    filterclass.checkFilteredMonsters(monsters); // updates this.monsters to filtered
    filterclass.saveFilterState().then(() => {
        resetGame();
        filterclass.disableSaveButton();
    });
}

window.resetFilter = function () {
    filterclass.resetFilter();
}

function disableFilter() {
    closeFilter()
    filterEnabled = false
    const tooltip = document.createElement("div");
    tooltip.innerHTML = `                
                <div id="tooltip" class="tooltip" role="tooltip">
                    <span class="tooltip-text">Filter is disabled once a game starts.</span>
                </div>`
    filterDiv.appendChild(tooltip);

    filterButton.setAttribute("onclick", "");
}

function enableFilter() {
    filterEnabled = true
    const tooltip = document.getElementById("tooltip");
    tooltip.remove()

    filterButton.setAttribute("onclick", "instanceFilterMenu()")
}