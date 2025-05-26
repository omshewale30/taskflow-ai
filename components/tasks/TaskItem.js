"use client";

import { useState } from 'react';
import { formatDistanceToNow, isPast, parseISO } from 'date-fns';
import { Calendar, CheckSquare, Square } from 'lucide-react';

export default function TaskItem({ task, onUpdateStatus }) {
  const [isUpdating, setIsUpdating] = useState(false);
  
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
            </div>
          )}
        </div>
      </div>
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