const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getDashboardAnalytics,
  getTaskAnalytics,
  getProjectAnalytics
} = require('../controllers/reportsController');

// All routes require authentication
router.use(auth);

// Get comprehensive dashboard analytics
router.get('/dashboard', getDashboardAnalytics);

// Get task analytics
router.get('/tasks', getTaskAnalytics);

// Get project analytics
router.get('/projects', getProjectAnalytics);

module.exports = router; 