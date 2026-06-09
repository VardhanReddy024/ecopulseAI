import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, decimals = 1): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(decimals)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(decimals)}k`;
  return value.toFixed(decimals);
}

export function formatCO2(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(2)} t`;
  return `${kg.toFixed(0)} kg`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getEcoRating(score: number): {
  label: string;
  color: string;
  gradient: string;
  description: string;
} {
  if (score < 200) return {
    label: "Eco Champion",
    color: "#10b981",
    gradient: "from-emerald-400 to-green-600",
    description: "Outstanding — your footprint is well below average."
  };
  if (score < 400) return {
    label: "Conscious",
    color: "#22d3ee",
    gradient: "from-cyan-400 to-emerald-500",
    description: "Great work — you live sustainably and could do even more."
  };
  if (score < 700) return {
    label: "Average",
    color: "#f59e0b",
    gradient: "from-amber-400 to-orange-500",
    description: "You're at the global mean — meaningful reductions are within reach."
  };
  if (score < 1000) return {
    label: "High Impact",
    color: "#f97316",
    gradient: "from-orange-500 to-red-500",
    description: "Your footprint is above average — small changes will add up fast."
  };
  return {
    label: "Critical",
    color: "#ef4444",
    gradient: "from-red-500 to-rose-600",
    description: "Your footprint is significantly above the sustainable threshold."
  };
}
