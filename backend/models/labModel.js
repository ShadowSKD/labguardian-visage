const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
    labCode: { type: String, required: true, unique: true },
    labName: { type: String, required: true },
    labDescription: { type: String, required: true },
    labClientsCount: { type: Number, default: 0 },
    labLock: { type: Boolean, default: false }
})

module.exports = mongoose.model('Lab', labSchema);