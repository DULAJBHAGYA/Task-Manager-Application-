import React, { useState, useEffect } from 'react';

const TaskForm = ({ task = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '',
    startDate: '',
    estimatedHours: '',
    tags: [],
    progress: 0,
    isRecurring: false,
    recurringPattern: '',
    recurringEndDate: '',
    assigneeId: '',
    projectId: ''
  });

  const [tagInput, setTagInput] = useState('');

  // Initialize form with task data if editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Pending',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : '',
        estimatedHours: task.estimatedHours || '',
        tags: task.tags || [],
        progress: task.progress || 0,
        isRecurring: task.isRecurring || false,
        recurringPattern: task.recurringPattern || '',
        recurringEndDate: task.recurringEndDate ? new Date(task.recurringEndDate).toISOString().split('T')[0] : '',
        assigneeId: task.assigneeId || '',
        projectId: task.projectId || ''
      });
    }
  }, [task]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert('Task title is required');
      return;
    }

    // Convert empty strings to null for optional fields
    const submitData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      dueDate: formData.dueDate || null,
      startDate: formData.startDate || null,
      estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null,
      recurringEndDate: formData.recurringEndDate || null,
      assigneeId: formData.assigneeId || null,
      projectId: formData.projectId || null
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Task Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Enter task title"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Enter task description"
        />
      </div>

      {/* Status and Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Progress and Estimated Hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-2">
            Progress ({formData.progress}%)
          </label>
          <input
            type="range"
            id="progress"
            name="progress"
            min="0"
            max="100"
            value={formData.progress}
            onChange={handleInputChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Hours
          </label>
          <input
            type="number"
            id="estimatedHours"
            name="estimatedHours"
            value={formData.estimatedHours}
            onChange={handleInputChange}
            min="0"
            step="0.5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="0.0"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tagInput" className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <input
          type="text"
          id="tagInput"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={handleTagInputKeyPress}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Press Enter to add a tag"
        />
        {formData.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Recurring Task */}
      <div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isRecurring"
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-700">
            Recurring Task
          </label>
        </div>
        
        {formData.isRecurring && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="recurringPattern" className="block text-sm font-medium text-gray-700 mb-2">
                Recurring Pattern
              </label>
              <select
                id="recurringPattern"
                name="recurringPattern"
                value={formData.recurringPattern}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="">Select pattern</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label htmlFor="recurringEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                id="recurringEndDate"
                name="recurringEndDate"
                value={formData.recurringEndDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
        </button>
      </div>
    </form>
  );
};

export default TaskForm; 