export type Theme = "light" | "dark";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: number;
}

export type TransportMode = "bike" | "car" | "public" | "flights";
export type DietType = "vegan" | "vegetarian" | "mixed" | "meat-heavy";
export type ShoppingLevel = "low" | "medium" | "high";

export interface FootprintInput {
  transport: {
    primary: TransportMode;
    weeklyKm: number;
    flightHours: number;
  };
  electricity: {
    monthlyKwh: number;
    renewable: boolean;
  };
  diet: DietType;
  shopping: {
    fashion: ShoppingLevel;
    electronics: ShoppingLevel;
    general: ShoppingLevel;
  };
  waste: {
    plasticLevel: ShoppingLevel;
    recycles: boolean;
  };
}

export interface FootprintResult {
  monthly: number;
  annual: number;
  breakdown: {
    transport: number;
    electricity: number;
    diet: number;
    shopping: number;
    waste: number;
  };
  rating: ReturnType<typeof import("../utils/cn").getEcoRating> | {
    label: string;
    color: string;
    gradient: string;
    description: string;
  };
  treesNeeded: number;
  vsAverage: number;
}

export interface Recommendation {
  id: string;
  category: "transport" | "energy" | "diet" | "shopping" | "waste";
  title: string;
  description: string;
  impact: number;
  effort: "low" | "medium" | "high";
  timeframe: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: "transport" | "energy" | "diet" | "waste" | "lifestyle";
  xp: number;
  duration: string;
  difficulty: "easy" | "medium" | "hard";
  emoji: string;
  completed?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Goal {
  id: string;
  title: string;
  targetReduction: number;
  deadline: string;
  currentReduction: number;
  createdAt: number;
  milestones: { value: number; label: string; reached: boolean }[];
}

export interface ActivityEntry {
  id: string;
  date: string;
  category: "transport" | "energy" | "diet" | "shopping" | "waste";
  amount: number;
  unit: string;
  description: string;
  co2: number;
}
