export class filterContainerClass {
    constructor(attachdiv, monsters) {
        this.monsters = monsters;
        this.filterContainer = document.createElement("div");

        
        buildContainer(attachdiv, this.filterContainer);
    }


    buildContainer(attachdiv, filterContainer) {
        filterContainer.setAttribute("class", "flex flex-col w-80 h-80 bg-white rounded-lg shadow-md z-100");
        attachdiv.appendChild(filterContainer);
    }
}