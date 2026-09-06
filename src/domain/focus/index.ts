import { FocusSessionState } from '../../types';

export interface FocusYield {
  xp: number;
  coins: number;
}

/**
 * Calculates XP and Coin yields based on duration and overcharge modifier.
 */
export function calculateFocusYield(
  durationMinutes: number,
  isOvercharged = false
): FocusYield {
  const safeMinutes = Math.max(1, durationMinutes);
  const baseXp = Math.round(safeMinutes * 4.8); // 25 min = 120 XP
  const baseCoins = Math.max(1, Math.round(safeMinutes * 0.6)); // 25 min = 15 coins

  if (isOvercharged) {
    return {
      xp: Math.round(baseXp * 1.5), // 25 min = 180 XP
      coins: Math.round(baseCoins * 1.5), // 25 min = 23 coins
    };
  }

  return {
    xp: baseXp,
    coins: baseCoins,
  };
}

export interface FocusSessionCreationParams {
  durationMinutes: number;
  questId?: string;
  questTitle?: string;
  isOvercharged?: boolean;
  soundscapeTrack?: FocusSessionState['soundscapeTrack'];
  now?: number;
  sessionMode?: 'work' | 'break';
}

/**
 * Creates a timestamp-anchored focus session entity.
 */
export function createFocusSessionEntity(params: FocusSessionCreationParams): FocusSessionState {
  const now = params.now || Date.now();
  const targetDurationSeconds = Math.max(60, Math.round(params.durationMinutes * 60));
  const endsAt = now + targetDurationSeconds * 1000;
  const isOvercharged = !!params.isOvercharged;
  const yields = calculateFocusYield(params.durationMinutes, isOvercharged);

  return {
    isActive: true,
    isPaused: false,
    targetDurationSeconds,
    remainingSeconds: targetDurationSeconds,
    accumulatedXp: yields.xp,
    accumulatedCoins: yields.coins,
    selectedQuestId: params.questId,
    selectedQuestTitle: params.questTitle || 'Deep Work: Strategy Sprint',
    isOvercharged,
    soundscapeTrack: params.soundscapeTrack || 'binaural',
    startedAt: now,
    endsAt,
    sessionMode: params.sessionMode || 'work',
  };
}

/**
 * Calculates remaining seconds using wall-clock timestamp comparison.
 */
export function calculateRemainingSeconds(
  session: FocusSessionState,
  now = Date.now()
): number {
  if (!session.isActive) return session.remainingSeconds;
  if (session.isPaused) return session.remainingSeconds;
  if (!session.endsAt) return session.remainingSeconds;

  const diffMs = session.endsAt - now;
  return Math.max(0, Math.ceil(diffMs / 1000));
}

/**
 * Pauses an active focus session, anchoring the exact remaining seconds.
 */
export function pauseFocusSessionEntity(
  session: FocusSessionState,
  now = Date.now()
): FocusSessionState {
  if (!session.isActive || session.isPaused) return session;

  const remaining = calculateRemainingSeconds(session, now);

  return {
    ...session,
    isPaused: true,
    pausedAt: now,
    remainingSeconds: remaining,
  };
}

/**
 * Resumes a paused session, re-anchoring endsAt from current wall-clock time.
 */
export function resumeFocusSessionEntity(
  session: FocusSessionState,
  now = Date.now()
): FocusSessionState {
  if (!session.isActive || !session.isPaused) return session;

  const remainingSeconds = Math.max(1, session.remainingSeconds);
  const newEndsAt = now + remainingSeconds * 1000;

  return {
    ...session,
    isPaused: false,
    pausedAt: undefined,
    endsAt: newEndsAt,
  };
}

/**
 * Checks if a session has finished its wall-clock duration.
 */
export function isFocusSessionComplete(
  session: FocusSessionState,
  now = Date.now()
): boolean {
  if (!session.isActive) return false;
  return calculateRemainingSeconds(session, now) <= 0;
}

/**
 * Computes progress stats (progress fraction 0..1, progress percentage 0..100, elapsed seconds).
 */
export function calculateFocusProgress(
  session: FocusSessionState,
  now = Date.now()
): {
  progressFraction: number;
  progressPercent: number;
  elapsedSeconds: number;
  remainingSeconds: number;
} {
  const remainingSeconds = calculateRemainingSeconds(session, now);
  const total = Math.max(1, session.targetDurationSeconds);
  const elapsedSeconds = Math.min(total, Math.max(0, total - remainingSeconds));
  const progressFraction = Math.min(1, Math.max(0, elapsedSeconds / total));
  const progressPercent = Math.round(progressFraction * 100);

  return {
    progressFraction,
    progressPercent,
    elapsedSeconds,
    remainingSeconds,
  };
}
