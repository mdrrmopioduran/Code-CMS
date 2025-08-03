/**
 * API utilities and HTTP client for CMS operations
 */

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth-token');
  }

  /**
   * Set authentication token
   */
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth-token', token);
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem('auth-token');
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(data.message || 'Request failed', response.status, data.errors);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error', 0);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * Upload file
   */
  async upload<T>(endpoint: string, file: File): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.message || 'Upload failed', response.status);
    }

    return data;
  }
}

// Create API client instance
export const api = new ApiClient();

// API endpoints
export const endpoints = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },

  // Pages
  pages: {
    list: '/pages',
    create: '/pages',
    get: (id: string) => `/pages/${id}`,
    update: (id: string) => `/pages/${id}`,
    delete: (id: string) => `/pages/${id}`,
    publish: (id: string) => `/pages/${id}/publish`,
  },

  // Posts
  posts: {
    list: '/posts',
    create: '/posts',
    get: (id: string) => `/posts/${id}`,
    update: (id: string) => `/posts/${id}`,
    delete: (id: string) => `/posts/${id}`,
  },

  // Media
  media: {
    list: '/media',
    upload: '/media/upload',
    delete: (id: string) => `/media/${id}`,
  },

  // Forms
  forms: {
    list: '/forms',
    create: '/forms',
    get: (id: string) => `/forms/${id}`,
    update: (id: string) => `/forms/${id}`,
    delete: (id: string) => `/forms/${id}`,
    submissions: (id: string) => `/forms/${id}/submissions`,
  },

  // Users
  users: {
    list: '/users',
    create: '/users',
    get: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },

  // Settings
  settings: {
    get: '/settings',
    update: '/settings',
  },

  // Public endpoints
  public: {
    page: (slug: string) => `/public/pages/${slug}`,
    post: (slug: string) => `/public/posts/${slug}`,
    form: (id: string) => `/public/forms/${id}`,
    submitForm: (id: string) => `/public/forms/${id}/submit`,
  },

  // Analytics
  analytics: {
    overview: '/analytics/overview',
    pages: '/analytics/pages',
    traffic: '/analytics/traffic',
    devices: '/analytics/devices',
  },
};

// API service functions
export const authService = {
  async login(email: string, password: string) {
    const response = await api.post(endpoints.auth.login, { email, password });
    if (response.data.token) {
      api.setToken(response.data.token);
    }
    return response;
  },

  async register(userData: any) {
    return api.post(endpoints.auth.register, userData);
  },

  async logout() {
    await api.post(endpoints.auth.logout);
    api.clearToken();
  },

  async getProfile() {
    return api.get(endpoints.auth.profile);
  },
};

export const pageService = {
  async getPages() {
    return api.get(endpoints.pages.list);
  },

  async createPage(pageData: any) {
    return api.post(endpoints.pages.create, pageData);
  },

  async updatePage(id: string, pageData: any) {
    return api.put(endpoints.pages.update(id), pageData);
  },

  async deletePage(id: string) {
    return api.delete(endpoints.pages.delete(id));
  },

  async getPublicPage(slug: string) {
    return api.get(endpoints.public.page(slug));
  },
};

export const mediaService = {
  async uploadFile(file: File) {
    return api.upload(endpoints.media.upload, file);
  },

  async getMedia() {
    return api.get(endpoints.media.list);
  },

  async deleteMedia(id: string) {
    return api.delete(endpoints.media.delete(id));
  },
};

export const formService = {
  async getForms() {
    return api.get(endpoints.forms.list);
  },

  async createForm(formData: any) {
    return api.post(endpoints.forms.create, formData);
  },

  async submitForm(formId: string, data: any) {
    return api.post(endpoints.public.submitForm(formId), data);
  },

  async getSubmissions(formId: string) {
    return api.get(endpoints.forms.submissions(formId));
  },
};

export { ApiError };
