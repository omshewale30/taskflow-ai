"use client";

import { useState, useEffect } from 'react';
import UserTaskList from '@/components/tasks/UserTaskList';
import { apiClient } from '@/lib/apiClient';
import Loading from '@/components/ui/Loading';
import { CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'open', 'completed'
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const taskData = await apiClient.getUserTasks();
        setTasks(taskData);
        setFilteredTasks(taskData);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        setError('Failed to load tasks');
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, []);
  
  useEffect(() => {
    if (filter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === filter));
    }
  }, [filter, tasks]);
  
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await apiClient.updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
      toast.success(`Task ${newStatus === 'completed' ? 'completed' : 'reopened'}`);
    } catch (error) {
      console.error('Failed to update task status:', error);
      toast.error('Failed to update task');
    }
  };

  if (isLoading) {
    return <Loading />;
  }
  
  return (
    <div className="fade-in space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tasks</h1>
          <p className="text-text-secondary">Manage and track your action items</p>
        </div>
        
        <div className="flex bg-background-card rounded-md p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              filter === 'all' 
                ? 'bg-primary text-background-dark' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              filter === 'open' 
                ? 'bg-primary text-background-dark' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              filter === 'completed' 
                ? 'bg-primary text-background-dark' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Completed
          </button>
        </div>
      </header>
      
      <div className="card">
        <div className="flex items-center mb-6 space-x-3">
          <div className="p-2 rounded-full bg-primary bg-opacity-10">
            <CheckSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Your Tasks</h2>
            <p className="text-text-secondary text-sm">
              {filteredTasks.length} {filter !== 'all' ? filter : ''} task{filteredTasks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        {error ? (
          <div className="p-4 rounded-md bg-error-background text-error">
            {error}
          </div>
        ) : (
          <UserTaskList 
            tasks={filteredTasks} 
            onUpdateStatus={handleUpdateTaskStatus} 
          />
        )}
      </div>
    </div>
  );
}