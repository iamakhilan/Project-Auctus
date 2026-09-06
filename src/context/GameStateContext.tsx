import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PlayerProfile,
  Quest,
  ChestSlot,
  RewardItem,
  TabType,
  ClaimModalData,
  FocusSessionState,
} from '../types';
import {
  loadProfileV2,
  saveProfileV2,
  loadQuestsV2,
  saveQuestsV2,
  loadChestsV2,
  saveChestsV2,
  loadRewardsV2,
  saveRewardsV2,
  loadFocusSessionV2,
  saveFocusSessionV2,
  exportAuctusBackup,
  importAuctusBackup,
} from '../services/storage';
import { soundEngine } from '../utils/audioSynthesizer';
import confetti from 'canvas-confetti';
import { calculateLevelProgression } from '../domain/progression';
import {
  createQuestEntity,
  completeQuestEntity,
  updateQuestEntity,
  deleteQuestEntity,
  QuestCreationParams,
} from '../domain/quests';
import { validateRedemption, deductCoins, createCustomRewardEntity } from '../domain/economy';
import { createChestSlotEntity, rollChestTier, createEmptyChestSlot } from '../domain/chests';
import {
  createFocusSessionEntity,
  calculateRemainingSeconds,
  pauseFocusSessionEntity,
  resumeFocusSessionEntity,
  calculateFocusYield,
} from '../domain/focus';

