export class FilterContainerClass {
    constructor(monsters) {
        this.monsters = monsters;
    }


    buildContainer() {
        let filterContainer = document.createElement("div");
        filterContainer.setAttribute("class", "fixed inset-y-0 flex items-start h-screen w-1/4 z-20");
        filterContainer.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg h-full w-full">
                <h2 class="text-2xl font-bold mb-4">Filter Options</h2>
                <div id="filteritems"></div>
                <button onclick="closeFilter()" class="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
            </div>
        `;

        console.log("Container Created");
        return filterContainer;
    }

    setGenerationFilter(monsters) {
        
        this.filterItems.appendChild(generationFilter);
    }   
}