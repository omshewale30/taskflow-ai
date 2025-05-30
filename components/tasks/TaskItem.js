"use client";

import { useState } from 'react';
import { formatDistanceToNow, isPast, parseISO } from 'date-fns';
import { Calendar, CheckSquare, Square, CalendarPlus, Star, Trash2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import toast from 'react-hot-toast';

export default function TaskItem({ task, onUpdateStatus }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdatingImportance, setIsUpdatingImportance] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleStatusToggle = async () => {
    try {
      setIsUpdating(true);
      const newStatus = task.status === 'completed' ? 'open' : 'completed';
      await onUpdateStatus(task.id, newStatus);
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleImportance = async () => {
    try {
      setIsUpdatingImportance(true);
      const response = await apiClient.updateTaskImportance(task.id, !task.is_important);
      
      if (!response) throw new Error('No response received from server');
      
      // Update the task's is_important state
      task.is_important = !task.is_important;
      
      // Notify parent component to refresh the task list with the updated task data
      if (onUpdateStatus) onUpdateStatus(task.id, task.status);
      
      toast.success(task.is_important ? 'Added to important tasks' : 'Removed from important tasks');
    } catch (error) {
      console.error('Error updating task importance:', error);
      toast.error('Failed to update task importance');
    } finally {
      setIsUpdatingImportance(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await apiClient.deleteTask(task.id);
      if (onUpdateStatus) onUpdateStatus(task.id, 'deleted');
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleAddToCalendar = async () => {
    if (!task.due_date) return;
    
    try {
      setIsDownloading(true);
      const blob = await apiClient.getTaskCalendarEvent(task.id);
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TaskFlow_Event_${task.id.substring(0, 8)}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Calendar event downloaded');
    } catch (error) {
      console.error('Failed to download calendar event:', error);
      toast.error('Failed to download calendar event');
    } finally {
      setIsDownloading(false);
    }
  };
  
  const isDueDate = task.due_date && parseISO(task.due_date);
  const isOverdue = isDueDate && task.status === 'open' && isPast(parseISO(task.due_date));
  
  return (
    <div className={`p-4 rounded-md transition-all duration-200 ${task.status === 'completed' ? 'bg-background-hover opacity-80' : 'bg-background-hover'}`}>
      <div className="flex items-start gap-3">
        <button 
          disabled={isUpdating}
          onClick={handleStatusToggle}
          className={`mt-0.5 flex-shrink-0 ${isUpdating ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
          aria-label={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isUpdating ? (
            <div className="h-5 w-5 animate-pulse">
              <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : task.status === 'completed' ? (
            <CheckSquare className="h-5 w-5 text-primary" />
          ) : (
            <Square className="h-5 w-5 text-text-secondary" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <p className={`text-sm md:text-base ${task.status === 'completed' ? 'text-text-muted line-through' : 'text-text-primary'}`}>
            {task.description}
          </p>
          
          {task.due_date && (
            <div className="mt-1 flex items-center">
              <Calendar className={`h-3.5 w-3.5 mr-1 ${isOverdue ? 'text-error' : 'text-text-muted'}`} />
              <span className={`text-xs ${isOverdue ? 'text-error' : 'text-text-muted'}`}>
                {formatDueDate(task.due_date)}
              </span>
              <button
                onClick={handleAddToCalendar}
                disabled={isDownloading}
                className={`ml-2 p-1 rounded hover:bg-background-card text-text-muted hover:text-primary transition-colors ${
                  isDownloading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                title="Add to Calendar"
              >
                {isDownloading ? (
                  <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <CalendarPlus className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleToggleImportance}
            disabled={isUpdatingImportance}
            className={`p-1 rounded hover:bg-background-card transition-colors ${
              isUpdatingImportance ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            title={task.is_important ? "Remove from important" : "Mark as important"}
          >
            {isUpdatingImportance ? (
              <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Star className={`h-5 w-5 ${task.is_important ? 'text-yellow-400 fill-yellow-400' : 'text-text-muted'}`} />
            )}
          </button>

          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className={`p-1 rounded hover:bg-background-card transition-colors ${
              isDeleting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            title="Delete task"
          >
            {isDeleting ? (
              <svg className="animate-spin h-5 w-5 text-error" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Trash2 className="h-5 w-5 text-text-muted hover:text-error" />
            )}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background-card p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Task</h3>
            <p className="text-text-secondary mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-md text-text-secondary hover:bg-background-hover"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 rounded-md bg-error text-white hover:bg-error-dark disabled:opacity-70"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDueDate(dateString) {
  try {
    const date = parseISO(dateString);
    
    if (!isPast(date)) {
      return `Due ${formatDistanceToNow(date, { addSuffix: true })}`;
    }
    
    return `Overdue (${formatDistanceToNow(date, { addSuffix: true })})`;
  } catch (e) {
    return dateString;
  }
}