-- Analytics Tables Migration
-- Run this against your database to create the analytics tables
-- If you use schemas, prefix table names with your schema

CREATE TABLE analytics_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country VARCHAR(2),
  device VARCHAR(50),
  os VARCHAR(50),
  browser VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_sessions_created_at ON analytics_sessions(created_at);
CREATE INDEX idx_analytics_sessions_country ON analytics_sessions(country);

CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES analytics_sessions(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  path VARCHAR(500) NOT NULL,
  properties JSONB,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(type);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);

CREATE TABLE analytics_pageviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES analytics_sessions(id) ON DELETE CASCADE,
  path VARCHAR(500) NOT NULL,
  referrer VARCHAR(500),
  duration INTEGER,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_pageviews_session_id ON analytics_pageviews(session_id);
CREATE INDEX idx_analytics_pageviews_path ON analytics_pageviews(path);
CREATE INDEX idx_analytics_pageviews_timestamp ON analytics_pageviews(timestamp);
