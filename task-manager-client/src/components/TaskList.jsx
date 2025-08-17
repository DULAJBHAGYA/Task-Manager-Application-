import React from 'react';
import TaskCard from './TaskCard';

const TaskList = ({ filteredTasks, setEditingTask, deleteTask, changeTaskStatus }) => {
  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          setEditingTask={setEditingTask}
          deleteTask={deleteTask}
          changeTaskStatus={changeTaskStatus}
        />
      ))}
    </div>
  );
};

export default TaskList; 