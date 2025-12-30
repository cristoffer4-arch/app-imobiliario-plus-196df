-- ============================================================================
-- RLS FIX FOR PUBLIC PROPERTIES ACCESS
-- ============================================================================
-- This script adds a public read policy to allow anonymous users to view
-- active properties without authentication.
-- 
-- IMPORTANT: Run this on your Supabase instance to fix the empty API response
-- ============================================================================

-- ============================================================================
-- PUBLIC READ POLICIES
-- ============================================================================

-- Allow public viewing of active properties
DROP POLICY IF EXISTS "Public can view active properties" ON properties;

CREATE POLICY "Public can view active properties"
    ON properties FOR SELECT
    USING (status = 'active');

-- Allow authenticated users to view their own properties (including inactive)
DROP POLICY IF EXISTS "Users can view own properties" ON properties;

CREATE POLICY "Users can view own properties"
    ON properties FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================================================
-- AUTHENTICATED INSERT POLICY (PRODUCTION SAFE)
-- ============================================================================
-- Requires:
-- 1. User must be authenticated (auth.uid() IS NOT NULL)
-- 2. user_id in the insert must match the authenticated user
-- This prevents users from inserting properties for other users

DROP POLICY IF EXISTS "Authenticated users can insert properties" ON properties;

CREATE POLICY "Authenticated users can insert properties"
    ON properties FOR INSERT
    WITH CHECK (
      auth.uid() IS NOT NULL 
      AND auth.uid() = user_id
    );

-- ============================================================================
-- DEV-ONLY: UNRESTRICTED INSERT (FOR TESTING/DEVELOPMENT)
-- ============================================================================
-- ⚠️ SECURITY WARNING: NEVER use this policy in production
-- This allows unrestricted property insertion for testing purposes
-- To enable during development:
-- 1. Uncomment the code below
-- 2. Deploy to development database only
-- 3. Delete this policy before production release
-- 4. Ensure authenticated policy above is active
--
-- DROP POLICY IF EXISTS "Dev: Anyone can insert properties" ON properties;
--
-- CREATE POLICY "Dev: Anyone can insert properties"
--     ON properties FOR INSERT
--     WITH CHECK (true);

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
-- INSTRUCTIONS FOR DEPLOYMENT
-- ============================================================================
-- 1. Go to your Supabase Dashboard: https://app.supabase.com
-- 2. Select your project: ebuktnhikkttcmxrbbhk
-- 3. Click on "SQL Editor" in the left sidebar
-- 4. Create a new query
-- 5. Copy and paste this entire file
-- 6. Click "Run" to execute
-- 7. Test the API endpoint: https://luxeagent.netlify.app/api/properties
-- ============================================================================
