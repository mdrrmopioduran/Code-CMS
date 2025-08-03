/**
 * Main CMS dashboard container component
 */
import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useCMSStore } from '../../store/cmsStore';
import DashboardHome from './views/DashboardHome';
import PageBuilder from './views/PageBuilder';
import PagesView from './views/Pages';
import PostsView from './views/Posts';
import MediaView from './views/Media';
import DownloadsView from './views/Downloads';
import UsersView from './views/Users';
import ThemesView from './views/Themes';
import DatabaseView from './views/Database';
import AnalyticsView from './views/Analytics';
import SettingsView from './views/Settings';
import FormsView from './views/Forms';

export default function CMSDashboard() {
  const { currentView } = useCMSStore();

  /**
   * Render the current view based on navigation selection
   */
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardHome />;
      case 'page-builder':
        return <PageBuilder />;
      case 'pages':
        return <PagesView />;
      case 'posts':
        return <PostsView />;
      case 'media':
        return <MediaView />;
      case 'downloads':
        return <DownloadsView />;
      case 'users':
        return <UsersView />;
      case 'themes':
        return <ThemesView />;
      case 'database':
        return <DatabaseView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      case 'forms':
        return <FormsView />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <DashboardLayout>
      {renderCurrentView()}
    </DashboardLayout>
  );
}
