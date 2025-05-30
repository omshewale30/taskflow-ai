"use client";

import { useState, useEffect } from 'react';
import { isToday, parseISO } from 'date-fns';
import { apiClient } from '@/lib/apiClient';
import TaskItem from './TaskItem';

export default function DailyDigest() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDailyDigest();
  }, []);

  const fetchDailyDigest = async () => {
    try {
      setIsLoading(true);
      const allTasks = await apiClient.getUserTasks();
      // Filter only tasks due today
      const todayTasks = allTasks.filter(task => 
        task.due_date && isToday(parseISO(task.due_date))
      );
      setTasks(todayTasks);
      setError(null);
    } catch (err) {
      console.error('Error fetching daily digest:', err);
      setError('Failed to load daily digest. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskUpdate = async (taskId, newStatus) => {
    try {
      await apiClient.updateTaskStatus(taskId, newStatus);
      // Refresh the digest after updating a task
      await fetchDailyDigest();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-background-hover rounded-md"></div>
        <div className="h-24 bg-background-hover rounded-md"></div>
        <div className="h-24 bg-background-hover rounded-md"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-error/10 text-error rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdateStatus={handleTaskUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-text-muted">
          No tasks due today. Add some tasks with today's due date to see them here!
        </div>
      )}
    </div>
  );
} 