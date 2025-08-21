const { Project, User, ProjectMember, Task } = require('../models');
const { Op } = require('sequelize');

// Get all projects for the authenticated user
const getAllProjects = async (req, res) => {
  try {
    const userId = req.userId;
    const { status, search, page = 1, limit = 10 } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build where clause
    const whereClause = {
      [Op.or]: [
        { ownerId: userId },
        { managerId: userId }
      ]
    };
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const projects = await Project.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: ProjectMember,
          as: 'members',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          }]
        },
        {
          model: Task,
          as: 'tasks',
          attributes: ['id', 'status']
        }
      ],
      order: [['updatedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    // Also get projects where user is a member
    const memberProjects = await Project.findAll({
      include: [
        {
          model: ProjectMember,
          as: 'members',
          where: { user_id: userId, isActive: true },
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          }]
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Task,
          as: 'tasks',
          attributes: ['id', 'status']
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    // Combine and deduplicate projects
    const allProjects = [...projects.rows, ...memberProjects];
    const uniqueProjects = allProjects.filter((project, index, self) => 
      index === self.findIndex(p => p.id === project.id)
    );
    
    // Calculate project statistics
    const projectsWithStats = uniqueProjects.map(project => {
      const projectData = project.toJSON();
      const totalTasks = projectData.tasks.length;
      const completedTasks = projectData.tasks.filter(task => task.status === 'Completed').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      return {
        ...projectData,
        taskStats: {
          total: totalTasks,
          completed: completedTasks,
          progress
        }
      };
    });
    
    res.json({
      success: true,
      message: 'Projects retrieved successfully',
      data: {
        projects: projectsWithStats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(uniqueProjects.length / limit),
          totalItems: uniqueProjects.length,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve projects',
      error: error.message
    });
  }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const project = await Project.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: ProjectMember,
          as: 'members',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          }]
        },
        {
          model: Task,
          as: 'tasks',
          include: [{
            model: User,
            as: 'assignee',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }]
        }
      ]
    });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check if user has access to this project
    const hasAccess = project.ownerId === userId || 
                     project.managerId === userId ||
                     project.members.some(member => member.user_id === userId);
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this project'
      });
    }
    
    res.json({
      success: true,
      message: 'Project retrieved successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Error getting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve project',
      error: error.message
    });
  }
};

// Create a new project
const createProject = async (req, res) => {
  try {
    const userId = req.userId;
    const projectData = {
      ...req.body,
      ownerId: userId
    };
    
    const project = await Project.create(projectData);
    
    // Add the creator as the first member with Owner role
    await ProjectMember.create({
      projectId: project.id,
      userId: userId,
      role: 'Owner',
      permissions: {
        canEdit: true,
        canDelete: true,
        canInvite: true,
        canManageTasks: true,
        canViewReports: true
      }
    });
    
    // Fetch the created project with associations
    const createdProject = await Project.findByPk(project.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: ProjectMember,
          as: 'members',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          }]
        }
      ]
    });
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project: createdProject }
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const updateData = req.body;
    
    const project = await Project.findByPk(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check if user has permission to edit
    const hasPermission = project.ownerId === userId || project.managerId === userId;
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit this project'
      });
    }
    
    await project.update(updateData);
    
    const updatedProject = await Project.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: ProjectMember,
          as: 'members',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          }]
        }
      ]
    });
    
    res.json({
      success: true,
      message: 'Project updated successfully',
      data: { project: updatedProject }
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const project = await Project.findByPk(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Only owner can delete the project
    if (project.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the project owner can delete this project'
      });
    }
    
    await project.destroy();
    
    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
};

// Search users to add to project
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const { projectId } = req.params;
    
    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: { users: [] }
      });
    }
    
    // Find users by name or email
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${query}%` } },
          { lastName: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
      limit: 10
    });
    
    // If projectId is provided, filter out users already in the project
    if (projectId) {
      const existingMembers = await ProjectMember.findAll({
        where: { project_id: projectId },
        attributes: ['user_id']
      });
      
      const existingUserIds = existingMembers.map(member => member.user_id);
      const filteredUsers = users.filter(user => !existingUserIds.includes(user.id));
      
      return res.json({
        success: true,
        data: { users: filteredUsers }
      });
    }
    
    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search users',
      error: error.message
    });
  }
};

// Add member to project
const addProjectMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, role = 'Developer' } = req.body;
    const currentUserId = req.userId;
    
    const project = await Project.findByPk(projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check if current user has permission to add members
    const hasPermission = project.ownerId === currentUserId || project.managerId === currentUserId;
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to add members to this project'
      });
    }
    
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user is already a member
    const existingMember = await ProjectMember.findOne({
      where: { project_id: projectId, user_id: userId }
    });
    
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this project'
      });
    }
    
    // Add member
    await ProjectMember.create({
      project_id: projectId,
      user_id: userId,
      role
    });
    
    // Fetch updated project with members
    const updatedProject = await Project.findByPk(projectId, {
      include: [
        {
          model: ProjectMember,
          as: 'members',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          }]
        }
      ]
    });
    
    res.json({
      success: true,
      message: 'Member added successfully',
      data: { project: updatedProject }
    });
  } catch (error) {
    console.error('Error adding project member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add project member',
      error: error.message
    });
  }
};

// Remove member from project
const removeProjectMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;
    const currentUserId = req.userId;
    
    const project = await Project.findByPk(projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check if current user has permission to remove members
    const hasPermission = project.ownerId === currentUserId || project.managerId === currentUserId;
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to remove members from this project'
      });
    }
    
    // Cannot remove the owner
    if (project.ownerId === parseInt(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove the project owner'
      });
    }
    
    // Remove member
    await ProjectMember.update(
      { isActive: false },
      { where: { project_id: projectId, user_id: userId } }
    );
    
    res.json({
      success: true,
      message: 'Member removed successfully'
    });
  } catch (error) {
    console.error('Error removing project member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove project member',
      error: error.message
    });
  }
};

// Get project statistics
const getProjectStats = async (req, res) => {
  try {
    const userId = req.userId;
    
    const userProjects = await Project.findAll({
      where: {
        [Op.or]: [
          { ownerId: userId },
          { managerId: userId },
          { '$members.user_id$': userId }
        ]
      },
      include: [
        {
          model: ProjectMember,
          as: 'members',
          attributes: ['id']
        },
        {
          model: Task,
          as: 'tasks',
          attributes: ['id', 'status']
        }
      ]
    });
    
    const stats = {
      totalProjects: userProjects.length,
      activeProjects: userProjects.filter(p => p.status === 'In Progress').length,
      completedProjects: userProjects.filter(p => p.status === 'Completed').length,
      totalTasks: userProjects.reduce((sum, p) => sum + p.tasks.length, 0),
      completedTasks: userProjects.reduce((sum, p) => 
        sum + p.tasks.filter(t => t.status === 'Completed').length, 0
      ),
      totalMembers: userProjects.reduce((sum, p) => sum + p.members.length, 0)
    };
    
    stats.completionRate = stats.totalProjects > 0 
      ? Math.round((stats.completedProjects / stats.totalProjects) * 100) 
      : 0;
    
    stats.taskCompletionRate = stats.totalTasks > 0 
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
      : 0;
    
    res.json({
      success: true,
      message: 'Project statistics retrieved successfully',
      data: { stats }
    });
  } catch (error) {
    console.error('Error getting project stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve project statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  searchUsers,
  addProjectMember,
  removeProjectMember,
  getProjectStats
}; 