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

    removeResults() {
        this.attachDiv.remove();
    }

    shownotFound() {
        this.attachDiv.innerHTML = `
        <div class="text-black w-80">No Results</div>`
    }

    createElement(monster) {
        const newDiv = document.createElement("Button");
        newDiv.setAttribute('onclick', `monsterPressed('${monster.name}')`)
        newDiv.setAttribute("class", "flex py-4 hover:bg-gray-300 hover:rounded-lg w-80");
        newDiv.innerHTML = `
            <img
                class="max-w-[55px] max-h-[55px] float-left" 
                src="/Images/Icons/${monster.name.replace(/ /g, '_')}_Icon.webp" 
                alt="${monster.name}" 
                onerror="this.onerror=null; this.src='/Images/Icons/Default_${monster.generations}_Icon.webp';" 
            />
            <span class="text-black pl-4">${monster.name}</span>

        `        
        this.attachDiv.appendChild(newDiv);
    
        if (this.result == "") {
            newDiv.remove();
            this.removeResults();
        }
    }
}