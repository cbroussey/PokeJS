const dispAmount = 25

function displayList(page = 0) {
    $("#prev").prop("disabled", false)
    $("#next").prop("disabled", false)
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
    if (page == 0) $("#prev").prop("disabled", true)
    if (page == Math.ceil(pkmns.length / dispAmount)-1) $("#next").prop("disabled", true)
    sessionStorage.page = page // We don't want to save the page accross sessions
}

$(document).ready(() => {
    Pokemon.import_pokemons();
    let pg = sessionStorage.page
    displayList(pg == null ? 0 : parseInt(pg));
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
    $("tbody >  tr").click(e => {
        console.log(e.currentTarget.children[0].innerText)
        $("body").css("overflow", "hidden") // Prevent scrolling
        $("#popup").show(0, () => {
            $("#popup").css("opacity", ".5")
        })
        $("#popup").click(() => {
            document.getElementById("popup").addEventListener("transitionend", f => {
                $("#popup").hide()
                $("body").css("overflow", "auto") // Restore scrolling
            }, {once: true})
            document.getElementById("detailsPopup").addEventListener("transitionend", f => {
                $("#detailsPopup").hide()
            }, {once: true})
            $("#popup").css("opacity", "0")
            $("#detailsPopup").css("transform", "")
            $("#detailsPopup").css("opacity", "0")
        })
        let pkmn = new Pokemon(e.currentTarget.children[0].innerText)
        $("#detailsPopup > img").attr("src", "../webp/images/" + (pkmn.id < 100 ? "0" : "") + (pkmn.id < 10 ? "0" : "") + pkmn.id + ".webp")
        $("#detailsPopup").show(0, () => {
            $("#detailsPopup").css("display", "flex")
            $("#detailsPopup").css("opacity", "1")
            $("#detailsPopup").css("transform", "translateY(0)")
        })
    })
})