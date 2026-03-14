

export enum TaskType {
  FIXED = 'FIXED',       // Daily habits, reset daily
  FLEXIBLE = 'FLEXIBLE'  // One-off tasks, don't reset
}

export enum TaskCategory {
  LEARNING = 'Learning',
  SPORTS = 'Sports',
  CREATIVE = 'Creative',
  MINDFULNESS = 'Mindfulness',
  WORK = 'Work',
  OTHER = 'Other'
}

export enum Priority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  category: TaskCategory;
  priority: Priority;
  dueDate?: string; // YYYY-MM-DD
  isCompleted: boolean;
  createdAt: number;
  streak: number; // For fixed tasks
  lastCompletedDate?: string; // YYYY-MM-DD
  pomodoroSessions: number; // Number of sessions completed
  totalTimeSpent: number; // In minutes
}

export interface JournalEntry {
  id: string;
  date: string; // ISO String
  mood: string;
  content: string;
  generatedInsight?: string;
  completedTaskCount: number;
  totalFixedTasks: number;
  location?: string;
}

export interface Inspiration {
  id: string;
  content: string;
  createdAt: string; // ISO String
  location?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  dateEarned: string;
  type: 'CARD' | 'SCULPTURE';
  rarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}

export interface FocusSession {
  date: string; // ISO Date string
  durationMinutes: number;
  taskId?: string;
}

export interface ActiveSession {
  startTime: number; // Timestamp
  taskId: string | null; // null = freestyle
  mode: 'COUNTDOWN' | 'STOPWATCH';
  initialDurationMinutes: number; // For countdown reference
}

export enum PlanetType {
  PROTO_EARTH = 'Proto Earth',
  GREEN_GAIA = 'Green Gaia',
  AQUA_PRIME = 'Aqua Prime',
  CRIMSON_MARS = 'Crimson Mars',
  GOLDEN_CORE = 'Golden Core',
  CYBER_TRON = 'Cyber Tron'
}

export interface UserState {
  tasks: Task[];
  journalEntries: JournalEntry[];
  inspirations: Inspiration[];
  achievements: Achievement[];
  lastLoginDate: string;
  dailyQuote?: {
    text: string;
    author: string;
    date: string;
  };
  planetResources: {
    [key in TaskCategory]: number; // Tracks accumulation of resources per category
  };
  focusHistory: FocusSession[];
  unlockedPlanets: PlanetType[];
  currentPlanet: PlanetType;
}