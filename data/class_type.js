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

    static effectivenessCalc(type, defenderTypes) { // Calculate the effectiveness of a move on a pokemon (based on their types)
        let multiplier = 1
        defenderTypes.forEach(e => { multiplier *= Type.all_types[type][e] });
        return multiplier
    }

    toString() {
        return `${this.name}` // No need to display the effectivenesses here, would fill up the screen for no point
    }
}