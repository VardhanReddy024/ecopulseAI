import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Trophy, Flame, Filter, Award, Zap, Clock, ArrowRight } from "lucide-react";
import { useAppStore } from "../store/appStore";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Primitives";
import { Button } from "../components/ui/Button";
import type { Challenge } from "../types";
import { cn } from "../utils/cn";

const categories: ("all" | Challenge["category"])[] = ["all", "transport", "energy", "diet", "waste", "lifestyle"];
const difficultyColors: Record<Challenge["difficulty"], string> = {
  easy: "border-eco-500/30 bg-eco-500/10 text-eco-700 dark:text-eco-300",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  hard: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

export default function Challenges() {
  const { challenges, completeChallenge, addActivity, xp, streak, achievements } = useAppStore();
  const [filter, setFilter] = useState<"all" | Challenge["category"]>("all");
  const [tab, setTab] = useState<"active" | "completed">("active");
  const [celebrating, setCelebrating] = useState<Challenge | null>(null);

  const filtered = useMemo(() => {
    return challenges
      .filter((c) => (tab === "active" ? !c.completed : c.completed))
      .filter((c) => filter === "all" || c.category === filter)
      .sort((a, b) => b.xp - a.xp);
  }, [challenges, filter, tab]);

  const completedCount = challenges.filter((c) => c.completed).length;
  const totalXP = challenges.reduce((s, c) => s + (c.completed ? c.xp : 0), 0);

  const handleComplete = (c: Challenge) => {
    if (c.completed) return;
    completeChallenge(c.id);
    addActivity({
      date: new Date().toISOString().slice(0, 10),
      category: c.category as any,
      amount: 1,
      unit: "challenge",
      description: `Completed: ${c.title}`,
      co2: -Math.round(c.xp * 0.15),
    });
    setCelebrating(c);
    setTimeout(() => setCelebrating(null), 2400);
  };

  const unlockedAchievements = achievements.filter((a) => a.unlocked);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="info" className="mb-3" icon={<Trophy className="h-3 w-3" />}>Challenges</Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Eco challenges</h1>
          <p className="mt-2 text-[var(--text-soft)]">Build habits that compound into real climate impact.</p>
        </div>
        <div className="flex items-center gap-3">
          <Card padding="sm" hover={false} className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">{streak} day streak</span>
          </Card>
          <Card padding="sm" hover={false} className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-eco-500" />
            <span className="text-sm font-medium">{xp.toLocaleString()} XP</span>
          </Card>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card padding="md" hover={false}>
          <div className="text-xs uppercase tracking-wider text-[var(--text-mute)]">Completed</div>
          <div className="mt-1 font-display text-2xl font-bold">{completedCount} <span className="text-sm font-normal text-[var(--text-mute)]">of {challenges.length}</span></div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--bg-soft)]">
            <div className="h-full bg-gradient-to-r from-eco-500 to-aurora-500" style={{ width: `${(completedCount / challenges.length) * 100}%` }} />
          </div>
        </Card>
        <Card padding="md" hover={false}>
          <div className="text-xs uppercase tracking-wider text-[var(--text-mute)]">Total XP earned</div>
          <div className="mt-1 font-display text-2xl font-bold gradient-text">{totalXP.toLocaleString()}</div>
          <div className="mt-3 text-xs text-[var(--text-mute)]">Each challenge = XP + CO₂ saved</div>
        </Card>
        <Card padding="md" hover={false}>
          <div className="text-xs uppercase tracking-wider text-[var(--text-mute)]">Achievements</div>
          <div className="mt-1 font-display text-2xl font-bold">{unlockedAchievements.length} <span className="text-sm font-normal text-[var(--text-mute)]">unlocked</span></div>
          <div className="mt-3 flex gap-1">
            {unlockedAchievements.slice(0, 6).map((a) => (
              <div key={a.id} className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                <Award className="h-3 w-3" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-1">
          <button
            onClick={() => setTab("active")}
            className={cn("rounded-lg px-3 py-1.5 text-sm font-medium transition", tab === "active" ? "bg-eco-500 text-white" : "text-[var(--text-soft)] hover:text-[var(--text)]")}
          >
            Active ({challenges.length - completedCount})
          </button>
          <button
            onClick={() => setTab("completed")}
            className={cn("rounded-lg px-3 py-1.5 text-sm font-medium transition", tab === "completed" ? "bg-eco-500 text-white" : "text-[var(--text-soft)] hover:text-[var(--text)]")}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition",
                filter === c
                  ? "border-eco-500 bg-eco-500/10 text-eco-700 dark:text-eco-300"
                  : "border-[var(--border)] text-[var(--text-soft)] hover:border-eco-500/40"
              )}
            >
              {c !== "all" && <Filter className="h-3 w-3" />}
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 && (
          <Card padding="lg" hover={false} className="col-span-full text-center">
            <Trophy className="mx-auto h-10 w-10 text-[var(--text-mute)]" />
            <h3 className="mt-3 font-display font-semibold">No challenges here</h3>
            <p className="mt-1 text-sm text-[var(--text-soft)]">Try a different filter or category.</p>
          </Card>
        )}
        {filtered.map((c, i) => (
          <ChallengeCard key={c.id} challenge={c} index={i} onComplete={() => handleComplete(c)} />
        ))}
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="card-elev relative mx-4 max-w-md p-8 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-3xl shadow-lg shadow-amber-500/40">
                {celebrating.emoji}
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold">Challenge complete!</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">
                You earned <span className="font-semibold text-eco-600">+{celebrating.xp} XP</span> and saved approximately <span className="font-semibold text-eco-600">{Math.round(celebrating.xp * 0.15)} kg CO₂</span>.
              </p>
              <p className="mt-1 text-xs text-[var(--text-mute)]">Keep the momentum going!</p>
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 0, x: 0, opacity: 1 }}
                    animate={{ y: Math.random() * 200 - 100, x: Math.random() * 400 - 200, opacity: 0, rotate: 360 }}
                    transition={{ duration: 1.4, delay: i * 0.04 }}
                    className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                    style={{ background: ["#10b981", "#22d3ee", "#f59e0b", "#a3e635"][i % 4] }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChallengeCard({ challenge, index, onComplete }: { challenge: Challenge; index: number; onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Card hover padding="md" className={cn("h-full", challenge.completed && "opacity-70")}>
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-eco-500/10 to-aurora-500/10 text-2xl">
            {challenge.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-semibold leading-tight">{challenge.title}</h3>
              {challenge.completed && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-eco-500 text-white">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
            <p className="mt-1.5 text-sm text-[var(--text-soft)]">{challenge.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className={cn("rounded-full border px-2 py-0.5 capitalize", difficultyColors[challenge.difficulty])}>
                {challenge.difficulty}
              </span>
              <span className="flex items-center gap-1 text-[var(--text-mute)]">
                <Clock className="h-3 w-3" /> {challenge.duration}
              </span>
              <span className="text-[var(--text-mute)]">· {challenge.xp} XP</span>
            </div>
            {!challenge.completed ? (
              <Button size="sm" className="mt-4 w-full" onClick={onComplete} iconRight={<ArrowRight className="h-3 w-3" />}>
                Mark complete
              </Button>
            ) : (
              <div className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-eco-500/30 bg-eco-500/5 py-2 text-xs font-medium text-eco-700 dark:text-eco-300">
                <Check className="h-3.5 w-3.5" /> Completed
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
