export class FilterContainerClass {
    constructor(monsters) {
        this.monsters = monsters;
        this.filterContainer = document.createElement("div");

        this.buildContainer(this.filterContainer);
    }


    buildContainer(filterContainer) {
        filterContainer.setAttribute("class", "absolute left-0 flex flex-wrap justify-start items-center bg-white w-1/4 h-500px");
    }
}