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

function detailsPopup(e) { // Display the details of a pokemon in a popup
    $("body").css("overflow", "hidden") // Prevent scrolling
    $("#popup").show(0, () => {
        $("#popup").css("opacity", ".5")
    })
    $("#popup").click(() => { // Close the popup when clicking outside of it
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
    pkmn.types.forEach(f => { // Display the types with their respective colors
        $("#detailsTypes").append("<p style='background-color: " + typeColors[f] + "'>" + f + "</p>")
    })
    $("#detailsAtt").text(pkmn.base_attack)
    $("#detailsAtt").append("<div class='tooltiptext'>Attack</div>")
    $("#detailsDef").text(pkmn.base_defense)
    $("#detailsDef").append("<div class='tooltiptext'>Defense</div>")
    $("#detailsSta").text(pkmn.base_stamina)
    $("#detailsSta").append("<div class='tooltiptext'>Stamina</div>")
    $("#detailsFast > ul").empty()
    pkmn.fast_moves.forEach(f => { // Display the fast moves with their respective power
        $("#detailsFast > ul").append("<li class='tooltip'>" + f
        + "<div class='tooltiptext'>Power: " + new Attack(f).power + "</div></li>")
        // Power is the only given move stat that is useful to display here
    })
    $("#detailsCharged > ul").empty()
    pkmn.charged_moves.forEach(f => { // Display the charged moves with their respective power
        $("#detailsCharged > ul").append("<li class='tooltip'>" + f
        + "<div class='tooltiptext'>Power: " + new Attack(f).power + "</div></li>")
        // Power is the only given move stat that is useful to display here
    })
    $("#detailsPopup").show(0, () => {
        $("#detailsPopup").css("display", "flex")
        $("#detailsPopup").css("opacity", "1")
        $("#detailsPopup").css("transform", "translateY(0)")
    })
}

function imgPopup(e) { // Display a bigger image when hovering over a thumbnail
    let popupImg = document.createElement('img');
    popupImg.src = e.currentTarget.src.replace("thumbnails", "images");
    popupImg.id = 'popupImg';
    let top = (e.target.getBoundingClientRect().top - Math.round(e.target.offsetWidth/2))
    if (top < 0) top = 50 // Prevent the popup from going offscreen
    popupImg.style.top = top + 'px';
    // Positionning the popup image on the left  side of the thumbnail
    popupImg.style.right = $("html").width() - (e.target.offsetParent.getBoundingClientRect().left - 10) + 'px';
    document.body.appendChild(popupImg);
    // Prevent the popup from going offscreen
    if (popupImg.getBoundingClientRect().bottom > window.innerHeight) top = window.innerHeight - popupImg.height - 50
    popupImg.style.top = top + 'px';
}

function displayList(page = 0, pkmns = Object.values(Pokemon.all_pokemons)) { // Display the table
    $("#pokeList > tbody").empty()
    $("#prev").prop("disabled", false)
    $("#next").prop("disabled", false)
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
    if (page <= 0) $("#prev").prop("disabled", true)
    if (page >= Math.ceil(pkmns.length / dispAmount)-1) $("#next").prop("disabled", true)
    sessionStorage.page = page // We don't want to save the page accross sessions
}

function applyFilters(page = 0) {
    // Get the values from the filters
    let gen = $("#genFilter").val()
    gen = gen == "" ? 0 : parseInt(gen)
    let type = $("#typeFilter").val()
    let name = $("#nameFilter").val()
    let filtered = Object.values(Pokemon.all_pokemons)
    if (gen != 0)
        filtered = filtered.filter(e => e.generation == gen)
    if (type != "")
        filtered = filtered.filter(e => e.types.includes(type))
    if (name != "")
        filtered = filtered.filter(e => e.name.toLowerCase().includes($("#nameFilter").val().toLowerCase()))
    // Display the list with the filtered/sorted pokemons (if they have been)
    displayList(page, gen || type != "" || name != "" ? filtered : Object.values(Pokemon.all_pokemons))
    sessionStorage.gen = gen ? gen.toString() : ""
    sessionStorage.type = type
    sessionStorage.name = name
}

$(document).ready(() => {
    // Load everything
    Pokemon.import_pokemons();
    let pg = sessionStorage.page
    let gen = sessionStorage.gen
    let type = sessionStorage.type
    let name = sessionStorage.name
    // Add the generations and types to the filters
    let gens = new Set(Object.values(Pokemon.all_pokemons).map(e => e.generation))
    gens.forEach(e => {
        $("#genFilter").append("<option value='" + e + "'>Gen " + e + "</option>")
    })
    Object.keys(Type.all_types).forEach(e => {
        $("#typeFilter").append("<option value='" + e + "'>" + e + "</option>")
    })
    if (name != null) $("#nameFilter").val(name)
    if (gen != null) $("#genFilter").val(gen)
    if (type != null) $("#typeFilter").val(type)
    applyFilters(pg == null ? 0 : parseInt(pg));
    // Handle previous and next button clicks
    $("#prev").click(() => {
        let page = parseInt($("#pageNum").text().split(" ")[1].split("/")[0]) - 1
        if (page > 0) {
            $("#pokeList > tbody").empty()
            applyFilters(page - 1)
            document.body.scrollIntoView()
        }
    })
    $("#next").click(() => {
        let page = parseInt($("#pageNum").text().split(" ")[1].split("/")[0]) - 1
        if (page < $("#pageNum").text().split("/")[1] - 1){
            $("#pokeList > tbody").empty()
            applyFilters(page + 1)
            document.body.scrollIntoView()
        }
    })
    // Handle filter changes
    $("#genFilter").change(() => {
        applyFilters()
    })
    $("#typeFilter").change(() => {
        applyFilters()
    })
    $("#nameFilter").keyup(() => {
        applyFilters()
    })
})
