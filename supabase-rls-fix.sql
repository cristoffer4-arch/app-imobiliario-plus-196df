-- ============================================================================ 
-- RLS FIX FOR PUBLIC PROPERTIES ACCESS (SECURE VERSION)
-- ============================================================================ 
-- This script adds a public read policy to allow anonymous users to view
-- active properties without authentication.
--
-- IMPORTANT SECURITY NOTE:
--   The previous version of this file created a `Anyone can insert properties`
--   policy (WITH CHECK (true)) which allows ANYONE to insert rows. This is
--   INSECURE for production and must NOT be applied to production databases.
--
--   This file below provides:
--    - A public SELECT policy for active properties (safe for public reads)
--    - Authenticated INSERT policy (recommended for production)
--    - A commented DEV-ONLY INSERT policy (explicitly for temporary local/dev use)
-- ============================================================================ 

-- Ensure RLS is enabled
ALTER TABLE IF EXISTS properties ENABLE ROW LEVEL SECURITY;

-- Public read policy: allows anyone to SELECT active properties
DROP POLICY IF EXISTS "Public can view active properties" ON properties;

CREATE POLICY "Public can view active properties"
    ON properties FOR SELECT
    USING (status = 'active');

-- Authenticated users can view their own properties (including inactive)
DROP POLICY IF EXISTS "Users can view own properties" ON properties;

CREATE POLICY "Users can view own properties"
    ON properties FOR SELECT
    USING (auth.uid() = user_id);

-- Recommended production INSERT policy:
-- Only authenticated users can insert and only if auth.uid() matches user_id in payload
DROP POLICY IF EXISTS "Authenticated users can insert properties" ON properties;

CREATE POLICY "Authenticated users can insert properties"
    ON properties FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- If you absolutely need to allow unauthenticated inserts temporarily for local/dev testing,
-- you can use the following DEV-ONLY policy. DO NOT apply to production.
-- (This block is commented out on purpose.)
/*
-- DEV ONLY: Allows anyone to insert properties (INSECURE — dev/demo only)
DROP POLICY IF EXISTS "Anyone can insert properties" ON properties;

CREATE POLICY "Anyone can insert properties"
    ON properties FOR INSERT
    WITH CHECK (true);
*/

-- Keep update/delete restricted to authenticated owners
DROP POLICY IF EXISTS "Users can update own properties" ON properties;

CREATE POLICY "Users can update own properties"
    ON properties FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own properties" ON properties;

CREATE POLICY "Users can delete own properties"
    ON properties FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================ 
-- Deployment instructions (SECURE)
-- 1) Run this script in your Supabase SQL editor to setup secure RLS policies.
-- 2) If you need to seed data for local development, run supabase-seed-data.sql locally
--    AFTER enabling the DEV-ONLY INSERT policy (only on your local/dev environment).
-- 3) DO NOT enable the DEV-ONLY INSERT policy in production.
-- ============================================================================
