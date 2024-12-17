let randomMonster;
let monster = "";
let monsters = [];
let result = "";

const attachDiv = document.getElementById("result");
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
    attachDiv.innerHTML = "";
    const monsterresult = monsters
    .filter((monster) => monster.name.toLowerCase().includes(result))
    .slice(0, 5);
    monsterresult.forEach(monster => {
        createElement(monster);
        console.log(monster);
    });
}

function createElement(monster) {
    const newDiv = document.createElement("div");
    newDiv.innerHTML = `
        <button>
            <span>${monster.name}</span>
            <img src="/Images/Icons/${monster.name.replace(/ /g, '_')}_Icon.webp"></img>
        </button>
`       
    attachDiv.appendChild(newDiv);
    if (result == "") {
        newDiv.remove();
    }
}