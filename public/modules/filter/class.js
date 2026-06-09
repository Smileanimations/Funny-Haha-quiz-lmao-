import { updateFilteredMonsters, loadFilteredMonsters } from "/models/filterModel.js";

export class FilterContainerClass {

    
    constructor(monsters) {
        this.originalMonsters = monsters;
        this.filterContainer;
        this.itemlist;
        this.monsterCategories = [];
        this.checkboxes = new Map();
        this.values = [];

        this.originalMonsters.forEach((monster) => {
            Object.keys(monster).forEach(key => {
                if (!this.monsterCategories.includes(key)) {
                    this.monsterCategories.push(key);
                }
            })
        })
    }

    async init() {
        const loaded = await this.loadSavedState();
        if (loaded && loaded.filtered_monsters) {
            this.savedFilterState = loaded.filtered_monsters;
        }
        this.monsters = this.originalMonsters;
    }

    async loadSavedState() {
        const filterState = await loadFilteredMonsters();
        if (filterState) {
            return filterState;
        } else {
            return null;
        }
    }

    async saveFilterState() {
        const filterState = {};
        this.checkboxes.forEach((checkbox, key) => {
            filterState[key] = checkbox.checked;
        });
        await updateFilteredMonsters(filterState);
    }

    // Method to build the filter container
    buildContainer() {
        this.filterContainer = document.createElement("div");
        this.filterContainer.setAttribute("class", "fixed bg-white inset-y-0 flex items-start h-screen w-1/3 z-20 overflow-auto");
        this.filterContainer.innerHTML = `
            <div class="p-6 rounded-lg h-full w-full">
                <h2 class="text-2xl font-bold mb-4">Filter Options</h2>
                <div id="filteritems"></div>
                <div id="buttons">
                    <button onclick="closeFilter()" class="mt-4 border-2 border-red-500 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Close</button>
                    <button onclick="resetFilter()" class="mt-4 border-2 border-gray-500 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Reset Filter</button>
                    <button onclick="saveChanges()" class="mt-4 text-black border-2 border-green-500 px-4 py-2 rounded" id="savebutton" disabled>Save Changes</button>
                </div>
            </div> 
        `;

        console.log("Filter Container Created");
        this.setFilter(this.originalMonsters, this.monsterCategories);

        this.filterContainer.addEventListener('change', (event) => {
            if (event.target.type === 'checkbox') {
                this.handleCheckboxChange(event.target);
            }
        });

        this.setCheckboxes();

        return this.filterContainer;
    }

    // Method to enable the save button
    enableSaveButton() {
        const savebutton = document.getElementById("savebutton")
        savebutton.setAttribute("class", "mt-4 border-2 border-green-500 text-white bg-green-500 px-4 py-2 rounded hover:bg-green-600")
        savebutton.disabled = false
    }

    // Method to disable the save button
    disableSaveButton() {
        const savebutton = document.getElementById("savebutton")
        savebutton.setAttribute("class", "mt-4 text-black border-2 border-green-500 px-4 py-2 rounded")
        savebutton.disabled = true
    }

    resetFilter() {
        this.checkboxes.forEach(checkbox => {
            checkbox.value = true
            checkbox.checked = true
        })
        this.enableSaveButton()
    }

    // Method to handle checkbox changes
    // 
    // @param {HTMLInputElement} checkbox is the checkbox that was pressed
    handleCheckboxChange(checkbox) {
        if (this.values.includes(checkbox)) {
            const existingCheckbox = this.values.find(cb => cb.name === checkbox.name);
            if (existingCheckbox) {
                existingCheckbox.value = checkbox.checked;
            }
        } else {
            checkbox.value = checkbox.checked;
            this.values.push(checkbox)
        }
        this.enableSaveButton()
    }

    setCheckboxes() {
        if (this.savedFilterState) {
            this.checkboxes.forEach((checkbox, key) => {
                if (this.savedFilterState[key] !== undefined) {
                    checkbox.checked = this.savedFilterState[key];
                    checkbox.value = this.savedFilterState[key];
                    if (!this.savedFilterState[key]) {
                        this.values.push(checkbox); // so filterMonsters knows what's unchecked
                    }
                }
            });
        } else {
            this.checkboxes.forEach((checkbox) => {
                checkbox.checked = true;
                checkbox.value = true;
            })
        }
    }

    getCategoryItems(monsters, category) {
        let maxItems = []
        monsters.forEach(monster => {
            const items = monster[category].toString().split(", ")
            items.forEach(item => {
                if (!maxItems.includes(item)) {
                    maxItems.push(item);
                }
            });
        });
        return maxItems;
    }

    // Method that filters the monsters after options have changed
    //
    // @param {Array} monsters are all the monsters in the json file
    filterMonsters(monsters) {
        let removedmonsters = []
        let filteredmonsters = []
        this.values.forEach(checkbox => {
            monsters.forEach(monster => {
                Object.keys(monster).forEach(category => {
                    if (category !== 'id' && category !== 'name'){
                        if (checkbox.checked == false) {
                            if (monster[category].toString().split(", ").includes(checkbox.name)) {
                                if (!removedmonsters.includes(monster)) {
                                    removedmonsters.push(monster)
                                }
                            }
                        }
                    }
                })
            })
        })
        filteredmonsters = monsters.filter(monster => !removedmonsters.includes(monster));
        return filteredmonsters
    }

    // Method to check if the filtered monsters are more than 0, if not it will show an error message and return the original monsters
    //
    // @monsters are all the monsters in the json file
    checkFilteredMonsters(monsters) {
        let filteredmonsters = this.filterMonsters(monsters);
        if (filteredmonsters.length > 0) {
            this.monsters = filteredmonsters
            if (document.getElementById("buttons").querySelector("p")) {
                document.getElementById("buttons").querySelector("p").remove()
            }
            return filteredmonsters
        } else {
            if (document.getElementById("buttons").querySelector("p")) {
                document.getElementById("buttons").querySelector("p").remove()
            }
            const error = document.createElement("p");
            error.setAttribute("class", "text-red-500");
            error.innerHTML = "No monsters found with the selected filters";
            const placement = document.getElementById("buttons");
            placement.appendChild(error);
            return this.originalMonsters
        }
    }

    // Method that creates all the checkboxes based on the categories in the json file
    //
    // @param {Array} monsters are all the monsters in the json file
    // @param {Array} categories are all the monster categories than can be filtered
    setFilter(monsters, categories) {
        categories.forEach(category => {
            if (category !== 'id' && category !== 'name') {
                const itemlist = this.filterContainer.querySelector("#filteritems");
                const maxItems = this.getCategoryItems(monsters, category); 

                if (itemlist) {
                    this.keyFilter = document.createElement("div");
                    this.keyFilter.setAttribute("id", "ailment-filter")
                    this.keyFilter.setAttribute("class", "py-6 ")
                    this.keyFilter.innerHTML = `
                    <h3 class="text-lg font-semibold">${category.charAt(0).toUpperCase()}${category.slice(1)}:</h3>
                    <div class="grid grid-cols-4" id="grid"></div>
                    `
                    maxItems.forEach(item => {
                        let keyitem = document.createElement("div")
                        keyitem.setAttribute("class", "flex items-center")
                        keyitem.innerHTML = ` 
                        <input type="checkbox" class="flex mr-2" id="${item}" name="${item}" value="${item}">
                        <label for="${item}">${item}</label>
                        `;
                        this.keyFilter.querySelector("#grid").appendChild(keyitem);
                        this.checkboxes.set(item, keyitem.querySelector('input'));
                    });
                    itemlist.appendChild(this.keyFilter);
                }
            }
        })
    }
}