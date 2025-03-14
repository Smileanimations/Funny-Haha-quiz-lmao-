export class FilterContainerClass {
    constructor(monsters) {
        this.monsters = monsters;
        this.filterContainer;
        this.itemlist;
        this.monsterKeys = [];
        this.checkboxes = new Map();
        this.values = [];

        this.monsters.forEach((monster) => {
            Object.keys(monster).forEach(key => {
                if (!this.monsterKeys.includes(key))
                    this.monsterKeys.push(key)
            })
        })
    }

    buildContainer() {
        this.filterContainer = document.createElement("div");
        this.filterContainer.setAttribute("class", "fixed bg-white inset-y-0 flex items-start h-screen w-1/3 z-20 overflow-auto");
        this.filterContainer.innerHTML = `
            <div class="p-6 rounded-lg h-full w-full">
                <h2 class="text-2xl font-bold mb-4">Filter Options</h2>
                <div id="filteritems"></div>
                <div>
                    <button onclick="closeFilter()" class="mt-4 border-2 border-red-500 bg-red-500 text-white px-4 py-2 rounded">Close</button>
                    <button onclick="saveChanges()" class="mt-4 text-black border-2 border-green-500 px-4 py-2 rounded" id="savebutton" disabled>Save Changes</button>
                </div>
            </div> 
        `;

        console.log("Container Created");
        this.setFilter(this.monsters, this.monsterKeys);

        this.filterContainer.addEventListener('change', (event) => {
            if (event.target.type === 'checkbox') {
                this.handleCheckboxChange(event.target);
            }
        });
        return this.filterContainer;
    }

    enableSaveButton() {
        const savebutton = document.getElementById("savebutton")
        savebutton.setAttribute("class", "mt-4 border-2 border-green-500 text-white bg-green-500 px-4 py-2 rounded")
        savebutton.disabled = false
    }

    disableSaveButton() {
        const savebutton = document.getElementById("savebutton")
        savebutton.setAttribute("class", "mt-4 text-black border-2 border-green-500 px-4 py-2 rounded")
        savebutton.disabled = true
    }
    
    handleCheckboxChange(checkbox) {
        console.log(`Checkbox ${checkbox.name} changed to ${checkbox.checked}`);
        if (this.values.includes(checkbox)) {
            const existingCheckbox = this.values.find(cb => cb.name === checkbox.name);
            if (existingCheckbox) {
                existingCheckbox.setAttribute("value", checkbox.checked);
            }
        } else {
            checkbox.setAttribute("value", checkbox.checked)
            this.values.push(checkbox)
        }
        this.enableSaveButton()
    }

    checkboxValues(checkboxes, items) {
        checkboxes.forEach(checkbox => {
            if (!checkbox.id.includes(items)) {
                checkbox.setAttribute("value", "true")
                checkbox.setAttribute("checked", "true")
            } else {
                checkbox.setAttribute("value", "false")
            }
        })
    }

    filterMonsters(monsters) {
        let removedmonsters = []
        let filteredmonsters = []
        this.values.forEach(checkbox => {
            monsters.forEach(monster => {
                Object.keys(monster).forEach(key => {
                    if (key !== 'id' && key !== 'name'){
                        if (checkbox.checked == false) {
                            if (monster[key].toString().split(", ").includes(checkbox.id)) {
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

    setFilter(monsters, keyarray) {
        keyarray.forEach(key => {
            if (key !== 'id' && key !== 'name') {
                const itemlist = this.filterContainer.querySelector("#filteritems");
                let maxItems = [];

                monsters.forEach(monster => {
                    const items = monster[key].toString().split(", ")
                    items.forEach(item => {
                        if (!maxItems.includes(item)) {
                            maxItems.push(item);
                        }
                    });
                });
                if (itemlist) {
                    this.keyFilter = document.createElement("div");
                    this.keyFilter.setAttribute("id", "ailment-filter")
                    this.keyFilter.setAttribute("class", "py-6 ")
                    this.keyFilter.innerHTML = `
                    <h3 class="text-lg font-semibold">${key.charAt(0).toUpperCase()}${key.slice(1)}:</h3>
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
                        this.checkboxes.set(`${item}`, keyitem.querySelector('input'));
                        this.checkboxValues(this.checkboxes, maxItems)
                    });
                    itemlist.appendChild(this.keyFilter);
                }
            }
        })
    }
}