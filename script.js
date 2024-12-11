fetch("../data/monsters.json")
.then(response => {
    if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error("Error fetching the JSON file:", error);
});
