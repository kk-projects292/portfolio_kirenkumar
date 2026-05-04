const express = require('express');
const router = express.Router();
const { getMessages, createMessage, markRead, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMessages); // Protected
router.post('/', createMessage); // Public
router.put('/:id/read', protect, markRead); // Protected
router.delete('/:id', protect, deleteMessage); // Protected

module.exports = router;
