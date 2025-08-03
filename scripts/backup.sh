#!/bin/bash
# Database backup script for Modern CMS

# Configuration
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="${MYSQL_DATABASE:-cms_production}"
DB_USER="${MYSQL_USER:-cms_user}"
DB_PASSWORD="${MYSQL_PASSWORD}"
DB_HOST="${MYSQL_HOST:-mysql}"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/cms_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/cms_backup_$DATE.sql

# Remove backups older than 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: cms_backup_$DATE.sql.gz"
