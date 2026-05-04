const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/register', registerUser); // Note: Hide or protect this after first use
router.get('/profile', getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