interface GameStateContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  profile: PlayerProfile;
  quests: Quest[];
  chests: ChestSlot[];
  rewards: RewardItem[];
  claimModal: ClaimModalData;
  focusSession: FocusSessionState;
  
  // Game Actions
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  addShards: (amount: number) => void;
  completeQuest: (questId: string) => void;
  createQuest: (
    titleOrParams: string | QuestCreationParams,
    tier?: 'Tier I' | 'Tier II' | 'Tier III' | 'Epic' | 'Urgent',
    dueLabel?: string
  ) => void;
  updateQuest: (questId: string, updates: Partial<QuestCreationParams>) => void;
  deleteQuest: (questId: string) => void;
  unlockChest: (slotIndex: number) => void;
  claimChestLoot: (slotIndex: number) => void;
  redeemReward: (rewardId: string) => boolean;
  createCustomReward: (title: string, cost: number, category: string, icon: string) => void;
  toggleSound: () => void;
  closeClaimModal: () => void;
  openCustomClaimModal: (data: Partial<ClaimModalData>) => void;
  exportData: () => string;
  importData: (json: string) => boolean;
  
  // Focus Arena Actions
  startFocusSession: (durationMinutes?: number, questId?: string, questTitle?: string) => void;
  pauseFocusSession: () => void;
  resumeFocusSession: () => void;
  cancelFocusSession: () => void;
  completeFocusSession: () => void;
  toggleManaOvercharge: () => void;
  setSoundscapeTrack: (track: FocusSessionState['soundscapeTrack']) => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<TabType>('realm');
  const [profile, setProfile] = useState<PlayerProfile>(loadProfileV2);
  const [quests, setQuests] = useState<Quest[]>(loadQuestsV2);
  const [chests, setChests] = useState<ChestSlot[]>(loadChestsV2);
  const [rewards, setRewards] = useState<RewardItem[]>(loadRewardsV2);

  const [claimModal, setClaimModal] = useState<ClaimModalData>({
    isOpen: false,
    title: '',
    subtitle: '',
    description: '',
  });

  const [focusSession, setFocusSession] = useState<FocusSessionState>(loadFocusSessionV2);

  // Save changes to V2 storage
  useEffect(() => {
    saveProfileV2(profile);
  }, [profile]);

  useEffect(() => {
    saveQuestsV2(quests);
  }, [quests]);

  useEffect(() => {
    saveChestsV2(chests);
  }, [chests]);

  useEffect(() => {
    saveRewardsV2(rewards);
  }, [rewards]);

  useEffect(() => {
    saveFocusSessionV2(focusSession);
  }, [focusSession]);

  const setActiveTab = (tab: TabType) => {
    soundEngine.playClick(profile.soundEnabled);
    setActiveTabState(tab);
  };

  const toggleSound = () => {
    setProfile(prev => {
      const nextSound = !prev.soundEnabled;
      soundEngine.playClick(nextSound);
      return { ...prev, soundEnabled: nextSound };
    });
  };

  // XP & Level Progression System
  const addXp = useCallback((amount: number) => {
    setProfile(prev => {
      const progression = calculateLevelProgression(
        prev.xp,
        prev.level,
        prev.xpToNextLevel,
        amount
      );

      if (progression.leveledUp) {
        soundEngine.playLevelUp(prev.soundEnabled);
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.4 },
          colors: ['#f59e0b', '#fbbf24', '#00e59b', '#38bdf8', '#ffffff'],
        });
      }

      return {
        ...prev,
        xp: progression.xp,
        level: progression.level,
        xpToNextLevel: progression.xpToNextLevel,
        citadelPower: Math.min(
          prev.citadelMaxPower,
          prev.citadelPower + progression.citadelPowerBonus
        ),
      };
    });
  }, [profile.soundEnabled]);

  const addCoins = useCallback((amount: number) => {
    soundEngine.playCoinClaim(profile.soundEnabled);
    setProfile(prev => ({
      ...prev,
      coins: prev.coins + amount,
    }));
  }, [profile.soundEnabled]);

  const addShards = useCallback((amount: number) => {
    setProfile(prev => ({
      ...prev,
      shards: prev.shards + amount,
    }));
  }, []);

  // Complete a Quest
  const completeQuest = useCallback((questId: string) => {
    let questCompletionResult: ReturnType<typeof completeQuestEntity> | null = null;

    setQuests(prev =>
      prev.map(q => {
        if (q.id === questId && !q.isCompleted) {
          const result = completeQuestEntity(q);
          questCompletionResult = result;
          soundEngine.playQuestComplete(profile.soundEnabled);
          addXp(result.xpEarned);
          if (result.coinsEarned > 0) {
            addCoins(result.coinsEarned);
          }
          if (result.streakShieldsEarned > 0) {
            setProfile(p => ({
              ...p,
              streakShields: p.streakShields + result.streakShieldsEarned,
            }));
          }

          // Trigger particle burst
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#00e59b', '#10b981', '#fbbf24', '#ffffff'],
          });

          return result.quest;
        }
        return q;
      })
    );

    if (questCompletionResult) {
      // Check for chest drop into empty slot if available
      setChests(curChests => {
        const emptyIdx = curChests.findIndex(c => c.status === 'empty' || c.tier === 'empty');
        if (emptyIdx !== -1) {
          const updated = [...curChests];
          const rolledTier = rollChestTier();
          updated[emptyIdx] = createChestSlotEntity(emptyIdx, rolledTier);
          return updated;
        }
        return curChests;
      });

      setProfile(p => ({
        ...p,
        completedQuestsCount: p.completedQuestsCount + 1,
        trophyPoints: p.trophyPoints + 25,
      }));
    }
  }, [addXp, addCoins, profile.soundEnabled]);

  // Create a new Quest in the Mission Forge
  const createQuest = useCallback((
    titleOrParams: string | QuestCreationParams,
    tier: 'Tier I' | 'Tier II' | 'Tier III' | 'Epic' | 'Urgent' = 'Tier I',
    dueLabel = 'Today'
  ) => {
    let params: QuestCreationParams;
    if (typeof titleOrParams === 'string') {
      params = {
        title: titleOrParams,
        tier,
        dueLabel,
      };
    } else {
      params = titleOrParams;
    }

    const newQuest = createQuestEntity(params);
    soundEngine.playClick(profile.soundEnabled);
    setQuests(prev => [newQuest, ...prev]);
  }, [profile.soundEnabled]);

  const updateQuest = useCallback((questId: string, updates: Partial<QuestCreationParams>) => {
    soundEngine.playClick(profile.soundEnabled);
    setQuests(prev =>
      prev.map(q => (q.id === questId ? updateQuestEntity(q, updates) : q))
    );
  }, [profile.soundEnabled]);

  const deleteQuest = useCallback((questId: string) => {
    soundEngine.playClick(profile.soundEnabled);
    setQuests(prev => deleteQuestEntity(prev, questId));
  }, [profile.soundEnabled]);

  // Unlock / Start Timer on a Chest
  const unlockChest = useCallback((slotIndex: number) => {
    soundEngine.playClick(profile.soundEnabled);
    setChests(prev =>
      prev.map(c => {
        if (c.slotIndex === slotIndex && c.status === 'queued') {
          return {
            ...c,
            status: 'unlocking',
          };
        }
        return c;
      })
    );
  }, [profile.soundEnabled]);

  // Claim Chest Loot
  const claimChestLoot = useCallback((slotIndex: number) => {
    const targetChest = chests.find(c => c.slotIndex === slotIndex);
    if (!targetChest) return;

    soundEngine.playCoinClaim(profile.soundEnabled);
    addXp(targetChest.xpReward);
    addCoins(targetChest.coinsReward);
    if (targetChest.shardsReward > 0) {
      addShards(targetChest.shardsReward);
    }

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#38bdf8', '#00e59b', '#fde047'],
    });

    setClaimModal({
      isOpen: true,
      title: `${targetChest.name} Claimed!`,
      subtitle: 'LOOT SECURED',
      description: 'Relic rewards and coins deposited into your Citadel Vault.',
      coins: targetChest.coinsReward,
      xp: targetChest.xpReward,
      shards: targetChest.shardsReward,
      icon: 'military_tech',
    });

    // Reset slot to empty
    setChests(prev =>
      prev.map(c => (c.slotIndex === slotIndex ? createEmptyChestSlot(slotIndex) : c))
    );

    setProfile(p => ({
      ...p,
      unlockedChestsCount: p.unlockedChestsCount + 1,
    }));
  }, [chests, addXp, addCoins, addShards, profile.soundEnabled]);

  // Redeem a Reward
  const redeemReward = useCallback((rewardId: string): boolean => {
    const target = rewards.find(r => r.id === rewardId);
    if (!target) return false;

    const validation = validateRedemption(profile, target);
    if (!validation.isValid) {
      soundEngine.playClick(profile.soundEnabled);
      return false;
    }

    // Deduct coins using domain pure function
    const updated = deductCoins(profile, target.cost);
    if (!updated) return false;

    setProfile(updated);

    soundEngine.playCoinClaim(profile.soundEnabled);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#00c853', '#fbbf24', '#ffffff'],
    });

    setClaimModal({
      isOpen: true,
      title: target.title,
      subtitle: 'REWARD UNLOCKED',
      description: 'You earned this through real-world focus and discipline. Enjoy guilt-free!',
      coins: -target.cost,
      icon: target.icon || 'redeem',
    });

    return true;
  }, [rewards, profile, profile.soundEnabled]);

  const createCustomReward = useCallback((title: string, cost: number, category: string, icon: string) => {
    const newReward = createCustomRewardEntity(title, cost, category, icon);
    soundEngine.playClick(profile.soundEnabled);
    setRewards(prev => [...prev, newReward]);
  }, [profile.soundEnabled]);

  const closeClaimModal = () => {
    setClaimModal(prev => ({ ...prev, isOpen: false }));
  };

  const openCustomClaimModal = (data: Partial<ClaimModalData>) => {
    setClaimModal({
      isOpen: true,
      title: data.title || 'Victory!',
      subtitle: data.subtitle || 'CLAIMED',
      description: data.description || 'Reward received.',
      coins: data.coins,
      xp: data.xp,
      shards: data.shards,
      icon: data.icon || 'celebration',
    });
  };

  const exportData = useCallback((): string => {
    return exportAuctusBackup();
  }, []);

  const importData = useCallback((json: string): boolean => {
    const result = importAuctusBackup(json);
    if (result.success && result.data) {
      setProfile(loadProfileV2());
      setQuests(loadQuestsV2());
      setChests(loadChestsV2());
      setRewards(loadRewardsV2());
      setFocusSession(loadFocusSessionV2());
      soundEngine.playLevelUp(profile.soundEnabled);
      return true;
    }
    return false;
  }, [profile.soundEnabled]);

  // Focus Arena Timer Management
  const startFocusSession = useCallback((
    durationMinutes = 25,
    questId?: string,
    questTitle?: string
  ) => {
    soundEngine.playClick(profile.soundEnabled);
    const newSession = createFocusSessionEntity({
      durationMinutes,
      questId,
      questTitle: questTitle || 'Deep Work: Strategy Sprint',
      isOvercharged: false,
      soundscapeTrack: 'binaural',
    });

    setFocusSession(newSession);
    soundEngine.startAmbience('binaural');
    setActiveTabState('focus-arena');
  }, [profile.soundEnabled]);

  const pauseFocusSession = useCallback(() => {
    soundEngine.playClick(profile.soundEnabled);
    setFocusSession(prev => {
      if (!prev.isActive) return prev;
      if (!prev.isPaused) {
        soundEngine.stopAmbience();
        return pauseFocusSessionEntity(prev);
      } else {
        if (prev.soundscapeTrack !== 'none') {
          soundEngine.startAmbience(prev.soundscapeTrack);
        }
        return resumeFocusSessionEntity(prev);
      }
    });
  }, [profile.soundEnabled]);

  const resumeFocusSession = useCallback(() => {
    soundEngine.playClick(profile.soundEnabled);
    setFocusSession(prev => {
      if (!prev.isActive || !prev.isPaused) return prev;
      if (prev.soundscapeTrack !== 'none') {
        soundEngine.startAmbience(prev.soundscapeTrack);
      }
      return resumeFocusSessionEntity(prev);
    });
  }, [profile.soundEnabled]);

  const cancelFocusSession = useCallback(() => {
    soundEngine.stopAmbience();
    soundEngine.playClick(profile.soundEnabled);
    setFocusSession(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      endsAt: undefined,
      startedAt: undefined,
      pausedAt: undefined,
    }));
    setActiveTabState('realm');
  }, [profile.soundEnabled]);

  const completeFocusSession = useCallback(() => {
    soundEngine.stopAmbience();
    soundEngine.playQuestComplete(profile.soundEnabled);

    const yields = calculateFocusYield(
      Math.round(focusSession.targetDurationSeconds / 60),
      focusSession.isOvercharged
    );

    addXp(yields.xp);
    addCoins(yields.coins);

    if (focusSession.selectedQuestId) {
      completeQuest(focusSession.selectedQuestId);
    }

    setProfile(p => ({
      ...p,
      totalFocusMinutes: p.totalFocusMinutes + Math.round(focusSession.targetDurationSeconds / 60),
    }));

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#00e5ff', '#38bdf8', '#fbbf24', '#00e59b'],
    });

    setClaimModal({
      isOpen: true,
      title: 'Crucible Triumph!',
      subtitle: 'FOCUS SESSION COMPLETE',
      description: 'Deep work target conquered. Focus Spire upgraded to Tier 3!',
      coins: yields.coins,
      xp: yields.xp,
      icon: 'swords',
    });

    setFocusSession(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      endsAt: undefined,
      startedAt: undefined,
      pausedAt: undefined,
    }));
  }, [focusSession, addXp, addCoins, completeQuest, profile.soundEnabled]);

  const toggleManaOvercharge = useCallback(() => {
    soundEngine.playOvercharge(profile.soundEnabled);
    setFocusSession(prev => {
      const nextOvercharged = !prev.isOvercharged;
      const yields = calculateFocusYield(
        Math.round(prev.targetDurationSeconds / 60),
        nextOvercharged
      );
      return {
        ...prev,
        isOvercharged: nextOvercharged,
        accumulatedXp: yields.xp,
        accumulatedCoins: yields.coins,
      };
    });
  }, [profile.soundEnabled]);

  const setSoundscapeTrack = useCallback((track: FocusSessionState['soundscapeTrack']) => {
    setFocusSession(prev => ({ ...prev, soundscapeTrack: track }));
    if (track === 'none') {
      soundEngine.stopAmbience();
    } else {
      soundEngine.startAmbience(track);
    }
  }, []);

  // Tick timer countdown anchored to wall-clock timestamps
  useEffect(() => {
    if (!focusSession.isActive || focusSession.isPaused) return;

    const timer = setInterval(() => {
      setFocusSession(prev => {
        if (!prev.isActive || prev.isPaused) return prev;
        const remaining = calculateRemainingSeconds(prev, Date.now());
        if (remaining <= 0) {
          completeFocusSession();
          return { ...prev, remainingSeconds: 0 };
        }
        return {
          ...prev,
          remainingSeconds: remaining,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [focusSession.isActive, focusSession.isPaused, completeFocusSession]);

  // Tick unlocking chests countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setChests(prev =>
        prev.map(c => {
          if (c.status === 'unlocking' && c.unlockTimeRemainingSeconds > 0) {
            const nextSec = c.unlockTimeRemainingSeconds - 1;
            if (nextSec <= 0) {
              return {
                ...c,
                status: 'ready',
                unlockTimeRemainingSeconds: 0,
                image: '/assets/chest_ready.png',
              };
            }
            return {
              ...c,
              unlockTimeRemainingSeconds: nextSec,
            };
          }
          return c;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GameStateContext.Provider
      value={{
        activeTab,
        setActiveTab,
        profile,
        quests,
        chests,
        rewards,
        claimModal,
        focusSession,
        addXp,
        addCoins,
        addShards,
        completeQuest,
        createQuest,
        updateQuest,
        deleteQuest,
        unlockChest,
        claimChestLoot,
        redeemReward,
        createCustomReward,
        toggleSound,
        closeClaimModal,
        openCustomClaimModal,
        exportData,
        importData,
        startFocusSession,
        pauseFocusSession,
        resumeFocusSession,
        cancelFocusSession,
        completeFocusSession,
        toggleManaOvercharge,
        setSoundscapeTrack,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
