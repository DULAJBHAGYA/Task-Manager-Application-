const { Task, User, Project, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get all tasks for the authenticated user
const getAllTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, search, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    
    // Build where clause
    const whereClause = {
      creatorId: req.userId
    };

    if (status) {
      whereClause.status = status;
    }

    if (priority) {
      whereClause.priority = priority;
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Get tasks with pagination
    const { count, rows: tasks } = await Task.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'description']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: {
        tasks,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tasks',
      error: error.message
    });
  }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: { 
        id,
        creatorId: req.userId 
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'description']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve task',
      error: error.message
    });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status = 'Pending',
      priority = 'Medium',
      dueDate,
      startDate,
      estimatedHours,
      tags = [],
      progress = 0,
      isRecurring = false,
      recurringPattern,
      recurringEndDate,
      assigneeId,
      projectId
    } = req.body;

    // Validate required fields
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    // Validate status
    const validStatuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // Validate priority
    const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority value'
      });
    }

    // Validate recurring pattern
    const validRecurringPatterns = ['daily', 'weekly', 'monthly', 'yearly'];
    if (recurringPattern && !validRecurringPatterns.includes(recurringPattern)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recurring pattern'
      });
    }

    // Check if assignee exists (if provided)
    if (assigneeId) {
      const assignee = await User.findByPk(assigneeId);
      if (!assignee) {
        return res.status(400).json({
          success: false,
          message: 'Assignee not found'
        });
      }
    }

    // Check if project exists (if provided)
    if (projectId) {
      const project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(400).json({
          success: false,
          message: 'Project not found'
        });
      }
    }

    // Create the task
    const task = await Task.create({
      title: title.trim(),
      description: description?.trim(),
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      startDate: startDate ? new Date(startDate) : null,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
      tags: Array.isArray(tags) ? tags : [],
      progress: Math.max(0, Math.min(100, parseInt(progress) || 0)),
      isRecurring,
      recurringPattern,
      recurringEndDate: recurringEndDate ? new Date(recurringEndDate) : null,
      creatorId: req.userId,
      assigneeId,
      projectId
    });

    // Fetch the created task with associations
    const createdTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'description']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task: createdTask }
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      startDate,
      completedDate,
      estimatedHours,
      actualHours,
      tags,
      progress,
      isRecurring,
      recurringPattern,
      recurringEndDate,
      assigneeId,
      projectId
    } = req.body;

    // Find the task and ensure user owns it
    const task = await Task.findOne({
      where: { 
        id,
        creatorId: req.userId 
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Validate status
    const validStatuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // Validate priority
    const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority value'
      });
    }

    // Validate recurring pattern
    const validRecurringPatterns = ['daily', 'weekly', 'monthly', 'yearly'];
    if (recurringPattern && !validRecurringPatterns.includes(recurringPattern)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recurring pattern'
      });
    }

    // Check if assignee exists (if provided)
    if (assigneeId) {
      const assignee = await User.findByPk(assigneeId);
      if (!assignee) {
        return res.status(400).json({
          success: false,
          message: 'Assignee not found'
        });
      }
    }

    // Check if project exists (if provided)
    if (projectId) {
      const project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(400).json({
          success: false,
          message: 'Project not found'
        });
      }
    }

    // Update the task
    const updateData = {};

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim();
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (completedDate !== undefined) updateData.completedDate = completedDate ? new Date(completedDate) : null;
    if (estimatedHours !== undefined) updateData.estimatedHours = estimatedHours ? parseFloat(estimatedHours) : null;
    if (actualHours !== undefined) updateData.actualHours = actualHours ? parseFloat(actualHours) : null;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
    if (progress !== undefined) updateData.progress = Math.max(0, Math.min(100, parseInt(progress) || 0));
    if (isRecurring !== undefined) updateData.isRecurring = isRecurring;
    if (recurringPattern !== undefined) updateData.recurringPattern = recurringPattern;
    if (recurringEndDate !== undefined) updateData.recurringEndDate = recurringEndDate ? new Date(recurringEndDate) : null;
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId;
    if (projectId !== undefined) updateData.projectId = projectId;

    await task.update(updateData);

    // Fetch the updated task with associations
    const updatedTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'description']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task: updatedTask }
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: error.message
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the task and ensure user owns it
    const task = await Task.findOne({
      where: { 
        id,
        creatorId: req.userId 
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Delete the task
    await task.destroy();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message
    });
  }
};

// Get task statistics
const getTaskStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Get counts by status
    const statusStats = await Task.findAll({
      where: { creatorId: userId },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Get counts by priority
    const priorityStats = await Task.findAll({
      where: { creatorId: userId },
      attributes: [
        'priority',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['priority']
    });

    // Get overdue tasks
    const overdueTasks = await Task.count({
      where: {
        creatorId: userId,
        dueDate: {
          [Op.lt]: new Date()
        },
        status: {
          [Op.notIn]: ['Completed', 'Cancelled']
        }
      }
    });

    // Get tasks due today
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const dueTodayTasks = await Task.count({
      where: {
        creatorId: userId,
        dueDate: {
          [Op.between]: [startOfDay, endOfDay]
        },
        status: {
          [Op.notIn]: ['Completed', 'Cancelled']
        }
      }
    });

    // Get total tasks
    const totalTasks = await Task.count({
      where: { creatorId: userId }
    });

    // Get completed tasks this month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const completedThisMonth = await Task.count({
      where: {
        creatorId: userId,
        status: 'Completed',
        completedDate: {
          [Op.gte]: startOfMonth
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Task statistics retrieved successfully',
      data: {
        statusStats,
        priorityStats,
        overdueTasks,
        dueTodayTasks,
        totalTasks,
        completedThisMonth
      }
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve task statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
}; 