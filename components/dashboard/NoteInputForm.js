"use client";

import { useState } from 'react';
import { apiClient } from '@/lib/apiClient';

export default function NoteInputForm({ isProcessing, setIsProcessing, onSuccess, onError }) {
  const [notesText, setNotesText] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!notesText.trim()) {
      return;
    }
    
    try {
      setIsProcessing(true);
      const result = await apiClient.processNotes(notesText);
      onSuccess(result.note_id);
    } catch (error) {
      console.error('Processing failed:', error);
      onError(error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={notesText}
          onChange={(e) => setNotesText(e.target.value)}
          placeholder="Paste or type your meeting notes here..."
          className="form-textarea"
          rows="10"
          disabled={isProcessing}
          required
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isProcessing || !notesText.trim()}
          className={`btn-primary ${
            isProcessing || !notesText.trim() ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-background-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing with AI...
            </span>
          ) : (
            'Process Notes'
          )}
        </button>
      </div>
    </form>
  );
}