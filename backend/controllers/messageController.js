const Message = require('../models/Message');

// Get all messages
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a message (Public)
const createMessage = async (req, res) => {
    try {
        const message = new Message(req.body);
        const savedMessage = await message.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Mark as read
const markRead = async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        if (!message) return res.status(404).json({ message: 'Message not found' });
        res.json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a message
const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMessages, createMessage, markRead, deleteMessage };
