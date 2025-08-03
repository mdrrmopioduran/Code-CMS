/**
 * Main header component for the CMS dashboard
 */
import React from 'react';
import { Bell, Search, Moon, Sun, LogOut, User, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { useCMSStore } from '../../store/cmsStore';
import { useTheme } from '../theme-provider';

interface HeaderProps {
  title?: string;
  breadcrumb?: string[];
}

export default function Header({ title = 'Dashboard', breadcrumb = [] }: HeaderProps) {
  const { user, logout, currentView, setCurrentView } = useCMSStore();
  const { theme, setTheme } = useTheme();

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    logout();
  };

  /**
   * Get page title based on current view
   */
  const getPageTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      'page-builder': 'Page Builder',
      pages: 'Pages',
      posts: 'Posts',
      media: 'Media Library',
      downloads: 'Downloads',
      users: 'User Management',
      themes: 'Themes',
      database: 'Database',
      analytics: 'Analytics',
      settings: 'Settings',
    };
    return titles[currentView] || title;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Title and breadcrumb */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
            {breadcrumb.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {breadcrumb.map((crumb, index) => (
                  <React.Fragment key={crumb}>
                    {index > 0 && <span>/</span>}
                    <span>{crumb}</span>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pages, posts, media..."
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Right side - Actions and user menu */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              3
            </Badge>
          </Button>

          {/* Quick actions */}
          <Button
            variant="default"
            size="sm"
            onClick={() => setCurrentView('page-builder')}
          >
            New Page
          </Button>

          {/* User menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => setCurrentView('settings')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => setCurrentView('settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
