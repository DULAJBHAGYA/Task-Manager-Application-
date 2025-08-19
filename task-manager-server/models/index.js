const { sequelize } = require('../config/database');

// Import models
const User = require('./User')(sequelize);
const Task = require('./Task')(sequelize);
const Project = require('./Project')(sequelize);
const Event = require('./Event')(sequelize);

// Define associations
// User associations
User.hasMany(Task, { as: 'createdTasks', foreignKey: 'creatorId' });
User.hasMany(Task, { as: 'assignedTasks', foreignKey: 'assigneeId' });
User.hasMany(Project, { as: 'ownedProjects', foreignKey: 'ownerId' });
User.hasMany(Project, { as: 'managedProjects', foreignKey: 'managerId' });
User.hasMany(Event, { as: 'createdEvents', foreignKey: 'creatorId' });

// Task associations
Task.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });
Task.belongsTo(User, { as: 'assignee', foreignKey: 'assigneeId' });
Task.belongsTo(Project, { as: 'project', foreignKey: 'projectId' });

// Project associations
Project.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
Project.belongsTo(User, { as: 'manager', foreignKey: 'managerId' });
Project.hasMany(Task, { as: 'tasks', foreignKey: 'projectId' });
Project.hasMany(Event, { as: 'events', foreignKey: 'projectId' });

// Event associations
Event.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });
Event.belongsTo(Project, { as: 'project', foreignKey: 'projectId' });

module.exports = {
  sequelize,
  User,
  Task,
  Project,
  Event
}; 