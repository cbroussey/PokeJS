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
        this.charged_moves = Pokemon.all_pokemons[id]["charged_moves"]
        this.fast_moves = Pokemon.all_pokemons[id]["fast_moves"]
        this.generation = Pokemon.all_pokemons[id]["generation"]
    }

    getTypes() {
        return this.types.map(e => new Type(e))
    }

    getAttacks() {
        return this.charged_moves.map(e => new Attack(e)).concat(this.fast_moves.map(e => new Attack(e))) // Concatenation of fast and charged moves
    }

    toString() {
        return `${this.name} (${this.types.join(", ")}) - ${this.base_stamina}/${this.base_attack}/${this.base_defense}` // Form not described here since unused
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
        pokemon.filter(e => e["form"] == Pokemon.defaultForm).forEach(e => { // Filter to get only the default form
            if (!(e["pokemon_id"] in Pokemon.all_pokemons)) { // If the pokemon id is not already in the list
                Pokemon.all_pokemons[e["pokemon_id"]] = {
                    "id": e["pokemon_id"],
                    "name": e["pokemon_name"],
                    "form": e["form"],
                    "base_stamina": e["base_stamina"],
                    "base_attack": e["base_attack"],
                    "base_defense": e["base_defense"],
                    "types": pokemon_type.filter(f => f["pokemon_id"] == e["pokemon_id"] && f["form"] == Pokemon.defaultForm)[0]["type"], // Get the types from the pokemon_type list
                    "charged_moves": pokemon_moves.filter(f => f["pokemon_id"] == e["pokemon_id"] && f["form"] == Pokemon.defaultForm)[0]["charged_moves"], // Get the charged moves from the pokemon_moves list
                    //"elite_charged_moves": pokemon_moves.filter(f => f["pokemon_id"] == e["pokemon_id"] && f["form"] == Pokemon.defaultForm)[0]["elite_charged_moves"],
                    "fast_moves": pokemon_moves.filter(f => f["pokemon_id"] == e["pokemon_id"] && f["form"] == Pokemon.defaultForm)[0]["fast_moves"], // Get the fast moves from the pokemon_moves list
                    //"elite_fast_moves": pokemon_moves.filter(f => f["pokemon_id"] == e["pokemon_id"] && f["form"] == Pokemon.defaultForm)[0]["elite_fast_moves"],
                    // Add the generation of the pokemon : repeating the filter is necessary since the object id are "Generation 1", "Generation 2", etc. and not 1, 2, etc.
                    // So here we first filter all of the pokemons to find the one we are looking for, then we filter again to keep only the "Generation ..." where it is located
                    "generation": Object.values(generation).filter(f => f.filter(g => g["id"] == e["pokemon_id"]).length)[0].filter(f => f["id"] == e["pokemon_id"])[0]["generation_number"]
                }
                // Dynamic import of types
                Pokemon.all_pokemons[e["pokemon_id"]]["types"].forEach(f => {
                    if (!(f in Type.all_types)) {
                        Type.all_types[f] = type_effectiveness[f]
                    }
                })
                // Dynamic import of fast attacks
                Pokemon.all_pokemons[e["pokemon_id"]]["fast_moves"].forEach(f => {
                    if (!(f in Attack.all_attacks)) {
                        let attack = fast_moves.filter(e => e["name"] == f)[0]
                        Attack.all_attacks[attack["move_id"]] = attack
                        Attack.all_attacks[attack["move_id"]]["move_type"] = "Fast"
                    }
                })
                // Dynamic import of charged attacks
                Pokemon.all_pokemons[e["pokemon_id"]]["charged_moves"].forEach(f => {
                    if (!(f in Attack.all_attacks)) {
                        let attack = charged_moves.filter(e => e["name"] == f)[0]
                        Attack.all_attacks[attack["move_id"]] = attack
                        Attack.all_attacks[attack["move_id"]]["move_type"] = "Charged"
                        delete Attack.all_attacks[attack["move_id"]]["critical_chance"] // critical_chance is not used, so it needs to be removed
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