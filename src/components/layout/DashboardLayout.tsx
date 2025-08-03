/**
 * Main dashboard layout component that wraps all CMS views
 */
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useCMSStore } from '../../store/cmsStore';
import { cn } from '../../lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarOpen } = useCMSStore();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        'flex-1 flex flex-col min-w-0',
        sidebarOpen ? 'lg:ml-0' : 'ml-0'
      )}>
        <Header />
        
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
