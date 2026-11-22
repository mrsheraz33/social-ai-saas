-- Social AI SaaS - PostgreSQL Schema

-- Enable UUID extension 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
-- MongoDB: User.ts

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password        VARCHAR(255),
    zernio_profile_id VARCHAR(255),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_users_email ON users(email);

-- 2. ACCOUNTS TABLE (Social Media Connections)
-- MongoDB: Account.ts

CREATE TABLE accounts (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform          VARCHAR(50) NOT NULL CHECK (platform IN (
                        'facebook', 'instagram', 'linkedin', 'twitter',
                        'youtube', 'tiktok', 'pinterest', 'reddit',
                        'bluesky', 'threads'
                      )),
    handle            VARCHAR(255) NOT NULL,
    zernio_account_id VARCHAR(255),
    access_token      TEXT DEFAULT '',
    refresh_token     TEXT DEFAULT '',
    token_expires_at  TIMESTAMP WITH TIME ZONE,
    status            VARCHAR(20) DEFAULT 'connected' CHECK (status IN (
                        'connected', 'disconnected', 'expired'
                      )),
    avatar_url        TEXT DEFAULT '',
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Unique constraint
    UNIQUE(user_id, zernio_account_id)
);

CREATE INDEX idx_accounts_user ON accounts(user_id);

-- 3. POSTS TABLE (Scheduled Content)
-- MongoDB: Post.ts

CREATE TABLE posts (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content       TEXT NOT NULL,
    media_url     TEXT,
    media_type    VARCHAR(20) CHECK (media_type IN ('image', 'video')),
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    status        VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN (
                    'draft', 'scheduled', 'published', 'failed'
                  )),
    retries       INTEGER DEFAULT 0 CHECK (retries >= 0),
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_posts_status_scheduled ON posts(status, scheduled_for);

CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);

-- 4. POST_PLATFORMS (Junction Table)
-- MongoDB: platforms[] array

CREATE TABLE post_platforms (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    platform   VARCHAR(50) NOT NULL CHECK (platform IN (
                 'facebook', 'instagram', 'linkedin', 'twitter',
                 'youtube', 'tiktok', 'pinterest', 'reddit',
                 'bluesky', 'threads'
               )),
    UNIQUE(post_id, platform)
);

CREATE INDEX idx_post_platforms_post ON post_platforms(post_id);

-- 5. GENERATIONS TABLE (AI History)
-- MongoDB: Generation.ts

CREATE TABLE generations (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    prompt     TEXT NOT NULL,
    content    TEXT NOT NULL,
    media_url  TEXT,
    media_type VARCHAR(20) CHECK (media_type IN ('image', 'video')),
    tone       VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_generations_user_created ON generations(user_id, created_at DESC);

-- 6. ACTIVITY_LOGS TABLE (Dashboard Feed)
-- MongoDB: ActivityLog.ts

CREATE TABLE activity_logs (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_type      VARCHAR(50) NOT NULL CHECK (action_type IN (
                       'POST_PUBLISHED', 'AI_REPLY'
                     )),
    description      TEXT NOT NULL,
    related_post_id  UUID REFERENCES posts(id) ON DELETE SET NULL,
    platform         VARCHAR(50),
    ai_generated_text TEXT,
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_user_created ON activity_logs(user_id, created_at DESC);
CREATE INDEX idx_activity_post ON activity_logs(related_post_id);