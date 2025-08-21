const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile, 
  getSettings, 
  updateSettings, 
  deleteProfile 
} = require('../controllers/userController');

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.delete('/profile', deleteProfile);

// Settings routes
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router; 