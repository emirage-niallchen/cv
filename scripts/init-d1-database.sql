-- Cloudflare D1 数据库初始化脚本
-- 根据 Prisma schema 生成

-- Session 表
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Link 表
CREATE TABLE IF NOT EXISTS "Link" (
    "id" TEXT PRIMARY KEY,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Admin 表
CREATE TABLE IF NOT EXISTS "Admin" (
    "id" TEXT PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "email" TEXT UNIQUE,
    "password" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "background" TEXT
);

-- CustomField 表
CREATE TABLE IF NOT EXISTS "CustomField" (
    "id" TEXT PRIMARY KEY,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- File 表
CREATE TABLE IF NOT EXISTS "File" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Location 表
CREATE TABLE IF NOT EXISTS "Location" (
    "id" TEXT PRIMARY KEY,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tech 表
CREATE TABLE IF NOT EXISTS "Tech" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "link" TEXT,
    "bgColor" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tag 表
CREATE TABLE IF NOT EXISTS "Tag" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "color" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Project 表
CREATE TABLE IF NOT EXISTS "Project" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "jobRole" TEXT,
    "jobTech" TEXT,
    "startTime" DATETIME,
    "endTime" DATETIME,
    "description" TEXT NOT NULL,
    "detail" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ProjectImage 表
CREATE TABLE IF NOT EXISTS "ProjectImage" (
    "id" TEXT PRIMARY KEY,
    "path" TEXT NOT NULL,
    "alt" TEXT,
    "projectId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE
);

-- ProjectLink 表
CREATE TABLE IF NOT EXISTS "ProjectLink" (
    "id" TEXT PRIMARY KEY,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "projectId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE
);

-- Page 表
CREATE TABLE IF NOT EXISTS "Page" (
    "id" TEXT PRIMARY KEY,
    "slug" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT 0,
    "metadata" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- FileTag 关联表
CREATE TABLE IF NOT EXISTS "FileTag" (
    "id" TEXT PRIMARY KEY,
    "fileId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE,
    FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE,
    UNIQUE("fileId", "tagId")
);

-- TechTag 关联表
CREATE TABLE IF NOT EXISTS "TechTag" (
    "id" TEXT PRIMARY KEY,
    "techId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("techId") REFERENCES "Tech"("id") ON DELETE CASCADE,
    FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE,
    UNIQUE("techId", "tagId")
);

-- ProjectTag 关联表
CREATE TABLE IF NOT EXISTS "ProjectTag" (
    "id" TEXT PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE,
    FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE,
    UNIQUE("projectId", "tagId")
);

-- Inbox 表
CREATE TABLE IF NOT EXISTS "Inbox" (
    "id" TEXT PRIMARY KEY,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ResumeSection 表
CREATE TABLE IF NOT EXISTS "ResumeSection" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "component" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT 1,
    "isPublished" BOOLEAN NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "config" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Resume 表
CREATE TABLE IF NOT EXISTS "Resume" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "location" TEXT,
    "title" TEXT,
    "organization" TEXT,
    "highlights" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ResumeTag 关联表
CREATE TABLE IF NOT EXISTS "ResumeTag" (
    "id" TEXT PRIMARY KEY,
    "resumeId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE,
    FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE,
    UNIQUE("resumeId", "tagId")
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS "idx_session_userId" ON "Session"("userId");
CREATE INDEX IF NOT EXISTS "idx_session_expires" ON "Session"("expires");
CREATE INDEX IF NOT EXISTS "idx_admin_username" ON "Admin"("username");
CREATE INDEX IF NOT EXISTS "idx_admin_email" ON "Admin"("email");
CREATE INDEX IF NOT EXISTS "idx_customfield_order" ON "CustomField"("order");
CREATE INDEX IF NOT EXISTS "idx_file_isPublished" ON "File"("isPublished");
CREATE INDEX IF NOT EXISTS "idx_tech_name" ON "Tech"("name");
CREATE INDEX IF NOT EXISTS "idx_tech_order" ON "Tech"("order");
CREATE INDEX IF NOT EXISTS "idx_tag_name" ON "Tag"("name");
CREATE INDEX IF NOT EXISTS "idx_tag_order" ON "Tag"("order");
CREATE INDEX IF NOT EXISTS "idx_project_order" ON "Project"("order");
CREATE INDEX IF NOT EXISTS "idx_project_isPublished" ON "Project"("isPublished");
CREATE INDEX IF NOT EXISTS "idx_page_slug" ON "Page"("slug");
CREATE INDEX IF NOT EXISTS "idx_page_order" ON "Page"("order");
CREATE INDEX IF NOT EXISTS "idx_inbox_type" ON "Inbox"("type");
CREATE INDEX IF NOT EXISTS "idx_inbox_isRead" ON "Inbox"("isRead");
CREATE INDEX IF NOT EXISTS "idx_resumesection_name" ON "ResumeSection"("name");
CREATE INDEX IF NOT EXISTS "idx_resumesection_order" ON "ResumeSection"("order");
CREATE INDEX IF NOT EXISTS "idx_resume_order" ON "Resume"("order");
CREATE INDEX IF NOT EXISTS "idx_resume_isPublished" ON "Resume"("isPublished"); 