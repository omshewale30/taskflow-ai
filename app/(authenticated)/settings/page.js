"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="fade-in space-y-6">
      <header>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-text-secondary">Manage your account settings</p>
      </header>
      
      <div className="card">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-background-hover">
            <User className="h-6 w-6 text-text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Account</h2>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Email
            </label>
            <div className="form-input bg-background-hover cursor-not-allowed">
              {user?.email || 'Not available'}
            </div>
            <p className="mt-1 text-xs text-text-muted">Your email address is used for account login</p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="btn-secondary text-error flex items-center space-x-2"
          >
            {isLoggingOut ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-error" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <LogOut className="h-5 w-5" />
                <span>Log out</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}