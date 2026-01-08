// Gamification Constants

// XP per level constant
export const XP_PER_LEVEL = 100;

// XP awards for different actions
export const XP_REWARDS = {
  PROPERTY_CREATED: 10,
  LEAD_CREATED: 5,
  SALE_COMPLETED: 50,
  MEETING_SCHEDULED: 3,
} as const;

// Badge criteria definitions
export const BADGE_CRITERIA = {
  first_property: { type: 'property_count', threshold: 1, xp: 50 },
  '10_properties': { type: 'property_count', threshold: 10, xp: 100 },
  '50_properties': { type: 'property_count', threshold: 50, xp: 250 },
  '100_properties': { type: 'property_count', threshold: 100, xp: 500 },
  first_lead: { type: 'lead_count', threshold: 1, xp: 25 },
  '10_leads': { type: 'lead_count', threshold: 10, xp: 75 },
  '50_leads': { type: 'lead_count', threshold: 50, xp: 200 },
  '100_leads': { type: 'lead_count', threshold: 100, xp: 400 },
  level_5: { type: 'level', threshold: 5, xp: 100 },
  level_10: { type: 'level', threshold: 10, xp: 250 },
  level_25: { type: 'level', threshold: 25, xp: 500 },
  level_50: { type: 'level', threshold: 50, xp: 1000 },
} as const;

// Calculate level from XP
export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

// Calculate XP needed for next level
export function calculateNextLevelXP(currentLevel: number): number {
  return currentLevel * XP_PER_LEVEL;
}

// Calculate XP within current level
export function calculateXPInCurrentLevel(xp: number, level: number): number {
  const currentLevelXP = (level - 1) * XP_PER_LEVEL;
  return xp - currentLevelXP;
}

// Calculate progress percentage to next level
export function calculateProgressToNextLevel(xp: number, level: number): number {
  const xpInCurrentLevel = calculateXPInCurrentLevel(xp, level);
  return (xpInCurrentLevel / XP_PER_LEVEL) * 100;
}
