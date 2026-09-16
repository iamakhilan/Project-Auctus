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
