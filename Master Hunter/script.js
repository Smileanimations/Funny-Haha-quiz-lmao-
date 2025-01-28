import {searchBarClass} from '../Data/class.js';

let searchBar
let monster = "";
let monsters = [];
let result = "";

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
})
.catch(error => {
    console.error("Error fetching the JSON file:", error);
});
