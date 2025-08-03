# 📦 Installation Guide - Modern CMS

Complete installation guide for Modern CMS development and production environments.

## 🎯 Quick Start (Development)

### Prerequisites
- Node.js 18+ 
- Git
- Code editor (VS Code recommended)

### 1-Minute Setup
```bash
# Clone repository
git clone https://github.com/your-username/modern-cms.git
cd modern-cms

# Install dependencies
npm install

# Start development server
npm run dev
```

Access at: http://localhost:3000
Login: admin@example.com / password

## 🔧 Detailed Installation

### System Requirements

#### Minimum Requirements
- **OS**: Windows 10, macOS 10.15+, Ubuntu 18.04+
- **RAM**: 4GB
- **Storage**: 2GB free space
- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher

#### Recommended Requirements
- **OS**: Latest stable versions
- **RAM**: 8GB+
- **Storage**: 10GB+ SSD
- **Node.js**: 18.17.0 LTS
- **npm**: 9.0.0+

### Development Installation

#### 1. Install Node.js
```bash
# Using Node Version Manager (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Or download from: https://nodejs.org/
```

#### 2. Clone Repository
```bash
git clone https://github.com/your-username/modern-cms.git
cd modern-cms
```

#### 3. Install Dependencies
```bash
# Install all dependencies
npm install

# Or use yarn
yarn install
```

#### 4. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit configuration (optional for development)
nano .env
```

#### 5. Start Development Server
```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Hot reload** enabled for development

### Production Installation

#### Option 1: Docker Deployment (Recommended)

```bash
# Prerequisites: Docker & Docker Compose
sudo apt update
sudo apt install docker.io docker-compose

# Clone and deploy
git clone https://github.com/your-username/modern-cms.git
cd modern-cms

# Configure environment
cp .env.example .env
# Edit .env with production values

# Deploy
docker-compose up -d
```

#### Option 2: Manual Installation

```bash
# Install Node.js (Production)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone and build
git clone https://github.com/your-username/modern-cms.git
cd modern-cms
npm ci --production
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 startup
pm2 save
```

## 🗄️ Database Setup

### Development (SQLite)
No setup required - uses in-memory database

### Production (MySQL)

#### Install MySQL
```bash
# Ubuntu/Debian
sudo apt install mysql-server
sudo mysql_secure_installation

# CentOS/RHEL
sudo yum install mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

#### Create Database
```sql
mysql -u root -p

CREATE DATABASE cms_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cms_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON cms_production.* TO 'cms_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Configure Environment
```bash
# Update .env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=cms_production
DB_USERNAME=cms_user
DB_PASSWORD=secure_password_here
```

#### Run Migrations
```bash
npm run db:migrate
npm run db:seed  # Optional: sample data
```

## 🎨 Frontend Setup

### UI Framework
The CMS uses **shadcn/ui** components with **Tailwind CSS**:

```bash
# Components are pre-installed, but to add new ones:
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
```

### Theme Configuration
```bash
# Tailwind config in tailwind.config.js
# Theme provider in src/components/theme-provider.tsx
# Dark/light mode toggle included
```

## 🔧 Configuration

### Environment Variables

#### Development (.env)
```bash
NODE_ENV=development
APP_NAME="Modern CMS"
APP_URL=http://localhost:3000
APP_DEBUG=true

# Database (SQLite for dev)
DB_CONNECTION=sqlite
DB_DATABASE=database.sqlite

# Features
ENABLE_REGISTRATION=true
ENABLE_ANALYTICS=true
```

#### Production (.env)
```bash
NODE_ENV=production
APP_NAME="Your CMS"
APP_URL=https://yourdomain.com
APP_DEBUG=false

# Database
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=cms_production
DB_USERNAME=cms_user
DB_PASSWORD=your_secure_password

# Security
JWT_SECRET=your-256-bit-secret-key
SESSION_SECRET=your-session-secret

# Email
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Features
ENABLE_REGISTRATION=false
ENABLE_ANALYTICS=true
ENABLE_CACHING=true
```

### Build Configuration

#### Vite Config (vite.config.ts)
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
```

#### Tailwind Config (tailwind.config.js)
```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // Custom theme extensions
    }
  },
  plugins: [require('tailwindcss-animate')]
}
```

## 📁 Project Structure

```
modern-cms/
├── src/
│   ├── components/       # Reusable components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── layout/      # Layout components
│   │   └── forms/       # Form components
│   ├── pages/           # Page components
│   │   ├── auth/        # Authentication pages
│   │   ├── cms/         # CMS dashboard pages
│   │   └── public/      # Public website pages
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── store/           # State management (Zustand)
│   ├── types/           # TypeScript definitions
│   └── styles/          # CSS styles
├── public/              # Static assets
├── server/              # Backend code (if included)
├── docs/                # Documentation
├── scripts/             # Build and deployment scripts
└── tests/               # Test files
```

## 🚀 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:host         # Start with network access

# Building
npm run build            # Build for production
npm run preview          # Preview production build
npm run build:analyze    # Analyze bundle size

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Linting & Formatting
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format with Prettier
npm run type-check       # TypeScript type checking

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed sample data
npm run db:reset         # Reset database

# Production
npm run start            # Start production server
npm run deploy           # Deploy to production
```

## 🔍 Verification

### Development Verification
```bash
# Check Node.js version
node --version  # Should be 18+

# Check npm version
npm --version   # Should be 8+

# Verify installation
npm run dev     # Should start without errors

# Test build
npm run build   # Should complete successfully
```

### Production Verification
```bash
# Check services status
docker-compose ps

# Test endpoints
curl http://localhost/health        # Frontend health
curl http://localhost:8000/health   # Backend health

# Check logs
docker-compose logs -f cms-frontend
docker-compose logs -f cms-backend
```

## 🐛 Troubleshooting

### Common Issues

#### Node.js Version Conflicts
```bash
# Use nvm to manage versions
nvm install 18
nvm use 18
nvm alias default 18
```

#### Port Already in Use
```bash
# Kill process on port 3000
sudo lsof -t -i:3000 | xargs kill -9

# Or use different port
npm run dev -- --port 3001
```

#### Permission Errors
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### Database Connection Issues
```bash
# Check MySQL status
sudo systemctl status mysql

# Test connection
mysql -u cms_user -p -h localhost cms_production

# Check logs
sudo tail -f /var/log/mysql/error.log
```

### Getting Help

#### Community Support
- **GitHub Issues**: [Report bugs](https://github.com/your-username/modern-cms/issues)
- **Discussions**: [Ask questions](https://github.com/your-username/modern-cms/discussions)
- **Wiki**: [Documentation](https://github.com/your-username/modern-cms/wiki)

#### Professional Support
- **Email**: support@moderncms.dev
- **Documentation**: Full documentation available
- **Priority Support**: Available for production deployments

## 🎯 Next Steps

After installation:

1. **Explore the Dashboard** - Login and familiarize yourself with the interface
2. **Create Your First Page** - Use the visual page builder
3. **Configure Settings** - Customize your CMS installation
4. **Add Users** - Set up your team with appropriate roles
5. **Deploy to Production** - Follow the deployment guide

## ✅ Installation Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Environment configured
- [ ] Database setup (production)
- [ ] Development server running
- [ ] Build process tested
- [ ] Login functionality verified
- [ ] All features accessible

**Happy coding! 🎉**

---

For more detailed information, check out our [Documentation Wiki](https://github.com/your-username/modern-cms/wiki).
