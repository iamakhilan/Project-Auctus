import { Quest, QuestCategory, QuestDifficulty, QuestTag } from '../types';

export interface QuestTemplate {
  title: string;
  description: string;
  category: QuestCategory;
  tag: QuestTag;
  baseXp: number;
  baseCoins: number;
  estimatedMinutes: number;
  difficulty: QuestDifficulty;
}

export const QUEST_TEMPLATES: QuestTemplate[] = [
  {
    title: 'Code Refactoring Sprint',
    description: 'Simplify complex functions and improve test coverage.',
    category: 'bounty',
    tag: 'Coding',
    baseXp: 120,
    baseCoins: 60,
    estimatedMinutes: 45,
    difficulty: 'hard',
  },
  {
    title: 'Technical Documentation Sync',
    description: 'Document architectural patterns and update README guidelines.',
    category: 'daily',
    tag: 'Study',
    baseXp: 75,
    baseCoins: 35,
    estimatedMinutes: 25,
    difficulty: 'normal',
  },
  {
    title: 'High-Intensity Mobility Flow',
    description: 'Execute full-body stretching and posture reset exercises.',
    category: 'daily',
    tag: 'Fitness',
    baseXp: 80,
    baseCoins: 40,
    estimatedMinutes: 30,
    difficulty: 'normal',
  },
  {
    title: 'Architecture Blueprint Review',
    description: 'Analyze system telemetry and optimize bottleneck subsystems.',
    category: 'epic',
    tag: 'Work',
    baseXp: 260,
    baseCoins: 140,
    estimatedMinutes: 60,
    difficulty: 'elite',
  },
  {
    title: 'Deep Mind Journaling',
    description: 'Perform evening mental debrief and plan upcoming sprint objectives.',
    category: 'daily',
    tag: 'Personal',
    baseXp: 50,
    baseCoins: 25,
    estimatedMinutes: 15,
    difficulty: 'normal',
  },
];

export const getQuestDifficultyMultiplier = (difficulty?: QuestDifficulty): number => {
  switch (difficulty) {
    case 'elite':
      return 1.75;
    case 'hard':
      return 1.35;
    case 'normal':
    default:
      return 1.0;
  }
};

export const generateDailyMissions = (count: number = 3): Quest[] => {
  const shuffled = [...QUEST_TEMPLATES].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(count, QUEST_TEMPLATES.length));

  return selected.map((template, index) => {
    const mult = getQuestDifficultyMultiplier(template.difficulty);
    return {
      id: `gen-quest-${Date.now()}-${index}`,
      title: template.title,
      description: template.description,
      category: template.category,
      tag: template.tag,
      difficulty: template.difficulty,
      xpReward: Math.round(template.baseXp * mult),
      coinsReward: Math.round(template.baseCoins * mult),
      isCompleted: false,
      dueLabel: template.category === 'daily' ? 'Today' : 'Active',
      estimatedMinutes: template.estimatedMinutes,
    };
  });
};
