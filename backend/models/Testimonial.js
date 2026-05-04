const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    author: { type: String, required: true },
    role: String,
    company: String,
    content: { type: String, required: true },
    avatarUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
