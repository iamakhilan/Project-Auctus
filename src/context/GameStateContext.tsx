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
  loadProfile,
  saveProfile,
  loadQuests,
  saveQuests,
  loadChests,
  saveChests,
  loadRewards,
  saveRewards,
} from '../utils/storage';
import { soundEngine } from '../utils/audioSynthesizer';
import confetti from 'canvas-confetti';
import { calculateLevelProgression } from '../domain/progression';
import { createQuestEntity, completeQuestEntity } from '../domain/quests';
import { validateRedemption, deductCoins, createCustomRewardEntity } from '../domain/economy';
import { createChestSlotEntity, rollChestTier, createEmptyChestSlot } from '../domain/chests';

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
  createQuest: (title: string, tier: 'Tier I' | 'Tier II' | 'Tier III', dueLabel?: string) => void;
  unlockChest: (slotIndex: number) => void;
  claimChestLoot: (slotIndex: number) => void;
  redeemReward: (rewardId: string) => boolean;
  createCustomReward: (title: string, cost: number, category: string, icon: string) => void;
  toggleSound: () => void;
  closeClaimModal: () => void;
  openCustomClaimModal: (data: Partial<ClaimModalData>) => void;
  
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
  const [profile, setProfile] = useState<PlayerProfile>(loadProfile);
  const [quests, setQuests] = useState<Quest[]>(loadQuests);
  const [chests, setChests] = useState<ChestSlot[]>(loadChests);
  const [rewards, setRewards] = useState<RewardItem[]>(loadRewards);

  const [claimModal, setClaimModal] = useState<ClaimModalData>({
    isOpen: false,
    title: '',
    subtitle: '',
    description: '',
  });

  const [focusSession, setFocusSession] = useState<FocusSessionState>({
    isActive: false,
    isPaused: false,
    targetDurationSeconds: 1500, // 25 min default
    remainingSeconds: 1500,
    accumulatedXp: 85,
    accumulatedCoins: 15,
    isOvercharged: false,
    soundscapeTrack: 'binaural',
  });

  // Save changes to storage
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveQuests(quests);
  }, [quests]);

  useEffect(() => {
    saveChests(chests);
  }, [chests]);

  useEffect(() => {
    saveRewards(rewards);
  }, [rewards]);

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
    title: string,
    tier: 'Tier I' | 'Tier II' | 'Tier III',
    dueLabel = 'Today'
  ) => {
    const newQuest = createQuestEntity({
      title,
      tier,
      dueLabel,
    });

    soundEngine.playClick(profile.soundEnabled);
    setQuests(prev => [newQuest, ...prev]);
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

  // Focus Arena Timer Management
  const startFocusSession = useCallback((
    durationMinutes = 25,
    questId?: string,
    questTitle?: string
  ) => {
    soundEngine.playClick(profile.soundEnabled);
    setFocusSession({
      isActive: true,
      isPaused: false,
      targetDurationSeconds: durationMinutes * 60,
      remainingSeconds: durationMinutes * 60,
      accumulatedXp: 85,
      accumulatedCoins: 15,
      selectedQuestId: questId,
      selectedQuestTitle: questTitle || 'Deep Work: Strategy Sprint',
      isOvercharged: false,
      soundscapeTrack: 'binaural',
    });

    soundEngine.startAmbience('binaural');
    setActiveTabState('focus-arena');
  }, [profile.soundEnabled]);

  const pauseFocusSession = useCallback(() => {
    soundEngine.playClick(profile.soundEnabled);
    setFocusSession(prev => {
      const next = !prev.isPaused;
      if (next) {
        soundEngine.stopAmbience();
      } else if (prev.soundscapeTrack !== 'none') {
        soundEngine.startAmbience(prev.soundscapeTrack);
      }
      return { ...prev, isPaused: next };
    });
  }, [profile.soundEnabled]);

  const resumeFocusSession = useCallback(() => {
    soundEngine.playClick(profile.soundEnabled);
    setFocusSession(prev => {
      if (prev.soundscapeTrack !== 'none') {
        soundEngine.startAmbience(prev.soundscapeTrack);
      }
      return { ...prev, isPaused: false };
    });
  }, [profile.soundEnabled]);

  const cancelFocusSession = useCallback(() => {
    soundEngine.stopAmbience();
    soundEngine.playClick(profile.soundEnabled);
    setFocusSession(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
    }));
    setActiveTabState('realm');
  }, [profile.soundEnabled]);

  const completeFocusSession = useCallback(() => {
    soundEngine.stopAmbience();
    soundEngine.playQuestComplete(profile.soundEnabled);

    const xpEarned = focusSession.isOvercharged ? 180 : 120;
    const coinsEarned = focusSession.isOvercharged ? 25 : 15;

    addXp(xpEarned);
    addCoins(coinsEarned);

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
      coins: coinsEarned,
      xp: xpEarned,
      icon: 'swords',
    });

    setFocusSession(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
    }));
  }, [focusSession, addXp, addCoins, completeQuest, profile.soundEnabled]);

  const toggleManaOvercharge = useCallback(() => {
    soundEngine.playOvercharge(profile.soundEnabled);
    setFocusSession(prev => ({
      ...prev,
      isOvercharged: !prev.isOvercharged,
      accumulatedXp: prev.isOvercharged ? 85 : 140,
    }));
  }, [profile.soundEnabled]);

  const setSoundscapeTrack = useCallback((track: FocusSessionState['soundscapeTrack']) => {
    setFocusSession(prev => ({ ...prev, soundscapeTrack: track }));
    if (track === 'none') {
      soundEngine.stopAmbience();
    } else {
      soundEngine.startAmbience(track);
    }
  }, []);

  // Tick timer countdown
  useEffect(() => {
    if (!focusSession.isActive || focusSession.isPaused) return;

    const timer = setInterval(() => {
      setFocusSession(prev => {
        if (prev.remainingSeconds <= 1) {
          completeFocusSession();
          return { ...prev, remainingSeconds: 0 };
        }
        return {
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1,
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
        unlockChest,
        claimChestLoot,
        redeemReward,
        createCustomReward,
        toggleSound,
        closeClaimModal,
        openCustomClaimModal,
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
