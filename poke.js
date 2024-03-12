class Pokemon {
    static defaultForm = "Normal"
    static all_pokemons = {}
    
    constructor(id/*, form*/) {
        this.id = id
        this.form = Pokemon.defaultForm
        /*
        let tmp = pokemon.filter((e) => e["pokemon_id"] == this.id)
        if (tmp.filter((e) => e["form"] == this.form).length) {
            tmp = tmp.filter((e) => e["form"] == this.form)[0]
        } else {
            console.log("[W] Form does not exist for this pokemon, using default form")
            tmp = tmp.filter((e) => e["form"] == "Normal")[0]
        }
        */
        this.name = Pokemon.all_pokemons[id]["name"]
        this.base_stamina = Pokemon.all_pokemons[id]["base_stamina"]
        this.base_attack = Pokemon.all_pokemons[id]["base_attack"]
        this.base_defense = Pokemon.all_pokemons[id]["base_defense"]
        this.types = Pokemon.all_pokemons[id]["types"]
    }

    getTypes() {
        return this.types.map(e => new Type(e))
    }

    toString() {
        return `${this.name} (${this.form}) - ${this.base_stamina}/${this.base_attack}/${this.base_defense}`
    }

    static import_pokemons() {
        /*
        Pokemon.all_pokemons = Object.fromEntries(pokemon.filter((e) => e["form"] == Pokemon.defaultForm).map(
            e => [e["pokemon_id"], {
                "name": e["pokemon_name"],
                "form": e["form"],
                "base_stamina": e["base_stamina"],
                "base_attack": e["base_attack"],
                "base_defense": e["base_defense"],
                "types": new Type(e["pokemon_id"]).types
            }]
        ));
        */
       // Filter all pokemons by default form and add them to the list
        pokemon.filter(e => e["form"] == Pokemon.defaultForm).forEach(e => {
            if (!(e["pokemon_id"] in Pokemon.all_pokemons)) {
                Pokemon.all_pokemons[e["pokemon_id"]] = {
                    "name": e["pokemon_name"],
                    "form": e["form"],
                    "base_stamina": e["base_stamina"],
                    "base_attack": e["base_attack"],
                    "base_defense": e["base_defense"],
                    "types": pokemon_type.filter(f => f["pokemon_id"] == e["pokemon_id"] && f["form"] == Pokemon.defaultForm)[0]["type"],
                    "charged_moves": pokemon_moves.filter(f => f["pokemon_id"] == e["pokemon_id"] && f["form"] == Pokemon.defaultForm)[0]["charged_moves"],
                    //"elite_charged_moves": pokemon_moves.filter(f => f["pokemon_id"] == e["pokemon_id"] && f["form"] == Pokemon.defaultForm)[0]["elite_charged_moves"],
                    "fast_moves": pokemon_moves.filter(f => f["pokemon_id"] == e["pokemon_id"] && f["form"] == Pokemon.defaultForm)[0]["fast_moves"]/*,*/
                    //"elite_fast_moves": pokemon_moves.filter(f => f["pokemon_id"] == e["pokemon_id"] && f["form"] == Pokemon.defaultForm)[0]["elite_fast_moves"]
                }
                Pokemon.all_pokemons[e["pokemon_id"]]["types"].forEach(f => {
                    if (!(f in Type.all_types)) {
                        //console.log("new type: " + f)
                        Type.all_types[f] = type_effectiveness[f]
                    }
                })
                Pokemon.all_pokemons[e["pokemon_id"]]["fast_moves"].forEach(f => {
                    if (!(f in Attack.all_attacks)) {
                        let attack = fast_moves.filter(e => e["name"] == f)[0]
                        Attack.all_attacks[attack["move_id"]] = attack
                        Attack.all_attacks[attack["move_id"]]["move_type"] = "Fast"
                        delete Attack.all_attacks[attack["move_id"]]["move_id"]
                    }
                })
                Pokemon.all_pokemons[e["pokemon_id"]]["charged_moves"].forEach(f => {
                    if (!(f in Attack.all_attacks)) {
                        let attack = charged_moves.filter(e => e["name"] == f)[0]
                        Attack.all_attacks[attack["move_id"]] = attack
                        Attack.all_attacks[attack["move_id"]]["move_type"] = "Charged"
                        delete Attack.all_attacks[attack["move_id"]]["move_id"]
                    }
                })
            } else {
                // Modify this if you want to have multiple forms of the same pokemon
                // Don't forget to remove the filter from the pokemon_type import
                console.log("[W] Pokemon id " + e["pokemon_id"] + " already exists in the list")
            }
        })
    }
}

class Type {
    static all_types = {}

    constructor(type/*, form*/) {
        //this.id = id
        /*
        this.form = form
        let tmp = types.filter((e) => e["pokemon_id"] == this.id)
        if (tmp.filter((e) => e["form"] == this.form).length) {
            tmp = tmp.filter((e) => e["form"] == this.form)[0]
        } else {
            console.log("[W] Form does not exist for this pokemon, using default form")
            tmp = tmp.filter((e) => e["form"] == "Normal")[0]
        }
        
        let tmp = pokemon_type.filter((e) => e["pokemon_id"] == id && e["form"] == Pokemon.defaultForm)[0]
        this.types = tmp["type"]
        this.types.forEach(e => {
            if (!(e in Type.all_types)) {
                Type.all_types[e] = type_effectiveness[e]
            }
        })
        */
        this.name = type
        this.effectiveness = Type.all_types[type]
    }

    static effectivenessCalc(type, defenderTypes) {
        let multiplier = 1
        defenderTypes.forEach(e => { multiplier *= Type.all_types[type][e] });
        return multiplier
    }

    toString() {
        return `${this.name}`
    }
    /*
    static import_types() {
        Type.all_types = type_effectiveness
        Type.all_types = Object.fromEntries(type_effectiveness.map(
            e => [e["pokemon_id"], [Pokemon.defaultForm, e["type1"], e["type2"]]]
        ));
    }*/
}

class Attack {
    static all_attacks = {}

    constructor(name) {
        this.name = name
        for (let id in Attack.all_attacks) {
            if (Attack.all_attacks[id]["name"] == this.name) {
                this.id = id;
                break;
            }
        }
        //this.id = all_attacks.filter(e => e["name"] == this.name)["id"]
        this.move = Attack.all_attacks[this.id]["move_type"]
        this.type = Attack.all_attacks[this.id]["type"]
        this.power = Attack.all_attacks[this.id]["power"]
        this.energy_delta = Attack.all_attacks[this.id]["energy_delta"]
        this.duration = Attack.all_attacks[this.id]["duration"]
        this.stamina_loss_scaler = Attack.all_attacks[this.id]["stamina_loss_scaler"]
        this.critical_chance = Attack.all_attacks[this.id]["critical_chance"]
    }
}

// In here, we are only going to use the normal form of each pokemon