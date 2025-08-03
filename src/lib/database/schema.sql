-- CMS Database Schema
-- Modern Content Management System Database Structure

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
    avatar VARCHAR(500),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255) NULL,
    login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);

-- User permissions table
CREATE TABLE IF NOT EXISTS user_permissions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    permission VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_permission (user_id, permission),
    INDEX idx_user_id (user_id),
    INDEX idx_permission (permission)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id VARCHAR(36) NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_parent_id (parent_id),
    INDEX idx_sort_order (sort_order)
);

-- Pages table
CREATE TABLE IF NOT EXISTS pages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content JSON NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    template VARCHAR(100) DEFAULT 'default',
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    visibility ENUM('public', 'private', 'password') DEFAULT 'public',
    password VARCHAR(255) NULL,
    author_id VARCHAR(36) NOT NULL,
    parent_id VARCHAR(36) NULL,
    sort_order INT DEFAULT 0,
    view_count INT DEFAULT 0,
    
    -- SEO fields
    seo_title VARCHAR(500),
    seo_description TEXT,
    seo_keywords TEXT,
    og_image VARCHAR(500),
    
    -- Scheduling
    published_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES pages(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_author_id (author_id),
    INDEX idx_published_at (published_at),
    FULLTEXT idx_content (title, excerpt)
);

-- Posts table (blog posts)
CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    visibility ENUM('public', 'private', 'password') DEFAULT 'public',
    password VARCHAR(255) NULL,
    author_id VARCHAR(36) NOT NULL,
    category_id VARCHAR(36) NULL,
    view_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    
    -- SEO fields
    seo_title VARCHAR(500),
    seo_description TEXT,
    seo_keywords TEXT,
    og_image VARCHAR(500),
    
    -- Scheduling
    published_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_author_id (author_id),
    INDEX idx_category_id (category_id),
    INDEX idx_published_at (published_at),
    FULLTEXT idx_content (title, content, excerpt)
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3b82f6',
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_usage_count (usage_count)
);

-- Post tags relationship
CREATE TABLE IF NOT EXISTS post_tags (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    post_id VARCHAR(36) NOT NULL,
    tag_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_tag (post_id, tag_id),
    INDEX idx_post_id (post_id),
    INDEX idx_tag_id (tag_id)
);

-- Media table
CREATE TABLE IF NOT EXISTS media (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    filename VARCHAR(500) NOT NULL,
    original_name VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    width INT NULL,
    height INT NULL,
    url VARCHAR(1000) NOT NULL,
    thumbnail_url VARCHAR(1000) NULL,
    alt_text VARCHAR(500),
    caption TEXT,
    type ENUM('image', 'video', 'audio', 'document', 'other') NOT NULL,
    folder VARCHAR(255) DEFAULT 'uploads',
    uploaded_by VARCHAR(36) NOT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    download_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_type (type),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_mime_type (mime_type),
    FULLTEXT idx_search (original_name, alt_text, caption)
);

-- Forms table
CREATE TABLE IF NOT EXISTS forms (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    fields JSON NOT NULL,
    settings JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    submission_count INT DEFAULT 0,
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_is_active (is_active),
    INDEX idx_created_by (created_by)
);

-- Form submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    form_id VARCHAR(36) NOT NULL,
    data JSON NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(1000),
    status ENUM('new', 'read', 'archived') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
    INDEX idx_form_id (form_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Downloads table
CREATE TABLE IF NOT EXISTS downloads (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    file_path VARCHAR(1000) NOT NULL,
    file_name VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    download_count INT DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    requires_login BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_is_public (is_public),
    INDEX idx_category (category),
    INDEX idx_created_by (created_by),
    FULLTEXT idx_search (title, description)
);

-- Download logs table
CREATE TABLE IF NOT EXISTS download_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    download_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(1000),
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (download_id) REFERENCES downloads(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_download_id (download_id),
    INDEX idx_user_id (user_id),
    INDEX idx_downloaded_at (downloaded_at)
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    key_name VARCHAR(255) UNIQUE NOT NULL,
    value JSON,
    type ENUM('string', 'number', 'boolean', 'json', 'array') DEFAULT 'string',
    category VARCHAR(100) DEFAULT 'general',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key_name (key_name),
    INDEX idx_category (category),
    INDEX idx_is_public (is_public)
);

-- Themes table
CREATE TABLE IF NOT EXISTS themes (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(50) NOT NULL,
    author VARCHAR(255),
    config JSON,
    is_active BOOLEAN DEFAULT FALSE,
    is_system BOOLEAN DEFAULT FALSE,
    thumbnail VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_is_active (is_active),
    INDEX idx_is_system (is_system)
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    page_url VARCHAR(1000) NOT NULL,
    page_title VARCHAR(500),
    referrer VARCHAR(1000),
    user_agent TEXT,
    ip_address VARCHAR(45),
    country VARCHAR(2),
    device_type ENUM('desktop', 'mobile', 'tablet') DEFAULT 'desktop',
    browser VARCHAR(100),
    os VARCHAR(100),
    session_id VARCHAR(255),
    user_id VARCHAR(36) NULL,
    event_type ENUM('pageview', 'click', 'download', 'form_submit') DEFAULT 'pageview',
    event_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_page_url (page_url(255)),
    INDEX idx_created_at (created_at),
    INDEX idx_event_type (event_type),
    INDEX idx_session_id (session_id),
    INDEX idx_user_id (user_id)
);

-- Sessions table for user sessions
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    payload LONGTEXT NOT NULL,
    last_activity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_last_activity (last_activity)
);

-- Password resets table
CREATE TABLE IF NOT EXISTS password_resets (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_token (token)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    message TEXT,
    data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
);

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(36),
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    changes JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_resource (resource_type, resource_id),
    INDEX idx_created_at (created_at)
);

-- Insert default admin user
INSERT INTO users (id, name, email, password, role, status, email_verified) 
VALUES (
    UUID(),
    'Admin User',
    'admin@example.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: 'password'
    'admin',
    'active',
    TRUE
) ON DUPLICATE KEY UPDATE email = email;

-- Insert default settings
INSERT INTO settings (key_name, value, type, category, is_public) VALUES
('site_name', '"Modern CMS"', 'string', 'general', TRUE),
('site_description', '"A powerful, modern content management system"', 'string', 'general', TRUE),
('site_url', '"http://localhost:3000"', 'string', 'general', TRUE),
('site_language', '"en"', 'string', 'general', TRUE),
('site_timezone', '"UTC"', 'string', 'general', FALSE),
('allow_registration', 'true', 'boolean', 'users', FALSE),
('default_user_role', '"viewer"', 'string', 'users', FALSE),
('posts_per_page', '10', 'number', 'reading', TRUE),
('comment_moderation', 'true', 'boolean', 'discussion', FALSE),
('enable_analytics', 'true', 'boolean', 'analytics', FALSE)
ON DUPLICATE KEY UPDATE key_name = key_name;
