const express = require('express');
const router = express.Router();
const { Event, User, Project } = require('../models');

// Get all events for the authenticated user
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, type } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = { creatorId: req.userId };
    
    if (startDate && endDate) {
      whereClause.dueDate = {
        [require('sequelize').Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    if (type) {
      whereClause.type = type;
    }
    
    const events = await Event.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['name', 'id']
        }
      ],
      order: [['dueDate', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      data: {
        events: events.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(events.count / limit),
          totalItems: events.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
});

// Create a new event
router.post('/', async (req, res) => {
  try {
    const { title, description, dueDate, time, duration, type, priority, status, projectId } = req.body;
    
    const eventData = {
      title,
      description,
      dueDate: new Date(dueDate),
      time,
      duration: parseInt(duration) || 60,
      type: type || 'event',
      priority: priority || 'Medium',
      status: status || 'Pending',
      creatorId: req.userId,
      projectId: projectId || null
    };
    
    const event = await Event.create(eventData);
    
    const createdEvent = await Event.findByPk(event.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['name', 'id']
        }
      ]
    });
    
    res.status(201).json({
      success: true,
      data: { event: createdEvent }
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ success: false, message: 'Failed to create event' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { 
        id: req.params.id,
        creatorId: req.userId 
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['name', 'id']
        }
      ]
    });
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    res.json({
      success: true,
      data: { event }
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch event' });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const { title, description, dueDate, time, duration, type, priority, status, projectId } = req.body;
    
    const event = await Event.findOne({
      where: { 
        id: req.params.id,
        creatorId: req.userId 
      }
    });
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    const updateData = {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : event.dueDate,
      time,
      duration: duration ? parseInt(duration) : event.duration,
      type: type || event.type,
      priority: priority || event.priority,
      status: status || event.status,
      projectId: projectId || event.projectId
    };
    
    await event.update(updateData);
    
    const updatedEvent = await Event.findByPk(event.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['name', 'id']
        }
      ]
    });
    
    res.json({
      success: true,
      data: { event: updatedEvent }
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ success: false, message: 'Failed to update event' });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { 
        id: req.params.id,
        creatorId: req.userId 
      }
    });
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    await event.destroy();
    
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ success: false, message: 'Failed to delete event' });
  }
});

module.exports = router; 