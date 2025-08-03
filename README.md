# Code-CMS
# Modern CMS - Open Source Content Management System

![Modern CMS](https://img.shields.io/badge/Modern%20CMS-v1.0.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)

A **modern, open-source Content Management System** built with React, TypeScript, and Tailwind CSS. Features a visual drag-and-drop page builder, comprehensive user management, analytics dashboard, and production-ready deployment.

## ✨ Features

### 🎯 **Core Features**
- **Visual Page Builder** - Drag-and-drop interface with live preview
- **User Management** - Role-based access control (Admin, Editor, Viewer)
- **Content Management** - Pages, posts, media library, downloads
- **Form Builder** - Create custom forms with submission handling
- **Analytics Dashboard** - Traffic insights and performance metrics
- **Theme System** - Light/dark mode with customizable themes
- **Database Management** - Visual database interface with migrations

### 🚀 **Technical Features**
- **Modern Stack** - React 18, TypeScript, Tailwind CSS
- **State Management** - Zustand for global state
- **UI Components** - shadcn/ui component library
- **Responsive Design** - Mobile-first approach
- **SEO Optimized** - Meta tags, OpenGraph, schema markup
- **Docker Ready** - Complete containerization setup
- **Production Ready** - Nginx, MySQL, Redis integration

### 🎨 **User Experience**
- **Intuitive Interface** - Clean, modern dashboard
- **Real-time Preview** - See changes instantly
- **Drag & Drop** - Visual content creation
- **Dark Mode** - System preference detection
- **Mobile Responsive** - Works on all devices

## 🏗️ Architecture

```
Modern CMS
├── Frontend (React + TypeScript)
│   ├── Dashboard & Admin Panel
│   ├── Visual Page Builder
│   ├── Content Management
│   └── Analytics Dashboard
├── Backend (Node.js + Express)
│   ├── REST API
│   ├── Authentication
│   ├── File Management
│   └── Database Operations
├── Database (MySQL)
│   ├── Users & Permissions
│   ├── Content Storage
│   ├── Analytics Data
│   └── System Settings
└── Infrastructure (Docker)
    ├── Web Server (Nginx)
    ├── Application Server
    ├── Database (MySQL)
    └── Cache (Redis)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- Git

### 1. Clone Repository
```bash
git clone https://github.com/your-username/modern-cms.git
cd modern-cms
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Development Mode
```bash
npm run dev
```

### 5. Production Deployment
```bash
# Build and deploy with Docker
docker-compose up -d

# Or build manually
npm run build
npm run preview
```

## 🐳 Docker Deployment

### Quick Deploy
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services Included
- **Frontend**: React app served by Nginx
- **Backend**: Node.js API server
- **Database**: MySQL 8.0
- **Cache**: Redis
- **Admin**: phpMyAdmin for database management

### Access Points
- **CMS Dashboard**: http://localhost:3000
- **API**: http://localhost:8000/api
- **Database Admin**: http://localhost:8080
- **Health Check**: http://localhost:3000/health

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components
│   └── public/         # Public-facing components
├── pages/              # Application pages
│   ├── auth/           # Authentication pages
│   ├── cms/            # CMS dashboard pages
│   └── public/         # Public website pages
├── store/              # State management (Zustand)
├── types/              # TypeScript definitions
├── lib/                # Utility functions
│   ├── api.ts          # API client
│   ├── utils.ts        # Helper functions
│   └── database/       # Database schema
└── hooks/              # Custom React hooks
```

## 🔧 Configuration

### Environment Variables
```bash
# Application
NODE_ENV=production
APP_NAME="Modern CMS"
APP_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=cms_database
DB_USERNAME=cms_user
DB_PASSWORD=your_password

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Features
ENABLE_REGISTRATION=true
ENABLE_ANALYTICS=true
ENABLE_CACHING=true
```

### Database Setup
```bash
# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

## 👤 Default Login

**Demo Credentials:**
- **Email**: admin@example.com
- **Password**: password

## 🎯 Usage Guide

### 1. **Dashboard Overview**
- View system statistics and recent activity
- Quick access to all CMS features
- System health monitoring

### 2. **Page Builder**
- Drag components from sidebar
- Customize properties in real-time
- Preview on desktop/tablet/mobile
- Save and publish pages

### 3. **Content Management**
- Create and edit pages/posts
- Upload and organize media files
- Manage downloadable resources
- Handle form submissions

### 4. **User Management**
- Add/edit users with roles
- Set permissions per user
- Monitor user activity
- Manage access levels

### 5. **Analytics**
- Track page views and visitors
- Monitor traffic sources
- Analyze user behavior
- Export reports

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Docker Commands
```bash
npm run docker:build    # Build Docker images
npm run docker:up       # Start containers
npm run docker:down     # Stop containers
npm run docker:logs     # View logs
```

### Database Commands
```bash
npm run db:migrate    # Run database migrations
npm run db:seed       # Seed sample data
npm run db:reset      # Reset database
```

## 🔌 API Reference

### Authentication
```bash
POST /api/auth/login      # User login
POST /api/auth/register   # User registration
POST /api/auth/logout     # User logout
GET  /api/auth/profile    # Get user profile
```

### Content Management
```bash
GET    /api/pages         # List pages
POST   /api/pages         # Create page
GET    /api/pages/:id     # Get page
PUT    /api/pages/:id     # Update page
DELETE /api/pages/:id     # Delete page
```

### Media Management
```bash
GET    /api/media         # List media files
POST   /api/media/upload  # Upload file
DELETE /api/media/:id     # Delete file
```

### Analytics
```bash
GET /api/analytics/overview  # Dashboard stats
GET /api/analytics/traffic   # Traffic data
GET /api/analytics/devices   # Device breakdown
```

## 🎨 Customization

### Adding New Components
1. Create component in `src/components/`
2. Add to page builder registry
3. Define editable properties
4. Test in preview mode

### Custom Themes
1. Define theme in `src/themes/`
2. Add color palette and fonts
3. Configure layout settings
4. Register in theme manager

### Database Schema
1. Create migration file
2. Define table structure
3. Add relationships
4. Run migration command

## 🔒 Security

### Features
- **JWT Authentication** - Secure token-based auth
- **Role-Based Access** - Granular permissions
- **Input Validation** - SQL injection prevention
- **CSRF Protection** - Cross-site request forgery protection
- **Rate Limiting** - API abuse prevention
- **File Upload Security** - Type and size validation

### Best Practices
- Regular security updates
- Strong password policies
- HTTPS in production
- Database backups
- Access logging

## 📊 Performance

### Optimizations
- **Code Splitting** - Lazy loading of routes
- **Image Optimization** - WebP format, lazy loading
- **Caching** - Redis for API responses
- **CDN Ready** - Static asset optimization
- **Database Indexing** - Optimized queries

### Monitoring
- Application metrics
- Database performance
- Error tracking
- Uptime monitoring

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow commit conventions

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **shadcn/ui** - For the beautiful component library
- **Lucide** - For the comprehensive icon set
- **Community** - For feedback and contributions

## 📞 Support

- **Documentation**: [Wiki](https://github.com/your-username/modern-cms/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/modern-cms/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/modern-cms/discussions)
- **Email**: support@moderncms.dev

## 🗺️ Roadmap

### v1.1.0 (Next Release)
- [ ] Multi-language support
- [ ] Advanced SEO tools
- [ ] Email marketing integration
- [ ] E-commerce features

### v1.2.0 (Future)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] AI-powered content suggestions
- [ ] Third-party integrations

### v2.0.0 (Long-term)
- [ ] Headless CMS mode
- [ ] GraphQL API
- [ ] Microservices architecture
- [ ] Enterprise features

---

**Made with ❤️ by the Modern CMS Team**

![Footer](https://img.shields.io/badge/Built%20with-React%20%7C%20TypeScript%20%7C%20Tailwind-blue?style=for-the-badge)
