const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  searchUsers,
  addProjectMember,
  removeProjectMember,
  getProjectStats
} = require('../controllers/projectController');

// All routes require authentication
router.use(auth);

// Get all projects for the authenticated user
router.get('/', getAllProjects);

// Get project statistics
router.get('/stats', getProjectStats);

// Get a single project by ID
router.get('/:id', getProjectById);

// Create a new project
router.post('/', createProject);

// Update a project
router.put('/:id', updateProject);

// Delete a project
router.delete('/:id', deleteProject);

// Search users to add to project
router.get('/:projectId/search-users', searchUsers);

// Add member to project
router.post('/:projectId/members', addProjectMember);

// Remove member from project
router.delete('/:projectId/members/:userId', removeProjectMember);

module.exports = router; 