const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Admin' },
    tags: [String],
    thumbnailUrl: String,
    published: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);
