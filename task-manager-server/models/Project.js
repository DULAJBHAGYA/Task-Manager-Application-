const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
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
        len: [0, 2000]
      }
    },
    status: {
      type: DataTypes.ENUM('Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'),
      defaultValue: 'Planning'
    },
    priority: {
      type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
      defaultValue: 'Medium'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    budgetEstimated: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    budgetActual: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    budgetCurrency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD'
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING(50)),
      defaultValue: []
    },
    allowPublicAccess: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    requireApproval: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    autoArchive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    archiveAfterDays: {
      type: DataTypes.INTEGER,
      defaultValue: 90,
      validate: {
        min: 1,
        max: 365
      }
    }
  }, {
    tableName: 'projects',
    timestamps: true,
    hooks: {
      beforeSave: (project) => {
        // Update completed date when status changes to completed
        if (project.changed('status') && project.status === 'Completed' && !project.endDate) {
          project.endDate = new Date();
        }
      }
    }
  });

  // Instance methods
  Project.prototype.addTeamMember = function(userId, role = 'Developer', permissions = {}) {
    // Implementation for adding team member
    return this.save();
  };

  Project.prototype.removeTeamMember = function(userId) {
    // Implementation for removing team member
    return this.save();
  };

  Project.prototype.updateTeamMemberRole = function(userId, newRole) {
    // Implementation for updating team member role
    return this.save();
  };

  Project.prototype.addMilestone = function(milestoneData) {
    // Implementation for adding milestone
    return this.save();
  };

  Project.prototype.completeMilestone = function(milestoneIndex) {
    // Implementation for completing milestone
    return this.save();
  };

  Project.prototype.addRisk = function(riskData) {
    // Implementation for adding risk
    return this.save();
  };

  // Class methods
  Project.findByUser = function(userId, status = null) {
    const whereClause = {
      [sequelize.Op.or]: [
        { ownerId: userId },
        { managerId: userId }
      ]
    };
    
    if (status) whereClause.status = status;
    
    return this.findAll({
      where: whereClause,
      include: [
        {
          model: sequelize.models.User,
          as: 'owner',
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: sequelize.models.User,
          as: 'manager',
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      order: [['updatedAt', 'DESC']]
    });
  };

  Project.findOverdue = function() {
    return this.findAll({
      where: {
        dueDate: { [sequelize.Op.lt]: new Date() },
        status: { [sequelize.Op.nin]: ['Completed', 'Cancelled'] }
      },
      include: [{
        model: sequelize.models.User,
        as: 'owner',
        attributes: ['firstName', 'lastName', 'email']
      }]
    });
  };

  return Project;
}; 