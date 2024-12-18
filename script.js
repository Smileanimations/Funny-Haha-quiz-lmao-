let randomMonster;
let monster = "";
let monsters = [];
let result = "";

const attachDiv = document.getElementById("result");
const searchbarDiv = document.getElementById("search-bar-div");
let searchBar = document.getElementById("search-bar");
console.log(searchBar);

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

function shownotFound() {
    attachDiv.innerHTML = `
    <div class="not-found">No Results</div>`
}

function createElement(monster) {
    const newDiv = document.createElement("div");
    newDiv.setAttribute("class", "result-div");
    newDiv.innerHTML = `
        <button class="results">
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
        attachDiv.remove();
    } else if (result === null){
        attachDiv.remove();
    }
}