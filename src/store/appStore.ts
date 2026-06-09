import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  User,
  FootprintInput,
  FootprintResult,
  Challenge,
  Achievement,
  Goal,
  ActivityEntry,
  ChatMessage,
  Theme,
} from "../types";
import { calculateFootprint } from "../services/carbonEngine";

interface AppState {
  // Auth
  user: User | null;
  setUser: (u: User | null) => void;

  // Theme
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;

  // Onboarding
  hasOnboarded: boolean;
  setOnboarded: (v: boolean) => void;

  // Footprint
  footprintInput: FootprintInput | null;
  footprintResult: FootprintResult | null;
  setFootprint: (input: FootprintInput) => void;
  updateFootprintInput: (patch: Partial<FootprintInput>) => void;

  // Gamification
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  addXp: (n: number) => void;
  bumpStreak: () => void;

  // Challenges
  challenges: Challenge[];
  completeChallenge: (id: string) => void;

  // Achievements
  achievements: Achievement[];

  // Goals
  goals: Goal[];
  addGoal: (g: Omit<Goal, "id" | "createdAt" | "milestones">) => void;
  updateGoalProgress: (id: string, currentReduction: number) => void;

  // Activity log
  activities: ActivityEntry[];
  addActivity: (a: Omit<ActivityEntry, "id">) => void;

