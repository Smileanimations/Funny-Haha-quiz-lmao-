import {searchBarClass} from '../Data/class.js';

let searchBar;
let generationArray = [];
let monsters = [];
let correctguessed = [0, 0, 0, 0, 0];
let guessedMonstrs = [];

let monstercount = document.getElementById("monstercount");
let generation = document.getElementById("generation");

let griddiv = document.getElementById("grid");

fetch("../Data/monsters.json")
.then(response => {
    if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    monsters = data.monsters;
    console.log(monsters);

    const searchbarDiv = document.getElementById('search-bar-div');
    const attachDiv = document.getElementById('result');
    searchBar = new searchBarClass(document.getElementById('search-bar'), searchbarDiv, attachDiv, monsters);

    setgenerationDisplay(generation, generationArray, monstercount);
})
.catch(error => {
    console.error("Error fetching the JSON file:", error);
});

function getMonsterCount(monsters, generation) {
    const filteredmonster = monsters.filter(monster => monster.generations === generation);
    return filteredmonster.length;
}


function setgenerationDisplay(generation, generationArray, monstercount) {
    for (let i = 1; i <= 5; i++) {
        
        let currentgen = document.createElement('th');
        currentgen.setAttribute('class', 'bg-gray-700 border border-gray-600');
        currentgen.innerHTML = `${i}`;
        
        generation.appendChild(currentgen);

        generationArray.push(getMonsterCount(monsters, i));

        let generationcount = document.createElement('td');
        generationcount.setAttribute('class', 'bg-gray-700 border border-gray-600 text-white px-4 py-2');
        generationcount.innerHTML = `${correctguessed[i - 1]}/${generationArray[i - 1]}`;

        monstercount.appendChild(generationcount);
    }
    console.log(generationArray);
}

function updategenerationDisplay() {

    while (monstercount.firstChild) {
        monstercount.removeChild(monstercount.firstChild);
    }

    for (let i = 1; i <= 5; i++) {
        let generationcount = document.createElement('td');
        generationcount.setAttribute('class', 'bg-gray-700 border border-gray-600 text-white px-4 py-2');
        generationcount.innerHTML = `${correctguessed[i - 1]}/${generationArray[i - 1]}`;
        monstercount.appendChild(generationcount);
    }
    console.log(correctguessed);
}

window.monsterPressed = function(monster) {
    if (guessedMonstrs.includes(monster)) {
        return;
    } else {
        guessedMonstrs.push(monster);
        correctguessed[monsters.find(mon => mon.name === monster).generations - 1]++;
        updategenerationDisplay();
    }
    searchBar.searchBar.value = "";
    searchBar.removeResults();

    createGuessedMonsters(monster);
}

function createGuessedMonsters(monster) {
    let pickedMonster = monsters.find(mon => mon.name === monster);
    let guessdiv = document.createElement('div');
    guessdiv.setAttribute('class', 'grid grid-row text-center bg-gray-600 p-6 rounded-lg w-full');
    guessdiv.innerHTML = `
        <img src = "../Images/Icons/${monster.replace(/ /g, '_')}_Icon.webp" alt ="${monster}" class="w-24 h-24">
        <h1 class = "text-white text-2xl">${monster}</h1>
        <h3 class = "text-white text-xl">Gen ${pickedMonster.generations}</h3>
    `;
    griddiv.appendChild(guessdiv);
}