const dispAmount = 25
const typeColors = {
    "Normal": '#A8A77A',
	"Fire": '#EE8130',
	"Water": '#6390F0',
	"Electric": '#F7D02C',
	"Grass": '#7AC74C',
	"Ice": '#96D9D6',
	"Fighting": '#C22E28',
	"Poison": '#A33EA1',
	"Ground": '#E2BF65',
	"Flying": '#A98FF3',
	"Psychic": '#F95587',
	"Bug": '#A6B91A',
	"Rock": '#B6A136',
	"Ghost": '#735797',
	"Dragon": '#6F35FC',
	"Dark": '#705746',
	"Steel": '#B7B7CE',
	"Fairy": '#D685AD',
}

function detailsPopup(e) {
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
    $("#detailsImg").attr("src", "../webp/images/" + (pkmn.id < 100 ? "0" : "") + (pkmn.id < 10 ? "0" : "") + pkmn.id + ".webp")
    $("#detailsName").text(pkmn.name)
    $("#detailsForm").text(pkmn.form)
    $("#detailsGen").text("(Gen " + pkmn.generation + ")")
    $("#detailsTypes")[0].innerHTML = "<h3>Types: </h3>"
    pkmn.types.forEach(f => {
        $("#detailsTypes")[0].innerHTML += "<p style='background-color: " + typeColors[f] + "'>" + f + "</p>"
    })
    $("#detailsAtt").text(pkmn.base_attack)
    $("#detailsAtt")[0].innerHTML += "<div class='tooltiptext'>Attack</div>"
    $("#detailsDef").text(pkmn.base_defense)
    $("#detailsDef")[0].innerHTML += "<div class='tooltiptext'>Defense</div>"
    $("#detailsSta").text(pkmn.base_stamina)
    $("#detailsSta")[0].innerHTML += "<div class='tooltiptext'>Stamina</div>"
    $("#detailsFast > ul").empty()
    pkmn.fast_moves.forEach(f => {
        $("#detailsFast > ul")[0].innerHTML += "<li class='tooltip'>" + f
        + "<div class='tooltiptext'>Power: " + new Attack(f).power + "</div></li>"
    })
    $("#detailsCharged > ul").empty()
    pkmn.charged_moves.forEach(f => {
        $("#detailsCharged > ul")[0].innerHTML += "<li class='tooltip'>" + f
        + "<div class='tooltiptext'>Power: " + new Attack(f).power + "</div></li>"
        // Power is the only given move stat that is useful to display here
    })
    $("#detailsPopup").show(0, () => {
        $("#detailsPopup").css("display", "flex")
        $("#detailsPopup").css("opacity", "1")
        $("#detailsPopup").css("transform", "translateY(0)")
    })
}

function imgPopup(e) {
    let popupImg = document.createElement('img');
    popupImg.src = e.currentTarget.src.replace("thumbnails", "images");
    popupImg.id = 'popupImg';
    let top = (e.target.getBoundingClientRect().top - Math.round(e.target.offsetWidth/2))
    if (top < 0) top = 50
    popupImg.style.top = top + 'px';
    popupImg.style.right = $("html").width() - (e.target.offsetParent.getBoundingClientRect().left - 10) + 'px';
    document.body.appendChild(popupImg);
    if (popupImg.getBoundingClientRect().bottom > window.innerHeight) top = window.innerHeight - popupImg.height - 50
    popupImg.style.top = top + 'px';
}

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
    $("tbody >  tr").click(e => {
        detailsPopup(e)
    })
    $("tbody > tr > td > img").mouseover(function(e) {
        imgPopup(e)
    });

    $("tbody > tr > td > img").mouseout(function() {
        // Remove the popup image when the mouse leaves the thumbnail
        let popupImg = document.querySelector('#popupImg');
        if (popupImg) {
            popupImg.remove();
        }
    });
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