  // Chat history
  chatHistory: ChatMessage[];
  addChatMessage: (m: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearChat: () => void;

  // Demo
  loadDemoData: () => void;
  resetAll: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

const defaultChallenges: Challenge[] = [
  { id: "c1", title: "No-Plastic Day", description: "Avoid all single-use plastics for 24 hours", category: "waste", xp: 50, duration: "1 day", difficulty: "easy", emoji: "🥤" },
  { id: "c2", title: "Walk or Bike It", description: "Skip motorized transport for all trips under 3 km today", category: "transport", xp: 75, duration: "1 day", difficulty: "easy", emoji: "🚲" },
  { id: "c3", title: "Lights-Out Hour", description: "Turn off all non-essential electronics for one full hour", category: "energy", xp: 40, duration: "1 hour", difficulty: "easy", emoji: "💡" },
  { id: "c4", title: "Plant-Based Plate", description: "Eat 100% plant-based meals for an entire day", category: "diet", xp: 90, duration: "1 day", difficulty: "medium", emoji: "🥗" },
  { id: "c5", title: "Reusable Week", description: "Use only reusables (bags, bottles, cups) for 7 days straight", category: "lifestyle", xp: 200, duration: "7 days", difficulty: "hard", emoji: "♻️" },
  { id: "c6", title: "Cold Laundry Week", description: "Wash all clothes in cold water for a week", category: "energy", xp: 120, duration: "7 days", difficulty: "medium", emoji: "🧺" },
  { id: "c7", title: "Zero Food Waste", description: "Plan, store, and use every scrap — no thrown-out food today", category: "diet", xp: 60, duration: "1 day", difficulty: "medium", emoji: "🍎" },
  { id: "c8", title: "Public Transit Hero", description: "Use public transport for every trip today", category: "transport", xp: 80, duration: "1 day", difficulty: "medium", emoji: "🚌" },
  { id: "c9", title: "Unplug Standby", description: "Unplug every device and appliance on standby", category: "energy", xp: 35, duration: "20 min", difficulty: "easy", emoji: "🔌" },
  { id: "c10", title: "Repair, Don't Replace", description: "Fix something broken instead of throwing it away", category: "lifestyle", xp: 100, duration: "1 task", difficulty: "hard", emoji: "🔧" },
];

const defaultAchievements: Achievement[] = [
  { id: "a1", title: "First Footprint", description: "Calculate your first carbon footprint", icon: "Sparkles", unlocked: false, progress: 0, target: 1, rarity: "common" },
  { id: "a2", title: "Streak Starter", description: "Hit a 3-day activity streak", icon: "Flame", unlocked: false, progress: 0, target: 3, rarity: "common" },
  { id: "a3", title: "Eco Warrior", description: "Complete 5 challenges", icon: "Trophy", unlocked: false, progress: 0, target: 5, rarity: "rare" },
  { id: "a4", title: "Reduction Rookie", description: "Reduce monthly emissions by 10%", icon: "TrendingDown", unlocked: false, progress: 0, target: 10, rarity: "common" },
  { id: "a5", title: "Century Club", description: "Earn 100 XP", icon: "Award", unlocked: false, progress: 0, target: 100, rarity: "rare" },
  { id: "a6", title: "Tree Hugger", description: "Offset the equivalent of 1 tree for a year", icon: "TreePine", unlocked: false, progress: 0, target: 1, rarity: "epic" },
  { id: "a7", title: "Consistency King", description: "Maintain a 30-day streak", icon: "Crown", unlocked: false, progress: 0, target: 30, rarity: "legendary" },
  { id: "a8", title: "Knowledge Seeker", description: "Ask Pulse 10 questions", icon: "MessageCircle", unlocked: false, progress: 0, target: 10, rarity: "common" },
];

const sampleInput: FootprintInput = {
  transport: { primary: "car", weeklyKm: 180, flightHours: 6 },
  electricity: { monthlyKwh: 280, renewable: false },
  diet: "mixed",
  shopping: { fashion: "medium", electronics: "medium", general: "medium" },
  waste: { plasticLevel: "medium", recycles: true },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),

      theme: "dark",
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
      setTheme: (theme) => set({ theme }),

      hasOnboarded: false,
      setOnboarded: (hasOnboarded) => set({ hasOnboarded }),

      footprintInput: null,
      footprintResult: null,
      setFootprint: (input) => {
        const result = calculateFootprint(input);
        set({ footprintInput: input, footprintResult: result });
        // Update achievement progress
        const achievements = get().achievements.map((a) =>
          a.id === "a1" ? { ...a, progress: 1, unlocked: true } : a
        );
        set({ achievements });
      },
      updateFootprintInput: (patch) => {
        const current = get().footprintInput;
        if (!current) return;
        const merged = { ...current, ...patch };
        get().setFootprint(merged);
      },

      xp: 0,
      streak: 0,
      lastActiveDate: null,
      addXp: (n) => {
        const newXp = get().xp + n;
        const achievements = get().achievements.map((a) => {
          if (a.id === "a5" && newXp >= a.target) return { ...a, progress: a.target, unlocked: true };
          if (a.id === "a5") return { ...a, progress: newXp };
          return a;
        });
        set({ xp: newXp, achievements });
      },
      bumpStreak: () => {
        const t = today();
        const last = get().lastActiveDate;
        if (last === t) return;
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const newStreak = last === yesterday ? get().streak + 1 : 1;
        const achievements = get().achievements.map((a) => {
          if (a.id === "a2" && newStreak >= a.target) return { ...a, progress: a.target, unlocked: true };
          if (a.id === "a2") return { ...a, progress: newStreak };
          if (a.id === "a7" && newStreak >= a.target) return { ...a, progress: a.target, unlocked: true };
          if (a.id === "a7") return { ...a, progress: newStreak };
          return a;
        });
        set({ streak: newStreak, lastActiveDate: t, achievements });
      },

      challenges: defaultChallenges,
      completeChallenge: (id) => {
        const challenges = get().challenges.map((c) => (c.id === id ? { ...c, completed: true } : c));
        const challenge = get().challenges.find((c) => c.id === id);
        if (challenge && !challenge.completed) {
          get().addXp(challenge.xp);
          get().bumpStreak();
        }
        const completedCount = challenges.filter((c) => c.completed).length;
        const achievements = get().achievements.map((a) => {
          if (a.id === "a3" && completedCount >= a.target) return { ...a, progress: a.target, unlocked: true };
          if (a.id === "a3") return { ...a, progress: completedCount };
          return a;
        });
        set({ challenges, achievements });
      },

      achievements: defaultAchievements,

      goals: [],
      addGoal: (g) => {
        const milestones = [
          { value: Math.round(g.targetReduction * 0.25), label: "Quarter way", reached: false },
          { value: Math.round(g.targetReduction * 0.5), label: "Halfway there", reached: false },
          { value: Math.round(g.targetReduction * 0.75), label: "75% complete", reached: false },
          { value: g.targetReduction, label: "Goal achieved!", reached: false },
        ];
        const goal: Goal = {
          ...g,
          id: `goal-${Date.now()}`,
          createdAt: Date.now(),
          milestones,
        };
        set({ goals: [...get().goals, goal] });
      },
      updateGoalProgress: (id, currentReduction) => {
        const goals = get().goals.map((g) => {
          if (g.id !== id) return g;
          const milestones = g.milestones.map((m) => ({
            ...m,
            reached: currentReduction >= m.value,
          }));
          return { ...g, currentReduction, milestones };
        });
        set({ goals });
      },

      activities: [],
      addActivity: (a) => {
        const activity: ActivityEntry = { ...a, id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
        set({ activities: [activity, ...get().activities].slice(0, 100) });
      },

      chatHistory: [],
      addChatMessage: (m) => {
        const msg: ChatMessage = { ...m, id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, timestamp: Date.now() };
        set({ chatHistory: [...get().chatHistory, msg].slice(-50) });
        // Update Pulse achievement
        const userMsgCount = get().chatHistory.filter((c) => c.role === "user").length + (m.role === "user" ? 1 : 0);
        const achievements = get().achievements.map((a) => {
          if (a.id === "a8" && userMsgCount >= a.target) return { ...a, progress: a.target, unlocked: true };
          if (a.id === "a8") return { ...a, progress: userMsgCount };
          return a;
        });
        set({ achievements });
      },
      clearChat: () => set({ chatHistory: [] }),

      loadDemoData: () => {
        const result = calculateFootprint(sampleInput);
        const baseDate = Date.now();
        const activities: ActivityEntry[] = [
          { id: "a1", date: new Date(baseDate - 6 * 86400000).toISOString().slice(0, 10), category: "transport", amount: 12, unit: "km", description: "Bike to work", co2: 0 },
          { id: "a2", date: new Date(baseDate - 5 * 86400000).toISOString().slice(0, 10), category: "energy", amount: 8, unit: "kWh saved", description: "LED swap completed", co2: -3.4 },
          { id: "a3", date: new Date(baseDate - 4 * 86400000).toISOString().slice(0, 10), category: "diet", amount: 1, unit: "day", description: "Plant-based day", co2: -5.5 },
          { id: "a4", date: new Date(baseDate - 3 * 86400000).toISOString().slice(0, 10), category: "transport", amount: 25, unit: "km", description: "Public transit", co2: 2.2 },
          { id: "a5", date: new Date(baseDate - 2 * 86400000).toISOString().slice(0, 10), category: "waste", amount: 2, unit: "kg", description: "Recycling sorted", co2: -1.1 },
          { id: "a6", date: new Date(baseDate - 1 * 86400000).toISOString().slice(0, 10), category: "shopping", amount: 1, unit: "item", description: "Refurb laptop instead of new", co2: -70 },
          { id: "a7", date: today(), category: "energy", amount: 1, unit: "hour", description: "Lights-out challenge", co2: -0.4 },
        ];
        set({
          footprintInput: sampleInput,
          footprintResult: result,
          xp: 320,
          streak: 7,
          lastActiveDate: today(),
          activities,
          goals: [
            {
              id: "g1",
              title: "Cut monthly footprint by 20%",
              targetReduction: 20,
              currentReduction: 12,
              deadline: new Date(baseDate + 60 * 86400000).toISOString().slice(0, 10),
              createdAt: baseDate - 14 * 86400000,
              milestones: [
                { value: 5, label: "Quarter way", reached: true },
                { value: 10, label: "Halfway there", reached: true },
                { value: 15, label: "75% complete", reached: false },
                { value: 20, label: "Goal achieved!", reached: false },
              ],
            },
          ],
        });
      },

      resetAll: () => {
        localStorage.removeItem("ecopulse-storage");
        window.location.reload();
      },
    }),
    {
      name: "ecopulse-storage",
      partialize: (s) => ({
        user: s.user,
        theme: s.theme,
        hasOnboarded: s.hasOnboarded,
        footprintInput: s.footprintInput,
        xp: s.xp,
        streak: s.streak,
        lastActiveDate: s.lastActiveDate,
        challenges: s.challenges,
        achievements: s.achievements,
        goals: s.goals,
        activities: s.activities,
        chatHistory: s.chatHistory,
      }),
    }
  )
);
