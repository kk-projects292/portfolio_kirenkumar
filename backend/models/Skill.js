const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true, enum: ['frontend', 'backend', 'database', 'tools', 'other'] },
    proficiency: { type: Number, required: true, min: 1, max: 100 },
    icon: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    color: { type: String, default: '#6366f1' },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Skill', skillSchema);
