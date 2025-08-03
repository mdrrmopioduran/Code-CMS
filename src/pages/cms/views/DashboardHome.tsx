/**
 * Dashboard home view with overview cards and quick actions
 */
import React, { useEffect } from 'react';
import { 
  FileText, 
  Image, 
  Users, 
  TrendingUp, 
  Plus, 
  Eye,
  Edit,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { useCMSStore } from '../../../store/cmsStore';
import { formatDate } from '../../../lib/utils';

export default function DashboardHome() {
  const { 
    pages, 
    posts, 
    mediaItems, 
    fetchPages, 
    fetchPosts, 
    fetchMedia,
    setCurrentView,
    user 
  } = useCMSStore();

  useEffect(() => {
    // Fetch data on component mount
    fetchPages();
    fetchPosts();
    fetchMedia();
  }, [fetchPages, fetchPosts, fetchMedia]);

  /**
   * Quick stats data
   */
  const stats = [
    {
      title: 'Total Pages',
      value: pages.length,
      change: '+12%',
      changeType: 'positive' as const,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Blog Posts',
      value: posts.length,
      change: '+8%',
      changeType: 'positive' as const,
      icon: Edit,
      color: 'bg-green-500',
    },
    {
      title: 'Media Files',
      value: mediaItems.length,
      change: '+23%',
      changeType: 'positive' as const,
      icon: Image,
      color: 'bg-purple-500',
    },
    {
      title: 'Page Views',
      value: '12.4K',
      change: '+15%',
      changeType: 'positive' as const,
      icon: Eye,
      color: 'bg-orange-500',
    },
  ];

  /**
   * Recent activities (mock data)
   */
  const recentActivities = [
    {
      id: '1',
      type: 'page_created',
      title: 'New page "About Us" created',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      user: 'John Doe',
    },
    {
      id: '2',
      type: 'post_published',
      title: 'Blog post "Getting Started" published',
      time: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      user: 'Jane Smith',
    },
    {
      id: '3',
      type: 'media_uploaded',
      title: '5 images uploaded to media library',
      time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      user: 'Mike Johnson',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}! 👋</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your website today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCurrentView('page-builder')}>
            <Plus className="h-4 w-4 mr-2" />
            New Page
          </Button>
          <Button variant="outline" onClick={() => setCurrentView('posts')}>
            <Edit className="h-4 w-4 mr-2" />
            Write Post
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span className="text-green-600">{stat.change}</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest changes to your website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{formatDate(activity.time)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setCurrentView('page-builder')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Page
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setCurrentView('posts')}
              >
                <Edit className="h-4 w-4 mr-2" />
                Write Blog Post
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setCurrentView('media')}
              >
                <Image className="h-4 w-4 mr-2" />
                Upload Media
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setCurrentView('analytics')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* System status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system health</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Storage Used</span>
                  <span>2.4 GB / 10 GB</span>
                </div>
                <Progress value={24} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Database</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Connected
                  </Badge>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Last Backup</span>
                  <span className="text-muted-foreground">2 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Site preview */}
      <Card>
        <CardHeader>
          <CardTitle>Live Site Preview</CardTitle>
          <CardDescription>Preview your published website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Your Website is Live!</h3>
            <p className="text-muted-foreground mb-4">
              Your website is published and accessible to visitors
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Update
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
