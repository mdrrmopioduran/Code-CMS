/**
 * Main sidebar navigation component for the CMS dashboard
 */
import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Image, 
  Puzzle, 
  Database,
  Palette,
  FileDown,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { useCMSStore } from '../../store/cmsStore';
import { cn } from '../../lib/utils';

interface SidebarProps {
  className?: string;
}

/**
 * Navigation item interface
 */
interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'main' | 'content' | 'system';
  badge?: string;
}

const navItems: NavItem[] = [
  // Main
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'main' },
  { id: 'page-builder', label: 'Page Builder', icon: Puzzle, category: 'main' },
  
  // Content
  { id: 'pages', label: 'Pages', icon: FileText, category: 'content' },
  { id: 'posts', label: 'Posts', icon: FileText, category: 'content' },
  { id: 'media', label: 'Media Library', icon: Image, category: 'content' },
  { id: 'downloads', label: 'Downloads', icon: FileDown, category: 'content' },
  
  // System
  { id: 'users', label: 'Users', icon: Users, category: 'system' },
  { id: 'themes', label: 'Themes', icon: Palette, category: 'system' },
  { id: 'database', label: 'Database', icon: Database, category: 'system' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, category: 'system' },
  { id: 'settings', label: 'Settings', icon: Settings, category: 'system' },
];

export default function Sidebar({ className }: SidebarProps) {
  const { sidebarOpen, setSidebarOpen, currentView, setCurrentView, user } = useCMSStore();

  /**
   * Handle navigation item click
   */
  const handleNavClick = (itemId: string) => {
    setCurrentView(itemId);
  };

  /**
   * Render navigation section
   */
  const renderNavSection = (category: string, items: NavItem[]) => (
    <div className="mb-6">
      <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {category}
      </h3>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3 px-3 h-10',
                isActive && 'bg-secondary text-secondary-foreground font-medium'
              )}
              onClick={() => handleNavClick(item.id)}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                  {item.badge}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );

  if (!sidebarOpen) {
    return (
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      <div className={cn(
        'fixed left-0 top-0 z-50 h-full w-72 bg-background border-r shadow-lg lg:shadow-none lg:relative lg:z-auto',
        className
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">CMS</span>
              </div>
              <div>
                <h1 className="font-semibold text-lg">Web Creator</h1>
                <p className="text-xs text-muted-foreground">Modern CMS</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User info */}
          {user && (
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <ScrollArea className="flex-1 p-4">
            {renderNavSection('Main', navItems.filter(item => item.category === 'main'))}
            {renderNavSection('Content', navItems.filter(item => item.category === 'content'))}
            {renderNavSection('System', navItems.filter(item => item.category === 'system'))}
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Web Creator CMS v1.0.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
