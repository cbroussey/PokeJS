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
        this.move_type = Attack.all_attacks[this.id]["move_type"]
        this.type = Attack.all_attacks[this.id]["type"]
        this.power = Attack.all_attacks[this.id]["power"]
        this.energy_delta = Attack.all_attacks[this.id]["energy_delta"]
        this.duration = Attack.all_attacks[this.id]["duration"]
        this.stamina_loss_scaler = Attack.all_attacks[this.id]["stamina_loss_scaler"]
        //this.critical_chance = Attack.all_attacks[this.id]["critical_chance"]
    }

    toString() {
        return `${this.name} (${this.move}) - ${this.type} - ${this.power} - ${this.energy_delta} - ${this.duration} - ${this.stamina_loss_scaler}`
    }
}