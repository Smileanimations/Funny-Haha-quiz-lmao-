import { updateFilteredState, loadFilteredState } from "/models/filterModel.js";

export class FilterContainerClass {

    // Constructor for the FilterContainerClass
    //
    // @param {Array} monsters are all the monsters in the json file
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

    // Method to initialize the filter container and load saved state
    async init() {
        const loaded = await this.loadSavedState();
        if (loaded && loaded.filtered_monsters) {
            this.savedFilterState = loaded.filtered_monsters;
        }
        this.monsters = this.originalMonsters;
    }

    // Method to load the saved filter state from the model
    async loadSavedState() {
        const filterState = await loadFilteredState();
        if (filterState) {
            return filterState;
        } else {
            return null;
        }
    }

    // Method to save the current filter state to the model
    async saveFilterState() {
        const filterState = {};
        this.checkboxes.forEach((checkbox, key) => {
            filterState[key] = checkbox.checked;
        });
        await updateFilteredState(filterState);
    }

    // Method to build the filter container
    buildContainer() {
        this.filterContainer = document.createElement("div");
        this.filterContainer.setAttribute("class", "filter");
        this.filterContainer.innerHTML = `
            <div class="">
                <h2 class="bold">Filter Options</h2>
                <div id="filteritems" class="filter-items"></div>
                <div id="buttons">
                    <button onclick="closeFilter()" class="close-filter-button">Close</button>
                    <button onclick="resetFilter()" class="reset-filter-button">Reset Filter</button>
                    <button onclick="saveChanges()" class="save-changes-button-disabled" id="savebutton" disabled>Save Changes</button>
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
        const savebutton = document.getElementById("savebutton");
        savebutton.classList.remove("save-changes-button-disabled");
        savebutton.classList.add("save-changes-button-enabled");
        savebutton.disabled = false
    }

    // Method to disable the save button
    disableSaveButton() {
        const savebutton = document.getElementById("savebutton");
        savebutton.classList.remove("save-changes-button-enabled");
        savebutton.classList.add("save-changes-button-disabled");
        savebutton.disabled = true
    }

    // Method to reset the filter to its default state
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


    // Method to set the checkboxes based on the saved filter state
    // If there is no saved filter state, all checkboxes will be checked by default
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

    // Method that gets all monster category items and returns them in an array
    //
    // @param {Array} monsters are all the monsters in the json file
    // @param {String} category is the category that is being filtered
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
                    if (category !== 'id' && category !== 'name' && category !== 'game'){
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
        filteredmonsters = this.filterGame(filteredmonsters)

        return filteredmonsters
    }

    // Method that filters the monsters based on the game checkbox values
    //
    // @param {Array} monsters are all the filtered monsters
    filterGame(monsters) {
        const removedMonsters = []
        monsters.forEach(monster => {
            Object.keys(monster).forEach(category => {
                if (category == 'game') {
                    let games = monster[category].toString().split(", ")
                    let checkboxValues = 0
                    this.values.forEach(checkbox => {
                        if (games.includes(checkbox.name)) {
                            if (checkbox.checked == false) {
                                checkboxValues++
                            }
                        }
                    })
                    if (checkboxValues == games.length) {
                        removedMonsters.push(monster)
                    }
                }
            })
        })
        if (removedMonsters.length > 0) {
            return monsters.filter(monster => !removedMonsters.includes(monster))
        }
        return monsters
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
                    this.keyFilter.setAttribute("class", "")
                    this.keyFilter.innerHTML = `
                    <h3 class="bold">${category.charAt(0).toUpperCase()}${category.slice(1)}:</h3>
                    <div class="checkbox-layout" id="grid"></div>
                    `
                    maxItems.forEach(item => {
                        let keyitem = document.createElement("div")
                        keyitem.setAttribute("class", "checkbox-div")
                        keyitem.innerHTML = ` 
                        <input type="checkbox" class="checkbox" id="${item}" name="${item}" value="${item}">
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