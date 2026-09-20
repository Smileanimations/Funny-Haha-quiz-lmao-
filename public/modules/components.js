fetch("./modules/nav-bar/nav-bar.html")
    .then(response => response.text())
    .then(html => {
        const navbar = document.createElement('header');
        navbar.innerHTML = html;
        body.prepend(navbar);
    })
    .catch(error => {
        console.log("Error fetching component:", error)
    })

fetch("./modules/footer/footer.html")
    .then(response => response.text())
    .then(html => {
        const footer = document.createElement('footer');
        footer.innerHTML = html;
        body.append(footer)
    })