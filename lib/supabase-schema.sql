-- Should I Date This Man? - Supabase Schema
-- Run this in your Supabase SQL Editor

-- Table: audit_reports
-- Stores all generated roast reports
CREATE TABLE IF NOT EXISTS audit_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Input data
  profile_type TEXT NOT NULL CHECK (profile_type IN ('linkedin', 'dating', 'resume', 'general')),
  profile_url TEXT,
  profile_text TEXT,
  claimed_height TEXT,

  -- Report output
  dateability_score INTEGER NOT NULL CHECK (dateability_score >= 0 AND dateability_score <= 100),
  score_label TEXT NOT NULL,
  verdict TEXT NOT NULL,
  archetype_label TEXT NOT NULL,
  roast_summary TEXT NOT NULL,
  funny_one_liner TEXT NOT NULL,
  shareable_caption TEXT NOT NULL,

  -- JSON blobs for complex data
  red_flags JSONB NOT NULL DEFAULT '[]',
  green_flags JSONB NOT NULL DEFAULT '[]',
  linkedin_translations JSONB,
  height_audit JSONB,

  -- Share tracking
  share_count INTEGER DEFAULT 0,
  share_slug TEXT UNIQUE
);

-- Index for sharing by slug
CREATE INDEX IF NOT EXISTS idx_audit_reports_share_slug ON audit_reports(share_slug);

-- Index for ordering by date
CREATE INDEX IF NOT EXISTS idx_audit_reports_created_at ON audit_reports(created_at DESC);

-- Row Level Security (public read for sharing)
ALTER TABLE audit_reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (anonymous submissions)
CREATE POLICY "Anyone can insert reports" ON audit_reports
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read reports (for share links)
CREATE POLICY "Anyone can read reports" ON audit_reports
  FOR SELECT USING (true);

-- Table: share_views
-- Track how many times a shared report was viewed
CREATE TABLE IF NOT EXISTS share_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES audit_reports(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT
);

-- Function to generate a random share slug
CREATE OR REPLACE FUNCTION generate_share_slug()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
