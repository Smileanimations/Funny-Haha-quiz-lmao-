import {searchBarClass} from '../Data/class.js';

let classdiv;
let searchBar;
let generationArray = [];
let classarray = [];
let classcount = {};
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
    getMonsterClasses(monsters);
    setgenerationDisplay(generation, generationArray, monstercount);
    setclassDisplay(classarray);
})
.catch(error => {
    console.error("Error fetching the JSON file:", error);
});

function getMonsterCount(monsters, generation) {
    const filteredmonster = monsters.filter(monster => monster.generations === generation);
    return filteredmonster.length;
}

function getMonsterClasses(monsters) {
    monsters.forEach(monster => {
        if (!classarray.includes(monster.class)) {
            classarray.push(monster.class)
            classarray[monster.class] = 1;
        } else {
            classarray[monster.class]++;
        }
    });
    classarray.sort();
} 


function setgenerationDisplay(generation, generationArray, monstercount) {
    for (let i = 1; i <= correctguessed.length; i++) {
        
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

function setclassDisplay(classarray) {
    classarray.forEach(monsterclass => {
        classdiv = document.createElement("div");
        classdiv.setAttribute('id', `${monsterclass}`);
        classdiv.setAttribute('class', 'flex flex-row justify-start');
        classdiv.innerHTML = `
            <div class="flex flex-wrap align-end">
                <h1 class="text-xl text-gray-400">${monsterclass} - 0 / ${classarray[monsterclass]}:</h1>
            </div>
            <div id="${monsterclass}-guessdiv" class="flex flex-col"></div>
        `;
        griddiv.appendChild(classdiv);
    });
}

function updategenerationDisplay() {

    while (monstercount.firstChild) {
        monstercount.removeChild(monstercount.firstChild);
    }

    for (let i = 1; i <= 5; i++) {
        if (correctguessed[i - 1] === generationArray[i - 1]) {
            let generationcount = document.createElement('td');
            generationcount.setAttribute('class', 'bg-green-500 border border-green-700 text-white px-4 py-2');
            generationcount.innerHTML = `${correctguessed[i - 1]}/${generationArray[i - 1]}`;
            monstercount.appendChild(generationcount);
        } else {
            let generationcount = document.createElement('td');
            generationcount.setAttribute('class', 'bg-gray-700 border border-gray-600 text-white px-4 py-2');
            generationcount.innerHTML = `${correctguessed[i - 1]}/${generationArray[i - 1]}`;
            monstercount.appendChild(generationcount);
        }
    }

    console.log(correctguessed);
}

window.monsterPressed = function(monster) {
    if (guessedMonstrs.includes(monsters.find(mon => mon.name === monster))) {
        return;
    } else {
        guessedMonstrs.push(monsters.find(mon => mon.name === monster));
        correctguessed[monsters.find(mon => mon.name === monster).generations - 1]++;
        updategenerationDisplay();
    }
    searchBar.searchBar.value = "";
    searchBar.removeResults();

    createGuessedMonsters(monster);
}

function createGuessedMonsters(monster) {
    let pickedMonster = monsters.find(mon => mon.name === monster);
    let monsterguess = document.createElement('div');
    monsterguess.setAttribute('class', 'flex flex-col place-items-center text-center bg-gray-600 rounded-lg w-32 h-40');
    monsterguess.innerHTML = `
        <img src = "../Images/Icons/${monster.replace(/ /g, '_')}_Icon.webp" alt ="${monster}" class="w-20 h-20 p-1" onerror="this.onerror=null; this.src='../Images/Icons/Default_${pickedMonster.generations}_Icon.webp';" />
        <div class="pt-1">
            <p class="text-gray-300 text-sm">Gen ${pickedMonster.generations}</p>
        </div>
        <div class="text-white pt-1">
            <h2 class = "text-base">${monster}</h2>
        </div>
    `;
    document.getElementById(`${pickedMonster.class}-guessdiv`).appendChild(monsterguess);
}