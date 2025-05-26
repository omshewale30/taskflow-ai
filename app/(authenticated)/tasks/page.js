"use client";

import { CheckSquare } from 'lucide-react';
import TaskTabs from '@/components/tasks/TaskTabs';

export default function TasksPage() {
  return (
    <div className="fade-in space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tasks</h1>
          <p className="text-text-secondary">Manage and track your action items</p>
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
              View and manage tasks from your meetings
            </p>
          </div>
        </div>
        
        <TaskTabs />
      </div>
    </div>
  );
}