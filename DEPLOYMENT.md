# 🚀 Production Deployment Guide

This guide covers deploying Modern CMS to production environments including cloud platforms, VPS, and containerized deployments.

## 📋 Prerequisites

- **Server Requirements**:
  - 2+ CPU cores
  - 4GB+ RAM
  - 20GB+ storage
  - Ubuntu 20.04+ or CentOS 8+
  
- **Software Requirements**:
  - Docker & Docker Compose
  - Node.js 18+ (if not using Docker)
  - MySQL 8.0+
  - Nginx (reverse proxy)
  - SSL certificate

## 🐳 Docker Deployment (Recommended)

### 1. Clone Repository
```bash
git clone https://github.com/your-username/modern-cms.git
cd modern-cms
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` file with production values:
```bash
# Production Environment
NODE_ENV=production
APP_NAME="Your CMS Name"
APP_URL=https://yourdomain.com
APP_DEBUG=false

# Database (Production)
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=cms_production
DB_USERNAME=cms_user
DB_PASSWORD=your_secure_password_here

# Security
JWT_SECRET=your-super-secure-jwt-secret-change-this-in-production
BCRYPT_SALT_ROUNDS=12
SESSION_SECRET=your-session-secret-change-this

# Email (Production SMTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="Your CMS Name"

# Features
ENABLE_REGISTRATION=false
ENABLE_ANALYTICS=true
ENABLE_CACHING=true
ENABLE_COMPRESSION=true

# Security
ENABLE_2FA=true
MAX_LOGIN_ATTEMPTS=5
ENABLE_RATE_LIMITING=true
```

### 3. Build and Deploy
```bash
# Build Docker images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 4. SSL Certificate Setup
```bash
# Using Let's Encrypt with Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🌐 Manual Deployment

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install Nginx
sudo apt install nginx -y

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Database Setup
```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE cms_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cms_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON cms_production.* TO 'cms_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Application Deployment
```bash
# Clone repository
git clone https://github.com/your-username/modern-cms.git
cd modern-cms

# Install dependencies
npm ci --production

# Build application
npm run build

# Setup environment
cp .env.example .env
# Edit .env with production values

# Run database migrations
npm run db:migrate

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 4. Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/modern-cms
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;

    # Static files
    location / {
        root /path/to/modern-cms/dist;
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/modern-cms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## ☁️ Cloud Platform Deployment

### AWS Deployment

#### 1. EC2 Instance Setup
```bash
# Launch EC2 instance (t3.medium or larger)
# Security Group: HTTP (80), HTTPS (443), SSH (22)

# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Follow manual deployment steps above
```

#### 2. RDS Database
```bash
# Create RDS MySQL instance
aws rds create-db-instance \
    --db-instance-identifier cms-production \
    --db-instance-class db.t3.micro \
    --engine mysql \
    --master-username admin \
    --master-user-password your-secure-password \
    --allocated-storage 20
```

#### 3. S3 for Media Storage
```bash
# Create S3 bucket
aws s3 mb s3://your-cms-media-bucket

# Update .env
AWS_S3_BUCKET=your-cms-media-bucket
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### DigitalOcean Deployment

#### 1. Droplet Creation
```bash
# Create droplet (2GB RAM minimum)
# Choose Ubuntu 20.04 LTS
# Add SSH key

# Connect and deploy
ssh root@your-droplet-ip
# Follow manual deployment steps
```

#### 2. Managed Database
```bash
# Create managed MySQL database
# Update connection strings in .env
```

### Google Cloud Platform

#### 1. Compute Engine
```bash
# Create VM instance
gcloud compute instances create cms-server \
    --image-family ubuntu-2004-lts \
    --image-project ubuntu-os-cloud \
    --machine-type e2-medium \
    --zone us-central1-a
```

#### 2. Cloud SQL
```bash
# Create Cloud SQL instance
gcloud sql instances create cms-db \
    --database-version MYSQL_8_0 \
    --tier db-n1-standard-1 \
    --region us-central1
```

## 🔧 Production Configuration

### 1. Environment Variables
```bash
# Security
JWT_SECRET=your-256-bit-secret
SESSION_SECRET=your-session-secret
BCRYPT_SALT_ROUNDS=12

# Performance
CACHE_DRIVER=redis
REDIS_HOST=localhost
ENABLE_COMPRESSION=true
ENABLE_CACHING=true

# Monitoring
LOG_LEVEL=error
ENABLE_ANALYTICS=true
```

### 2. PM2 Configuration
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'modern-cms',
    script: './server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8000
    }
  }]
};
```

### 3. Database Optimization
```sql
-- MySQL optimization
SET GLOBAL innodb_buffer_pool_size = 1073741824; -- 1GB
SET GLOBAL max_connections = 200;
SET GLOBAL innodb_log_file_size = 268435456; -- 256MB
```

## 📊 Monitoring & Maintenance

### 1. Application Monitoring
```bash
# PM2 monitoring
pm2 monit

# Logs
pm2 logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 2. Database Backup
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mysql"
DB_NAME="cms_production"

mkdir -p $BACKUP_DIR

mysqldump -u cms_user -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/cms_backup_$DATE.sql
gzip $BACKUP_DIR/cms_backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

# Cron job: 0 2 * * * /path/to/backup.sh
```

### 3. System Updates
```bash
#!/bin/bash
# update.sh
cd /path/to/modern-cms

# Backup database
./backup.sh

# Pull latest code
git pull origin main

# Install dependencies
npm ci --production

# Build application
npm run build

# Run migrations
npm run db:migrate

# Restart application
pm2 restart modern-cms

# Reload nginx
sudo systemctl reload nginx
```

## 🔒 Security Checklist

### Server Security
- [ ] SSH key authentication only
- [ ] Disable root login
- [ ] Configure firewall (UFW)
- [ ] Regular security updates
- [ ] Fail2ban for intrusion prevention

### Application Security
- [ ] Strong JWT secrets
- [ ] Rate limiting enabled
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens

### Database Security
- [ ] Strong passwords
- [ ] Limited user privileges
- [ ] Regular backups
- [ ] Encrypted connections
- [ ] Network isolation

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear node modules and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 2. Database Connection
```bash
# Test MySQL connection
mysql -u cms_user -p -h localhost cms_production

# Check MySQL status
sudo systemctl status mysql
```

#### 3. Nginx Issues
```bash
# Test configuration
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
```

#### 4. SSL Certificate
```bash
# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

### Performance Optimization

#### 1. Enable Caching
```bash
# Redis installation
sudo apt install redis-server
sudo systemctl enable redis

# Update .env
CACHE_DRIVER=redis
REDIS_HOST=localhost
```

#### 2. Database Optimization
```bash
# MySQL tuning
sudo mysql_secure_installation
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Add optimizations:
# innodb_buffer_pool_size = 1G
# max_connections = 200
```

## 📈 Scaling

### Horizontal Scaling
- Load balancer (Nginx/HAProxy)
- Multiple application servers
- Database replication
- CDN for static assets

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Enable caching layers
- Compress static assets

---

## 📞 Support

For deployment issues:
- **Documentation**: [Wiki](https://github.com/your-username/modern-cms/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/modern-cms/issues)
- **Email**: deploy@moderncms.dev

**Happy Deploying! 🚀**
