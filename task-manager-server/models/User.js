const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 255]
      }
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'manager'),
      defaultValue: 'user'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emailVerificationExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    theme: {
      type: DataTypes.ENUM('light', 'dark', 'auto'),
      defaultValue: 'light'
    },
    language: {
      type: DataTypes.ENUM('en', 'es', 'fr', 'de'),
      defaultValue: 'en'
    },
    timezone: {
      type: DataTypes.STRING,
      defaultValue: 'UTC'
    },
    emailNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    pushNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    smsNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    twoFactorAuth: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sessionTimeout: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
      validate: {
        min: 15,
        max: 480
      }
    },
    passwordExpiry: {
      type: DataTypes.INTEGER,
      defaultValue: 90,
      validate: {
        min: 30,
        max: 365
      }
    }
  }, {
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  // Instance methods
  User.prototype.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
  };

  User.prototype.getInitials = function() {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
  };

  User.prototype.isPasswordExpired = function() {
    if (!this.passwordExpiry) return false;
    
    const passwordAge = Date.now() - this.updatedAt;
    const expiryTime = this.passwordExpiry * 24 * 60 * 60 * 1000;
    
    return passwordAge > expiryTime;
  };

  User.prototype.getPublicProfile = function() {
    const userData = this.toJSON();
    delete userData.password;
    delete userData.emailVerificationToken;
    delete userData.passwordResetToken;
    delete userData.twoFactorSecret;
    
    return userData;
  };

  // Class methods
  User.findByEmail = function(email) {
    return this.findOne({ where: { email: email.toLowerCase() } });
  };

  return User;
}; 