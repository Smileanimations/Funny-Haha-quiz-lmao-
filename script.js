import { searchBarClass } from "./Modules/Search Bar/class.js";
import { FilterContainerClass } from "./Modules/Filter/class.js";

let searchbar;
let filterclass;
let filterContainer;
let randomMonster;
let monsters = [];
let attempts = 0;
let victoryDiv;
let backgroundColor = "green";

const body = document.getElementById("body");
const mainscreen = document.getElementById("mainscreen");

let attachDiv;
let searchbarDiv;

let resetbutton = document.getElementById("resetbutton");

let guessDiv = document.getElementById("guesses");
const guessDivBackground = document.getElementById("guessbackground")
let attemptsElement = document.getElementById("attempts");

guessDivBackground.style.visibility = "hidden";

// Fetch the JSON file
fetch("./Data/Frontier/monsters.json")

.then(response => {
    if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    monsters = data.monsters;
    createFilter();
    attachDiv = document.getElementById("result");
    searchbarDiv = document.getElementById("search-bar-div");
    // Imports the searchBarClass from the class.js file and creates a new instance of it.
    searchbar = new searchBarClass(document.getElementById("search-bar"), searchbarDiv, attachDiv, monsters);
    monsters = filterclass.filterMonsters(data.monsters);
    console.log(monsters);
    resetGame(monsters)
})
.catch(error => {
    console.error("Error fetching the JSON file:", error);
});

// Function that gets a random monster from the monsters array.
function getRandomMonster(monsters) {
    let filteredmonsters = filterclass.checkFilteredMonsters(filterclass.filterMonsters(monsters));
    console.log(filteredmonsters);
    randomMonster = filteredmonsters[Math.floor(Math.random() * filteredmonsters.length)];
    console.log(randomMonster);
    return randomMonster;
}

// Function that clears the the search bar and results and pick a new random monster.
window.resetGame = function() {
    resetbutton.setAttribute("class", "bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600");
    resetbutton.setAttribute("onclick", "giveUp()");
    resetbutton.innerHTML = "Give Up";

    backgroundColor = "green";
    guessDiv.innerHTML = '';
    guessDivBackground.style.visibility = "hidden";
    getRandomMonster(monsters);
    removevictoryScreen();
    if (searchbar) {
        searchbar.searchBar.disabled = false;
    }
    attempts = 0;
    attemptsElement.innerHTML = 'Attempts:'
}

// Function that shows the victory screen with a red bar instead of a green one.
window.giveUp = function() {
    backgroundColor = "red";
    victoryScreen(randomMonster, backgroundColor);

}

// Function that compares the monster with the random monster and returns an array with the colors of the results.
function compareMonster(monster) {
    let colors = [];

    console.log(monster);
    console.log(randomMonster);



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
function compareElement(monster, randommonster) {
    let monsterarray = monster.split(", ");
    let randommonsterarray = randommonster.split(", ");

    let wrong = 0;
    let correct = 0;

    console.log(monsterarray);
    console.log(randommonsterarray);

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
window.monsterPressed = function(monster) {
    attempts++;
    guessDivBackground.style.visibility = "visible";
    let bottomBorder = "";
    let monsterguess = monsters.filter((monsterguess) => monsterguess.name === monster);
    searchbar.removeResults();
    searchbar.searchBar.value = "";

    let monsterMatch = monsterguess[0];
    let compareResults = compareMonster(monsterMatch);

    if (compareResults.every((result) => result.includes("green")) && monsterMatch != randomMonster) {
        bottomBorder = "border-b-4 border-yellow-500"
    } else if (monsterMatch === randomMonster) {
        victoryScreen(monsterMatch, backgroundColor);
    }

    console.log(compareResults);

    const guessElement = document.createElement("div");
    guessElement.setAttribute("class",
        "flex items-center bg-gray-600 p-4 rounded-lg w-full");
    guessElement.innerHTML = `
        <div class="w-20 h-20 object-cover">
            <img src="/Images/Icons/${monster.replace(/ /g, '_')}_Icon.webp" alt="Monster Image" class="object-contain rounded-full" onerror="this.onerror=null; this.src='/Images/Icons/Default_${monsterMatch.generations}_Icon.webp';"/>
        </div>

        <div>
            <h3 class="text-2xl font-bold ${bottomBorder}">${monsterMatch.name}</h3>
            <div class="flex items-center space-x-2 mt-2">
                <span class="px-3 py-1 bg-${compareResults[0]}-500 rounded-full text-sm font-bold">Gen ${monsterMatch.generations}</span>
                <span class="px-3 py-1 bg-${compareResults[1]}-500 rounded-full text-sm font-bold">${monsterMatch.class}</span>
                <span class="px-3 py-1 bg-${compareResults[2]}-500 rounded-full text-sm font-bold">${monsterMatch.species}</span>
                <span class="px-3 py-1 bg-${compareResults[3]}-500 rounded-full text-sm font-bold">${monsterMatch.element}</span>
                <span class="px-3 py-1 bg-${compareResults[4]}-500 rounded-full text-sm font-bold">${monsterMatch.ailment}</span>
            </div>
        </div>
    `
    guessDiv.prepend(guessElement);
    
    attemptsElement.innerHTML = `Attempts: ${attempts}`
}

// Function that creates the victory screen with the monster that was guessed correctly (Also creates when you give up).
function victoryScreen(monster, backgroundColor) {
    searchbar.searchBar.disabled = true;

    resetbutton.setAttribute("class", "bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600");
    resetbutton.setAttribute("onclick", "resetGame()");
    resetbutton.innerHTML = "Play Again";

    victoryDiv = document.createElement("div");

    victoryDiv.setAttribute("class", 
        "absolute justify-center items-center"
    )

    victoryDiv.innerHTML = `
        <div class="rounded-3xl bg-white w-[800px] h-[600px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div class="flex flex-col justify-center items-center">
                <h1 class="text-center text-black text-2xl font-medium">And the monster was...</h1>
                <img class="size-64 object-contain mt-12" src="/Images/Renders/${monster.name.replace(/ /g, '_')}_Render.webp" onerror="this.onerror=null; this.src='/Images/Renders/default.webp';"></img>
                <h2 class="text-4xl font-medium antialiased text-black py-4">${monster.name}</h2>
                <h3 class="text-2xl font medium antialiased text-black py-2">${monster.class}</h2>
            </div>
            <div class="absolute inset-x-0 bottom-20 flex justify-around items-center h-16">
                <button onclick="resetGame()" class="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600" id="retryButton">Retry</button>
                <button onclick="removevictoryScreen()" class="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600" id="showResultsButton">Show Results</button>
            </div>
            <div class="absolute inset-x-0 bottom-0 h-20 bg-${backgroundColor}-500 rounded-b-3xl">
            </div>
        </div>
    `

    mainscreen.appendChild(victoryDiv);
}

// Function that removes the victory screen.	
window.removevictoryScreen = function() {
    if (victoryDiv) {
        victoryDiv.remove();
    }
}

// \/ Everything under this line deals with the filter \/

function createFilter() {
    // Imports the FilterContainerClass from the class.js file and creates a new instance of it.
    filterclass = new FilterContainerClass(monsters);
    filterContainer = filterclass.buildContainer();
    body.appendChild(filterContainer);
    filterContainer.style.visibility = "hidden"
}

window.instanceFilterMenu = function() {
    filterContainer.style.visibility = "visible";
}

window.closeFilter = function() {
    filterContainer.style.visibility = "hidden";
}

window.saveChanges = function() {
    resetGame();
    filterclass.disableSaveButton()
}