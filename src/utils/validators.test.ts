import { describe, expect, it } from 'vitest';
import { clamp, isCostValid, isNonEmpty, sanitize } from './validators';

describe('validators', () => {
  it('accepts non-empty text and rejects whitespace-only values', () => {
    expect(isNonEmpty('Quest')).toBe(true);
    expect(isNonEmpty('  Quest  ')).toBe(true);
    expect(isNonEmpty('   ')).toBe(false);
    expect(isNonEmpty('')).toBe(false);
  });

  it('enforces the reward cost range and integer requirement', () => {
    expect(isCostValid(10)).toBe(true);
    expect(isCostValid(5000)).toBe(true);
    expect(isCostValid(9)).toBe(false);
    expect(isCostValid(5001)).toBe(false);
    expect(isCostValid(10.5)).toBe(false);
    expect(isCostValid(Number.NaN)).toBe(false);
  });

  it('clamps values into the requested range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
    expect(clamp(5, 10, 0)).toBe(5);
  });

  it('removes markup and escapes dangerous characters', () => {
    expect(sanitize('  <script>alert("x")</script>  Quest  ')).toBe(
      'alert(&quot;x&quot;) Quest',
    );
    expect(sanitize('<img src=x onerror=alert(1)>Reward')).toBe('Reward');
  });
});
