const { User, Task, Project, Event } = require('../models');
const { Op } = require('sequelize');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = user.getPublicProfile();

    res.status(200).json({
      success: true,
      data: {
        user: userData
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, avatar } = req.body;

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken'
        });
      }
    }

    // Update user fields
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email.toLowerCase();
    if (avatar !== undefined) updateData.avatar = avatar;

    await user.update(updateData);

    const userData = user.getPublicProfile();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: userData
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user settings
const getSettings = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const settings = {
      theme: user.theme,
      language: user.language,
      timezone: user.timezone,
      notifications: {
        email: user.emailNotifications,
        push: user.pushNotifications,
        sms: user.smsNotifications
      },
      security: {
        twoFactorAuth: user.twoFactorAuth,
        sessionTimeout: user.sessionTimeout,
        passwordExpiry: user.passwordExpiry
      }
    };

    res.status(200).json({
      success: true,
      data: {
        settings
      }
    });

  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user settings
const updateSettings = async (req, res) => {
  try {
    const { theme, language, timezone, notifications, security } = req.body;

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update settings fields
    const updateData = {};
    if (theme) updateData.theme = theme;
    if (language) updateData.language = language;
    if (timezone) updateData.timezone = timezone;
    
    if (notifications) {
      if (notifications.email !== undefined) updateData.emailNotifications = notifications.email;
      if (notifications.push !== undefined) updateData.pushNotifications = notifications.push;
      if (notifications.sms !== undefined) updateData.smsNotifications = notifications.sms;
    }
    
    if (security) {
      if (security.twoFactorAuth !== undefined) updateData.twoFactorAuth = security.twoFactorAuth;
      if (security.sessionTimeout !== undefined) updateData.sessionTimeout = security.sessionTimeout;
      if (security.passwordExpiry !== undefined) updateData.passwordExpiry = security.passwordExpiry;
    }

    await user.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully'
    });

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete user profile
const deleteProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete all associated data first (due to foreign key constraints)
    // Delete user's tasks
    await Task.destroy({
      where: {
        [Op.or]: [
          { creatorId: req.userId },
          { assigneeId: req.userId }
        ]
      }
    });

    // Delete user's projects
    await Project.destroy({
      where: {
        [Op.or]: [
          { ownerId: req.userId },
          { managerId: req.userId }
        ]
      }
    });

    // Delete user's events
    await Event.destroy({
      where: { creatorId: req.userId }
    });

    // Finally delete the user
    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });

  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getSettings,
  updateSettings,
  deleteProfile
}; 