const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  getTasksForCalendar
} = require('../controllers/taskController');

// All routes require authentication
router.use(auth);

// Get all tasks with filtering, searching, and pagination
router.get('/', getAllTasks);

// Get task statistics
router.get('/stats', getTaskStats);

// Get tasks for calendar view
router.get('/calendar', getTasksForCalendar);

// Get a single task by ID
router.get('/:id', getTaskById);

// Create a new task
router.post('/', createTask);

// Update a task
router.put('/:id', updateTask);

// Delete a task
router.delete('/:id', deleteTask);

module.exports = router; 