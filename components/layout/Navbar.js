"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Settings, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="bg-background-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">TaskFlow AI</span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              <NavLink href="/dashboard" active={isActive('/dashboard')} onClick={closeMobileMenu}>
                <LayoutDashboard className="h-5 w-5 mr-1.5" />
                Dashboard
              </NavLink>
              <NavLink href="/tasks" active={isActive('/tasks')} onClick={closeMobileMenu}>
                <CheckSquare className="h-5 w-5 mr-1.5" />
                Tasks
              </NavLink>
            </div>
          </div>
          
          {/* User dropdown (desktop) */}
          <div className="hidden md:flex md:items-center">
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-background-hover text-text-primary"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-background-dark font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
                <span>{user?.email?.split('@')[0] || 'User'}</span>
              </button>
              
              {/* User dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-background-card shadow-lg border border-border">
                  <div className="py-1 divide-y divide-border">
                    <div className="px-4 py-3">
                      <p className="text-sm text-text-muted">Signed in as</p>
                      <p className="text-sm font-medium truncate">{user?.email}</p>
                    </div>
                    <div>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm hover:bg-background-hover"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-error hover:bg-background-hover"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-primary focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink 
              href="/dashboard" 
              active={isActive('/dashboard')} 
              onClick={closeMobileMenu} 
              isMobile
            >
              <LayoutDashboard className="h-5 w-5 mr-2" />
              Dashboard
            </NavLink>
            <NavLink 
              href="/tasks" 
              active={isActive('/tasks')} 
              onClick={closeMobileMenu}
              isMobile
            >
              <CheckSquare className="h-5 w-5 mr-2" />
              Tasks
            </NavLink>
          </div>
          
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary text-background-dark">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium">{user?.email?.split('@')[0] || 'User'}</div>
                <div className="text-sm text-text-muted truncate">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link
                href="/settings"
                className="flex items-center px-3 py-2 rounded-md text-text-secondary hover:bg-background-hover hover:text-text-primary"
                onClick={closeMobileMenu}
              >
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </Link>
              <button
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
                className="flex w-full items-center px-3 py-2 rounded-md text-error hover:bg-background-hover"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, active, children, onClick, isMobile = false }) {
  const baseClasses = "flex items-center font-medium";
  const desktopClasses = active 
    ? "px-3 py-2 rounded-md text-primary border-b-2 border-primary" 
    : "px-3 py-2 rounded-md text-text-secondary hover:text-text-primary";
  const mobileClasses = active
    ? "block px-3 py-2 rounded-md text-primary bg-primary bg-opacity-10"
    : "block px-3 py-2 rounded-md text-text-secondary hover:bg-background-hover hover:text-text-primary";
    
  return (
    <Link 
      href={href} 
      className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses}`} 
      onClick={onClick}
    >
      {children}
    </Link>
  );
}