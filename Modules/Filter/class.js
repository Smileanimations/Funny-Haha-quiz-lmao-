export class FilterContainerClass {
    constructor(monsters) {
        this.monsters = monsters;
        this.filterContainer;
        this.generationFilter;
        this.classFilter;
        this.elementFilter;
        this.ailmentFilter;
        this.speciesFilter;
        this.itemlist;
        this.monsterKeys = [];
        this.checkboxes = new Map();

        this.monsters.forEach((monster) => {
            Object.keys(monster).forEach(key => {
                if (!this.monsterKeys.includes(key))
                    this.monsterKeys.push(key)
            })
        })
    }

    buildContainer() {
        this.filterContainer = document.createElement("div");
        this.filterContainer.setAttribute("class", "fixed inset-y-0 flex items-start h-screen w-1/4 z-20");
        this.filterContainer.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg h-full w-full">
                <h2 class="text-2xl font-bold mb-4">Filter Options</h2>
                <div id="filteritems"></div>
                <div>
                    <button onclick="closeFilter()" class="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
                    <button class="mt-4 text-black border-2 border-green-500 px-4 py-2 rounded" disabled>Save Changes</button>
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

    handleCheckboxChange(checkbox) {
        console.log(`Checkbox ${checkbox.name} changed to ${checkbox.checked}`);
        console.log(this.checkboxes)
    }

    checkboxValues(checkboxes, monster) {
        checkboxes.forEach(checkbox => {
            if (!checkbox.name.includes(monster)) {
                checkbox.setAttribute("value", "true")
                checkbox.setAttribute("checked", "true")
            } else {
                checkbox.setAttribute("value", "false")
            }
        })
    }

    setFilter(monsters, keyarray) {
        keyarray.forEach(key => {
            if (key !== 'id' && key !== 'name') {
                const itemlist = this.filterContainer.querySelector("#filteritems");
                let maxItems = [];
                
                monsters.forEach(monster => {
                    const items = monster[key].toString().split(", ")
                    console.log(items)
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