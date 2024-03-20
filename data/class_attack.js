class Attack {
    static all_attacks = {}

    constructor(name) {
        this.name = name
        for (let id in Attack.all_attacks) { // Find the id of the attack by its name
            if (Attack.all_attacks[id]["name"] == this.name) {
                this.move_id = id;
                break;
            }
        }
        this.move_type = Attack.all_attacks[this.move_id]["move_type"]
        this.type = Attack.all_attacks[this.move_id]["type"]
        this.power = Attack.all_attacks[this.move_id]["power"]
        this.energy_delta = Attack.all_attacks[this.move_id]["energy_delta"]
        this.duration = Attack.all_attacks[this.move_id]["duration"]
        this.stamina_loss_scaler = Attack.all_attacks[this.move_id]["stamina_loss_scaler"]
        //this.critical_chance = Attack.all_attacks[this.id]["critical_chance"] // Unused here, undefined in some attacks
    }

    toString() {
        return `${this.name} (${this.move_type},  ${this.type}) - ${this.power} - ${this.energy_delta} - ${this.duration} - ${this.stamina_loss_scaler}`
    }
}