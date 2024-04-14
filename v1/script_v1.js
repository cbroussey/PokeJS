$(document).ready(() => {
    // Load everything
    Pokemon.import_pokemons();
    Object.values(Pokemon.all_pokemons).forEach(p => { // Create the table
        let pkrow = document.createElement("tr")
        Object.values(document.querySelectorAll("#pokeList > thead > tr > th")).forEach(i => { // For each column
            let pkcell = document.createElement("td")
            if (i.innerText.toLowerCase() != "thumbnail") { // Test if it isn't the thumbnail column
                // Get the value from the pokemon object
                pkcell.innerText = p[i.innerText.toLowerCase().replace(" ", "_")]
                pkcell.innerText = pkcell.innerText.replace(",", ", ")
            } else {
                let pkimg = document.createElement("img")
                // Thumbnail's name needs to be made of 3 digits, so we add 0s if needed
                pkimg.src = "../webp/thumbnails/" + (p["id"] < 100 ? "0" : "") + (p["id"] < 10 ? "0" : "") + p["id"] + ".webp"
                pkcell.appendChild(pkimg)
            }
            pkrow.appendChild(pkcell)
        })
        document.querySelector("#pokeList > tbody").appendChild(pkrow)
    })
})