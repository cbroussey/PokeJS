function setFn(caller) {
    let cmd = caller.innerText.match(/^[^ \(]+/)[0]
    let args = caller.innerText.match(/\([^\)]*/)[0].substring(1).split(",")
    $("#function").val(cmd)
    showArgs()
    if (args[0] != "") {
        args.forEach((e,i) => {
            document.getElementById("params").children[i].value = e.substring(1, e.length-1)
        })
    }
}

function runFn() {
    let cmd = $("#function > option:selected").val()
    let args = [...$("#params > input").map((i,el) => el.value)]
    args.forEach((el,i) => {
        if (!isNaN(el)) args[i] = parseInt(el)
        else args[i] = `'${el}'`
    })
    $("#result")[0].innerHTML = ""
    try {
        let res = eval(`${cmd}(${args.join(",")})`)
        if (res == "") console.log("No results") //$("#result")[0].innerHTML = "No results"
        else {
            console.table(res)
            //res.forEach(e => {
            //    $("#result")[0].innerHTML += JSON.stringify(e) + "<br>"
            //})
        }
    } catch (e) {
        $("#result")[0].innerHTML = e
    }
}

function showArgs() {
    let cmd = $("#function > option:selected").val()
    let args = eval(`${cmd}.toString()`).match(/^function [^ ]+( )*\([^\)]*\)/gm)[0]
    args = args.substring(args.indexOf("(")+1,args.length-1).split(",")
    $("#params")[0].innerHTML = ""
    for (let i of args) {
        if (i != "") $("#params")[0].innerHTML += `<input type="text" placeholder="${i}">`
    }
    document.querySelectorAll("#params > input").forEach(e => {
        e.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
                runFn()
            }
        });
    })
}

function getPokemonByType(typeName) {
    return Object.values(Pokemon.all_pokemons).filter(e => e["types"].includes(typeName))
}

function getPokemonByAttack(attackName) {
    return Object.values(Pokemon.all_pokemons).filter(e => e["charged_moves"].includes(attackName) || e["fast_moves"].includes(attackName))
}

function getAttacksByType(typeName) {
    return Object.values(Attack.all_attacks).filter(e => e["type"] == typeName)
}

function sortPokemonByName() {
    return Object.values(Pokemon.all_pokemons).sort((a, b) => a["name"] < b["name"] ? -1 : a["name"] > b["name"] ? 1 : 0)
}

function sortPokemonByStamina() {
    return Object.values(Pokemon.all_pokemons).sort((a, b) => b["base_stamina"] - a["base_stamina"])
}

function getWeakestEnnemies(attack) {
    let attackType = new Attack(attack).type
    let weakest = []
    Object.values(Pokemon.all_pokemons).forEach((e, f) => {
        weakest.push({id : f, multiplier : Type.effectivenessCalc(attackType, e["types"])})
    })
    // The bigger the multiplier, the stronger the attack, the weaker the ennemy
    weakest = weakest.sort((a, b) => a["multiplier"] > b["multiplier"] ? -1 : 1)
    weakest = weakest.filter(e => e["multiplier"] == weakest[0]["multiplier"])
    return weakest.map(e => Object.values(Pokemon.all_pokemons)[e["id"]])
}

function getStrongestEnnemies(attack) {
    let attackType = new Attack(attack).type
    let strongest = []
    Object.values(Pokemon.all_pokemons).forEach((e, f) => {
        strongest.push({id : f, multiplier : Type.effectivenessCalc(attackType, e["types"])})
    })
    // The lower the multiplier, the weaker the attack, the stronger the ennemy
    strongest = strongest.sort((a, b) => a["multiplier"] < b["multiplier"] ? -1 : 1)
    strongest = strongest.filter(e => e["multiplier"] == strongest[0]["multiplier"])
    return strongest.map(e => Object.values(Pokemon.all_pokemons)[e["id"]])
}

function getBestAttackTypesForEnnemy(name) {
    let attackType = []
    Object.keys(Type.all_types).forEach(e => {
        attackType.push({"type": e, "multiplier":Type.effectivenessCalc(e, Object.values(Pokemon.all_pokemons).filter(e => e["name"] == name)[0]["types"])})
    })
    let maxMult = attackType.sort((a, b) => a["multiplier"] < b["multiplier"])[0]["multiplier"]
    return attackType.filter(e => e["multiplier"] == maxMult).map(e => e["type"])
}

$(document).ready(function() {
    $("#function").change(showArgs)
    showArgs()
    Pokemon.import_pokemons()
})