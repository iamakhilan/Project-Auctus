import {
  PlayerProfile,
  Quest,
  ChestSlot,
  RewardItem,
  FocusSessionState,
  Habit,
  EconomyTransaction,
} from '../../types';

export interface AuctusV2SaveData {
  schemaVersion: 2;
  exportedAt: string;
  profile: PlayerProfile;
  quests: Quest[];
  chests: ChestSlot[];
  rewards: RewardItem[];
  focusSession?: FocusSessionState;
  habits?: Habit[];
  transactions?: EconomyTransaction[];
  achievements?: any[];
}

export interface MigrationResult {
  migrated: boolean;
  fromVersion: number;
  toVersion: number;
  data: AuctusV2SaveData;
  error?: string;
}
