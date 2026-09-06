import { describe, it, expect } from 'vitest';
import {
  calculateFocusYield,
  createFocusSessionEntity,
  calculateRemainingSeconds,
  pauseFocusSessionEntity,
  resumeFocusSessionEntity,
  isFocusSessionComplete,
  calculateFocusProgress,
} from '../../src/domain/focus';

describe('Focus Arena Timing Domain Engine', () => {
  it('should calculate yields for standard and overcharged modes', () => {
    const standard25 = calculateFocusYield(25, false);
    expect(standard25.xp).toBe(120);
    expect(standard25.coins).toBe(15);

    const overcharged25 = calculateFocusYield(25, true);
    expect(overcharged25.xp).toBe(180);
    expect(overcharged25.coins).toBe(23);

    const standard60 = calculateFocusYield(60, false);
    expect(standard60.xp).toBe(288);
    expect(standard60.coins).toBe(36);
  });

  it('should create session with correct timestamp anchors', () => {
    const now = 1700000000000;
    const session = createFocusSessionEntity({
      durationMinutes: 25,
      now,
    });

    expect(session.isActive).toBe(true);
    expect(session.isPaused).toBe(false);
    expect(session.targetDurationSeconds).toBe(1500);
    expect(session.startedAt).toBe(now);
    expect(session.endsAt).toBe(now + 1500 * 1000);
    expect(session.remainingSeconds).toBe(1500);
  });

  it('should calculate remaining seconds based on wall-clock progression', () => {
    const now = 1700000000000;
    const session = createFocusSessionEntity({
      durationMinutes: 25,
      now,
    });

    // 500 seconds later in real-world time
    const later = now + 500 * 1000;
    const remaining = calculateRemainingSeconds(session, later);
    expect(remaining).toBe(1000);

    const progress = calculateFocusProgress(session, later);
    expect(progress.elapsedSeconds).toBe(500);
    expect(progress.progressPercent).toBe(33);
  });

  it('should handle pause and resume with timestamp re-anchoring', () => {
    const start = 1700000000000;
    const session = createFocusSessionEntity({
      durationMinutes: 10, // 600s
      now: start,
    });

    // Run for 200s, then pause
    const pauseTime = start + 200 * 1000;
    const pausedSession = pauseFocusSessionEntity(session, pauseTime);
    expect(pausedSession.isPaused).toBe(true);
    expect(pausedSession.remainingSeconds).toBe(400);

    // Tab stays asleep or paused for 1000s
    const idleTime = pauseTime + 1000 * 1000;
    expect(calculateRemainingSeconds(pausedSession, idleTime)).toBe(400);

    // Resume at idleTime
    const resumedSession = resumeFocusSessionEntity(pausedSession, idleTime);
    expect(resumedSession.isPaused).toBe(false);
    expect(resumedSession.endsAt).toBe(idleTime + 400 * 1000);

    // 100s after resume
    const afterResume = idleTime + 100 * 1000;
    expect(calculateRemainingSeconds(resumedSession, afterResume)).toBe(300);
  });

  it('should correctly detect session completion when elapsed', () => {
    const start = 1700000000000;
    const session = createFocusSessionEntity({
      durationMinutes: 5, // 300s
      now: start,
    });

    expect(isFocusSessionComplete(session, start + 299 * 1000)).toBe(false);
    expect(isFocusSessionComplete(session, start + 300 * 1000)).toBe(true);
    expect(isFocusSessionComplete(session, start + 400 * 1000)).toBe(true);
  });

  it('should survive JSON serialization simulating browser refresh', () => {
    const start = 1700000000000;
    const session = createFocusSessionEntity({
      durationMinutes: 25,
      now: start,
    });

    // Simulate localStorage save & reload
    const serialized = JSON.stringify(session);
    const restored = JSON.parse(serialized);

    // Check after 600s
    const checkTime = start + 600 * 1000;
    expect(calculateRemainingSeconds(restored, checkTime)).toBe(900);
  });
});
