"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import MeetingResultsDisplay from '@/components/notes/MeetingResultsDisplay';
import { apiClient } from '@/lib/apiClient';
import Loading from '@/components/ui/Loading';
import toast from 'react-hot-toast';

export default function NoteResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { noteId } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [noteData, setNoteData] = useState(null);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchNoteData = async () => {
      try {
        setIsLoading(true);
        // This would typically fetch the note results from a backend API
        // For now, we'll use our cached API result from local storage as a workaround
        const cachedResult = localStorage.getItem(`note_result_${noteId}`);
        
        if (cachedResult) {
          setNoteData(JSON.parse(cachedResult));
        } else {
          // In a real implementation, this would be:
          // const data = await apiClient.getNoteById(noteId);
          toast.error('Note data not found');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Failed to fetch note data:', error);
        setError('Failed to load the meeting notes results');
        toast.error('Failed to load meeting notes results');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (noteId) {
      fetchNoteData();
    }
  }, [noteId, router]);
  
  const handleSaveTasks = async (tasks) => {
    try {
      setIsSaving(true);
      await apiClient.saveProcessedTasks(noteId, tasks);
      toast.success('Tasks saved successfully!');
      router.push('/tasks');
    } catch (error) {
      console.error('Failed to save tasks:', error);
      toast.error('Failed to save tasks');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return <Loading />;
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-4">Error</h1>
        <p className="text-text-secondary mb-6">{error}</p>
        <button 
          onClick={() => router.push('/dashboard')} 
          className="btn-secondary"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }
  
  if (!noteData) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Note Not Found</h1>
        <p className="text-text-secondary mb-6">The requested note could not be found.</p>
        <button 
          onClick={() => router.push('/dashboard')} 
          className="btn-secondary"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div className="fade-in">
      <MeetingResultsDisplay 
        noteData={noteData} 
        onSaveTasks={handleSaveTasks}
        isSaving={isSaving}
      />
    </div>
  );
}