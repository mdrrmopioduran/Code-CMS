/**
 * Type definitions for the CMS system
 */

// Base types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  permissions?: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: PageBlock[];
  status: 'draft' | 'published' | 'archived';
  authorId: string;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags: string[];
  categories?: string[];
  status: 'draft' | 'published' | 'archived';
  authorId: string;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  type: 'image' | 'video' | 'document' | 'audio';
  mimeType: string;
  size: number;
  alt?: string;
  caption?: string;
  createdAt: Date;
  uploadedBy: string;
}

// Page Builder types
export interface PageBlock {
  id: string;
  type: BlockType;
  content: Record<string, any>;
  order: number;
  parentId?: string;
  children?: PageBlock[];
}

export type BlockType = 
  | 'heading'
  | 'text'
  | 'image'
  | 'video'
  | 'button'
  | 'form'
  | 'gallery'
  | 'separator'
  | 'spacer'
  | 'columns'
  | 'hero'
  | 'testimonial'
  | 'accordion'
  | 'tabs';

export interface BlockDefinition {
  type: BlockType;
  name: string;
  icon: string;
  category: 'content' | 'media' | 'layout' | 'forms' | 'advanced';
  defaultContent: Record<string, any>;
  editableFields: BlockField[];
  preview?: string;
}

export interface BlockField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'color' | 'image' | 'url';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Form Builder types
export interface Form {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  submissions?: FormSubmission[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'date';
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  order: number;
}

export interface FormSettings {
  submitButtonText: string;
  successMessage: string;
  redirectUrl?: string;
  emailNotifications: boolean;
  notificationEmail?: string;
  storeSubmissions: boolean;
  allowMultipleSubmissions: boolean;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

// Database types
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
}

export interface DatabaseTable {
  name: string;
  rows: number;
  size: string;
  engine: string;
  collation: string;
  createdAt: Date;
}

// Analytics types
export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  averageSessionDuration: number;
  topPages: PageAnalytics[];
  trafficSources: TrafficSource[];
  deviceTypes: DeviceAnalytics[];
  period: {
    start: Date;
    end: Date;
  };
}

export interface PageAnalytics {
  path: string;
  title: string;
  views: number;
  uniqueViews: number;
  bounceRate: number;
  averageTime: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
}

export interface DeviceAnalytics {
  device: string;
  visitors: number;
  percentage: number;
}

// Theme types
export interface Theme {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  thumbnail: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  layout: ThemeLayout;
  isActive: boolean;
  customCSS?: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  card: string;
  border: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
}

export interface ThemeLayout {
  containerWidth: string;
  headerHeight: string;
  sidebarWidth: string;
}

// Settings types
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  language: string;
  timezone: string;
  dateFormat: string;
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  googleAnalytics?: string;
  
  // Social
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  
  // Email
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  fromEmail?: string;
  fromName?: string;
  
  // Features
  registrationEnabled: boolean;
  commentsEnabled: boolean;
  maintenanceMode: boolean;
}

// API types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// File upload types
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  result?: MediaItem;
}

// Activity log types
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
}

// Permission types
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
}

// Comment types (for posts/pages)
export interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorEmail: string;
  authorUrl?: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  parentId?: string;
  resourceType: 'post' | 'page';
  resourceId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Navigation menu types
export interface MenuItem {
  id: string;
  label: string;
  url: string;
  type: 'page' | 'post' | 'custom' | 'category';
  target?: '_blank' | '_self';
  parentId?: string;
  order: number;
  children?: MenuItem[];
}

export interface Menu {
  id: string;
  name: string;
  location: string;
  items: MenuItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Widget types
export interface Widget {
  id: string;
  type: string;
  title: string;
  content: Record<string, any>;
  area: string;
  order: number;
  isActive: boolean;
}

// Backup types
export interface Backup {
  id: string;
  filename: string;
  size: number;
  type: 'full' | 'database' | 'files';
  status: 'creating' | 'completed' | 'failed';
  createdAt: Date;
  downloadUrl?: string;
}
