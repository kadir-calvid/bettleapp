import mongoose from 'mongoose';

const battleSchema = new mongoose.Schema({
    battle_number: { type: Number },
    name: { type: String },
    year: { type: Number },
    attacker_king: { type: String },
    defender_king: { type: String },
    attackers: { type: Array },
    defenders: { type: Array },
    attacker_outcome:{ type: String},
    battle_type :{ type: String },
    major_death:{ type: Number},
    major_capture :{ type: Number },
    attacker_size:{ type: Number},
    defender_size :{ type: Number },
    attacker_commander :{ type: Array },
    defender_commander:{ type: Array},
    summer:{ type: Number},
    location :{ type: String },
    note:{ type: String},
    region :{ type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('battle', battleSchema);