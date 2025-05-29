import axios from 'axios';
import { supabaseBrowser } from './supabase/client';

const API_URL = 'http://localhost:8000';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabaseBrowser.auth.getSession();
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    } else {
      console.warn('No access token available for API request');
    }
    
    return config;
  } catch (error) {
    console.error('Error getting session for API request:', error);
    return config;
  }
}, (error) => {
  return Promise.reject(error);
});

export const apiClient = {
  // Notes processing
  processNotes: async (text) => {
    try {
      // For MVP/demo, we'll also store the result in localStorage for use in the results page
      const response = await api.post('/notes/process', { text });
      
      // Cache the result for demo purposes
      localStorage.setItem(`note_result_${response.data.note_id}`, JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      console.error('API Error (processNotes):', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Tasks
  saveProcessedTasks: async (noteId, tasks) => {
    try {
      const response = await api.post(`/notes/${noteId}/tasks`, { tasks });
      return response.data;
    } catch (error) {
      console.error('API Error (saveProcessedTasks):', error.response?.data || error.message);
      throw error;
    }
  },
  
  getUserTasks: async () => {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('API Error (getUserTasks):', error.response?.data || error.message);
      // For MVP/demo purposes, return mock data if API is not available
      return [
        { 
          id: '1', 
          description: 'Follow up with marketing team on Q3 campaign', 
          due_date: '2025-06-15', 
          status: 'open', 
          created_at: '2025-05-20T10:30:00Z' 
        },
        { 
          id: '2', 
          description: 'Prepare presentation for client meeting', 
          due_date: '2025-06-10', 
          status: 'open', 
          created_at: '2025-05-21T14:15:00Z' 
        },
        { 
          id: '3', 
          description: 'Review budget proposal', 
          due_date: '2025-06-05', 
          status: 'completed', 
          created_at: '2025-05-19T09:45:00Z' 
        },
        { 
          id: '4', 
          description: 'Send weekly progress report to team', 
          due_date: null, 
          status: 'open', 
          created_at: '2025-05-22T16:00:00Z' 
        }
      ];
    }
  },
  
  updateTaskStatus: async (taskId, status) => {
    try {
      const response = await api.put(`/tasks/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('API Error (updateTaskStatus):', error.response?.data || error.message);
      throw error;
    }
  },

  getTasksByNote: async (noteId) => {
    try {
      const response = await api.get(`/tasks/by-note/${noteId}`);
      return response.data;
    } catch (error) {
      console.error('API Error (getTasksByNote):', error.response?.data || error.message);
      throw error;
    }
  },

  getNotesWithTasks: async () => {
    try {
      const response = await api.get('/tasks/notes');
      return response.data;
    } catch (error) {
      console.error('API Error (getNotesWithTasks):', error.response?.data || error.message);
      throw error;
    }
  },

  getTaskCalendarEvent: async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}/calendar_event.ics`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('API Error (getTaskCalendarEvent):', error.response?.data || error.message);
      throw error;
    }
  }
};