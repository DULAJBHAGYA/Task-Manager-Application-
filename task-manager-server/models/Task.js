const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000]
      }
    },
    status: {
      type: DataTypes.ENUM('Pending', 'In Progress', 'Completed', 'Cancelled'),
      defaultValue: 'Pending'
    },
    priority: {
      type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
      defaultValue: 'Medium'
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    completedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estimatedHours: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    actualHours: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING(50)),
      defaultValue: []
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    recurringPattern: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
      allowNull: true
    },
    recurringEndDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastRecurred: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'tasks',
    timestamps: true,
    hooks: {
      beforeSave: (task) => {
        // Update completed date when status changes to completed
        if (task.changed('status') && task.status === 'Completed' && !task.completedDate) {
          task.completedDate = new Date();
        }
      }
    }
  });

  // Instance methods
  Task.prototype.addComment = function(userId, content) {
    // Implementation for adding comments
    return this.save();
  };

  Task.prototype.addSubtask = function(title) {
    // Implementation for adding subtasks
    return this.save();
  };

  Task.prototype.completeSubtask = function(subtaskIndex) {
    // Implementation for completing subtasks
    return this.save();
  };

  Task.prototype.updateProgress = function(progress) {
    this.progress = Math.max(0, Math.min(100, progress));
    if (this.progress === 100 && this.status !== 'Completed') {
      this.status = 'Completed';
      this.completedDate = new Date();
    }
    return this.save();
  };

  // Class methods
  Task.findOverdue = function() {
    return this.findAll({
      where: {
        dueDate: { [sequelize.Op.lt]: new Date() },
        status: { [sequelize.Op.ne]: 'Completed' }
      },
      include: [{
        model: sequelize.models.User,
        as: 'assignee',
        attributes: ['firstName', 'lastName', 'email']
      }]
    });
  };

  Task.findByUser = function(userId, status = null) {
    const whereClause = { assigneeId: userId };
    if (status) whereClause.status = status;
    
    return this.findAll({
      where: whereClause,
      include: [
        {
          model: sequelize.models.Project,
          as: 'project',
          attributes: ['name']
        },
        {
          model: sequelize.models.User,
          as: 'creator',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['dueDate', 'ASC'], ['priority', 'DESC']]
    });
  };

  return Task;
}; 