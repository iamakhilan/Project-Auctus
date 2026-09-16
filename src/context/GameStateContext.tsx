import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
} from '../types';
import { StorageService } from '../services/storage';
import { soundEngine } from '../utils/audioSynthesizer';
import { triggerConfetti } from '../utils/confetti';

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

  // Actions
  addXp: (amount: number) => void;
  addCoins: (amount: number, reason: string) => void;
  addGems: (amount: number, reason: string) => void;
  completeQuest: (questId: string) => void;
  createQuest: (quest: Omit<Quest, 'id' | 'isCompleted'>) => void;
  deleteQuest: (questId: string) => void;
  updateQuest: (questId: string, patch: Partial<Quest>) => void;
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

  // Focus Arena Actions
  startFocusSession: (durationMinutes: number, questId?: string, questTitle?: string) => void;
  pauseFocusSession: () => void;
  resumeFocusSession: () => void;
  cancelFocusSession: () => void;
  completeFocusSession: () => void;
  toggleManaOvercharge: () => void;
  setSoundscapeTrack: (track: FocusSessionState['soundscapeTrack']) => void;

  // Backup
  exportData: () => string;
  importData: (json: string) => boolean;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

// Chest tier helpers for auto-fill
function rollChestTier(): ChestTier {
  const r = Math.random() * 100;
  if (r < 55) return 'bronze';
  if (r < 85) return 'silver';
  if (r < 97) return 'gold';
  return 'mythic';
}

