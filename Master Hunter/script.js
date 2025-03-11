import {searchBarClass} from '../Data/class.js';

let searchBar;
let generationArray = [];
let classarray = [];
let monsters = [];
let correctguessed = [];
let guessedMonstrs = [];
let chosenCategory = generationArray;
let sortnumber = 0;

let monstercount = document.getElementById("monstercount");
let table = document.getElementById("table");
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
    getGenerationsCount(monsters);
    getMonsterClasses(monsters);
    setTableDisplay(table, chosenCategory, monstercount);
})
.catch(error => {
    console.error("Error fetching the JSON file:", error);
});

function getGenerationsCount(monsters) {
    let maxGenerations = Math.max(
        ...monsters
            .map(monster => monster.generations)
    );
    console.log(maxGenerations)

    for (let i = 1; i <= maxGenerations; i++) {
        generationArray.push(monsters.filter(monster => monster.generations === i).length);
    }
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

function setCorrectGuessed(typeArray) {
    correctguessed = [];
    typeArray.forEach(element => {
        correctguessed.push(0);
    });
    console.log(correctguessed);
}

function setTableHeader(element, typeArray) {
    if (!Number(element)) {
        return element;
    } else {
        return `${typeArray.indexOf(element) + 1}`;
    }
}

function setTableData(element, typeArray) {
    if (!Number(element)) {
        return `${classarray[element]}`;
    } else {
        return `${generationArray[typeArray.indexOf(element)]}`;
    }
}

function setTableDisplay(table, typeArray, monstercount) {
    setCorrectGuessed(typeArray);
    typeArray.forEach(element => {
        let currenttype = document.createElement('th');
        currenttype.setAttribute('class', 'bg-gray-700 border border-gray-600 w-28 px-2 py-2');
        currenttype.innerHTML = `${setTableHeader(element, typeArray)}`;
        
        table.appendChild(currenttype);

        let typecount = document.createElement('td');
        typecount.setAttribute('class', 'bg-gray-700 border border-gray-600 text-white px-4 py-2');
        typecount.innerHTML = `${correctguessed[typeArray.indexOf(element)]} / ${setTableData(element, typeArray)}`;

        monstercount.appendChild(typecount);
    })
}

function updateTableDisplay(typeArray) {
    while (monstercount.firstChild) {
        monstercount.removeChild(monstercount.firstChild);
        table.removeChild(table.firstChild);
    }

    typeArray.forEach(element => {
        let tabledata = document.createElement('td');

        let currenttype = document.createElement('th');
        currenttype.setAttribute('class', 'bg-gray-700 border border-gray-600 w-28 px-2 py-2');
        currenttype.innerHTML = `${setTableHeader(element, typeArray)}`;
        table.appendChild(currenttype);

        if (correctguessed[typeArray.indexOf(element)] == setTableData(element, typeArray)) {
            tabledata.setAttribute('class', 'bg-green-500 border border-green-700 text-white px-4 py-2');
            tabledata.innerHTML = `${correctguessed[typeArray.indexOf(element)]} / ${setTableData(element, typeArray)}`;
            monstercount.appendChild(tabledata);
        } else {
            tabledata.setAttribute('class', 'bg-gray-700 border border-gray-600 text-white px-4 py-2');
            tabledata.innerHTML = `${correctguessed[typeArray.indexOf(element)]} / ${setTableData(element, typeArray)}`;
            monstercount.appendChild(tabledata);
        }
    })

    console.log(correctguessed);
}

window.monsterPressed = function(monster) {
    if (guessedMonstrs.includes(monsters.find(mon => mon.name === monster))) {
        console.log(`Already Guessed ${monster}`);	
        return;
    } else {
        guessedMonstrs.push(monsters.find(mon => mon.name === monster));
        correctguessed[updateCorrectguessScore(monster, chosenCategory)]++;
        console.log(correctguessed);
        updateTableDisplay(chosenCategory);
    }
    searchBar.searchBar.value = "";
    searchBar.removeResults();

    createGuessedMonsters(monster);
}

function createGuessedMonsters(monster) {
    let pickedMonster = monsters.find(mon => mon.name === monster);
    let monsterguess = document.createElement('div');
    monsterguess.setAttribute('class', 'flex flex-col place-items-center text-center bg-gray-600 rounded-lg w-40 h-48');
    monsterguess.innerHTML = `
        <img src = "../Images/Icons/${monster.replace(/ /g, '_')}_Icon.webp" alt ="${monster}" class="w-20 h-20 p-1" onerror="this.onerror=null; this.src='../Images/Icons/Default_${pickedMonster.generations}_Icon.webp';" />
        <div class="pt-1">
            <p class="text-gray-300 text-sm">Gen ${pickedMonster.generations}</p>
        </div>
        <div class="text-white pt-1">
            <h2 class = "text-lg">${monster}</h2>
            <p class="text-base">${pickedMonster.class}</p>
        </div>
    `;
    griddiv.appendChild(monsterguess);
}

function updateCorrectguessScore(monster, typeArray) {
    let chosenMonster = monsters.find(mon => mon.name === monster);
    if (!chosenMonster) {
        console.error(`Monster not found: ${monster}`);
        return -1;
    }

    if (typeArray == classarray) { 
        return typeArray.indexOf(chosenMonster.class);
    } else {
        console.log(chosenMonster.generations);
        return chosenMonster.generations - 1;
    }
}

window.toggleGameMode = function() {
    if (chosenCategory == classarray) {
        chosenCategory = generationArray;
    } else {
        chosenCategory = classarray;
    }

    setCorrectGuessed(chosenCategory);

    guessedMonstrs.forEach(monster => {
        correctguessed[updateCorrectguessScore(monster.name, chosenCategory)]++;
    });
    
    updateTableDisplay(chosenCategory);
}

window.sortArray = function() {
    switch (sortnumber) {
        case 1:
            guessedMonstrs.sort((a, b) => a.name.localeCompare(b.name));
            guessedMonstrs.sort((a, b) => a.class.localeCompare(b.class));
            break;
        case 2:
            guessedMonstrs.sort((a, b) => a.name.localeCompare(b.name));
            guessedMonstrs.sort((a, b) => a.generations - b.generations);
            break;
        default:
            guessedMonstrs.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    console.log(sortnumber);

    guessedMonstrs.sort();
    while (griddiv.firstChild) {
        griddiv.removeChild(griddiv.firstChild);
    }

    guessedMonstrs.forEach(monster => {
        createGuessedMonsters(monster.name);
    });

    if (sortnumber >= 2) {
        sortnumber = 0;
    } else {
        sortnumber++;
    }
}

window.fillresults = function() {
    for (let i = 0; i < 200; i++) {
        let randomMonster = monsters[Math.floor(Math.random() * monsters.length)];
        monsterPressed(randomMonster.name);
    }
}