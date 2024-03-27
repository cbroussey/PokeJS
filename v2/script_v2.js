const dispAmount = 25

function displayList(page = 0) {
    let pkmns = Object.values(Pokemon.all_pokemons)
    for (let n = page * dispAmount; n < pkmns.length && n < (page+1) * dispAmount; n++) {
        let pkrow = document.createElement("tr")
        Object.values(document.querySelectorAll("#pokeList > thead > tr > th")).forEach(i => {
            let pkcell = document.createElement("td")
            if (i.innerText.toLowerCase() != "thumbnail") {
                pkcell.innerText = pkmns[n][i.innerText.toLowerCase().replace(" ", "_")]
                pkcell.innerText = pkcell.innerText.replace(",", ", ")
            } else {
                let pkimg = document.createElement("img")
                pkimg.src = "../webp/thumbnails/" + (pkmns[n]["id"] < 100 ? "0" : "") + (pkmns[n]["id"] < 10 ? "0" : "") + pkmns[n]["id"] + ".webp"
                pkcell.appendChild(pkimg)
            }
            pkrow.appendChild(pkcell)
        })
        document.querySelector("#pokeList > tbody").appendChild(pkrow)
    }
    $("#pageNum").text("Page " + (page + 1) + "/" + Math.ceil(pkmns.length / dispAmount))
}

$(document).ready(() => {
    Pokemon.import_pokemons();
    displayList();
    $("#prev").click(() => {
        let page = parseInt($("#pageNum").text().split(" ")[1].split("/")[0]) - 1
        if (page > 0) {
            $("#pokeList > tbody").empty()
            displayList(page - 1)
            document.body.scrollIntoView()
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