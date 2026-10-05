import { INITIAL_PROFILE, INITIAL_QUESTS, INITIAL_HABITS, INITIAL_CHESTS, INITIAL_REWARDS } from '../services/storage';

export interface RepairResult {
  repairedPayload: Record<string, unknown>;
  issuesFixed: string[];
}

export function repairCorruptedBackup(rawJson: string): RepairResult | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return null;
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return null;
  }

  const issuesFixed: string[] = [];
  const repaired = { ...(parsed as Record<string, unknown>) } as Record<string, unknown> & { profile?: unknown; timestamp?: unknown; version?: unknown; quests?: unknown; habits?: unknown; chests?: unknown; rewards?: unknown; transactions?: unknown };

  if (!repaired.version) {
    repaired.version = '2.0';
    issuesFixed.push('Added missing schema version');
  }

  if (!repaired.timestamp || typeof repaired.timestamp !== 'string') {
    repaired.timestamp = new Date().toISOString();
    issuesFixed.push('Repaired invalid timestamp');
  }

  if (!repaired.profile || typeof repaired.profile !== 'object') {
    repaired.profile = { ...INITIAL_PROFILE };
    issuesFixed.push('Reconstructed default player profile');
  } else {
    // Fill any missing profile fields
    for (const [k, v] of Object.entries(INITIAL_PROFILE) as Array<[string, unknown]>) {
      const prof = repaired.profile as Record<string, unknown>;
      if (prof[k] === undefined || prof[k] === null) {
        prof[k] = v;
        issuesFixed.push(`Restored default profile field: ${k}`);
      }
    }
  }

  if (!Array.isArray(repaired.quests)) {
    repaired.quests = [...INITIAL_QUESTS];
    issuesFixed.push('Reconstructed default quest log');
  }

  if (!Array.isArray(repaired.habits)) {
    repaired.habits = [...INITIAL_HABITS];
    issuesFixed.push('Reconstructed default habit tracker');
  }

  if (!Array.isArray(repaired.chests)) {
    repaired.chests = [...INITIAL_CHESTS];
    issuesFixed.push('Reconstructed default chest slots');
  }

  if (!Array.isArray(repaired.rewards)) {
    repaired.rewards = [...INITIAL_REWARDS];
    issuesFixed.push('Reconstructed default rewards bazaar');
  }

  if (!Array.isArray(repaired.transactions)) {
    repaired.transactions = [];
    issuesFixed.push('Initialized empty treasury ledger');
  }

  return {
    repairedPayload: repaired,
    issuesFixed,
  };
}
