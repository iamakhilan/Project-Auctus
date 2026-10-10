import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  TabType,
  PlayerProfile,
  Quest,
  Habit,
  ChestSlot,
  ChestTier,
  RewardItem,
  Achievement,
  EconomyTransaction,
  FocusSessionState,
  ClaimModalData,
  Campaign,
  Milestone,
  FocusEffortLog,
  WeeklyReview,
  DailyObjective,
  ProductivitySnapshot,
} from '../types';
import { StorageService, STORAGE_KEYS } from '../services/storage';
import { soundEngine } from '../utils/audioSynthesizer';
import { triggerConfetti } from '../utils/confetti';

import { getLocalDateString } from '../utils/dateUtils';
import { syncChannel } from '../utils/syncChannel';
import { buildDailyObjectives } from '../engine/planner';
import { buildSnapshot, deriveInsights } from '../engine/intelligence';
import { buildWeeklyReview as buildWeeklyReviewEngine, shouldShowWeeklyReview } from '../engine/weekly';
import { createAIProviderFromStorage, hasUserConfiguredApiKey, setUserApiKey, clearUserApiKey } from '../services/aiProvider';
import { buildAIContext } from '../services/aiContext';
import { AUCTUSIntelligence, AIReasoningResponse } from '../services/intelligenceLayer';

interface GameStateContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  profile: PlayerProfile;
  quests: Quest[];
  habits: Habit[];
  chests: ChestSlot[];
  rewards: RewardItem[];
  achievements: Achievement[];
  transactions: EconomyTransaction[];
  focusSession: FocusSessionState;
  claimModal: ClaimModalData;
  campaigns: Campaign[];
  effortLogs: FocusEffortLog[];
  weeklyReviews: WeeklyReview[];
  dailyObjectives: DailyObjective[];
  productivitySnapshot: ProductivitySnapshot;
  insights: string[];

  addXp: (amount: number) => void;
  addCoins: (amount: number, reason: string) => void;
  addGems: (amount: number, reason: string) => void;
  completeQuest: (questId: string) => void;
  createQuest: (quest: Omit<Quest, 'id' | 'isCompleted'>) => void;
  deleteQuest: (questId: string) => void;
  updateQuest: (questId: string, patch: Partial<Quest>) => void;
  postponeQuest: (questId: string, newDueDate: string) => void;
  checkInHabit: (habitId: string) => void;
  createHabit: (habit: Omit<Habit, 'id' | 'streakCount' | 'bestStreak'>) => void;
  deleteHabit: (habitId: string) => void;
  updateHabit: (habitId: string, patch: Partial<Habit>) => void;
  startChestUnlock: (slotIndex: number) => void;
  speedUpChest: (slotIndex: number) => boolean;
  claimChestLoot: (slotIndex: number) => void;
  redeemReward: (rewardId: string) => boolean;
  createCustomReward: (title: string, cost: number, category: string, icon: string, description: string) => void;
  editReward: (rewardId: string, patch: Partial<RewardItem>) => void;
  ascendCitadel: () => boolean;
  toggleSound: () => void;
  openClaimModal: (data: Partial<ClaimModalData>) => void;
  closeClaimModal: () => void;

  startFocusSession: (durationMinutes: number, questId?: string, questTitle?: string) => void;
  pauseFocusSession: () => void;
  resumeFocusSession: () => void;
  cancelFocusSession: () => void;
  completeFocusSession: () => void;
  toggleManaOvercharge: () => void;
  setSoundscapeTrack: (track: FocusSessionState['soundscapeTrack']) => void;

  // Campaign & chain
  createCampaign: (data: Omit<Campaign, 'id' | 'createdAt' | 'milestones' | 'status'> & { milestones?: Omit<Milestone,'id'|'campaignId'|'questIds'|'status'>[] }) => Campaign;
  updateCampaign: (campaignId: string, patch: Partial<Campaign>) => void;
  deleteCampaign: (campaignId: string) => void;
  archiveCampaign: (campaignId: string) => void;
  createMilestone: (campaignId: string, data: Omit<Milestone, 'id' | 'campaignId' | 'questIds' | 'status'>) => Milestone | null;
  updateMilestone: (campaignId: string, milestoneId: string, patch: Partial<Milestone>) => void;
  deleteMilestone: (campaignId: string, milestoneId: string) => void;
  createQuestChain: (campaignId: string, milestoneId: string, quests: Omit<Quest,'id'|'isCompleted'|'campaignId'|'milestoneId'>[]) => Quest[];
  linkQuestToChain: (questId: string, campaignId: string, milestoneId: string) => void;
  unlinkQuestFromChain: (questId: string) => void;
  // Planning & intelligence
  getDailyObjectives: (opts?: { max?: number; availableMinutes?: number }) => DailyObjective[];
  getCampaignProgress: (campaignId: string) => number;
  generateWeeklyReview: () => WeeklyReview;
  carryOverOverdue: (questIds: string[], newDueDate: string) => void;
  needsWeeklyReview: boolean;
  dismissWeeklyReview: () => void;

  exportData: () => string;
  importData: (json: string) => boolean;

  // AI Intelligence Layer
  aiDailyBriefing: AIReasoningResponse | null;
  isAiLoading: boolean;
  aiError: string | null;
  refreshAiBriefing: () => Promise<void>;
  askAi: (question: string) => Promise<AIReasoningResponse>;
  getNextAiAction: () => Promise<AIReasoningResponse>;
  decomposeQuest: (questId: string) => Promise<AIReasoningResponse>;
  showApiKeyModal: boolean;
  setShowApiKeyModal: (show: boolean) => void;
  handleApiKeySet: (apiKey: string) => void;
  handleApiKeyClear: () => void;
  hasApiKey: boolean;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

