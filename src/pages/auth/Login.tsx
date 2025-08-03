/**
 * Login page component with authentication form
 */
import React, { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useCMSStore } from '../../store/cmsStore';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useCMSStore();

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      // Save to localStorage for demo purposes
      localStorage.setItem('cms_user', JSON.stringify({
        id: '1',
        name: 'John Doe',
        email,
        role: 'admin',
        avatar: 'https://pub-cdn.sider.ai/u/U0KAH94GG31/web-coder/688f5e232b2b5e92a4f427bb/resource/f002ea29-a169-4a79-826a-eafaa9d6722f.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <span className="text-primary-foreground font-bold text-xl">CMS</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Web Creator</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Modern Content Management System</p>
        </div>

        {/* Login form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">Demo Credentials:</p>
              <div className="text-sm space-y-1">
                <p><strong>Email:</strong> admin@example.com</p>
                <p><strong>Password:</strong> password</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Don't have an account? <a href="#" className="text-primary hover:underline">Contact Administrator</a></p>
            </div>
          </CardContent>
        </Card>

        {/* Features highlight */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 dark:text-blue-300 text-sm">📝</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Page Builder</p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 dark:text-green-300 text-sm">🎨</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Visual Editor</p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-600 dark:text-purple-300 text-sm">⚡</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Fast Deploy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
