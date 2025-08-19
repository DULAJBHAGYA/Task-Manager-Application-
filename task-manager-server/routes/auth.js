const express = require('express');
const router = express.Router();
const { signup, signin, getCurrentUser, logout } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/signin', signin);

// Protected routes
router.get('/me', auth, getCurrentUser);
router.post('/logout', auth, logout);

module.exports = router; 