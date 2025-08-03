/**
 * Main application component with routing and authentication
 */
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from './components/theme-provider';
import { useCMSStore } from './store/cmsStore';
import LoginPage from './pages/auth/Login';
import CMSDashboard from './pages/cms/Dashboard';
import HomePage from './pages/Home';

export default function App() {
  const { isAuthenticated, setUser } = useCMSStore();

  useEffect(() => {
    // Check for existing session (mock for now)
    // In real app, check localStorage/sessionStorage or API
    const savedUser = localStorage.getItem('cms_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUser(user);
      } catch (error) {
        localStorage.removeItem('cms_user');
      }
    }
  }, [setUser]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="cms-ui-theme">
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/cms/*" 
            element={isAuthenticated ? <CMSDashboard /> : <LoginPage />} 
          />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}
