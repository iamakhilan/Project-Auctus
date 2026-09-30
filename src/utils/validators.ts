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
  version: '1.0' | '2.0' | 'unknown';
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
  const rawVersion = typeof obj.version === 'string' ? obj.version : undefined;
  const version: '1.0' | '2.0' | 'unknown' = rawVersion === '2.0' ? '2.0' : rawVersion === '1.0' || !rawVersion ? '1.0' : 'unknown';

  const errors: string[] = [];

  // Validate profile if present
  if (obj.profile !== undefined) {
    if (!obj.profile || typeof obj.profile !== 'object' || Array.isArray(obj.profile)) {
      errors.push('Profile property must be a valid object.');
    } else {
      const p = obj.profile as Record<string, unknown>;
      if (typeof p.name !== 'string' || !p.name.trim()) errors.push('Profile name must be a non-empty string.');
      if (typeof p.level !== 'number' || p.level < 1) errors.push('Profile level must be a positive integer.');
      if (typeof p.coins !== 'number' || p.coins < 0) errors.push('Profile coins must be a non-negative integer.');
      if (typeof p.gems !== 'number' || p.gems < 0) errors.push('Profile gems must be a non-negative integer.');
    }
  }

  // Validate quests if present
  if (obj.quests !== undefined) {
    if (!Array.isArray(obj.quests)) {
      errors.push('Quests property must be an array.');
    } else {
      obj.quests.forEach((q, idx) => {
        if (!q || typeof q !== 'object') {
          errors.push(`Quest item at index ${idx} is invalid.`);
        } else {
          const questObj = q as Record<string, unknown>;
          if (typeof questObj.id !== 'string') errors.push(`Quest item at index ${idx} missing valid ID.`);
          if (typeof questObj.title !== 'string') errors.push(`Quest item at index ${idx} missing valid title.`);
        }
      });
    }
  }

  // Validate habits if present
  if (obj.habits !== undefined) {
    if (!Array.isArray(obj.habits)) {
      errors.push('Habits property must be an array.');
    } else {
      obj.habits.forEach((h, idx) => {
        if (!h || typeof h !== 'object') {
          errors.push(`Habit item at index ${idx} is invalid.`);
        } else {
          const habitObj = h as Record<string, unknown>;
          if (typeof habitObj.id !== 'string') errors.push(`Habit item at index ${idx} missing valid ID.`);
          if (typeof habitObj.title !== 'string') errors.push(`Habit item at index ${idx} missing valid title.`);
        }
      });
    }
  }

  // Version 2.0 schema assertions
  if (version === '2.0') {
    if (obj.achievementLocks !== undefined && !Array.isArray(obj.achievementLocks)) {
      errors.push('Version 2.0 backup achievementLocks property must be an array of string IDs.');
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
