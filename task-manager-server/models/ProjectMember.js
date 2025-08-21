const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProjectMember = sequelize.define('ProjectMember', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.ENUM('Owner', 'Manager', 'Developer', 'Tester', 'Viewer'),
      defaultValue: 'Developer'
    },
    permissions: {
      type: DataTypes.JSONB,
      defaultValue: {
        canEdit: true,
        canDelete: false,
        canInvite: false,
        canManageTasks: true,
        canViewReports: true
      }
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'project_members',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['project_id', 'user_id']
      }
    ]
  });

  // Instance methods
  ProjectMember.prototype.hasPermission = function(permission) {
    return this.permissions && this.permissions[permission] === true;
  };

  ProjectMember.prototype.updatePermissions = function(newPermissions) {
    this.permissions = { ...this.permissions, ...newPermissions };
    return this.save();
  };

  // Class methods
  ProjectMember.findByProject = function(projectId) {
    return this.findAll({
      where: { projectId, isActive: true },
      include: [{
        model: sequelize.models.User,
        attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
      }],
      order: [['joinedAt', 'ASC']]
    });
  };

  ProjectMember.findByUser = function(userId) {
    return this.findAll({
      where: { userId, isActive: true },
      include: [{
        model: sequelize.models.Project,
        attributes: ['id', 'name', 'description', 'status', 'progress']
      }],
      order: [['joinedAt', 'DESC']]
    });
  };

  ProjectMember.addMember = function(projectId, userId, role = 'Developer', permissions = {}) {
    return this.create({
      projectId,
      userId,
      role,
      permissions: {
        canEdit: true,
        canDelete: false,
        canInvite: false,
        canManageTasks: true,
        canViewReports: true,
        ...permissions
      }
    });
  };

  ProjectMember.removeMember = function(projectId, userId) {
    return this.update(
      { isActive: false },
      { where: { projectId, userId } }
    );
  };

  return ProjectMember;
}; 