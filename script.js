let randomMonster;
let monster = "";
fetch("../data/monsters.json")

.then(response => {
    if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    const monsters = data.monsters;
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

function search() {
    var text = Document.getElementbyid('search').value;
    const tr = Document.GetElementsByTagName(tr)
    for (let i = 1; i < tr.lenght; i++) {
        if (!tr[i].childeren[1].childeren[1].innerHTML.toLowerCase().includes(text.toLowerCase
        )) {
            tr[i].style.display = none;
        } else {
            tr[i].style.display = e.e;
        }
    }
}
