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
        this.checkboxes = new Map();
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
        this.setGenerationFilter(this.monsters);
        this.setClassFilter(this.monsters);
        this.setSpeciesFilter(this.monsters);
        this.setElementFilter(this.monsters);
        this.setAilmentFilter(this.monsters);

        this.checkboxValues(this.checkboxes, this.monsters);

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

    setGenerationFilter(monsters) {
        const itemlist = this.filterContainer.querySelector("#filteritems");
        const maxGenerations = [...new Set(this.monsters.map(monster => monster.generations))];

        if (itemlist) {
            this.generationFilter = document.createElement("div");
            this.generationFilter.setAttribute("id", "generation-filter")
            this.generationFilter.innerHTML = `<h3 class="text-lg font-semibold">Generations:</h3>`

            maxGenerations.forEach(generation => {
                let generationitem = document.createElement("div")
                generationitem.innerHTML = ` 
                <input type="checkbox" id="${generation}" name="${generation}" value="${generation}">
                <label for="${generation}">Gen ${generation}</label>
                `;
                this.generationFilter.appendChild(generationitem);
                this.checkboxes.set(`${generation}`, generationitem.querySelector('input'));
            });

            itemlist.appendChild(this.generationFilter);
        } else {
            console.log("Failed to create Generation Filter")
        }
        
    }   

    setSpeciesFilter(monsters) {
        const itemlist = this.filterContainer.querySelector("#filteritems");
        let maxSpecies = [];
        monsters.forEach(monster => {
            if (!maxSpecies.includes(monster.species)) {
                maxSpecies.push(monster.species)
            }
        });
        maxSpecies.sort();
        if (itemlist) {
            this.speciesFilter = document.createElement("div");
            this.speciesFilter.setAttribute("id", "species-filter")
            this.speciesFilter.setAttribute("class", "py-6 ")
            this.speciesFilter.innerHTML = `
            <h3 class="text-lg font-semibold">Species:</h3>
            <div class="grid grid-cols-4" id="grid"></div>
            `
            maxSpecies.forEach(species => {
                let speciesfilter = document.createElement("div")
                speciesfilter.setAttribute("class", "flex items-center")
                speciesfilter.innerHTML = ` 
                <input type="checkbox" class="flex mr-2" id="${species}" name="${species}" value="${species}" checked>
                <label for="${species}">${species}</label>
                `;
                this.speciesFilter.querySelector("#grid").appendChild(speciesfilter);
            });
            itemlist.appendChild(this.speciesFilter);
        }
    }

    setClassFilter(monsters) {
        const itemlist = this.filterContainer.querySelector("#filteritems");
        let maxClasses = [];
        monsters.forEach(monster => {
            if (!maxClasses.includes(monster.class)) {
                maxClasses.push(monster.class)
            }
        });
        maxClasses.sort();
        if (itemlist) {
            this.classFilter = document.createElement("div");
            this.classFilter.setAttribute("id", "class-filter")
            this.classFilter.setAttribute("class", "py-6 ")
            this.classFilter.innerHTML = `
            <h3 class="text-lg font-semibold">Class:</h3>
            <div class="grid grid-cols-4" id="grid"></div>
            `
            maxClasses.forEach(classes => {
                let classitem = document.createElement("div")
                classitem.setAttribute("class", "flex items-center")
                classitem.innerHTML = ` 
                <input type="checkbox" class="flex mr-2" id="${classes}" name="${classes}" value="${classes}" checked>
                <label for="${classes}">${classes}</label>
                `;
                this.classFilter.querySelector("#grid").appendChild(classitem);
            });
            itemlist.appendChild(this.classFilter);
        }
    }

    setElementFilter(monsters) {
        const itemlist = this.filterContainer.querySelector("#filteritems");
        let maxElements = [];
        monsters.forEach(monster => {
            const elements = monster.element.split(", ");
            elements.forEach(element => {
                if (!maxElements.includes(element)) {
                    maxElements.push(element);
                }
            });
        });
        if (itemlist) {
            this.elementFilter = document.createElement("div");
            this.elementFilter.setAttribute("id", "element-filter")
            this.elementFilter.setAttribute("class", "py-6 ")
            this.elementFilter.innerHTML = `
            <h3 class="text-lg font-semibold">Elements:</h3>
            <div class="" id="grid"></div>
            `
            maxElements.forEach(element => {
                let elementitem = document.createElement("div")
                elementitem.setAttribute("class", "flex items-center")
                elementitem.innerHTML = ` 
                <input type="checkbox" class="flex mr-2" id="${element}" name="${element}" value="${element}" checked>
                <label for="${element}">${element}</label>
                `;
                this.elementFilter.querySelector("#grid").appendChild(elementitem);
            });
            itemlist.appendChild(this.elementFilter);
        }
    }

    setAilmentFilter(monsters) {
        const itemlist = this.filterContainer.querySelector("#filteritems");
        let maxAilments = [];
        monsters.forEach(monster => {
            const ailments = monster.ailment.split(", ");
            ailments.forEach(ailment => {
                if (!maxAilments.includes(ailment)) {
                    maxAilments.push(ailment);
                }
            });
        });
        if (itemlist) {
            this.ailmentFilter = document.createElement("div");
            this.ailmentFilter.setAttribute("id", "ailment-filter")
            this.ailmentFilter.setAttribute("class", "py-6 ")
            this.ailmentFilter.innerHTML = `
            <h3 class="text-lg font-semibold">Ailments:</h3>
            <div class="grid grid-cols-4" id="grid"></div>
            `
            maxAilments.forEach(ailment => {
                let ailmentitem = document.createElement("div")
                ailmentitem.setAttribute("class", "flex items-center")
                ailmentitem.innerHTML = ` 
                <input type="checkbox" class="flex mr-2" id="${ailment}" name="${ailment}" value="${ailment}" checked>
                <label for="${ailment}">${ailment}</label>
                `;
                this.ailmentFilter.querySelector("#grid").appendChild(ailmentitem);
            });
            itemlist.appendChild(this.ailmentFilter);
        }
    }

    checkboxValues(checkboxes, monsters) {
        monsters.forEach(monster => {
            checkboxes.forEach(checkbox => {
                if (checkbox.id == monster.generations) {
                    checkbox.setAttribute("value", "true")
                } else {
                    checkbox.setAttribute("checked", "unchecked")
                    checkbox.setAttribute("value", "false")
                }
            }) 
        })
    }
}