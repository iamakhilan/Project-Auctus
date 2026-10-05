import { describe, it, expect } from 'vitest';
import { isNonEmpty, isCostValid, clamp, sanitize, validateBackupPayload } from '../validators';

describe('isNonEmpty', () => {
  it('returns true for non-empty strings', () => {
    expect(isNonEmpty('hello')).toBe(true);
    expect(isNonEmpty(' a ')).toBe(true);
    expect(isNonEmpty('0')).toBe(true);
  });

  it('returns false for empty or whitespace-only strings', () => {
    expect(isNonEmpty('')).toBe(false);
    expect(isNonEmpty('   ')).toBe(false);
    expect(isNonEmpty('\t\n')).toBe(false);
    expect(isNonEmpty(' \n\t ')).toBe(false);
  });
});

describe('isCostValid boundaries 10-5000', () => {
  it('accepts lower boundary 10 and upper boundary 5000', () => {
    expect(isCostValid(10)).toBe(true);
    expect(isCostValid(5000)).toBe(true);
  });

  it('accepts values inside range', () => {
    expect(isCostValid(100)).toBe(true);
    expect(isCostValid(2500)).toBe(true);
    expect(isCostValid(11)).toBe(true);
    expect(isCostValid(4999)).toBe(true);
  });

  it('rejects values below 10 and above 5000', () => {
    expect(isCostValid(9)).toBe(false);
    expect(isCostValid(0)).toBe(false);
    expect(isCostValid(-5)).toBe(false);
    expect(isCostValid(5001)).toBe(false);
    expect(isCostValid(10000)).toBe(false);
  });

  it('rejects non-integers and non-finite numbers', () => {
    expect(isCostValid(10.5)).toBe(false);
    expect(isCostValid(99.9)).toBe(false);
    expect(isCostValid(NaN)).toBe(false);
    expect(isCostValid(Infinity)).toBe(false);
    expect(isCostValid(-Infinity)).toBe(false);
  });
});

describe('clamp', () => {
  it('clamps within normal min/max', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it('swaps min and max when min > max', () => {
    expect(clamp(5, 10, 0)).toBe(5);
    expect(clamp(-5, 10, 0)).toBe(0);
    expect(clamp(15, 10, 0)).toBe(10);
    expect(clamp(0, 10, 0)).toBe(0);
    expect(clamp(10, 10, 0)).toBe(10);
  });

  it('handles equal min and max', () => {
    expect(clamp(5, 5, 5)).toBe(5);
    expect(clamp(100, 5, 5)).toBe(5);
  });
});

describe('sanitize', () => {
  it('strips HTML tags', () => {
    expect(sanitize('<b>hello</b>')).toBe('hello');
    expect(sanitize('<div><p>nested</p></div>')).toBe('nested');
    expect(sanitize('<script>alert("x")</script>')).toBe('alert(&quot;x&quot;)');
    expect(sanitize('hello <b>world</b> test')).toBe('hello world test');
  });

  it('escapes critical entities', () => {
    expect(sanitize('a & b')).toBe('a &amp; b');
    expect(sanitize('say "hello"')).toBe('say &quot;hello&quot;');
    expect(sanitize("it's fine")).toBe('it&#39;s fine');
    // remaining < and > after tag stripping are escaped
    expect(sanitize('a < b')).toBe('a &lt; b');
    expect(sanitize('a > b')).toBe('a &gt; b');
  });

  it('collapses whitespace and trims', () => {
    expect(sanitize('  hello   world  ')).toBe('hello world');
    expect(sanitize('hello \n\t  world')).toBe('hello world');
    expect(sanitize('   ')).toBe('');
    expect(sanitize('')).toBe('');
  });

  it('returns empty string for non-string input', () => {
    // @ts-expect-error testing runtime guard
    expect(sanitize(null)).toBe('');
    // @ts-expect-error testing runtime guard
    expect(sanitize(undefined)).toBe('');
    expect(sanitize(123 as unknown as string)).toBe('');
  });
});

describe('validateBackupPayload', () => {
  it('validates a valid v2 backup payload', () => {
    const backup = {
      version: '2.0',
      profile: {
        name: 'Commander',
        level: 5,
        coins: 1000,
        gems: 50,
      },
      quests: [{ id: 'q1', title: 'Test Quest' }],
      habits: [{ id: 'h1', title: 'Test Habit' }],
      achievementLocks: ['a1', 'a2'],
    };

    const res = validateBackupPayload(JSON.stringify(backup));
    expect(res.isValid).toBe(true);
    expect(res.version).toBe('2.0');
    expect(res.errors).toHaveLength(0);
  });

  it('validates a legacy v1 backup payload without version key', () => {
    const legacy = {
      profile: {
        name: 'Legacy Player',
        level: 2,
        coins: 500,
        gems: 10,
      },
      quests: [{ id: 'q1', title: 'Legacy Quest' }],
    };

    const res = validateBackupPayload(JSON.stringify(legacy));
    expect(res.isValid).toBe(true);
    expect(res.version).toBe('1.0');
    expect(res.errors).toHaveLength(0);
  });

  it('rejects malformed JSON strings', () => {
    const res = validateBackupPayload('{ broken json:');
    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain('Invalid JSON format');
  });

  it('rejects invalid profile structures', () => {
    const invalid = {
      version: '2.0',
      profile: {
        name: '',
        level: -1,
        coins: 'lots',
      },
    };

    const res = validateBackupPayload(invalid);
    expect(res.isValid).toBe(false);
    expect(res.errors.length).toBeGreaterThan(0);
  });

  it('rejects invalid achievementLocks type in v2 schema', () => {
    const invalid = {
      version: '2.0',
      achievementLocks: 'not-an-array',
    };

    const res = validateBackupPayload(invalid);
    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain('achievementLocks');
  });
});
