#!/bin/bash
# Deployment script for Modern CMS

set -e  # Exit on any error

echo "🚀 Starting Modern CMS deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/opt/modern-cms"
BACKUP_DIR="/backups"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check requirements
check_requirements() {
    log_info "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    if [ ! -f ".env" ]; then
        log_error ".env file not found"
        exit 1
    fi
    
    log_info "Requirements check passed"
}

# Backup current deployment
backup_current() {
    log_info "Creating backup..."
    
    # Create backup directory
    mkdir -p $BACKUP_DIR/$(date +%Y%m%d_%H%M%S)
    
    # Backup database if running
    if docker-compose -f $DOCKER_COMPOSE_FILE ps mysql | grep -q "Up"; then
        docker-compose -f $DOCKER_COMPOSE_FILE exec -T mysql mysqldump -u cms_user -p$DB_PASSWORD cms_production > $BACKUP_DIR/pre_deploy_$(date +%Y%m%d_%H%M%S).sql
        log_info "Database backup created"
    fi
    
    log_info "Backup completed"
}

# Build new images
build_images() {
    log_info "Building Docker images..."
    docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache
    log_info "Images built successfully"
}

# Deploy services
deploy_services() {
    log_info "Deploying services..."
    
    # Stop current services
    docker-compose -f $DOCKER_COMPOSE_FILE down
    
    # Start new services
    docker-compose -f $DOCKER_COMPOSE_FILE up -d
    
    log_info "Services deployed"
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    # Wait for services to start
    sleep 30
    
    # Check frontend
    if curl -f http://localhost/health > /dev/null 2>&1; then
        log_info "Frontend is healthy"
    else
        log_error "Frontend health check failed"
        return 1
    fi
    
    # Check backend
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        log_info "Backend is healthy"
    else
        log_error "Backend health check failed"
        return 1
    fi
    
    log_info "Health check passed"
}

# Cleanup old images
cleanup() {
    log_info "Cleaning up old Docker images..."
    docker image prune -f
    docker system prune -f --volumes
    log_info "Cleanup completed"
}

# Main deployment process
main() {
    log_info "Starting deployment process..."
    
    check_requirements
    backup_current
    build_images
    deploy_services
    
    if health_check; then
        log_info "✅ Deployment completed successfully!"
        cleanup
    else
        log_error "❌ Deployment failed health check"
        log_warn "Rolling back..."
        # Add rollback logic here if needed
        exit 1
    fi
}

# Run deployment
main "$@"
