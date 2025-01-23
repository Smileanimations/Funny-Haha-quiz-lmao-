let randomMonster;
let monster = "";
let monsters = [];
let result = "";
let attempts = 0;
let victoryDiv;
let backgroundColor = "green";
let resetvalue = true;

const mainscreen = document.getElementById("mainscreen");

const attachDiv = document.getElementById("result");
const searchbarDiv = document.getElementById("search-bar-div");
let searchBar = document.getElementById("search-bar");

let resetbutton = document.getElementById("resetbutton");

let guessDiv = document.getElementById("guesses");
const guessDivBackground = document.getElementById("guessbackground")
let attemptsElement = document.getElementById("attempts");

guessDivBackground.style.visibility = "hidden";
removeResults()

searchBar.addEventListener("input", updateValue);

fetch("./Data/monsters.json")

.then(response => {
    if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    monsters = data.monsters;
    console.log(monsters);
    console.log(getRandomMonster(monsters));
})
.catch(error => {
    console.error("Error fetching the JSON file:", error);
});

function getRandomMonster(monsters) {
    randomMonster = Math.floor(Math.random() * monsters.length);
    return monsters[randomMonster];
}

function resetGame() {
    resetbutton.setAttribute("class", "bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600");
    resetbutton.setAttribute("onclick", "giveUp()");
    resetbutton.innerHTML = "Give Up";

    backgroundColor = "green";
    guessDiv.innerHTML = '';
    guessDivBackground.style.visibility = "hidden";
    getRandomMonster(monsters);
    removevictoryScreen(resetvalue);
    searchBar.disabled = false;
    attempts = 0;
    attemptsElement.innerHTML = 'Attempts:'
}

function giveUp() {
    backgroundColor = "red";
    victoryScreen(monsters[randomMonster], backgroundColor);

}

function updateValue(e) {
    result = e.target.value.toLowerCase();
    searchbarDiv.appendChild(attachDiv);
    attachDiv.innerHTML = "";
    const monsterresult = monsters
    .filter((monster) => monster.name.toLowerCase().includes(result))
    .slice(0, 5);
    if (monsterresult.length > 0) {
        monsterresult.forEach(monster => {
            createElement(monster);
        });
    } else {
        shownotFound();
    }
}

function removeResults() {
    attachDiv.remove();
}

function shownotFound() {
    attachDiv.innerHTML = `
    <div class="not-found">No Results</div>`
}

function createElement(monster) {
    const newDiv = document.createElement("div");
    newDiv.setAttribute("class", "result-div");
    newDiv.innerHTML = `
        <button class="results" onclick="monsterPressed('${monster.name}')">
            <span class="result-text">${monster.name}</span>
            <img
                class="result-image" 
                src="/Images/Icons/${monster.name.replace(/ /g, '_')}_Icon.webp" 
                alt="${monster.name}" 
                onerror="this.onerror=null; this.src='/Images/Icons/Default_${monster.generations}_Icon.webp';" 
            />
        </button>
    `       
    attachDiv.appendChild(newDiv);

    if (result == "") {
        newDiv.remove();
        removeResults();
    }
}

function compareMonster(monster) {
    let colors = [];

    console.log(monster);
    console.log(monsters[randomMonster]);



    if (monster.generations == monsters[randomMonster].generations) {
        colors.push("green");
    } else {
        colors.push("red");
    }

    if (monster.class == monsters[randomMonster].class) {
        colors.push("green");
    } else {
        colors.push("red");
    }

    if (monster.species == monsters[randomMonster].species) {
        colors.push("green");
    } else {
        colors.push("red");
    }

    colors.push(compareElement(monster.element, monsters[randomMonster].element));
    colors.push(compareElement(monster.ailment, monsters[randomMonster].ailment))
    return colors;
}

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

function monsterPressed(monster) {
    attempts++;
    guessDivBackground.style.visibility = "visible";
    let bottomBorder = "";
    let monsterguess = monsters.filter((monsterguess) => monsterguess.name === monster);
    removeResults();
    searchBar.value = "";

    let monsterMatch = monsterguess[0];
    let compareResults = compareMonster(monsterMatch);

    if (compareResults.every((result) => result.includes("green")) && monsterMatch != monsters[randomMonster]) {
        bottomBorder = "border-b-4 border-yellow-500"
    } else if (monsterMatch === monsters[randomMonster]) {
        victoryScreen(monsterMatch, backgroundColor);
    }

    console.log(compareResults);

    const guessElement = document.createElement("div");
    guessElement.setAttribute("class",
        "flex items-center bg-gray-600 p-4 rounded-lg w-full");
    guessElement.innerHTML = `
        <div class="w-20 h-20 object-cover">
            <img src="/Images/Icons/${monster.replace(/ /g, '_')}_Icon.webp" alt="Monster Image" class="object-contain rounded-full" onerror="this.onerror=null; this.src='/Images/Icons/Default_${monsterMatch.generations}_Icon.webp';"  />
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

function victoryScreen(monster, backgroundColor) {
    searchBar.disabled = true;

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
                <img class="size-44 mt-12" src="/Images/Icons/${monster.name.replace(/ /g, '_')}_Icon.webp" onerror="this.onerror=null; this.src='/Images/Icons/Default_${monster.generations}_Icon.webp';"></img>
                <h2 class="text-4xl font-medium antialiased text-black py-4">${monster.name}</h2>
                <h3 class="text-2xl font medium antialiased text-black py-2">${monster.class}</h2>
            </div>
            <div class="absolute inset-x-0 bottom-20 flex justify-around items-center h-16">
                <button onclick="resetGame()" class="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600" id="retryButton">Retry</button>
                <button onclick="removevictoryScreen(resetvalue)" class="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600" id="showResultsButton">Show Results</button>
            </div>
            <div class="absolute inset-x-0 bottom-0 h-20 bg-${backgroundColor}-500 rounded-b-3xl">
            </div>
        </div>
    `

    mainscreen.appendChild(victoryDiv);
}

function removevictoryScreen(resetvalue) {
    victoryDiv.remove();
}