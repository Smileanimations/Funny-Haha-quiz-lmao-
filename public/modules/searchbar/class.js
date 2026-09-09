export class searchBarClass {
    constructor(searchBar, searchbarDiv, attachDiv, monsters) {
        this.searchbarDiv = searchbarDiv;
        this.searchBar = searchBar;
        this.attachDiv = attachDiv;
        
        this.updateValue = this.updateValue.bind(this);
        this.searchBar.addEventListener("input", this.updateValue);

        this.monsters = monsters;
        this.removeResults();
    }

    updateMonsters(monsters) {
        this.monsters = monsters;
    }

    // Method to update the search results based on the input value
    // 
    // @e is the character that is typed in the search bar
    updateValue(e) {
        this.result = e.target.value.toLowerCase();
        this.searchbarDiv.appendChild(this.attachDiv);
        this.attachDiv.innerHTML = "";
        const monsterresult = this.monsters
        .filter((monster) => monster.name.toLowerCase().includes(this.result))
        .slice(0, 5);
        if (monsterresult.length > 0) {
            monsterresult.forEach(monster => {
                this.createElement(monster);
            });
        } else {
            this.shownotFound();
        }
    }

    // Method to remove the search results
    removeResults() {
        this.attachDiv.remove();
    }

    // Method to show a message when no results are found
    shownotFound() {
        this.attachDiv.innerHTML = `
        <div class="result">No Results</div>`
    }

    // Method that creates a button for each monster that is found in the search results, it also adds an event listener to each button that will call the monsterPressed function when clicked
    //
    // @param {Object} monster is the monster that is found in the search results
    createElement(monster) {
        const newDiv = document.createElement("Button");
        newDiv.setAttribute('onclick', `monsterPressed('${monster.name}')`)
        newDiv.setAttribute("class", "result");
        newDiv.innerHTML = `
            <img
                src="/images/icons/${monster.name.replace(/ /g, '_')}_Icon.webp" 
                alt="${monster.name}" 
                onerror="this.onerror=null; this.src='/images/icons/Default_${monster.generations}_Icon.webp';" 
            />
            <span>${monster.name}</span>

        `        
        this.attachDiv.appendChild(newDiv);
    
        if (this.result == "") {
            newDiv.remove();
            this.removeResults();
        }
    }
}