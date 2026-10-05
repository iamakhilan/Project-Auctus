import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageService, INITIAL_PROFILE } from '../storage';
import { applyAtomicTransaction } from '../../utils/transactionRunner';
import { calculateUpdatedStreak } from '../../utils/dateUtils';
import { validateBackupPayload } from '../../utils/validators';

describe('Integration: Multi-module State & Persistence Safety', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('coordinates economy transactions, achievement locks, and backup verification', () => {
    // 1. Initial State
    const profile = StorageService.getProfile();
    expect(profile.coins).toBe(INITIAL_PROFILE.coins);

    // 2. Atomic Transaction
    const txRes = applyAtomicTransaction(profile, {
      amount: 250,
      currency: 'coins',
      type: 'earn',
      reason: 'Epic bounty completion',
    });
    expect(txRes.success).toBe(true);
    StorageService.setProfile(txRes.newProfile);
    expect(StorageService.getProfile().coins).toBe(INITIAL_PROFILE.coins + 250);

    // 3. Persistent Achievement Lock
    const initialLocks = StorageService.getAchievementLocks();
    const updatedLocks = [...initialLocks, 'a5'];
    StorageService.setAchievementLocks(updatedLocks);
    expect(StorageService.getAchievementLocks()).toContain('a5');

    // 4. Timezone-safe Streak Check-in
    const habits = StorageService.getHabits();
    const habit = habits[0];
    const streakRes = calculateUpdatedStreak(habit.completedDates, habit.streakCount, habit.bestStreak, '2026-10-02');
    expect(streakRes.streakCount).toBeGreaterThan(0);

    // 5. Version 2.0 Backup Export and Validation
    const backupJson = StorageService.exportBackup();
    const validation = validateBackupPayload(backupJson);
    expect(validation.isValid).toBe(true);
    expect(validation.version).toBe('2.1');

    // 6. Restore to clean state
    localStorage.clear();
    const imported = StorageService.importBackup(backupJson);
    expect(imported).toBe(true);
    expect(StorageService.getProfile().coins).toBe(INITIAL_PROFILE.coins + 250);
    expect(StorageService.getAchievementLocks()).toContain('a5');
  });

  it('verifies safe empty state fallbacks for telemetry exports', () => {
    const backupJson = StorageService.exportBackup();
    expect(backupJson).toBeTypeOf('string');
    const parsed = JSON.parse(backupJson);
    expect(parsed.version).toBe('2.1');
    expect(Array.isArray(parsed.quests)).toBe(true);
    expect(Array.isArray(parsed.habits)).toBe(true);
    expect(Array.isArray(parsed.transactions)).toBe(true);
  });
});
