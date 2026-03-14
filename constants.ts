
import { TaskCategory, TaskType, UserState, Priority, PlanetType } from "./types";

export const INITIAL_STATE: UserState = {
  tasks: [
    {
      id: '1',
      title: 'Morning Meditation (10m)',
      type: TaskType.FIXED,
      category: TaskCategory.MINDFULNESS,
      priority: Priority.HIGH,
      isCompleted: false,
      createdAt: Date.now(),
      streak: 0,
      pomodoroSessions: 0,
      totalTimeSpent: 0
    },
    {
      id: '2',
      title: 'Read Technical Book',
      type: TaskType.FIXED,
      category: TaskCategory.LEARNING,
      priority: Priority.MEDIUM,
      isCompleted: false,
      createdAt: Date.now(),
      streak: 0,
      pomodoroSessions: 0,
      totalTimeSpent: 0
    }
  ],
  journalEntries: [],
  inspirations: [],
  achievements: [],
  lastLoginDate: new Date().toISOString().split('T')[0],
  planetResources: {
    [TaskCategory.LEARNING]: 0,
    [TaskCategory.SPORTS]: 0,
    [TaskCategory.CREATIVE]: 0,
    [TaskCategory.MINDFULNESS]: 0,
    [TaskCategory.WORK]: 0,
    [TaskCategory.OTHER]: 0,
  },
  focusHistory: [],
  unlockedPlanets: [PlanetType.PROTO_EARTH],
  currentPlanet: PlanetType.PROTO_EARTH
};

// Soft Earth Tone Moods
export const MOODS = [
  { label: 'Happy', emoji: '😄', color: 'bg-banana-light' },
  { label: 'Calm', emoji: '😌', color: 'bg-emerald-100' },
  { label: 'Stressed', emoji: '🤯', color: 'bg-rose-100' },
  { label: 'Tired', emoji: '😴', color: 'bg-stone-200' },
  { label: 'Sad', emoji: '😔', color: 'bg-indigo-100' },
];

export const CATEGORY_ICONS: Record<TaskCategory, string> = {
    [TaskCategory.LEARNING]: '📚',
    [TaskCategory.SPORTS]: '🏃',
    [TaskCategory.CREATIVE]: '🎨',
    [TaskCategory.MINDFULNESS]: '🧘',
    [TaskCategory.WORK]: '💼',
    [TaskCategory.OTHER]: '✨',
};

// Minimalist Priority Colors (Subtle backgrounds)
export const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.HIGH]: 'text-rose-700 bg-rose-50 border-rose-100',
  [Priority.MEDIUM]: 'text-amber-700 bg-amber-50 border-amber-100',
  [Priority.LOW]: 'text-stone-500 bg-stone-100 border-stone-200',
};

export const PLANET_TIERS = [
  { type: PlanetType.PROTO_EARTH, reqTasks: 0, reqFocus: 0, desc: "A humble beginning." },
  { type: PlanetType.GREEN_GAIA, reqTasks: 10, reqFocus: 60, desc: "Life begins to bloom." },
  { type: PlanetType.AQUA_PRIME, reqTasks: 25, reqFocus: 180, desc: "Oceans of knowledge." },
  { type: PlanetType.CRIMSON_MARS, reqTasks: 50, reqFocus: 400, desc: "Forged in discipline." },
  { type: PlanetType.GOLDEN_CORE, reqTasks: 100, reqFocus: 1000, desc: "A shining beacon of success." },
  { type: PlanetType.CYBER_TRON, reqTasks: 200, reqFocus: 2500, desc: "The future is yours." },
];