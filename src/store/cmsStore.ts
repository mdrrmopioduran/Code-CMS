/**
 * Global CMS store using Zustand for state management
 */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  content: any[];
  status: 'draft' | 'published' | 'archived';
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  createdAt: Date;
}

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  language: string;
  timezone: string;
}

interface CMSState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Navigation
  currentView: string;
  sidebarOpen: boolean;
  
  // Content
  pages: Page[];
  posts: Post[];
  mediaItems: MediaItem[];
  
  // Settings
  siteSettings: SiteSettings;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setCurrentView: (view: string) => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Content actions
  fetchPages: () => Promise<void>;
  createPage: (page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePage: (id: string, updates: Partial<Page>) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  
  fetchPosts: () => Promise<void>;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePost: (id: string, updates: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  
  fetchMedia: () => Promise<void>;
  uploadMedia: (file: File) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
  
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
}

export const useCMSStore = create<CMSState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        currentView: 'dashboard',
        sidebarOpen: true,
        pages: [],
        posts: [],
        mediaItems: [],
        siteSettings: {
          siteName: 'My CMS Site',
          siteDescription: 'A modern content management system',
          siteUrl: 'https://example.com',
          language: 'en',
          timezone: 'UTC',
        },

        // Auth actions
        login: async (email: string, password: string) => {
          set({ isLoading: true });
          
          // Mock authentication
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (email === 'admin@example.com' && password === 'password') {
            const user: User = {
              id: '1',
              name: 'John Doe',
              email,
              role: 'admin',
              avatar: 'https://pub-cdn.sider.ai/u/U0KAH94GG31/web-coder/688f5e232b2b5e92a4f427bb/resource/1c0d89fc-8a14-4e3f-a4fa-3e41ed321b4f.jpg',
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else {
            set({ isLoading: false });
            throw new Error('Invalid credentials');
          }
        },

        logout: () => {
          localStorage.removeItem('cms_user');
          set({ 
            user: null, 
            isAuthenticated: false,
            currentView: 'dashboard'
          });
        },

        setUser: (user: User) => {
          set({ user, isAuthenticated: true });
        },

        // Navigation actions
        setCurrentView: (view: string) => {
          set({ currentView: view });
        },

        setSidebarOpen: (open: boolean) => {
          set({ sidebarOpen: open });
        },

        // Pages actions
        fetchPages: async () => {
          // Mock API call
          const mockPages: Page[] = [
            {
              id: '1',
              title: 'Home',
              slug: 'home',
              content: [],
              status: 'published',
              authorId: '1',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
            {
              id: '2',
              title: 'About',
              slug: 'about',
              content: [],
              status: 'published',
              authorId: '1',
              createdAt: new Date('2024-01-02'),
              updatedAt: new Date('2024-01-02'),
            },
          ];
          set({ pages: mockPages });
        },

        createPage: async (pageData) => {
          const newPage: Page = {
            ...pageData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set(state => ({ pages: [...state.pages, newPage] }));
        },

        updatePage: async (id: string, updates: Partial<Page>) => {
          set(state => ({
            pages: state.pages.map(page =>
              page.id === id ? { ...page, ...updates, updatedAt: new Date() } : page
            )
          }));
        },

        deletePage: async (id: string) => {
          set(state => ({
            pages: state.pages.filter(page => page.id !== id)
          }));
        },

        // Posts actions
        fetchPosts: async () => {
          const mockPosts: Post[] = [
            {
              id: '1',
              title: 'Getting Started with CMS',
              slug: 'getting-started',
              content: 'This is a sample blog post content...',
              excerpt: 'Learn how to get started with our CMS.',
              tags: ['tutorial', 'cms', 'guide'],
              status: 'published',
              authorId: '1',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
          ];
          set({ posts: mockPosts });
        },

        createPost: async (postData) => {
          const newPost: Post = {
            ...postData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set(state => ({ posts: [...state.posts, newPost] }));
        },

        updatePost: async (id: string, updates: Partial<Post>) => {
          set(state => ({
            posts: state.posts.map(post =>
              post.id === id ? { ...post, ...updates, updatedAt: new Date() } : post
            )
          }));
        },

        deletePost: async (id: string) => {
          set(state => ({
            posts: state.posts.filter(post => post.id !== id)
          }));
        },

        // Media actions
        fetchMedia: async () => {
          const mockMedia: MediaItem[] = [
            {
              id: '1',
              filename: 'sample-image.jpg',
              originalName: 'Sample Image.jpg',
              url: 'https://pub-cdn.sider.ai/u/U0KAH94GG31/web-coder/688f5e232b2b5e92a4f427bb/resource/bcfc4375-4235-41db-a631-96720ed3e71b.jpg',
              type: 'image',
              size: 1024000,
              createdAt: new Date('2024-01-01'),
            },
          ];
          set({ mediaItems: mockMedia });
        },

        uploadMedia: async (file: File) => {
          const newMedia: MediaItem = {
            id: Date.now().toString(),
            filename: file.name.replace(/\s+/g, '-').toLowerCase(),
            originalName: file.name,
            url: URL.createObjectURL(file), // In real app, this would be uploaded to server
            type: file.type.startsWith('image/') ? 'image' : 
                  file.type.startsWith('video/') ? 'video' : 'document',
            size: file.size,
            createdAt: new Date(),
          };
          set(state => ({ mediaItems: [...state.mediaItems, newMedia] }));
        },

        deleteMedia: async (id: string) => {
          set(state => ({
            mediaItems: state.mediaItems.filter(item => item.id !== id)
          }));
        },

        // Settings actions
        updateSiteSettings: async (settings: Partial<SiteSettings>) => {
          set(state => ({
            siteSettings: { ...state.siteSettings, ...settings }
          }));
        },
      }),
      {
        name: 'cms-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          siteSettings: state.siteSettings,
        }),
      }
    ),
    { name: 'CMS Store' }
  )
);
