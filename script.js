let randomMonster;
let monster = "";
let monsters = [];
let result = "";

const attachDiv = document.getElementById("result");
const searchbarDiv = document.getElementById("search-bar-div");
let searchBar = document.getElementById("search-bar");

const guessDiv = document.getElementById("guesses");

removeResults()

searchBar.addEventListener("input", updateValue);

fetch("../data/monsters.json")

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

function updateValue(e) {
    result = e.target.value.toLowerCase();
    console.log(result);
    searchbarDiv.appendChild(attachDiv);
    attachDiv.innerHTML = "";
    const monsterresult = monsters
    .filter((monster) => monster.name.toLowerCase().includes(result))
    .slice(0, 5);
    if (monsterresult.length > 0) {
        monsterresult.forEach(monster => {
            createElement(monster);
            console.log(monster);
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

function monsterPressed(monster) {
    console.log(monster);
    let monsterguess = monsters.filter((monsterguess) => monsterguess.name === monster)
    console.log(monsterguess);
    removeResults()
    searchBar.value = ""

    let monsterMatch = monsterguess[0];

    const guessElement = document.createElement("div");


    guessElement.innerHTML = `
        <div class="w-20 h-20">
            <img src="/Images/Icons/${monster.replace(/ /g, '_')}_Icon.webp" alt="Monster Image" class="object-contain rounded-full" onerror="this.onerror=null; this.src='/Images/Icons/Default_${monsterMatch.generations}_Icon.webp';"  />
        </div>

        <div>
            <h3 class="text-2xl font-bold">${monsterMatch.name}</h3>
            <div class="flex items-center space-x-2 mt-2">
                <span class="px-3 py-1 bg-green-500 rounded-full text-sm font-bold">Gen ${monsterMatch.generations}</span>
                <span class="px-3 py-1 bg-red-500 rounded-full text-sm font-bold">${monsterMatch.class}</span>
                <span class="px-3 py-1 bg-gray-500 rounded-full text-sm font-bold">Large</span>
            </div>
        </div>
    `
    guessDiv.appendChild(guessElement);
    
}