function rollChestTier(): ChestTier {
  const r = Math.random() * 100;
  if (r < 55) return 'bronze';
  if (r < 85) return 'silver';
  if (r < 97) return 'gold';
  return 'mythic';
}
function chestConfigForTier(tier: ChestTier): { name: string; totalUnlockSeconds: number; coinsReward: number; xpReward: number; gemsReward: number } {
  switch (tier) {
    case 'bronze': return { name: 'Bronze Supply Chest', totalUnlockSeconds: 3600, coinsReward: 50, xpReward: 30, gemsReward: 2 };
    case 'silver': return { name: 'Silver Quest Chest', totalUnlockSeconds: 7200, coinsReward: 100, xpReward: 60, gemsReward: 5 };
    case 'gold': return { name: 'Gold Relic Chest', totalUnlockSeconds: 14400, coinsReward: 200, xpReward: 120, gemsReward: 10 };
    case 'mythic': return { name: 'Mythic Obsidian Chest', totalUnlockSeconds: 28800, coinsReward: 400, xpReward: 250, gemsReward: 25 };
  }
}
function hasDependencyCycle(quests: Quest[]): boolean {
  const adj = new Map<string, string[]>();
  for (const q of quests) adj.set(q.id, q.dependsOn ?? []);
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const dfs = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    for (const dep of adj.get(id) ?? []) {
      if (dfs(dep)) return true;
    }
    visiting.delete(id);
    visited.add(id);
    return false;
  };
  for (const q of quests) if (dfs(q.id)) return true;
  return false;
}
function deriveDueLabel(dueDate?: string): string | undefined {

  if (!dueDate) return undefined;
  const today = getLocalDateString(new Date());
  if (dueDate === today) return 'Today';
  if (dueDate < today) return 'Overdue';
  const diff = Math.round((new Date(dueDate + 'T00:00:00').getTime() - new Date(today + 'T00:00:00').getTime()) / 86400000);
  if (diff === 1) return 'Tomorrow';
  if (diff <= 7) return 'This Week';
  return dueDate;
}
function recomputeMilestoneStatuses(campaign: Campaign, quests: Quest[]): Campaign {
  const qById = new Map(quests.map(q=>[q.id,q] as const));
  let foundActive = false;
  const nextMilestones = campaign.milestones
    .slice().sort((a,b)=>a.order-b.order)
    .map(m => {
      if (m.questIds.length === 0) return { ...m, status: 'active' as const };
      const allDone = m.questIds.every(id=> qById.get(id)?.isCompleted);
      if (allDone) return { ...m, status: 'completed' as const };
      if (!foundActive) { foundActive = true; return { ...m, status: 'active' as const }; }
      return { ...m, status: 'locked' as const };
    });
  // campaign status: if all milestones completed -> completed
  const allMilestonesDone = nextMilestones.length > 0 && nextMilestones.every(m=> m.status==='completed');
  const status: Campaign['status'] = allMilestonesDone ? 'completed' : campaign.status === 'completed' ? 'active' : campaign.status;
  return { ...campaign, milestones: nextMilestones, status, completedAt: allMilestonesDone ? new Date().toISOString() : undefined };
}

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('realm');
  const [profile, setProfile] = useState<PlayerProfile>(StorageService.getProfile);
  const [quests, setQuests] = useState<Quest[]>(StorageService.getQuests);
  const [habits, setHabits] = useState<Habit[]>(StorageService.getHabits);
  const [chests, setChests] = useState<ChestSlot[]>(StorageService.getChests);
  const [rewards, setRewards] = useState<RewardItem[]>(StorageService.getRewards);
  const [achievements, setAchievements] = useState<Achievement[]>(StorageService.getAchievements);
  const [transactions, setTransactions] = useState<EconomyTransaction[]>(StorageService.getTransactions);
  const [campaigns, setCampaigns] = useState<Campaign[]>(StorageService.getCampaigns);
  const [effortLogs, setEffortLogs] = useState<FocusEffortLog[]>(StorageService.getEffortLogs);
  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReview[]>(StorageService.getWeeklyReviews);
  const [weeklyState, setWeeklyState] = useState<{ lastReviewWeekStart?: string }>(StorageService.getWeeklyState);

  const [focusSession, setFocusSession] = useState<FocusSessionState>(() => {
    const saved = StorageService.getFocusState();
    return saved || { isActive: false, isPaused: false, targetDurationSeconds: 1500, remainingSeconds: 1500, accumulatedXp: 0, accumulatedCoins: 0, isOvercharged: false, soundscapeTrack: 'none' };
  });
  const [claimModal, setClaimModal] = useState<ClaimModalData>({ isOpen: false, title: '', subtitle: '', description: '' });
  const focusIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completeFocusSessionRef = useRef<() => void>(() => {});
  const chestTimeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const focusSessionRef = useRef(focusSession);
  focusSessionRef.current = focusSession;
  const fallbackDedupRef = useRef<Map<string, number>>(new Map());

  useEffect(() => { StorageService.setProfile(profile); }, [profile]);
  useEffect(() => { StorageService.setQuests(quests); }, [quests]);
  useEffect(() => { StorageService.setHabits(habits); }, [habits]);
  useEffect(() => { StorageService.setChests(chests); }, [chests]);
  useEffect(() => { StorageService.setRewards(rewards); }, [rewards]);
  useEffect(() => { StorageService.setAchievements(achievements); }, [achievements]);
  useEffect(() => { StorageService.setTransactions(transactions); }, [transactions]);
  useEffect(() => { StorageService.setFocusState(focusSession); }, [focusSession]);
  useEffect(() => { StorageService.setCampaigns(campaigns); }, [campaigns]);
  useEffect(() => { StorageService.setEffortLogs(effortLogs); }, [effortLogs]);
  useEffect(() => { StorageService.setWeeklyReviews(weeklyReviews); }, [weeklyReviews]);
  useEffect(() => { StorageService.setWeeklyState(weeklyState); }, [weeklyState]);

  // Keep campaigns milestone statuses in sync with quest completions
  useEffect(() => {
    setCampaigns(prev => {
      let changed = false;
      const next = prev.map(c => {
        const recomputed = recomputeMilestoneStatuses(c, quests);
        // shallow compare statuses
        const same = recomputed.status === c.status && recomputed.milestones.every((m,i)=> m.status === c.milestones[i]?.status);
        if (!same) changed = true;
        return same ? c : recomputed;
      });
      return changed ? next : prev;
    });
  }, [quests]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'auctus_sync_event_fallback' && e.newValue) {
        try {
          const msg = JSON.parse(e.newValue) as { type?: string; entityId?: string; nonce?: string; timestamp?: number };
          const dedupKey = msg.nonce || `${msg.type || ''}:${msg.entityId || ''}:${msg.timestamp || ''}`;
          const now = Date.now();
          const lastSeen = fallbackDedupRef.current.get(dedupKey);
          if (lastSeen !== undefined && now - lastSeen < 30000) return;
          fallbackDedupRef.current.set(dedupKey, now);
          if (fallbackDedupRef.current.size > 100) {
            for (const [k, ts] of Array.from(fallbackDedupRef.current.entries())) {
              if (now - ts > 30000) fallbackDedupRef.current.delete(k);
            }
          }
          if (msg.type === 'DELETE_QUEST' && msg.entityId) {
            setQuests(prev => prev.filter(q => q.id !== msg.entityId));
            setFocusSession(prev =>
              prev.selectedQuestId === msg.entityId
                ? { ...prev, selectedQuestId: undefined, selectedQuestTitle: undefined }
                : prev
            );
          } else if (msg.type === 'DELETE_HABIT' && msg.entityId) {
            setHabits(prev => prev.filter(h => h.id !== msg.entityId));
          } else if (msg.type === 'DELETE_REWARD' && msg.entityId) {
            setRewards(prev => prev.filter(r => r.id !== msg.entityId));
          }
        } catch {
          // ignore fallback parse error
        }
        return;
      }

      if (!e.key || !Object.values(STORAGE_KEYS).includes(e.key as string)) return;
      try {
        if (e.newValue === null) return;
        const data = JSON.parse(e.newValue);
        switch (e.key) {
          case STORAGE_KEYS.PROFILE: setProfile(data); break;
          case STORAGE_KEYS.QUESTS: setQuests(data); break;
          case STORAGE_KEYS.HABITS: setHabits(data); break;
          case STORAGE_KEYS.CHESTS: setChests(data); break;
          case STORAGE_KEYS.REWARDS: setRewards(data); break;
          case STORAGE_KEYS.ACHIEVEMENTS: setAchievements(data); break;
          case STORAGE_KEYS.TRANSACTIONS: setTransactions(data); break;
          case STORAGE_KEYS.FOCUS: setFocusSession(data); break;
          case STORAGE_KEYS.CAMPAIGNS: setCampaigns(data); break;
          case STORAGE_KEYS.EFFORT_LOGS: setEffortLogs(data); break;
          case STORAGE_KEYS.WEEKLY_REVIEWS: setWeeklyReviews(data); break;
          case STORAGE_KEYS.WEEKLY_STATE: setWeeklyState(data); break;
        }
      } catch { /* ignore */ }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Cross-tab broadcast eviction listener
  useEffect(() => {
    const unsubscribe = syncChannel.subscribe((message) => {
      const raw = message as unknown as { nonce?: string; timestamp?: number; type?: string; entityId?: string };
      const dedupKey = raw.nonce || `${raw.type || ''}:${raw.entityId || ''}:${raw.timestamp || ''}`;
      const now = Date.now();
      const lastSeen = fallbackDedupRef.current.get(dedupKey);
      if (lastSeen !== undefined && now - lastSeen < 30000) return;
      fallbackDedupRef.current.set(dedupKey, now);
      if (fallbackDedupRef.current.size > 100) {
        for (const [k, ts] of Array.from(fallbackDedupRef.current.entries())) {
          if (now - ts > 30000) fallbackDedupRef.current.delete(k);
        }
      }
      if (message.type === 'DELETE_QUEST' && message.entityId) {
        setQuests(prev => prev.filter(q => q.id !== message.entityId));
        setFocusSession(prev =>
          prev.selectedQuestId === message.entityId
            ? { ...prev, selectedQuestId: undefined, selectedQuestTitle: undefined }
            : prev
        );
      } else if (message.type === 'DELETE_HABIT' && message.entityId) {
        setHabits(prev => prev.filter(h => h.id !== message.entityId));
      } else if (message.type === 'DELETE_REWARD' && message.entityId) {
        setRewards(prev => prev.filter(r => r.id !== message.entityId));
      }
    });

    return unsubscribe;
  }, []);

  // Sync sound engine state
  useEffect(() => {
    soundEngine.isMuted = !profile.soundEnabled;
  }, [profile.soundEnabled]);

  const toggleSound = () => {
    setProfile(p => {
      const nextSound = !p.soundEnabled;
      StorageService.setAudioSettings({
        ...StorageService.getAudioSettings(),
        soundEnabled: nextSound,
      });
      return { ...p, soundEnabled: nextSound };
    });
  };

  // AI Intelligence Layer Initialization
  const [aiDailyBriefing, setAiDailyBriefing] = useState<AIReasoningResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(() => hasUserConfiguredApiKey());

  // Initialize AI provider from stored user API key
  const aiProvider = hasUserConfiguredApiKey() ? createAIProviderFromStorage() : null;
  const aiIntelligence = useMemo(() => {
    return aiProvider ? new AUCTUSIntelligence(aiProvider) : null;
  }, [aiProvider]);

  // Handle API key changes - reinitialize provider
  const handleApiKeySet = useCallback((apiKey: string) => {
setUserApiKey(apiKey);
    setHasApiKey(true);
    setShowApiKeyModal(false);
    setAiError(null);
  }, []);

  const handleApiKeyClear = useCallback(() => {
    clearUserApiKey();
    setHasApiKey(false);
    setShowApiKeyModal(true);
    setAiError('AI provider not configured - please add your API key');
  }, []);

  const refreshAiBriefing = useCallback(async () => {
    if (!aiIntelligence) {
      setAiError('AI provider not configured - please add your API key');
      setShowApiKeyModal(true);
      return;
    }
    
    setIsAiLoading(true);
    setAiError(null);
    
    try {
      const context = buildAIContext(
        quests, habits, effortLogs, campaigns, achievements, profile, 
        transactions, weeklyReviews, activeTab, focusSession.isActive
      );
      
      const briefing = await aiIntelligence.generateDailyBriefing(context);
      setAiDailyBriefing(briefing);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Unknown AI error');
      console.error('AI briefing failed:', error);
    } finally {
      setIsAiLoading(false);
    }
  }, [aiIntelligence, quests, habits, effortLogs, campaigns, achievements, profile, transactions, weeklyReviews, activeTab, focusSession.isActive]);

  // Auto-refresh briefing when key data changes or daily
  useEffect(() => {
    if (aiIntelligence) {
      refreshAiBriefing();
      
      // Also set up daily refresh (at midnight)
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const msUntilMidnight = tomorrow.getTime() - now.getTime();
      
      const timer = setTimeout(() => {
        refreshAiBriefing();
        // Repeat every 24 hours
        setInterval(refreshAiBriefing, 24 * 60 * 60 * 1000);
      }, msUntilMidnight);
      
      return () => clearTimeout(timer);
    }
  }, [aiIntelligence, refreshAiBriefing]);

  const askAi = useCallback(async (question: string): Promise<AIReasoningResponse> => {
    if (!aiIntelligence) {
      throw new Error('AI provider not configured');
    }
    
    try {
      const context = buildAIContext(
        quests, habits, effortLogs, campaigns, achievements, profile, 
        transactions, weeklyReviews, activeTab, focusSession.isActive
      );
      
      return await aiIntelligence.askAuctus(question, context);
    } catch (error) {
      console.error('Ask AI failed:', error);
      throw error;
    }
  }, [aiIntelligence, quests, habits, effortLogs, campaigns, achievements, profile, transactions, weeklyReviews, activeTab, focusSession.isActive]);

  const getNextAiAction = useCallback(async (): Promise<AIReasoningResponse> => {
    if (!aiIntelligence) {
      throw new Error('AI provider not configured');
    }
    
    try {
      const context = buildAIContext(
        quests, habits, effortLogs, campaigns, achievements, profile, 
        transactions, weeklyReviews, activeTab, focusSession.isActive
      );
      
      return await aiIntelligence.getNextBestAction(context);
    } catch (error) {
      console.error('Get next AI action failed:', error);
      throw error;
    }
  }, [aiIntelligence, quests, habits, effortLogs, campaigns, achievements, profile, transactions, weeklyReviews, activeTab, focusSession.isActive]);

  const decomposeQuest = useCallback(async (questId: string): Promise<AIReasoningResponse> => {
    if (!aiIntelligence) {
      throw new Error('AI provider not configured');
    }
    
    try {
      const context = buildAIContext(
        quests, habits, effortLogs, campaigns, achievements, profile, 
        transactions, weeklyReviews, activeTab, focusSession.isActive
      );
      
      return await aiIntelligence.decomposeQuest(questId, context);
    } catch (error) {
      console.error('Decompose quest failed:', error);
      throw error;
    }
  }, [aiIntelligence, quests, habits, effortLogs, campaigns, achievements, profile, transactions, weeklyReviews, activeTab, focusSession.isActive]);

  const openClaimModal = useCallback((data: Partial<ClaimModalData>) => {
    setClaimModal({ isOpen: true, title: data.title || 'Victory Reward', subtitle: data.subtitle || 'CLAIMED', description: data.description || '', coins: data.coins, xp: data.xp, gems: data.gems, icon: data.icon || '🎉' });
    soundEngine.playSuccess(); triggerConfetti();
  }, []);
  const closeClaimModal = () => setClaimModal(prev => ({ ...prev, isOpen: false }));

  const addXp = useCallback((amount: number) => {
    setProfile(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let nextThreshold = prev.xpToNextLevel;
      while (newXp >= nextThreshold) {
        newXp -= nextThreshold; newLevel += 1; nextThreshold = Math.round(nextThreshold * 1.25);
        soundEngine.playLevelUp(); triggerConfetti();
      }
      return { ...prev, level: newLevel, xp: newXp, xpToNextLevel: nextThreshold, citadelPower: Math.min(prev.citadelMaxPower, prev.citadelPower + Math.round(amount * 0.5)) };
    });
  }, []);
  const addXpRef = useRef(addXp); addXpRef.current = addXp;
  const addCoins = useCallback((amount: number, reason: string) => {
    setProfile(p => ({ ...p, coins: p.coins + amount }));
    setTransactions(t => [{ id: `tx-${Date.now()}-${Math.random().toString(36).slice(2)}`, timestamp: Date.now(), amount, currency: 'coins', type: amount >= 0 ? 'earn' : 'spend', reason }, ...t]);
    if (amount > 0) soundEngine.playCoinCollect();
  }, []);
  const addCoinsRef = useRef(addCoins); addCoinsRef.current = addCoins;
  const addGems = useCallback((amount: number, reason: string) => {
    setProfile(p => ({ ...p, gems: p.gems + amount }));
    setTransactions(t => [{ id: `tx-${Date.now()}-${Math.random().toString(36).slice(2)}`, timestamp: Date.now(), amount, currency: 'gems', type: amount >= 0 ? 'earn' : 'spend', reason }, ...t]);
    if (amount > 0) soundEngine.playSuccess();
  }, []);
  const addGemsRef = useRef(addGems); addGemsRef.current = addGems;

  // Achievement evaluator — single effect: sync progress + unlock + reward exactly once
  useEffect(() => {
    const getProgress = (ach: Achievement): number => {
      switch (ach.category) {
        case 'quests': return profile.completedQuestsCount;
        case 'focus': return profile.totalFocusMinutes;
        case 'streak': return profile.streakDays;
        case 'citadel': return profile.citadelTier;
        case 'habits': return habits.reduce((max, h) => Math.max(max, h.streakCount), 0);
        default: return ach.currentValue;
      }
    };
    const unlockedIds: string[] = [];
    setAchievements(prev => {
      let changed = false;
      const next = prev.map(a => {
        if (a.isUnlocked) return a;
        const prog = getProgress(a);
        const progressChanged = prog !== a.currentValue;
        const shouldUnlock = prog >= a.targetValue;
        if (shouldUnlock) { changed = true; unlockedIds.push(a.id); return { ...a, currentValue: prog, isUnlocked: true, unlockedAt: new Date().toISOString() }; }
        if (progressChanged) { changed = true; return { ...a, currentValue: prog }; }
        return a;
      });
      return changed ? next : prev;
    });
    if (unlockedIds.length === 0) return;
    // Defer rewards to next tick to avoid setState-during-render and ensure achievements state committed
    // Use snapshot of achievements at unlock time to get reward payloads
    const snapshotById = new Map(achievements.map(a=>[a.id,a] as const));
    setTimeout(() => {
      unlockedIds.forEach(id => {
        const ach = snapshotById.get(id);
        if (!ach) return;
        if (ach.rewards.xp) addXpRef.current(ach.rewards.xp);
        if (ach.rewards.coins) addCoinsRef.current(ach.rewards.coins, `Achievement: ${ach.title}`);
        if (ach.rewards.gems) addGemsRef.current(ach.rewards.gems, `Achievement: ${ach.title}`);
        openClaimModal({ title: ach.title, subtitle: 'ACHIEVEMENT UNLOCKED', description: ach.description + (ach.rewards.titleReward ? ` Title unlocked: ${ach.rewards.titleReward}` : ''), xp: ach.rewards.xp, coins: ach.rewards.coins, gems: ach.rewards.gems, icon: ach.icon });
      });
    }, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.completedQuestsCount, profile.totalFocusMinutes, profile.streakDays, profile.citadelTier, habits]);

  const completeQuest = useCallback((questId: string) => {
    let shouldReward = false;
    let questSnap: Quest | null = null;
    let campaignGems = 0;
    let campaignTitle = '';
    setQuests(prev => {
      const idx = prev.findIndex(q => q.id === questId);
      if (idx === -1) return prev;
      const quest = prev[idx];
      if (quest.isCompleted) return prev;
      if (quest.dependsOn && quest.dependsOn.length > 0) {
        const blocked = quest.dependsOn.some(depId => {
          const dep = prev.find(q=> q.id===depId);
          return !dep || !dep.isCompleted;
        });
        if (blocked) return prev;
      }
      shouldReward = true;
      questSnap = quest;
      const elapsed = quest.estimatedMinutes ?? 25;
      if (quest.campaignId) {
        const campaign = campaigns.find(c=> c.id===quest.campaignId);
        if (campaign) {
          const remaining = campaign.milestones.flatMap(m=> m.questIds).filter(id=> id!==questId).some(id=> {
            const q = prev.find(x=> x.id===id);
            return !q?.isCompleted;
          });
          if (!remaining) { campaignGems = 15; campaignTitle = campaign.title; }
        }
      }
      return prev.map(q => (q.id === questId ? { ...q, isCompleted: true, completedAt: new Date().toISOString(), actualMinutes: q.actualMinutes ?? elapsed } : q));
    });
    if (!shouldReward || !questSnap) return;
    const qs: Quest = questSnap;
    addXp(qs.xpReward);
    addCoins(qs.coinsReward, `Completed Quest: ${qs.title}`);
    setProfile(p => ({ ...p, completedQuestsCount: p.completedQuestsCount + 1 }));
    if (campaignGems) addGems(campaignGems, `Campaign completed: ${campaignTitle}`);
    openClaimModal({ title: qs.title, subtitle: 'MISSION ACCOMPLISHED', description: qs.campaignId ? `Campaign progress updated — tag #${qs.tag}` : `Objective conquered under tag #${qs.tag}!`, xp: qs.xpReward, coins: qs.coinsReward, icon: '🎯' });
  }, [addXp, addCoins, openClaimModal, campaigns, addGems]);

  const createQuest = (data: Omit<Quest, 'id' | 'isCompleted'>) => {
    const newQuest: Quest = { ...data, id: `q-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, isCompleted: false, createdAt: new Date().toISOString(), postponedCount: 0, source: data.source ?? 'manual', dueLabel: data.dueLabel ?? deriveDueLabel(data.dueDate), priority: data.priority ?? 'medium' };
    if (newQuest.dependsOn && hasDependencyCycle([...quests, newQuest])) return;
    setQuests(prev => [newQuest, ...prev]);
    // if linked to campaign milestone, register questId in milestone
    if (newQuest.campaignId && newQuest.milestoneId) {
      setCampaigns(prev => prev.map(c=> c.id===newQuest.campaignId ? { ...c, milestones: c.milestones.map(m=> m.id===newQuest.milestoneId ? { ...m, questIds: [...m.questIds, newQuest.id] } : m) } : c));
    }
    soundEngine.playClick();
  };
  const deleteQuest = (questId: string) => {
    const q = quests.find(x=> x.id===questId);
    setQuests(prev => prev.filter(x => x.id !== questId));
    if (q?.campaignId && q?.milestoneId) {
      setCampaigns(prev=> prev.map(c=> c.id===q.campaignId ? { ...c, milestones: c.milestones.map(m=> m.id===q.milestoneId ? { ...m, questIds: m.questIds.filter(id=> id!==questId) } : m) } : c));
    }
  };
  const updateQuest = useCallback((questId: string, patch: Partial<Quest>) => {
    // cycle guard for dependency edits
    if (patch.dependsOn) {
      const prospective = quests.map(q=> q.id===questId ? { ...q, ...patch, id: q.id } as Quest : q);
      if (hasDependencyCycle(prospective)) return;
    }
    setQuests(prev => prev.map(q => {
      if (q.id !== questId) return q;
      const next: Quest = { ...q, ...patch, id: q.id };
      if (patch.dueDate !== undefined) next.dueLabel = deriveDueLabel(patch.dueDate);
      return next;
    }));
    soundEngine.playClick();
  }, [quests]);
  const postponeQuest = (questId: string, newDueDate: string) => {
    setQuests(prev=> prev.map(q=> q.id===questId ? { ...q, dueDate: newDueDate, dueLabel: deriveDueLabel(newDueDate), postponedCount: (q.postponedCount ?? 0) + 1 } : q));
    soundEngine.playClick();
  };
  const checkInHabit = (habitId: string) => {
    const today = getLocalDateString(new Date());
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    const completedDates = habit.completedDates || [];
    if (completedDates.includes(today)) return;
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);
    const newCompletedDates = [...completedDates, today];
    const wasConsecutive = completedDates.includes(yesterdayStr);
    const newStreak = wasConsecutive ? habit.streakCount + 1 : 1;
    const bestStreak = Math.max(newStreak, habit.bestStreak);
    setHabits(prev => prev.map(h => (h.id === habitId ? { ...h, streakCount: newStreak, bestStreak, lastCompletedDate: today, completedDates: newCompletedDates } : h)));
    let multiplier = 1;
    if (newStreak >= 30) multiplier = 2.0; else if (newStreak >= 21) multiplier = 1.75; else if (newStreak >= 14) multiplier = 1.5; else if (newStreak >= 7) multiplier = 1.25;
    const xpEarned = Math.round(habit.xpYield * multiplier);
    const coinsEarned = Math.round(habit.coinYield * multiplier);
    addXp(xpEarned); addCoins(coinsEarned, `Habit Streak Check-in: ${habit.title} (${newStreak}d)`);
    openClaimModal({ title: habit.title, subtitle: `${newStreak} DAY STREAK! \uD83D\uDD25`, description: `Discipline multiplier ${multiplier}x applied!`, xp: xpEarned, coins: coinsEarned, icon: '🔥' });
  };
  const createHabit = (data: Omit<Habit, 'id' | 'streakCount' | 'bestStreak' | 'completedDates'>) => {
    const newHabit: Habit = { ...data, id: `h-${Date.now()}`, streakCount: 0, bestStreak: 0, completedDates: [] };
    setHabits(prev => [...prev, newHabit]); soundEngine.playClick();
  };
  const deleteHabit = (habitId: string) => setHabits(prev => prev.filter(h => h.id !== habitId));
  const updateHabit = useCallback((habitId: string, patch: Partial<Habit>) => { setHabits(prev => prev.map(h => (h.id === habitId ? { ...h, ...patch, id: h.id } : h))); soundEngine.playClick(); }, []);

  const startChestUnlock = (slotIndex: number) => {
    setChests(prev => prev.map(c => { if (c.slotIndex !== slotIndex || c.status !== 'locked') return c; const now = Date.now(); return { ...c, status: 'unlocking', unlockStartedAt: now, unlockEndsAt: now + c.totalUnlockSeconds * 1000 }; }));
    soundEngine.playClick();
  };
  const speedUpChest = (slotIndex: number): boolean => {
    let shouldCharge = false;
    setChests(prev => {
      const c = prev.find(x => x.slotIndex === slotIndex);
      if (!c || c.status !== 'unlocking') return prev;
      // verify affordability inside updater via closure profile — but charge only if unlocking
      if (profile.gems < 10) return prev;
      shouldCharge = true;
      return prev.map(x => (x.slotIndex === slotIndex ? { ...x, status: 'ready', unlockEndsAt: Date.now() } : x));
    });
    if (!shouldCharge) return false;
    setProfile(p => ({ ...p, gems: p.gems - 10 }));
    soundEngine.playSuccess(); return true;
  };
  const claimChestLoot = (slotIndex: number) => {
    let chestSnap: ChestSlot | null = null;
    setChests(prev => {
      const idx = prev.findIndex(c => c.slotIndex === slotIndex);
      if (idx === -1) return prev;
      const chest = prev[idx];
      if (chest.status !== 'ready') return prev;
      chestSnap = chest;
      return prev.map(c => c.slotIndex === slotIndex ? { ...c, status: 'empty', tier: 'bronze' as ChestTier, name: 'Empty Slot', unlockStartedAt: undefined, unlockEndsAt: undefined } : c);
    });
    if (!chestSnap) return;
    const cs: ChestSlot = chestSnap;
    addCoins(cs.coinsReward, `Opened ${cs.name}`); addXp(cs.xpReward); addGems(cs.gemsReward, `Gems from ${cs.name}`);
    openClaimModal({ title: cs.name, subtitle: `${cs.tier.toUpperCase()} LOOT UNLOCKED`, description: 'Loot reward successfully added to treasury.', coins: cs.coinsReward, xp: cs.xpReward, gems: cs.gemsReward, icon: '🎁' });
    const timeout = setTimeout(() => {
      const tier = rollChestTier(); const cfg = chestConfigForTier(tier);
      setChests(prev => prev.map(c => { if (c.slotIndex !== slotIndex) return c; if (c.status !== 'empty') return c; return { ...c, tier, name: cfg.name, status: 'locked', totalUnlockSeconds: cfg.totalUnlockSeconds, coinsReward: cfg.coinsReward, xpReward: cfg.xpReward, gemsReward: cfg.gemsReward, unlockStartedAt: undefined, unlockEndsAt: undefined }; }));
    }, 30000);
    chestTimeoutRefs.current.push(timeout);
  };
  useEffect(() => { const t = chestTimeoutRefs.current; return () => { t.forEach(clearTimeout); }; }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setChests(prev => prev.map(c => { if (c.status === 'unlocking' && c.unlockEndsAt && now >= c.unlockEndsAt) return { ...c, status: 'ready' }; return c; }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const redeemReward = (rewardId: string): boolean => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return false;
    // Atomic affordability check inside updater — prevents double-spend on rapid clicks
    let affordable = false;
    setProfile(prev => {
      if (prev.coins < reward.cost) return prev;
      affordable = true;
      return prev;
    });
    if (!affordable && profile.coins < reward.cost) return false;
    if (profile.coins < reward.cost) return false;
    addCoins(-reward.cost, `Redeemed: ${reward.title}`);
    openClaimModal({ title: reward.title, subtitle: 'REWARD CLAIMED', description: reward.description, icon: reward.icon });
    return true;
  };
  const createCustomReward = (title: string, cost: number, category: string, icon: string, description: string) => {
    const newReward: RewardItem = { id: `r-${Date.now()}`, title, cost, category, icon: icon || '🎁', description, isCustom: true };
    setRewards(prev => [newReward, ...prev]); soundEngine.playSuccess();
  };
  const editReward = useCallback((rewardId: string, patch: Partial<RewardItem>) => { setRewards(prev => prev.map(r => (r.id === rewardId ? { ...r, ...patch, id: r.id } : r))); soundEngine.playClick(); }, []);
  const ascendCitadel = (): boolean => {
    if (profile.citadelPower < profile.citadelMaxPower) return false;
    setProfile(p => ({ ...p, citadelTier: p.citadelTier + 1, citadelPower: 0, citadelMaxPower: Math.round(p.citadelMaxPower * 1.5), title: p.citadelTier + 1 === 3 ? 'Iron Vanguard' : p.citadelTier + 1 === 4 ? 'Aether Archon' : 'Apex Sovereign' }));
    addXp(300); addGems(30, 'Citadel Ascension Reward');
    openClaimModal({ title: `Citadel Ascended to Tier ${profile.citadelTier + 1}!`, subtitle: 'ASCENDANCY COMPLETE', description: 'Passive +20% XP rate unlocked across all focus arenas.', xp: 300, gems: 30, icon: '🏰' });
    return true;
  };

  // Focus engine with effort logging
  const startFocusSession = (durationMinutes: number, questId?: string, questTitle?: string) => {
    const totalSecs = durationMinutes * 60;
    const q = questId ? quests.find(x=> x.id===questId) : undefined;
    const now = Date.now();
    setFocusSession({ isActive: true, isPaused: false, targetDurationSeconds: totalSecs, remainingSeconds: totalSecs, accumulatedXp: Math.round(durationMinutes * 4), accumulatedCoins: Math.round(durationMinutes * 2), selectedQuestId: questId, selectedQuestTitle: questTitle ?? q?.title, isOvercharged: false, soundscapeTrack: 'cyber-rain', startedAt: now, targetEndsAt: now + totalSecs * 1000 });
    soundEngine.playSuccess(); soundEngine.startSoundscape('cyber-rain');
  };
  const pauseFocusSession = useCallback(() => {
    setFocusSession(prev => ({ ...prev, isPaused: true, pausedAt: Date.now() })); soundEngine.stopSoundscape();
    if (focusIntervalRef.current) { clearInterval(focusIntervalRef.current); focusIntervalRef.current = null; }
  }, []);
  const resumeFocusSession = useCallback(() => {
    setFocusSession(prev => {
      if (!prev.isPaused) return prev;
      soundEngine.startSoundscape(prev.soundscapeTrack);
      // If we have wall-clock bookkeeping, reconcile remainingSeconds on resume
      if (prev.pausedAt && prev.targetEndsAt) {
        const now = Date.now();
        const remaining = Math.max(0, Math.round((prev.targetEndsAt - now) / 1000));
        return { ...prev, isPaused: false, remainingSeconds: remaining, pausedAt: undefined };
      }
      return { ...prev, isPaused: false, pausedAt: undefined };
    });
  }, []);
  const cancelFocusSession = useCallback(() => {
    if (focusIntervalRef.current) { clearInterval(focusIntervalRef.current); focusIntervalRef.current = null; }
    soundEngine.stopSoundscape();
    setFocusSession(prev => {
      if (!prev.isActive || !prev.startedAt) return { ...prev, isActive: false, isPaused: false };
      const elapsed = Math.max(0, prev.targetDurationSeconds - prev.remainingSeconds);
      const actualMinutes = Math.max(1, Math.round(elapsed / 60));
      const plannedMinutes = Math.round(prev.targetDurationSeconds / 60);
      const linkedQuest = prev.selectedQuestId ? quests.find(q=> q.id===prev.selectedQuestId) : undefined;
      const log: FocusEffortLog = { id: `log-${Date.now()}`, questId: prev.selectedQuestId, campaignId: linkedQuest?.campaignId, milestoneId: linkedQuest?.milestoneId, plannedMinutes, actualMinutes, startedAt: prev.startedAt, endedAt: Date.now(), completed: false, interrupted: true };
      setEffortLogs(p=> [log, ...p]);
      if (prev.selectedQuestId) {
        setQuests(qs=> qs.map(q=> q.id===prev.selectedQuestId ? { ...q, actualMinutes: (q.actualMinutes ?? 0) + actualMinutes } : q));
      }
      return { ...prev, isActive: false, isPaused: false };
    });
  }, [quests]);
  const completeFocusSession = useCallback(() => {
    if (focusIntervalRef.current) { clearInterval(focusIntervalRef.current); focusIntervalRef.current = null; }
    soundEngine.stopSoundscape();
    let shouldComplete = false;
    let captured: FocusSessionState | null = null;
    setFocusSession(prev => {
      if (!prev.isActive) return prev;
      shouldComplete = true;
      captured = prev;
      return { ...prev, isActive: false, isPaused: false, remainingSeconds: 0 };
    });
    if (!shouldComplete || !captured) return;
    const prev = captured as FocusSessionState;
    const multiplier = prev.isOvercharged ? 1.5 : 1.0;
    const finalXp = Math.round(prev.accumulatedXp * multiplier);
    const finalCoins = Math.round(prev.accumulatedCoins * multiplier);
    const mins = Math.round(prev.targetDurationSeconds / 60);
    const plannedMinutes = mins;
    const linkedQuest = prev.selectedQuestId ? quests.find(q=> q.id===prev.selectedQuestId) : undefined;
    const log: FocusEffortLog = { id: `log-${Date.now()}`, questId: prev.selectedQuestId, campaignId: linkedQuest?.campaignId, milestoneId: linkedQuest?.milestoneId, plannedMinutes, actualMinutes: mins, startedAt: prev.startedAt ?? Date.now() - mins*60000, endedAt: Date.now(), completed: true, interrupted: false, xpEarned: finalXp, coinsEarned: finalCoins };
    setEffortLogs(p=> [log, ...p]);
    setProfile(p => ({ ...p, totalFocusMinutes: p.totalFocusMinutes + mins, citadelPower: finalXp >= 60 ? Math.min(p.citadelMaxPower, p.citadelPower + Math.round(finalXp * 0.2)) : p.citadelPower }));
    addXp(finalXp); addCoins(finalCoins, `Focus Combat Victory (${mins}m)`);
    if (prev.selectedQuestId && linkedQuest) {
      setQuests(qs=> qs.map(q=> q.id===prev.selectedQuestId ? { ...q, actualMinutes: mins } : q));
      // Defer quest completion by one tick but use functional guard inside completeQuest so stale quests don't double-award
      setTimeout(()=> completeQuest(prev.selectedQuestId!), 0);
    }
    openClaimModal({ title: 'Combat Arena Victory!', subtitle: `${mins} MINUTE FOCUS COMPLETED`, description: prev.selectedQuestTitle ? `Objective: ${prev.selectedQuestTitle}` : 'Deep work sprint successfully concluded.', xp: finalXp, coins: finalCoins, icon: '⚔️' });
  }, [addXp, addCoins, openClaimModal, quests, completeQuest]);
  useEffect(() => { completeFocusSessionRef.current = completeFocusSession; }, [completeFocusSession]);
  const toggleManaOvercharge = () => { setFocusSession(prev => ({ ...prev, isOvercharged: !prev.isOvercharged })); soundEngine.playClick(); };
  const setSoundscapeTrack = (track: FocusSessionState['soundscapeTrack']) => {
    setFocusSession(prev => ({ ...prev, soundscapeTrack: track }));
    soundEngine.stopSoundscape();
    if (track !== 'none') soundEngine.startSoundscape(track);
  };

  // Interval tick for focus timer
  useEffect(() => {
    if (!focusSession.isActive || focusSession.isPaused) {
      if (focusIntervalRef.current) { clearInterval(focusIntervalRef.current); focusIntervalRef.current = null; }
      return;
    }
    focusIntervalRef.current = setInterval(() => {
      setFocusSession(prev => {
        if (!prev.isActive || prev.isPaused) return prev;
        const nextRemaining = prev.remainingSeconds - 1;
        if (nextRemaining <= 0) {
          if (focusIntervalRef.current) { clearInterval(focusIntervalRef.current); focusIntervalRef.current = null; }
          setTimeout(()=> completeFocusSessionRef.current(), 0);
          return { ...prev, remainingSeconds: 0 };
        }
        return { ...prev, remainingSeconds: nextRemaining };
      });
    }, 1000);
    return () => { if (focusIntervalRef.current) { clearInterval(focusIntervalRef.current); focusIntervalRef.current = null; } };
  }, [focusSession.isActive, focusSession.isPaused]);

  // Campaign actions
  const createCampaign = (data: Omit<Campaign, 'id' | 'createdAt' | 'milestones' | 'status'> & { milestones?: Omit<Milestone,'id'|'campaignId'|'questIds'|'status'>[] }): Campaign => {
    const id = `camp-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
    const milestones: Milestone[] = (data.milestones ?? []).map((m, idx)=> ({ ...m, id: `ms-${Date.now()}-${idx}-${Math.random().toString(36).slice(2,4)}`, campaignId: id, questIds: [], status: idx===0 ? 'active' as const : 'locked' as const, order: m.order ?? idx }));
    const campaign: Campaign = { id, title: data.title, description: data.description, goalType: data.goalType, targetDate: data.targetDate, status: 'active', createdAt: new Date().toISOString(), milestones, estimatedTotalMinutes: data.estimatedTotalMinutes, color: data.color, icon: data.icon };
    setCampaigns(prev=> [campaign, ...prev]);
    soundEngine.playSuccess();
    return campaign;
  };
  const updateCampaign = (campaignId: string, patch: Partial<Campaign>) => {
    setCampaigns(prev=> prev.map(c=> c.id===campaignId ? { ...c, ...patch, id: c.id } : c));
    soundEngine.playClick();
  };
  const deleteCampaign = (campaignId: string) => {
    // unlink quests
    setQuests(prev=> prev.map(q=> q.campaignId===campaignId ? { ...q, campaignId: undefined, milestoneId: undefined } : q));
    setCampaigns(prev=> prev.filter(c=> c.id!==campaignId));
  };
  const archiveCampaign = (campaignId: string) => {
    setCampaigns(prev=> prev.map(c=> c.id===campaignId ? { ...c, status: 'archived' as const, archivedAt: new Date().toISOString() } : c));
  };
  const createMilestone = (campaignId: string, data: Omit<Milestone, 'id' | 'campaignId' | 'questIds' | 'status'>): Milestone | null => {
    const camp = campaigns.find(c=> c.id===campaignId);
    if (!camp) return null;
    const ms: Milestone = { ...data, id: `ms-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, campaignId, questIds: [], status: camp.milestones.length===0 ? 'active' : 'locked', order: data.order ?? camp.milestones.length };
    setCampaigns(prev=> prev.map(c=> c.id===campaignId ? { ...c, milestones: [...c.milestones, ms] } : c));
    soundEngine.playClick();
    return ms;
  };
  const updateMilestone = (campaignId: string, milestoneId: string, patch: Partial<Milestone>) => {
    setCampaigns(prev=> prev.map(c=> c.id===campaignId ? { ...c, milestones: c.milestones.map(m=> m.id===milestoneId ? { ...m, ...patch, id: m.id, campaignId: m.campaignId } : m) } : c));
  };
  const deleteMilestone = (campaignId: string, milestoneId: string) => {
    const camp = campaigns.find(c=> c.id===campaignId);
    const ms = camp?.milestones.find(m=> m.id===milestoneId);
    if (ms) {
      setQuests(prev=> prev.map(q=> q.milestoneId===milestoneId ? { ...q, milestoneId: undefined } : q));
    }
    setCampaigns(prev=> prev.map(c=> c.id===campaignId ? { ...c, milestones: c.milestones.filter(m=> m.id!==milestoneId) } : c));
  };
  const createQuestChain = (campaignId: string, milestoneId: string, drafts: Omit<Quest,'id'|'isCompleted'|'campaignId'|'milestoneId'>[]): Quest[] => {
    // generate ids first so linear chain can reference previous id
    const ids = drafts.map((_, idx)=> `q-${Date.now()}-${idx}-${Math.random().toString(36).slice(2,5)}`);
    const created: Quest[] = drafts.map((d, idx)=> {
      let dependsOn = d.dependsOn;
      // auto-wire linear chain: each item after first depends on previous in chain unless caller already specified
      if (idx > 0 && !dependsOn) dependsOn = [ids[idx-1]];
      return {
        ...d,
        id: ids[idx],
        isCompleted: false,
        campaignId,
        milestoneId,
        createdAt: new Date().toISOString(),
        postponedCount: 0,
        source: 'campaign' as const,
        dependsOn,
        priority: d.priority ?? 'medium',
        dueLabel: d.dueLabel ?? deriveDueLabel(d.dueDate),
      };
    });
    // cycle guard: reject chain that would create a circular dependency
    const prospective = [...quests, ...created];
    if (hasDependencyCycle(prospective)) {
      soundEngine.playSuccess();
      return [];
    }
    setQuests(prev=> [...created, ...prev]);
    setCampaigns(prev=> prev.map(c=> c.id===campaignId ? { ...c, milestones: c.milestones.map(m=> m.id===milestoneId ? { ...m, questIds: [...m.questIds, ...created.map(q=> q.id)] } : m) } : c));
    soundEngine.playSuccess();
    return created;
  };
  const linkQuestToChain = (questId: string, campaignId: string, milestoneId: string) => {
    setQuests(prev=> prev.map(q=> q.id===questId ? { ...q, campaignId, milestoneId } : q));
    setCampaigns(prev=> prev.map(c=> c.id===campaignId ? { ...c, milestones: c.milestones.map(m=> m.id===milestoneId ? { ...m, questIds: m.questIds.includes(questId) ? m.questIds : [...m.questIds, questId] } : m) } : c));
  };
  const unlinkQuestFromChain = (questId: string) => {
    const q = quests.find(x=> x.id===questId);
    if (!q?.campaignId || !q?.milestoneId) return;
    const { campaignId, milestoneId } = q;
    setQuests(prev=> prev.map(x=> x.id===questId ? { ...x, campaignId: undefined, milestoneId: undefined } : x));
    setCampaigns(prev=> prev.map(c=> c.id===campaignId ? { ...c, milestones: c.milestones.map(m=> m.id===milestoneId ? { ...m, questIds: m.questIds.filter(id=> id!==questId) } : m) } : c));
  };

  // Planning + intelligence derived
  const dailyObjectives = useMemo(()=> buildDailyObjectives(quests, campaigns), [quests, campaigns]);
  const productivitySnapshot = useMemo(()=> buildSnapshot(quests, effortLogs, 14), [quests, effortLogs]);
  const insights = useMemo(()=> deriveInsights(productivitySnapshot, campaigns, quests), [productivitySnapshot, campaigns, quests]);

  const getDailyObjectives = useCallback((opts?: { max?: number; availableMinutes?: number })=> buildDailyObjectives(quests, campaigns, opts), [quests, campaigns]);
  const getCampaignProgress = useCallback((campaignId: string): number => {
    const c = campaigns.find(x=> x.id===campaignId);
    if (!c) return 0;
    const ids = c.milestones.flatMap(m=> m.questIds);
    if (ids.length===0) return 0;
    const byId = new Map(quests.map(q=>[q.id,q] as const));
    const done = ids.filter(id=> byId.get(id)?.isCompleted).length;
    return Math.round(done/ids.length*100);
  }, [campaigns, quests]);

  const generateWeeklyReview = useCallback((): WeeklyReview => {
    const wr = buildWeeklyReviewEngine(quests, campaigns, effortLogs);
    setWeeklyReviews(prev=> {
      const existing = prev.find(r=> r.id===wr.id);
      if (existing) return prev.map(r=> r.id===wr.id ? wr : r);
      return [wr, ...prev];
    });
    setWeeklyState({ lastReviewWeekStart: wr.weekStart });
    return wr;
  }, [quests, campaigns, effortLogs]);
  const carryOverOverdue = (questIds: string[], newDueDate: string) => {
    setQuests(prev=> prev.map(q=> questIds.includes(q.id) ? { ...q, dueDate: newDueDate, dueLabel: deriveDueLabel(newDueDate), postponedCount: (q.postponedCount ?? 0) + 1 } : q));
  };
  const needsWeeklyReview = useMemo(()=> shouldShowWeeklyReview(weeklyState.lastReviewWeekStart), [weeklyState.lastReviewWeekStart]);
  const dismissWeeklyReview = useCallback(() => {
    const now = new Date();
    const monday = new Date(now); monday.setHours(0,0,0,0);
    const day = monday.getDay(); const diff = day===0 ? -6 : 1-day; monday.setDate(monday.getDate()+diff);
    setWeeklyState({ lastReviewWeekStart: getLocalDateString(monday) });
  }, []);

  return (
    <GameStateContext.Provider
      value={{
        activeTab, setActiveTab, profile, quests, habits, chests, rewards, achievements, transactions, focusSession, claimModal,
        campaigns, effortLogs, weeklyReviews, dailyObjectives, productivitySnapshot, insights,
        addXp, addCoins, addGems, completeQuest, createQuest, deleteQuest, updateQuest, postponeQuest,
        checkInHabit, createHabit, deleteHabit, updateHabit,
        startChestUnlock, speedUpChest, claimChestLoot, redeemReward, createCustomReward, editReward,
        ascendCitadel, toggleSound, openClaimModal, closeClaimModal,
        startFocusSession, pauseFocusSession, resumeFocusSession, cancelFocusSession, completeFocusSession, toggleManaOvercharge, setSoundscapeTrack,
        createCampaign, updateCampaign, deleteCampaign, archiveCampaign, createMilestone, updateMilestone, deleteMilestone, createQuestChain, linkQuestToChain, unlinkQuestFromChain,
        getDailyObjectives, getCampaignProgress, generateWeeklyReview, carryOverOverdue, needsWeeklyReview, dismissWeeklyReview,
        exportData: StorageService.exportBackup,
        importData: (json: string) => {
          const ok = StorageService.importBackup(json);
          if (ok) {
            setProfile(StorageService.getProfile());
            setQuests(StorageService.getQuests());
            setHabits(StorageService.getHabits());
            setChests(StorageService.getChests());
            setRewards(StorageService.getRewards());
            setAchievements(StorageService.getAchievements());
            setTransactions(StorageService.getTransactions());
            setCampaigns(StorageService.getCampaigns());
            setEffortLogs(StorageService.getEffortLogs());
            setWeeklyReviews(StorageService.getWeeklyReviews());
            setWeeklyState(StorageService.getWeeklyState());
          }
          return ok;
        },
        // AI Intelligence Layer
        aiDailyBriefing, isAiLoading, aiError, refreshAiBriefing, askAi, getNextAiAction, decomposeQuest,
        showApiKeyModal, setShowApiKeyModal, handleApiKeySet, handleApiKeyClear, hasApiKey
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = (): GameStateContextType => {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error('useGameState must be used within GameStateProvider');
  return ctx;
};
