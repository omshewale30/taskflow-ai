"use client";

import TaskItem from './TaskItem';

export default function UserTaskList({ tasks, onUpdateStatus }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary">No tasks yet. Process some notes to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
}