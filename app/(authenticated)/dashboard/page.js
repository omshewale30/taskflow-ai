"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NoteInputForm from '@/components/dashboard/NoteInputForm';
import { BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleProcessSuccess = (noteId) => {
    setIsProcessing(false);
    toast.success('Notes processed successfully!');
    router.push(`/notes/${noteId}/results`);
  };
  
  const handleProcessError = (error) => {
    setIsProcessing(false);
    toast.error(`Error: ${error.message || 'Failed to process notes'}`);
  };

  return (
    <div className="fade-in space-y-6">
      <header>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-text-secondary">Input your meeting notes to process with AI</p>
      </header>
      
      <div className="card p-6 md:p-8">
        <div className="flex items-center mb-6 space-x-3">
          <div className="p-2 rounded-full bg-primary bg-opacity-10">
            <BrainCircuit className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Meeting Notes Processor</h2>
            <p className="text-text-secondary text-sm">
              Paste your meeting notes below to generate AI summaries and extract tasks
            </p>
          </div>
        </div>
        
        <NoteInputForm 
          isProcessing={isProcessing} 
          setIsProcessing={setIsProcessing}
          onSuccess={handleProcessSuccess}
          onError={handleProcessError}
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">How it works</h3>
          <ol className="space-y-3 list-decimal list-inside text-text-secondary">
            <li>Paste your meeting notes or transcript</li>
            <li>Our AI will process the text to create a concise summary</li>
            <li>Action items and tasks will be automatically identified</li>
            <li>Review the results and save the tasks to your task list</li>
          </ol>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Tips for best results</h3>
          <ul className="space-y-3 list-disc list-inside text-text-secondary">
            <li>Include full context in your meeting notes</li>
            <li>Mention deadlines with specific dates when possible</li>
            <li>Be explicit about action items and ownership</li>
            <li>Review extracted tasks to make any necessary edits</li>
          </ul>
        </div>
      </div>
    </div>
  );
}