import { describe, it, expect } from 'vitest';

describe('Sanity Test Harness', () => {
  it('should pass basic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have mock audio context available in environment', () => {
    const ctx = new window.AudioContext();
    expect(ctx).toBeDefined();
    expect(ctx.createOscillator).toBeDefined();
  });

  it('should have localStorage available', () => {
    window.localStorage.setItem('test_key', 'test_val');
    expect(window.localStorage.getItem('test_key')).toBe('test_val');
    window.localStorage.removeItem('test_key');
    expect(window.localStorage.getItem('test_key')).toBeNull();
  });
});
