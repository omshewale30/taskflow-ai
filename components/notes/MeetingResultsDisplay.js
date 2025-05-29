"use client";

import { useState } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { Calendar, CheckCircle2, FileText, ListTodo, ChevronUp, ChevronDown, CalendarPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Markdown from 'react-markdown';
import { apiClient } from '@/lib/apiClient';
import toast from 'react-hot-toast';

export default function MeetingResultsDisplay({ noteData, onSaveTasks, isSaving }) {
  const router = useRouter();
  const [tasks, setTasks] = useState(noteData?.extracted_tasks || []);
  const [showOriginalNotes, setShowOriginalNotes] = useState(false);
  const [downloadingTaskId, setDownloadingTaskId] = useState(null);
  
  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value
    };
    setTasks(updatedTasks);
  };
  
  const handleRemoveTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSaveClick = () => {
    onSaveTasks(tasks);
  };

  const handleAddToCalendar = async (taskId, description, dueDate) => {
    if (!dueDate) return;
    
    try {
      setDownloadingTaskId(taskId);
      const blob = await apiClient.getTaskCalendarEvent(taskId);
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TaskFlow_Event_${taskId.substring(0, 8)}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Calendar event downloaded');
    } catch (error) {
      console.error('Failed to download calendar event:', error);
      toast.error('Failed to download calendar event');
    } finally {
      setDownloadingTaskId(null);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'yyyy-MM-dd') : dateString;
  };
  
  if (!noteData) {
    return (
      <div className="text-center p-8">
        <p className="text-text-secondary">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold mb-2">Meeting Results</h1>
        <p className="text-text-secondary">Review AI-generated summary and extracted tasks</p>
      </header>
      
      {/* Original Notes (collapsible) */}
      <div className="card">
        <button
          onClick={() => setShowOriginalNotes(!showOriginalNotes)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-background-hover">
              <FileText className="h-5 w-5 text-text-primary" />
            </div>
            <h2 className="text-lg font-medium">Original Notes</h2>
          </div>
          {showOriginalNotes ? (
            <ChevronUp className="h-5 w-5 text-text-secondary" />
          ) : (
            <ChevronDown className="h-5 w-5 text-text-secondary" />
          )}
        </button>
        
        {showOriginalNotes && (
          <div className="mt-4 p-4 bg-background-hover rounded-md max-h-80 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-text-secondary text-sm font-mono">
              {noteData.original_text}
            </pre>
          </div>
        )}
      </div>
      
      {/* AI Summary */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-full bg-primary bg-opacity-10">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-medium">AI Summary</h2>
        </div>
        <div className="p-4 bg-background-hover rounded-md">
          <Markdown
            components={{
              p: ({ node, ...props }) => <p className="text-text-primary" {...props} />,
              h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-text-primary mb-4" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-text-primary mb-3" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-text-primary mb-2" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside text-text-primary mb-4" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-text-primary mb-4" {...props} />,
              li: ({ node, ...props }) => <li className="text-text-primary mb-1" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-bold text-text-primary" {...props} />,
              em: ({ node, ...props }) => <em className="italic text-text-primary" {...props} />,
              a: ({ node, ...props }) => <a className="text-primary hover:underline" {...props} />,
              blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary pl-4 italic text-text-primary mb-4" {...props} />
            }}
          >
            {noteData.summary}
          </Markdown>
        </div>
      </div>
      
      {/* Extracted Tasks */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-full bg-primary bg-opacity-10">
            <ListTodo className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-medium">Extracted Action Items</h2>
            <p className="text-sm text-text-secondary">
              Review and edit the tasks before saving
            </p>
          </div>
        </div>
        
        {tasks.length === 0 ? (
          <div className="text-center p-6 bg-background-hover rounded-md">
            <p className="text-text-secondary">No tasks were extracted from these notes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div key={index} className="p-4 bg-background-hover rounded-md">
                <div className="flex flex-col space-y-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">
                      Task Description
                    </label>
                    <input
                      type="text"
                      value={task.description}
                      onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                      className="form-input"
                      placeholder="Task description"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <label className="block text-sm text-text-secondary mb-1">
                        Due Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-text-muted" />
                        </div>
                        <input
                          type="date"
                          value={formatDate(task.due_date)}
                          onChange={(e) => handleTaskChange(index, 'due_date', e.target.value)}
                          className="form-input pl-10"
                        />
                      </div>
                    </div>
                    
                    {task.due_date && (
                      <button
                        type="button"
                        onClick={() => handleAddToCalendar(task.id || `temp-${index}`, task.description, task.due_date)}
                        disabled={downloadingTaskId === (task.id || `temp-${index}`)}
                        className={`mt-6 p-2 text-primary hover:bg-background-card rounded-md ${
                          downloadingTaskId === (task.id || `temp-${index}`) ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                        title="Add to Calendar"
                      >
                        {downloadingTaskId === (task.id || `temp-${index}`) ? (
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <CalendarPlus className="h-5 w-5" />
                        )}
                      </button>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(index)}
                      className="mt-6 p-2 text-error hover:bg-background-card rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 flex items-center justify-end space-x-4">
          <button 
            type="button" 
            onClick={() => router.push('/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveClick}
            disabled={isSaving || tasks.length === 0}
            className={`btn-primary ${
              isSaving || tasks.length === 0 ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-background-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Tasks...
              </span>
            ) : (
              'Save Tasks'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}