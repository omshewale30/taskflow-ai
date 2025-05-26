"use client";

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import UserTaskList from './UserTaskList';
import Loading from '@/components/ui/Loading';
import toast from 'react-hot-toast';

export default function TaskTabs() {
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filter, setFilter] = useState('all'); // 'all', 'open', 'completed'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [notesData, tasksData] = await Promise.all([
          apiClient.getNotesWithTasks(),
          apiClient.getUserTasks()
        ]);
        setNotes(notesData);
        setTasks(tasksData);
        setFilteredTasks(tasksData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load tasks');
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTasksForNote = async (noteId) => {
      try {
        setIsLoading(true);
        const tasksData = await apiClient.getTasksByNote(noteId);
        setFilteredTasks(tasksData);
      } catch (error) {
        console.error('Failed to fetch tasks for note:', error);
        toast.error('Failed to load tasks for this meeting');
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === 'all') {
      setFilteredTasks(tasks);
    } else {
      fetchTasksForNote(activeTab);
    }
  }, [activeTab, tasks]);

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

  const getTabLabel = (note) => {
    // Try to use the first line of the summary as the tab label
    if (note.summary) {
      const firstLine = note.summary.split('\n')[0];
      if (firstLine.length > 30) {
        return firstLine.substring(0, 27) + '...';
      }
      return firstLine;
    }
    // Fallback to date if no summary
    return new Date(note.created_at).toLocaleDateString();
  };

  if (isLoading && !tasks.length) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-primary text-background-dark'
              : 'text-text-secondary hover:text-text-primary hover:bg-background-card'
          }`}
        >
          All Tasks
        </button>
        {notes.map((note) => (
          <button
            key={note.id}
            onClick={() => setActiveTab(note.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === note.id
                ? 'bg-primary text-background-dark'
                : 'text-text-secondary hover:text-text-primary hover:bg-background-card'
            }`}
          >
            {getTabLabel(note)}
          </button>
        ))}
      </div>

      <div className="flex bg-background-card rounded-md p-1 mb-6">
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
  );
} 