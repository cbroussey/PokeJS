function displayList(page = 0) {
    const dispAmnt = 25
    let pkmns = Object.values(Pokemon.all_pokemons)
    for (let n = page * dispAmnt; n < pkmns.length && n < (page+1) * dispAmnt; n++) {
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
}

$(document).ready(() => {
    Pokemon.import_pokemons();
    displayList();
})