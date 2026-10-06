/**
 * Shared validators — pure, no side effects.
 */

export const isNonEmpty = (value: string): boolean => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Cost must be integer in [10, 5000]. Matches Vault CustomRewardModal rules.
 */
export const isCostValid = (value: number): boolean => {
  return Number.isFinite(value) && Number.isInteger(value) && value >= 10 && value <= 5000;
};

export const clamp = (value: number, min: number, max: number): number => {
  if (min > max) [min, max] = [max, min];
  return Math.min(Math.max(value, min), max);
};

/**
 * Basic XSS-safe sanitize: strip HTML tags, trim, collapse whitespace,
 * and escape the five critical entities for safe innerHTML use.
 */
export const sanitize = (input: string): string => {
  if (typeof input !== 'string') return '';
  // strip tags
  let out = input.replace(/<[^>]*>/g, '');
  // escape entities
  out = out
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  // collapse whitespace and trim
  out = out.replace(/\s+/g, ' ').trim();
  return out;
};

export interface BackupValidationResult {
  isValid: boolean;
  version: '1.0' | '2.0' | '2.1' | 'unknown';
  errors: string[];
  data?: Record<string, unknown>;
}

export const validateBackupPayload = (raw: string | unknown): BackupValidationResult => {
  let parsed: unknown = raw;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return {
        isValid: false,
        version: 'unknown',
        errors: ['Invalid JSON format: unable to parse backup string.'],
      };
    }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {
      isValid: false,
      version: 'unknown',
      errors: ['Invalid backup structure: root payload must be a JSON object.'],
    };
  }

  const obj = parsed as Record<string, unknown>;

  // Prototype pollution guard — reject dangerous keys at root
  for (const k of Object.keys(obj)) {
    if (k === '__proto__' || k === 'constructor' || k === 'prototype') {
      return { isValid: false, version: 'unknown', errors: [`Backup contains forbidden key: ${k}`] };
    }
  }

  const rawVersion = typeof obj.version === 'string' ? obj.version : undefined;
  const version: '1.0' | '2.0' | '2.1' | 'unknown' = rawVersion === '2.1' ? '2.1' : rawVersion === '2.0' ? '2.0' : rawVersion === '1.0' || !rawVersion ? '1.0' : 'unknown';

  // Reject future/unknown versions — must not be treated as valid
  if (version === 'unknown') {
    return { isValid: false, version: 'unknown', errors: [`Unsupported backup version: ${String(rawVersion)}`] };
  }

  const errors: string[] = [];

  const isFiniteInt = (v: unknown): boolean => typeof v === 'number' && Number.isFinite(v) && Number.isInteger(v);
  const isFiniteNum = (v: unknown): boolean => typeof v === 'number' && Number.isFinite(v);

  // Validate profile if present
  if (obj.profile !== undefined) {
    if (!obj.profile || typeof obj.profile !== 'object' || Array.isArray(obj.profile)) {
      errors.push('Profile property must be a valid object.');
    } else {
      const p = obj.profile as Record<string, unknown>;
      if (typeof p.name !== 'string' || !p.name.trim()) errors.push('Profile name must be a non-empty string.');
      if (typeof p.name === 'string' && p.name.length > 80) errors.push('Profile name too long (max 80).');
      if (!isFiniteInt(p.level) || (p.level as number) < 1 || (p.level as number) > 999) errors.push('Profile level must be an integer 1..999.');
      if (!isFiniteInt(p.coins) || (p.coins as number) < 0 || (p.coins as number) > 10_000_000) errors.push('Profile coins must be an integer 0..10,000,000.');
      if (!isFiniteInt(p.gems) || (p.gems as number) < 0 || (p.gems as number) > 10_000_000) errors.push('Profile gems must be an integer 0..10,000,000.');
      if (p.xp !== undefined && (!isFiniteNum(p.xp) || (p.xp as number) < 0)) errors.push('Profile xp must be a non-negative finite number.');
      if (p.xpToNextLevel !== undefined && (!isFiniteNum(p.xpToNextLevel) || (p.xpToNextLevel as number) <= 0)) errors.push('Profile xpToNextLevel must be a positive finite number.');
    }
  }

  // Validate quests if present
  if (obj.quests !== undefined) {
    if (!Array.isArray(obj.quests)) {
      errors.push('Quests property must be an array.');
    } else {
      if (obj.quests.length > 2000) errors.push('Quests array too large (max 2000).');
      obj.quests.forEach((q, idx) => {
        if (!q || typeof q !== 'object') {
          errors.push(`Quest item at index ${idx} is invalid.`);
        } else {
          const questObj = q as Record<string, unknown>;
          for (const k of Object.keys(questObj)) if (k === '__proto__' || k === 'constructor' || k === 'prototype') errors.push(`Quest ${idx} contains forbidden key: ${k}`);
          if (typeof questObj.id !== 'string' || !questObj.id.trim()) errors.push(`Quest item at index ${idx} missing valid ID.`);
          else if (questObj.id.length > 100) errors.push(`Quest item at index ${idx} ID too long.`);
          if (typeof questObj.title !== 'string' || !questObj.title.trim()) errors.push(`Quest item at index ${idx} missing valid title.`);
          else if ((questObj.title as string).length > 200) errors.push(`Quest item at index ${idx} title too long (max 200).`);
          if (questObj.xpReward !== undefined && (!isFiniteNum(questObj.xpReward) || (questObj.xpReward as number) < 0)) errors.push(`Quest ${idx} xpReward invalid.`);
          if (questObj.coinsReward !== undefined && (!isFiniteNum(questObj.coinsReward) || (questObj.coinsReward as number) < 0)) errors.push(`Quest ${idx} coinsReward invalid.`);
        }
      });
    }
  }

  // Validate habits if present
  if (obj.habits !== undefined) {
    if (!Array.isArray(obj.habits)) {
      errors.push('Habits property must be an array.');
    } else {
      if (obj.habits.length > 1000) errors.push('Habits array too large (max 1000).');
      obj.habits.forEach((h, idx) => {
        if (!h || typeof h !== 'object') {
          errors.push(`Habit item at index ${idx} is invalid.`);
        } else {
          const habitObj = h as Record<string, unknown>;
          for (const k of Object.keys(habitObj)) if (k === '__proto__' || k === 'constructor' || k === 'prototype') errors.push(`Habit ${idx} contains forbidden key: ${k}`);
          if (typeof habitObj.id !== 'string' || !habitObj.id.trim()) errors.push(`Habit item at index ${idx} missing valid ID.`);
          if (typeof habitObj.title !== 'string' || !habitObj.title.trim()) errors.push(`Habit item at index ${idx} missing valid title.`);
        }
      });
    }
  }

  // Validate campaigns if present (2.1 additions)
  if (obj.campaigns !== undefined) {
    if (!Array.isArray(obj.campaigns)) errors.push('Campaigns property must be an array.');
    else if (obj.campaigns.length > 500) errors.push('Campaigns array too large (max 500).');
    else {
      (obj.campaigns as unknown[]).forEach((c, idx) => {
        if (!c || typeof c !== 'object' || Array.isArray(c)) errors.push(`Campaign at index ${idx} is invalid.`);
        else {
          const cc = c as Record<string, unknown>;
          for (const k of Object.keys(cc)) if (k === '__proto__' || k === 'constructor' || k === 'prototype') errors.push(`Campaign ${idx} contains forbidden key: ${k}`);
          if (typeof cc.id !== 'string' || !cc.id.trim()) errors.push(`Campaign at index ${idx} missing valid ID.`);
          if (typeof cc.title !== 'string' || !cc.title.trim()) errors.push(`Campaign at index ${idx} missing valid title.`);
        }
      });
    }
  }

  // Validate effortLogs / weeklyReviews / chests / rewards / transactions if present — basic shape
  for (const key of ['effortLogs', 'weeklyReviews', 'chests', 'rewards', 'transactions', 'achievements'] as const) {
    const val = obj[key];
    if (val !== undefined && !Array.isArray(val)) errors.push(`${key} property must be an array.`);
    else if (Array.isArray(val) && val.length > 5000) errors.push(`${key} array too large (max 5000).`);
  }

  // Version 2.x schema assertions
  if (version === '2.0' || version === '2.1') {
    if (obj.achievementLocks !== undefined && !Array.isArray(obj.achievementLocks)) {
      errors.push('Version 2.x backup achievementLocks property must be an array of string IDs.');
    } else if (Array.isArray(obj.achievementLocks)) {
      for (let i = 0; i < (obj.achievementLocks as unknown[]).length; i++) if (typeof (obj.achievementLocks as unknown[])[i] !== 'string') errors.push(`achievementLocks[${i}] must be a string.`);
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      version,
      errors,
    };
  }

  return {
    isValid: true,
    version,
    errors: [],
    data: obj,
  };
};
