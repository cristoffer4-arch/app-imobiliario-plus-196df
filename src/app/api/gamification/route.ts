// API Route: /api/gamification
// GET: Get user's gamification stats (XP, level, badges, activities)
// POST: Award XP and check for badge unlocks

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { calculateLevel, calculateNextLevelXP } from '@/lib/gamification-constants';
import type { GamificationStats } from '@/types/index';

// GET /api/gamification - Get user's gamification stats
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile with XP
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('xp, level')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch profile', details: profileError.message },
        { status: 500 }
      );
    }

    const xp = profile?.xp || 0;
    const level = calculateLevel(xp);
    const nextLevelXP = calculateNextLevelXP(level);
    const currentLevelXP = (level - 1) * 100;
    const progressToNextLevel = ((xp - currentLevelXP) / 100) * 100;

    // Get user badges
    const { data: userBadges, error: badgesError } = await supabase
      .from('user_badges')
      .select(`
        id,
        user_id,
        badge_id,
        unlocked_at,
        badge:badges(
          id,
          name,
          description,
          icon,
          criteria,
          rarity,
          xp_reward,
          created_at
        )
      `)
      .eq('user_id', session.user.id)
      .order('unlocked_at', { ascending: false });

    if (badgesError) {
      console.error('Error fetching badges:', badgesError);
    }

    // Get total counts
    const { count: propertiesCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id);

    const { count: leadsCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id);

    // Get recent activities
    const { data: activities, error: activitiesError } = await supabase
      .from('activity_feed')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError);
    }

    const stats: GamificationStats = {
      xp,
      level,
      next_level_xp: nextLevelXP,
      progress_to_next_level: progressToNextLevel,
      total_properties: propertiesCount || 0,
      total_leads: leadsCount || 0,
      badges: userBadges || [],
      recent_activities: activities || [],
    };

    return NextResponse.json({
      data: stats,
      message: 'Gamification stats retrieved successfully',
    });

  } catch (error) {
    console.error('Unexpected error in GET /api/gamification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/gamification - Award XP and check badges
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { xp_amount, activity_type, description } = body;

    if (!xp_amount || !activity_type) {
      return NextResponse.json(
        { error: 'Missing required fields: xp_amount and activity_type' },
        { status: 400 }
      );
    }

    // Get current profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('xp, level')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to fetch profile', details: profileError.message },
        { status: 500 }
      );
    }

    const currentXP = profile?.xp || 0;
    const newXP = currentXP + xp_amount;
    const oldLevel = calculateLevel(currentXP);
    const newLevel = calculateLevel(newXP);

    // Update XP and level
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        xp: newXP,
        level: newLevel,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update XP', details: updateError.message },
        { status: 500 }
      );
    }

    // Create activity feed entry
    const { error: activityError } = await supabase
      .from('activity_feed')
      .insert([{
        user_id: session.user.id,
        activity_type,
        description: description || `Ganhou ${xp_amount} XP`,
        xp: xp_amount,
        is_public: true,
      }]);

    if (activityError) {
      console.error('Error creating activity:', activityError);
    }

    // Check for level up
    if (newLevel > oldLevel) {
      await supabase
        .from('activity_feed')
        .insert([{
          user_id: session.user.id,
          activity_type: 'level_up',
          description: `Avançou para o nível ${newLevel}!`,
          xp: 0,
          is_public: true,
        }]);
    }

    // Check for badge unlocks
    const unlockedBadges = await checkAndUnlockBadges(supabase, session.user.id);

    return NextResponse.json({
      data: {
        xp: newXP,
        level: newLevel,
        level_up: newLevel > oldLevel,
        unlocked_badges: unlockedBadges,
      },
      message: 'XP awarded successfully',
    });

  } catch (error) {
    console.error('Unexpected error in POST /api/gamification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to check and unlock badges
async function checkAndUnlockBadges(supabase: any, userId: string) {
  const unlockedBadges = [];

  try {
    // Get user stats
    const { data: profile } = await supabase
      .from('profiles')
      .select('xp, level')
      .eq('id', userId)
      .single();

    const { count: propertiesCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { count: leadsCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const level = calculateLevel(profile?.xp || 0);

    // Get all badges
    const { data: allBadges } = await supabase
      .from('badges')
      .select('*');

    if (!allBadges) return unlockedBadges;

    // Get already unlocked badges
    const { data: userBadges } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', userId);

    const unlockedBadgeIds = new Set(userBadges?.map((ub: any) => ub.badge_id) || []);

    // Check each badge
    for (const badge of allBadges) {
      if (unlockedBadgeIds.has(badge.id)) continue;

      const criteria = badge.criteria as any;
      let shouldUnlock = false;

      if (criteria.type === 'property_count' && propertiesCount >= criteria.threshold) {
        shouldUnlock = true;
      } else if (criteria.type === 'lead_count' && leadsCount >= criteria.threshold) {
        shouldUnlock = true;
      } else if (criteria.type === 'level' && level >= criteria.threshold) {
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        // Unlock badge
        const { error } = await supabase
          .from('user_badges')
          .insert([{
            user_id: userId,
            badge_id: badge.id,
          }]);

        if (!error) {
          unlockedBadges.push(badge);

          // Create activity for badge unlock
          await supabase
            .from('activity_feed')
            .insert([{
              user_id: userId,
              activity_type: 'badge_unlock',
              description: `Desbloqueou a badge: ${badge.name}`,
              xp: badge.xp_reward || 0,
              is_public: true,
            }]);

          // Award badge XP
          if (badge.xp_reward > 0) {
            const { data: currentProfile } = await supabase
              .from('profiles')
              .select('xp')
              .eq('id', userId)
              .single();

            await supabase
              .from('profiles')
              .update({
                xp: (currentProfile?.xp || 0) + badge.xp_reward,
              })
              .eq('id', userId);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking badges:', error);
  }

  return unlockedBadges;
}
