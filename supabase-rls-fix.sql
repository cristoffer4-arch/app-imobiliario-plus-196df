-- ============================================================================
-- RLS FIX FOR PUBLIC PROPERTIES ACCESS
-- ============================================================================
-- This script adds a public read policy to allow anonymous users to view
-- active properties without authentication.
-- 
-- IMPORTANT: Run this on your Supabase instance to fix the empty API response
-- ============================================================================

-- Add public read policy for properties (allows anyone to view active properties)
DROP POLICY IF EXISTS "Public can view active properties" ON properties;

CREATE POLICY "Public can view active properties"
    ON properties FOR SELECT
    USING (status = 'active');

-- Optional: Keep the existing policy for users to view their own properties
-- This allows authenticated users to see ALL their properties (including inactive ones)
DROP POLICY IF EXISTS "Users can view own properties" ON properties;

CREATE POLICY "Users can view own properties"
    ON properties FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================================================
-- INSERT POLICY - PRODUCTION SAFE (RECOMMENDED)
-- ============================================================================
-- This policy requires authentication and ensures users can only insert
-- properties with their own user_id
DROP POLICY IF EXISTS "Authenticated users can insert properties" ON properties;

CREATE POLICY "Authenticated users can insert properties"
    ON properties FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- ============================================================================
-- DEV/TEST ONLY: PUBLIC INSERT POLICY (DO NOT USE IN PRODUCTION)
-- ============================================================================
-- ⚠️ CRITICAL SECURITY WARNING: The policy below allows ANYONE to insert 
-- properties without authentication. This is ONLY for development/testing.
-- 
-- 🚨 NEVER RUN THIS IN PRODUCTION - it creates a severe security vulnerability
-- 
-- To enable for local dev/testing only, uncomment the lines below:
-- 
-- DROP POLICY IF EXISTS "Anyone can insert properties" ON properties;
-- 
-- CREATE POLICY "Anyone can insert properties"
--     ON properties FOR INSERT
--     WITH CHECK (true);
-- ============================================================================

-- Keep existing policies for authenticated users to manage their own properties
DROP POLICY IF EXISTS "Users can update own properties" ON properties;

CREATE POLICY "Users can update own properties"
    ON properties FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own properties" ON properties;

CREATE POLICY "Users can delete own properties"
    ON properties FOR DELETE
    USING (auth.uid() = user_id);

-- Verify RLS is enabled
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- INSTRUCTIONS FOR PRODUCTION DEPLOYMENT
-- ============================================================================
-- 1. Go to your Supabase Dashboard: https://app.supabase.com
-- 2. Select your project: ebuktnhikkttcmxrbbhk
-- 3. Click on "SQL Editor" in the left sidebar
-- 4. Create a new query
-- 5. Copy and paste this entire file
-- 6. Click "Run" to execute
-- 7. Verify policies are active in Database > Policies
-- 
-- WHAT THIS DOES:
-- ✅ Enables public SELECT for active properties (safe for API)
-- ✅ Enables authenticated INSERT with user_id validation (secure)
-- ✅ Keeps authenticated UPDATE/DELETE for property owners
-- ❌ Does NOT enable public INSERT (security best practice)
-- 
-- FOR LOCAL DEV/TESTING ONLY:
-- If you need to test property creation without auth in development,
-- uncomment the "DEV/TEST ONLY" policy section above. 
-- NEVER deploy this to production!
-- 
-- SEED DATA:
-- To populate test data, run supabase-seed-data.sql ONLY in dev environment
-- ============================================================================
