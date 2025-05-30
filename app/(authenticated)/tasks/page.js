'use client';

import { useState, useEffect } from 'react';
import DailyDigest from '@/components/tasks/DailyDigest';
import TaskTabs from '@/components/tasks/TaskTabs';

export default function TasksPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false after initial render
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-700 rounded"></div>
          <div className="space-y-2">
            <div className="h-16 bg-slate-700 rounded"></div>
            <div className="h-16 bg-slate-700 rounded"></div>
            <div className="h-16 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">

      
      {/* Daily Digest Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Today's Focus</h2>
        <DailyDigest />
      </div>
      
      {/* All Tasks Section with Tabs */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-200">All Tasks</h2>
        <TaskTabs />
      </div>
    </div>
  );
} 