function chestConfigForTier(tier: ChestTier): { name: string; totalUnlockSeconds: number; coinsReward: number; xpReward: number; gemsReward: number } {
  switch (tier) {
    case 'bronze':
      return { name: 'Bronze Supply Chest', totalUnlockSeconds: 3600, coinsReward: 50, xpReward: 30, gemsReward: 2 };
    case 'silver':
      return { name: 'Silver Quest Chest', totalUnlockSeconds: 7200, coinsReward: 100, xpReward: 60, gemsReward: 5 };
    case 'gold':
      return { name: 'Gold Relic Chest', totalUnlockSeconds: 14400, coinsReward: 200, xpReward: 120, gemsReward: 10 };
    case 'mythic':
      return { name: 'Mythic Obsidian Chest', totalUnlockSeconds: 28800, coinsReward: 400, xpReward: 250, gemsReward: 25 };
  }
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

  const [focusSession, setFocusSession] = useState<FocusSessionState>(() => {
    const saved = StorageService.getFocusState();
    return saved || {
      isActive: false,
      isPaused: false,
      targetDurationSeconds: 1500,
      remainingSeconds: 1500,
      accumulatedXp: 0,
      accumulatedCoins: 0,
      isOvercharged: false,
      soundscapeTrack: 'none',
    };
  });

  const [claimModal, setClaimModal] = useState<ClaimModalData>({
    isOpen: false,
    title: '',
    subtitle: '',
    description: '',
  });

  // Refs for leak-free focus timer
  const focusIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completeFocusSessionRef = useRef<() => void>(() => {});
  const chestTimeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Sync profile & state to storage
  useEffect(() => { StorageService.setProfile(profile); }, [profile]);
  useEffect(() => { StorageService.setQuests(quests); }, [quests]);
  useEffect(() => { StorageService.setHabits(habits); }, [habits]);
  useEffect(() => { StorageService.setChests(chests); }, [chests]);
  useEffect(() => { StorageService.setRewards(rewards); }, [rewards]);
  useEffect(() => { StorageService.setAchievements(achievements); }, [achievements]);
  useEffect(() => { StorageService.setTransactions(transactions); }, [transactions]);
  useEffect(() => { StorageService.setFocusState(focusSession); }, [focusSession]);

  // Sync sound engine state
  useEffect(() => {
    soundEngine.isMuted = !profile.soundEnabled;
  }, [profile.soundEnabled]);

  const toggleSound = () => {
    setProfile(p => ({ ...p, soundEnabled: !p.soundEnabled }));
  };

  const openClaimModal = useCallback((data: Partial<ClaimModalData>) => {
    setClaimModal({
      isOpen: true,
      title: data.title || 'Victory Reward',
      subtitle: data.subtitle || 'CLAIMED',
      description: data.description || '',
      coins: data.coins,
      xp: data.xp,
      gems: data.gems,
      icon: data.icon || '🎉',
    });
    soundEngine.playSuccess();
    triggerConfetti();
  }, []);

  const closeClaimModal = () => {
    setClaimModal(prev => ({ ...prev, isOpen: false }));
  };

  const addXp = useCallback((amount: number) => {
    setProfile(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let nextThreshold = prev.xpToNextLevel;

      while (newXp >= nextThreshold) {
        newXp -= nextThreshold;
        newLevel += 1;
        nextThreshold = Math.round(nextThreshold * 1.25);
        soundEngine.playLevelUp();
        triggerConfetti();
      }

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        xpToNextLevel: nextThreshold,
        citadelPower: Math.min(prev.citadelMaxPower, prev.citadelPower + Math.round(amount * 0.5)),
      };
    });
  }, []);

  const addCoins = useCallback((amount: number, reason: string) => {
    setProfile(p => ({ ...p, coins: p.coins + amount }));
    setTransactions(t => [
      {
        id: `tx-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        amount,
        currency: 'coins',
        type: amount >= 0 ? 'earn' : 'spend',
        reason,
      },
      ...t,
    ]);
    if (amount > 0) soundEngine.playCoinCollect();
  }, []);

  const addGems = useCallback((amount: number, reason: string) => {
    setProfile(p => ({ ...p, gems: p.gems + amount }));
    setTransactions(t => [
      {
        id: `tx-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        amount,
        currency: 'gems',
        type: amount >= 0 ? 'earn' : 'spend',
        reason,
      },
      ...t,
    ]);
    if (amount > 0) soundEngine.playSuccess();
  }, []);

  // Achievement auto-evaluator — watches profile + habits, auto-unlocks matching entries once
  useEffect(() => {
    const getProgress = (ach: Achievement): number => {
      switch (ach.category) {
        case 'quests':
          return profile.completedQuestsCount;
        case 'focus':
          return profile.totalFocusMinutes;
        case 'streak':
          return profile.streakDays;
        case 'citadel':
          return profile.citadelTier;
        case 'habits': {
          const maxStreak = habits.reduce((max, h) => Math.max(max, h.streakCount), 0);
          return maxStreak;
        }
        default:
          return ach.currentValue;
      }
    };

    const toUnlock = achievements.filter(a => !a.isUnlocked && getProgress(a) >= a.targetValue);
    if (toUnlock.length === 0) return;

    // Update achievements state only once per entry
    setAchievements(prev =>
      prev.map(a => {
        if (a.isUnlocked) return a;
        const prog = getProgress(a);
        const shouldUnlock = prog >= a.targetValue;
        if (!shouldUnlock) {
          // keep currentValue in sync for UI even if not yet unlocked
          if (a.currentValue !== prog) return { ...a, currentValue: prog };
          return a;
        }
        return {
          ...a,
          currentValue: prog,
          isUnlocked: true,
          unlockedAt: new Date().toISOString(),
        };
      })
    );

    // Fire rewards + modal for each newly unlocked achievement (only once because we filtered isUnlocked)
    toUnlock.forEach(ach => {
      const prog = getProgress(ach);
      // keep currentValue consistent even before state flush
      if (ach.rewards.xp) addXp(ach.rewards.xp);
      if (ach.rewards.coins) addCoins(ach.rewards.coins, `Achievement: ${ach.title}`);
      if (ach.rewards.gems) addGems(ach.rewards.gems, `Achievement: ${ach.title}`);
      openClaimModal({
        title: ach.title,
        subtitle: 'ACHIEVEMENT UNLOCKED',
        description: ach.description + (ach.rewards.titleReward ? ` Title unlocked: ${ach.rewards.titleReward}` : ''),
        xp: ach.rewards.xp,
        coins: ach.rewards.coins,
        gems: ach.rewards.gems,
        icon: ach.icon,
      });
      // ensure visible currentValue sync even if async
      void prog;
    });
  }, [profile.completedQuestsCount, profile.totalFocusMinutes, profile.streakDays, profile.citadelTier, habits, achievements, addXp, addCoins, addGems, openClaimModal]);

  // Keep achievement currentValue synced even when not unlocking (e.g., progress bar UI)
  useEffect(() => {
    setAchievements(prev => {
      let changed = false;
      const next = prev.map(a => {
        if (a.isUnlocked) return a;
        let prog = a.currentValue;
        switch (a.category) {
          case 'quests': prog = profile.completedQuestsCount; break;
          case 'focus': prog = profile.totalFocusMinutes; break;
          case 'streak': prog = profile.streakDays; break;
          case 'citadel': prog = profile.citadelTier; break;
          case 'habits': prog = habits.reduce((m, h) => Math.max(m, h.streakCount), 0); break;
        }
        if (prog !== a.currentValue) { changed = true; return { ...a, currentValue: prog }; }
        return a;
      });
      return changed ? next : prev;
    });
  }, [profile.completedQuestsCount, profile.totalFocusMinutes, profile.streakDays, profile.citadelTier, habits]);

  // Quest Actions
  const completeQuest = useCallback((questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.isCompleted) return;

    setQuests(prev =>
      prev.map(q => (q.id === questId ? { ...q, isCompleted: true, completedAt: new Date().toISOString() } : q))
    );

    addXp(quest.xpReward);
    addCoins(quest.coinsReward, `Completed Quest: ${quest.title}`);
    setProfile(p => ({ ...p, completedQuestsCount: p.completedQuestsCount + 1 }));

    openClaimModal({
      title: quest.title,
      subtitle: 'MISSION ACCOMPLISHED',
      description: `Objective conquered under tag #${quest.tag}!`,
      xp: quest.xpReward,
      coins: quest.coinsReward,
      icon: '🎯',
    });
  }, [quests, addXp, addCoins, openClaimModal]);

  const createQuest = (data: Omit<Quest, 'id' | 'isCompleted'>) => {
    const newQuest: Quest = {
      ...data,
      id: `q-${Date.now()}`,
      isCompleted: false,
    };
    setQuests(prev => [newQuest, ...prev]);
    soundEngine.playClick();
  };

  const deleteQuest = (questId: string) => {
    setQuests(prev => prev.filter(q => q.id !== questId));
  };

  const updateQuest = useCallback((questId: string, patch: Partial<Quest>) => {
    setQuests(prev => prev.map(q => (q.id === questId ? { ...q, ...patch, id: q.id } : q)));
    soundEngine.playClick();
  }, []);

  // Habit Actions
  const checkInHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const habit = habits.find(h => h.id === habitId);
    if (!habit || habit.lastCompletedDate === today) return;

    const newStreak = habit.streakCount + 1;
    const bestStreak = Math.max(newStreak, habit.bestStreak);

    setHabits(prev =>
      prev.map(h => (h.id === habitId ? { ...h, streakCount: newStreak, bestStreak, lastCompletedDate: today } : h))
    );

    // Multiplier for streak milestones
    let multiplier = 1;
    if (newStreak >= 30) multiplier = 2.0;
    else if (newStreak >= 21) multiplier = 1.75;
    else if (newStreak >= 14) multiplier = 1.5;
    else if (newStreak >= 7) multiplier = 1.25;

    const xpEarned = Math.round(habit.xpYield * multiplier);
    const coinsEarned = Math.round(habit.coinYield * multiplier);

    addXp(xpEarned);
    addCoins(coinsEarned, `Habit Streak Check-in: ${habit.title} (${newStreak}d)`);

    openClaimModal({
      title: habit.title,
      subtitle: `${newStreak} DAY STREAK! 🔥`,
      description: `Discipline multiplier ${multiplier}x applied!`,
      xp: xpEarned,
      coins: coinsEarned,
      icon: '🔥',
    });
  };

  const createHabit = (data: Omit<Habit, 'id' | 'streakCount' | 'bestStreak'>) => {
    const newHabit: Habit = {
      ...data,
      id: `h-${Date.now()}`,
      streakCount: 0,
      bestStreak: 0,
    };
    setHabits(prev => [...prev, newHabit]);
    soundEngine.playClick();
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  const updateHabit = useCallback((habitId: string, patch: Partial<Habit>) => {
    setHabits(prev => prev.map(h => (h.id === habitId ? { ...h, ...patch, id: h.id } : h)));
    soundEngine.playClick();
  }, []);

  // Chest Actions
  const startChestUnlock = (slotIndex: number) => {
    setChests(prev =>
      prev.map(c => {
        if (c.slotIndex !== slotIndex || c.status !== 'locked') return c;
        const now = Date.now();
        return {
          ...c,
          status: 'unlocking',
          unlockStartedAt: now,
          unlockEndsAt: now + c.totalUnlockSeconds * 1000,
        };
      })
    );
    soundEngine.playClick();
  };

  const speedUpChest = (slotIndex: number): boolean => {
    const cost = 10;
    if (profile.gems < cost) return false;

    setProfile(p => ({ ...p, gems: p.gems - cost }));
    setChests(prev =>
      prev.map(c => (c.slotIndex === slotIndex ? { ...c, status: 'ready', unlockEndsAt: Date.now() } : c))
    );
    soundEngine.playSuccess();
    return true;
  };

  const claimChestLoot = (slotIndex: number) => {
    const chest = chests.find(c => c.slotIndex === slotIndex);
    if (!chest || chest.status !== 'ready') return;

    addCoins(chest.coinsReward, `Opened ${chest.name}`);
    addXp(chest.xpReward);
    addGems(chest.gemsReward, `Gems from ${chest.name}`);

    // Set slot to empty
    setChests(prev =>
      prev.map(c =>
        c.slotIndex === slotIndex
          ? {
              ...c,
              status: 'empty',
              tier: 'bronze' as ChestTier,
              name: 'Empty Slot',
              unlockStartedAt: undefined,
              unlockEndsAt: undefined,
            }
          : c
      )
    );

    openClaimModal({
      title: chest.name,
      subtitle: `${chest.tier.toUpperCase()} LOOT UNLOCKED`,
      description: 'Loot reward successfully added to treasury.',
      coins: chest.coinsReward,
      xp: chest.xpReward,
      gems: chest.gemsReward,
      icon: '🎁',
    });

    // Chest auto-fill: schedule new random chest after 30s delay
    const timeout = setTimeout(() => {
      const tier = rollChestTier();
      const cfg = chestConfigForTier(tier);
      setChests(prev =>
        prev.map(c => {
          if (c.slotIndex !== slotIndex) return c;
          // Only fill if still empty (functional update guard)
          if (c.status !== 'empty') return c;
          return {
            ...c,
            tier,
            name: cfg.name,
            status: 'locked',
            totalUnlockSeconds: cfg.totalUnlockSeconds,
            coinsReward: cfg.coinsReward,
            xpReward: cfg.xpReward,
            gemsReward: cfg.gemsReward,
            unlockStartedAt: undefined,
            unlockEndsAt: undefined,
          };
        })
      );
    }, 30000);
    chestTimeoutRefs.current.push(timeout);
  };

  // Cleanup chest auto-fill timeouts on unmount
  useEffect(() => {
    const chestTimeouts = chestTimeoutRefs.current;
    return () => {
      chestTimeouts.forEach(clearTimeout);
    };
  }, []);

  // Chest Timer Tick
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setChests(prev =>
        prev.map(c => {
          if (c.status === 'unlocking' && c.unlockEndsAt && now >= c.unlockEndsAt) {
            return { ...c, status: 'ready' };
          }
          return c;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rewards
  const redeemReward = (rewardId: string): boolean => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || profile.coins < reward.cost) return false;

    addCoins(-reward.cost, `Redeemed: ${reward.title}`);
    openClaimModal({
      title: reward.title,
      subtitle: 'REWARD CLAIMED',
      description: reward.description,
      icon: reward.icon,
    });
    return true;
  };

  const createCustomReward = (title: string, cost: number, category: string, icon: string, description: string) => {
    const newReward: RewardItem = {
      id: `r-${Date.now()}`,
      title,
      cost,
      category,
      icon: icon || '🎁',
      description,
      isCustom: true,
    };
    setRewards(prev => [newReward, ...prev]);
    soundEngine.playSuccess();
  };

  const editReward = useCallback((rewardId: string, patch: Partial<RewardItem>) => {
    setRewards(prev => prev.map(r => (r.id === rewardId ? { ...r, ...patch, id: r.id } : r)));
    soundEngine.playClick();
  }, []);

  // Citadel Ascension
  const ascendCitadel = (): boolean => {
    if (profile.citadelPower < profile.citadelMaxPower) return false;

    setProfile(p => ({
      ...p,
      citadelTier: p.citadelTier + 1,
      citadelPower: 0,
      citadelMaxPower: Math.round(p.citadelMaxPower * 1.5),
      title: p.citadelTier + 1 === 3 ? 'Iron Vanguard' : p.citadelTier + 1 === 4 ? 'Aether Archon' : 'Apex Sovereign',
    }));

    addXp(300);
    addGems(30, 'Citadel Ascension Reward');

    openClaimModal({
      title: `Citadel Ascended to Tier ${profile.citadelTier + 1}!`,
      subtitle: 'ASCENDANCY COMPLETE',
      description: 'Passive +20% XP rate unlocked across all focus arenas.',
      xp: 300,
      gems: 30,
      icon: '🏰',
    });
    return true;
  };

  // Focus Arena Engine
  const startFocusSession = (durationMinutes: number, questId?: string, questTitle?: string) => {
    const totalSecs = durationMinutes * 60;
    setFocusSession({
      isActive: true,
      isPaused: false,
      targetDurationSeconds: totalSecs,
      remainingSeconds: totalSecs,
      accumulatedXp: Math.round(durationMinutes * 4),
      accumulatedCoins: Math.round(durationMinutes * 2),
      selectedQuestId: questId,
      selectedQuestTitle: questTitle,
      isOvercharged: false,
      soundscapeTrack: 'cyber-rain',
      startedAt: Date.now(),
    });
    soundEngine.playSuccess();
    soundEngine.startSoundscape('cyber-rain');
  };

  const pauseFocusSession = useCallback(() => {
    setFocusSession(prev => ({ ...prev, isPaused: true }));
    soundEngine.stopSoundscape();
    if (focusIntervalRef.current) {
      clearInterval(focusIntervalRef.current);
      focusIntervalRef.current = null;
    }
  }, []);

  const resumeFocusSession = useCallback(() => {
    setFocusSession(prev => ({ ...prev, isPaused: false }));
    // soundscape restarts in effect / direct
    setFocusSession(prev => {
      soundEngine.startSoundscape(prev.soundscapeTrack);
      return prev;
    });
  }, []);

  const cancelFocusSession = useCallback(() => {
    if (focusIntervalRef.current) {
      clearInterval(focusIntervalRef.current);
      focusIntervalRef.current = null;
    }
    soundEngine.stopSoundscape();
    setFocusSession(prev => ({ ...prev, isActive: false, isPaused: false }));
  }, []);

  const completeFocusSession = useCallback(() => {
    // teardown interval first to prevent leak
    if (focusIntervalRef.current) {
      clearInterval(focusIntervalRef.current);
      focusIntervalRef.current = null;
    }
    soundEngine.stopSoundscape();

    setFocusSession(prev => {
      if (!prev.isActive) return prev;
      const multiplier = prev.isOvercharged ? 1.5 : 1.0;
      const finalXp = Math.round(prev.accumulatedXp * multiplier);
      const finalCoins = Math.round(prev.accumulatedCoins * multiplier);
      const mins = Math.round(prev.targetDurationSeconds / 60);

      // side-effects via setters (safe inside updater via queue)
      addXp(finalXp);
      addCoins(finalCoins, `Focus Combat Victory (${mins}m)`);
      setProfile(p => ({ ...p, totalFocusMinutes: p.totalFocusMinutes + mins }));

      if (prev.selectedQuestId) {
        // defer quest completion to next tick to avoid nested state batch issues
        const qid = prev.selectedQuestId;
        setTimeout(() => completeQuest(qid), 0);
      }

      openClaimModal({
        title: 'Combat Arena Victory!',
        subtitle: `${mins} MINUTE FOCUS COMPLETED`,
        description: prev.selectedQuestTitle ? `Objective: ${prev.selectedQuestTitle}` : 'Deep work sprint successfully concluded.',
        xp: finalXp,
        coins: finalCoins,
        icon: '⚔️',
      });

      return { ...prev, isActive: false, isPaused: false, remainingSeconds: 0 };
    });
  }, [addXp, addCoins, openClaimModal, completeQuest]);

  // Keep ref in sync for interval closure
  useEffect(() => {
    completeFocusSessionRef.current = completeFocusSession;
  }, [completeFocusSession]);

  const toggleManaOvercharge = () => {
    setFocusSession(prev => ({ ...prev, isOvercharged: !prev.isOvercharged }));
    soundEngine.playClick();
  };

  const setSoundscapeTrack = (track: FocusSessionState['soundscapeTrack']) => {
    setFocusSession(prev => ({ ...prev, soundscapeTrack: track }));
    // use functional state check to avoid stale closure
    setFocusSession(prev => {
      if (prev.isActive && !prev.isPaused) {
        soundEngine.startSoundscape(track);
      }
      return prev;
    });
  };

  // Focus Timer countdown tick — leak-free with cleanup + Page Visibility handling
  useEffect(() => {
    // Clear any existing interval before (re)starting
    if (focusIntervalRef.current) {
      clearInterval(focusIntervalRef.current);
      focusIntervalRef.current = null;
    }

    if (!focusSession.isActive || focusSession.isPaused) return;

    // Visibility handler: pause tick while hidden, resume when visible without losing time
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (focusIntervalRef.current) {
          clearInterval(focusIntervalRef.current);
          focusIntervalRef.current = null;
        }
      } else {
        // re-arm interval if still active and not paused
        if (!focusIntervalRef.current && focusSession.isActive && !focusSession.isPaused) {
          focusIntervalRef.current = setInterval(() => {
            setFocusSession(prev => {
              if (!prev.isActive || prev.isPaused) return prev;
              if (prev.remainingSeconds <= 1) {
                // use ref to avoid stale closure leak
                completeFocusSessionRef.current();
                return prev;
              }
              return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
            });
          }, 1000);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    focusIntervalRef.current = setInterval(() => {
      setFocusSession(prev => {
        if (!prev.isActive || prev.isPaused) return prev;
        if (prev.remainingSeconds <= 1) {
          completeFocusSessionRef.current();
          return prev;
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (focusIntervalRef.current) {
        clearInterval(focusIntervalRef.current);
        focusIntervalRef.current = null;
      }
    };
  }, [focusSession.isActive, focusSession.isPaused]);

  // Ensure complete teardown on unmount
  useEffect(() => {
    return () => {
      if (focusIntervalRef.current) {
        clearInterval(focusIntervalRef.current);
        focusIntervalRef.current = null;
      }
      soundEngine.stopSoundscape();
    };
  }, []);

  return (
    <GameStateContext.Provider
      value={{
        activeTab,
        setActiveTab,
        profile,
        quests,
        habits,
        chests,
        rewards,
        achievements,
        transactions,
        focusSession,
        claimModal,
        addXp,
        addCoins,
        addGems,
        completeQuest,
        createQuest,
        deleteQuest,
        updateQuest,
        checkInHabit,
        createHabit,
        deleteHabit,
        updateHabit,
        startChestUnlock,
        speedUpChest,
        claimChestLoot,
        redeemReward,
        createCustomReward,
        editReward,
        ascendCitadel,
        toggleSound,
        openClaimModal,
        closeClaimModal,
        startFocusSession,
        pauseFocusSession,
        resumeFocusSession,
        cancelFocusSession,
        completeFocusSession,
        toggleManaOvercharge,
        setSoundscapeTrack,
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
          }
          return ok;
        },
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
