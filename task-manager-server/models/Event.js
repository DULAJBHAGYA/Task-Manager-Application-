const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Event = sequelize.define('Event', {
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING(5),
      allowNull: false,
      validate: {
        is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 60,
      validate: {
        min: 0
      }
    },
    type: {
      type: DataTypes.ENUM('event', 'meeting', 'deadline', 'presentation', 'task'),
      defaultValue: 'event'
    },
    priority: {
      type: DataTypes.ENUM('Low', 'Medium', 'High'),
      defaultValue: 'Medium'
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    }
  }, {
    tableName: 'events',
    timestamps: true
  });

  return Event;
}; 