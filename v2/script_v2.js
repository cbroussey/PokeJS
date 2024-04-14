const dispAmount = 25

function displayList(page = 0) { // Display the table
    $("#prev").prop("disabled", false)
    $("#next").prop("disabled", false)
    let pkmns = Object.values(Pokemon.all_pokemons)
    for (let n = page * dispAmount; n < pkmns.length && n < (page+1) * dispAmount; n++) { // Pagination
        let pkrow = document.createElement("tr")
        Object.values(document.querySelectorAll("#pokeList > thead > tr > th")).forEach(i => { // For each column
            let pkcell = document.createElement("td")
            if (i.innerText.toLowerCase() != "thumbnail") { // Test if it isn't the thumbnail column
                // Get the value from the pokemon object
                pkcell.innerText = pkmns[n][i.innerText.toLowerCase().replace(" ", "_")]
                pkcell.innerText = pkcell.innerText.replace(",", ", ")
            } else {
                let pkimg = document.createElement("img")
                // Thumbnail's name needs to be made of 3 digits, so we add 0s if needed
                pkimg.src = "../webp/thumbnails/" + (pkmns[n]["id"] < 100 ? "0" : "") + (pkmns[n]["id"] < 10 ? "0" : "") + pkmns[n]["id"] + ".webp"
                pkcell.appendChild(pkimg)
            }
            pkrow.appendChild(pkcell)
        })
        document.querySelector("#pokeList > tbody").appendChild(pkrow)
    }

    $("#pageNum").text("Page " + (page + 1) + "/" + Math.ceil(pkmns.length / dispAmount))
    if (page == 0) $("#prev").prop("disabled", true)
    if (page == Math.ceil(pkmns.length / dispAmount)-1) $("#next").prop("disabled", true)
    sessionStorage.page = page // We don't want to save the page accross sessions
}

$(document).ready(() => {
    // Load everything
    Pokemon.import_pokemons();
    let pg = sessionStorage.page
    displayList(pg == null ? 0 : parseInt(pg));
    // Handle previous and next button clicks
    $("#prev").click(() => {
        let page = parseInt($("#pageNum").text().split(" ")[1].split("/")[0]) - 1
        if (page > 0) {
            $("#pokeList > tbody").empty()
            displayList(page - 1)
            document.body.scrollIntoView()
        } else {
            
        }
    })
    $("#next").click(() => {
        let page = parseInt($("#pageNum").text().split(" ")[1].split("/")[0]) - 1
        if (page < Math.floor(Object.values(Pokemon.all_pokemons).length / dispAmount)) {
            $("#pokeList > tbody").empty()
            displayList(page + 1)
            document.body.scrollIntoView()
        }
    })
})