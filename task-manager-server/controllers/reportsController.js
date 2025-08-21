const { Task, Project, User, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get comprehensive analytics for the dashboard
const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const { timeRange = 'month' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Get task statistics
    const taskStats = await Task.findAll({
      where: {
        creatorId: userId,
        createdAt: { [Op.gte]: startDate }
      },
      attributes: [
        'status',
        'priority',
        [sequelize.fn('COUNT', sequelize.col('Task.id')), 'count']
      ],
      group: ['status', 'priority'],
      raw: true
    });

    // Get project statistics
    const projectStats = await Project.findAll({
      where: {
        [Op.or]: [
          { ownerId: userId },
          { managerId: userId }
        ],
        createdAt: { [Op.gte]: startDate }
      },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('Project.id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Get member projects
    const memberProjects = await Project.findAll({
      include: [
        {
          model: sequelize.models.ProjectMember,
          as: 'members',
          where: { user_id: userId, isActive: true },
          attributes: []
        }
      ],
      where: {
        createdAt: { [Op.gte]: startDate }
      },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('Project.id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Calculate totals
    const totalTasks = taskStats.reduce((sum, stat) => sum + parseInt(stat.count), 0);
    const completedTasks = parseInt(taskStats.find(stat => stat.status === 'Completed')?.count || 0);
    const pendingTasks = parseInt(taskStats.find(stat => stat.status === 'Pending')?.count || 0);
    const inProgressTasks = parseInt(taskStats.find(stat => stat.status === 'In Progress')?.count || 0);

    const totalProjects = projectStats.reduce((sum, stat) => sum + parseInt(stat.count), 0);
    const completedProjects = parseInt(projectStats.find(stat => stat.status === 'Completed')?.count || 0);
    const activeProjects = parseInt(projectStats.find(stat => stat.status === 'In Progress')?.count || 0);

    // Priority distribution
    const priorityDistribution = {
      High: taskStats.filter(stat => stat.priority === 'High').reduce((sum, stat) => sum + parseInt(stat.count), 0),
      Medium: taskStats.filter(stat => stat.priority === 'Medium').reduce((sum, stat) => sum + parseInt(stat.count), 0),
      Low: taskStats.filter(stat => stat.priority === 'Low').reduce((sum, stat) => sum + parseInt(stat.count), 0)
    };

    // Status distribution
    const statusDistribution = {
      'Pending': pendingTasks,
      'In Progress': inProgressTasks,
      'Completed': completedTasks
    };

    // Project status distribution
    const projectStatusDistribution = {
      'Planning': parseInt(projectStats.find(stat => stat.status === 'Planning')?.count || 0),
      'In Progress': activeProjects,
      'On Hold': parseInt(projectStats.find(stat => stat.status === 'On Hold')?.count || 0),
      'Completed': completedProjects
    };

    // Calculate completion rates
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const projectCompletionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    // Get recent activity
    const recentTasks = await Task.findAll({
      where: {
        creatorId: userId,
        createdAt: { [Op.gte]: startDate }
      },
      include: [
        { model: User, as: 'creator', attributes: ['firstName', 'lastName'] },
        { model: User, as: 'assignee', attributes: ['firstName', 'lastName'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    const recentProjects = await Project.findAll({
      where: {
        [Op.or]: [
          { ownerId: userId },
          { managerId: userId }
        ],
        createdAt: { [Op.gte]: startDate }
      },
      include: [
        { model: User, as: 'owner', attributes: ['firstName', 'lastName'] },
        { model: User, as: 'manager', attributes: ['firstName', 'lastName'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Combine recent activity
    const recentActivity = [
      ...recentTasks.map(task => ({
        id: task.id,
        title: task.title,
        type: 'task',
        status: task.status,
        createdAt: task.createdAt,
        creator: task.creator
      })),
      ...recentProjects.map(project => ({
        id: project.id,
        title: project.name,
        type: 'project',
        status: project.status,
        createdAt: project.createdAt,
        creator: project.owner
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

    res.json({
      success: true,
      message: 'Analytics retrieved successfully',
      data: {
        summary: {
          totalTasks,
          completedTasks,
          pendingTasks,
          inProgressTasks,
          totalProjects,
          completedProjects,
          activeProjects,
          taskCompletionRate,
          projectCompletionRate
        },
        distributions: {
          priority: priorityDistribution,
          status: statusDistribution,
          projectStatus: projectStatusDistribution
        },
        recentActivity
      }
    });
  } catch (error) {
    console.error('Error getting dashboard analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics',
      error: error.message
    });
  }
};

// Get task analytics
const getTaskAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const { timeRange = 'month', projectId } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    const whereClause = {
      creatorId: userId,
      createdAt: { [Op.gte]: startDate }
    };

    if (projectId && projectId !== 'all') {
      whereClause.projectId = projectId;
    }

    // Get task statistics
    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'creator', attributes: ['firstName', 'lastName'] },
        { model: User, as: 'assignee', attributes: ['firstName', 'lastName'] },
        { model: Project, as: 'project', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Calculate statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
    const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;

    // Priority distribution
    const priorityDistribution = {
      High: tasks.filter(task => task.priority === 'High').length,
      Medium: tasks.filter(task => task.priority === 'Medium').length,
      Low: tasks.filter(task => task.priority === 'Low').length
    };

    // Status distribution
    const statusDistribution = {
      'Pending': pendingTasks,
      'In Progress': inProgressTasks,
      'Completed': completedTasks
    };

    // Completion rate
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Average completion time (for completed tasks)
    const completedTasksWithDates = tasks.filter(task => 
      task.status === 'Completed' && task.completedDate && task.createdAt
    );

    let averageCompletionTime = 0;
    if (completedTasksWithDates.length > 0) {
      const totalTime = completedTasksWithDates.reduce((sum, task) => {
        const completionTime = new Date(task.completedDate) - new Date(task.createdAt);
        return sum + completionTime;
      }, 0);
      averageCompletionTime = Math.round(totalTime / completedTasksWithDates.length / (1000 * 60 * 60 * 24)); // Days
    }

    res.json({
      success: true,
      message: 'Task analytics retrieved successfully',
      data: {
        summary: {
          totalTasks,
          completedTasks,
          pendingTasks,
          inProgressTasks,
          completionRate,
          averageCompletionTime
        },
        distributions: {
          priority: priorityDistribution,
          status: statusDistribution
        },
        tasks: tasks.map(task => ({
          id: task.id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          createdAt: task.createdAt,
          completedDate: task.completedDate,
          creator: task.creator,
          assignee: task.assignee,
          project: task.project
        }))
      }
    });
  } catch (error) {
    console.error('Error getting task analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve task analytics',
      error: error.message
    });
  }
};

// Get project analytics
const getProjectAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const { timeRange = 'month' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Get projects where user is owner or manager
    const ownedProjects = await Project.findAll({
      where: {
        [Op.or]: [
          { ownerId: userId },
          { managerId: userId }
        ],
        createdAt: { [Op.gte]: startDate }
      },
      include: [
        { model: User, as: 'owner', attributes: ['firstName', 'lastName'] },
        { model: User, as: 'manager', attributes: ['firstName', 'lastName'] },
        { model: Task, as: 'tasks', attributes: ['id', 'status'] },
        { model: sequelize.models.ProjectMember, as: 'members', include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }] }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Get projects where user is a member
    const memberProjects = await Project.findAll({
      include: [
        {
          model: sequelize.models.ProjectMember,
          as: 'members',
          where: { user_id: userId, isActive: true },
          include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
        },
        { model: User, as: 'owner', attributes: ['firstName', 'lastName'] },
        { model: User, as: 'manager', attributes: ['firstName', 'lastName'] },
        { model: Task, as: 'tasks', attributes: ['id', 'status'] }
      ],
      where: {
        createdAt: { [Op.gte]: startDate }
      },
      order: [['createdAt', 'DESC']]
    });

    // Combine and deduplicate projects
    const allProjects = [...ownedProjects, ...memberProjects];
    const uniqueProjects = allProjects.filter((project, index, self) => 
      index === self.findIndex(p => p.id === project.id)
    );

    // Calculate statistics
    const totalProjects = uniqueProjects.length;
    const completedProjects = uniqueProjects.filter(project => project.status === 'Completed').length;
    const activeProjects = uniqueProjects.filter(project => project.status === 'In Progress').length;
    const planningProjects = uniqueProjects.filter(project => project.status === 'Planning').length;
    const onHoldProjects = uniqueProjects.filter(project => project.status === 'On Hold').length;

    // Status distribution
    const statusDistribution = {
      'Planning': planningProjects,
      'In Progress': activeProjects,
      'On Hold': onHoldProjects,
      'Completed': completedProjects
    };

    // Completion rate
    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    // Calculate average team size
    const totalTeamMembers = uniqueProjects.reduce((sum, project) => {
      return sum + (project.members ? project.members.length : 0);
    }, 0);
    const averageTeamSize = totalProjects > 0 ? Math.round(totalTeamMembers / totalProjects) : 0;

    // Calculate average tasks per project
    const totalTasks = uniqueProjects.reduce((sum, project) => {
      return sum + (project.tasks ? project.tasks.length : 0);
    }, 0);
    const averageTasksPerProject = totalProjects > 0 ? Math.round(totalTasks / totalProjects) : 0;

    res.json({
      success: true,
      message: 'Project analytics retrieved successfully',
      data: {
        summary: {
          totalProjects,
          completedProjects,
          activeProjects,
          planningProjects,
          onHoldProjects,
          completionRate,
          averageTeamSize,
          averageTasksPerProject
        },
        distributions: {
          status: statusDistribution
        },
        projects: uniqueProjects.map(project => ({
          id: project.id,
          name: project.name,
          status: project.status,
          progress: project.progress,
          createdAt: project.createdAt,
          owner: project.owner,
          manager: project.manager,
          memberCount: project.members ? project.members.length : 0,
          taskCount: project.tasks ? project.tasks.length : 0
        }))
      }
    });
  } catch (error) {
    console.error('Error getting project analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve project analytics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  getTaskAnalytics,
  getProjectAnalytics
}; 