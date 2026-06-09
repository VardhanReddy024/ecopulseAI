import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, Trophy, Calendar, Check, Sparkles, PartyPopper, TrendingDown } from "lucide-react";
import { useAppStore } from "../store/appStore";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Primitives";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Primitives";
import { cn } from "../utils/cn";

export default function Goals() {
  const { goals, addGoal, updateGoalProgress } = useAppStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Cut my monthly footprint by 25%");
  const [target, setTarget] = useState(20);
  const [days, setDays] = useState(60);
  const [celebrate, setCelebrate] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const deadline = new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
    addGoal({ title, targetReduction: target, deadline, currentReduction: 0 });
    setOpen(false);
    setTitle("Cut my monthly footprint by 25%");
    setTarget(20);
    setDays(60);
  };

  const handleProgress = (id: string, current: number) => {
    updateGoalProgress(id, current);
    if (current >= goals.find((g) => g.id === id)!.targetReduction) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 3000);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="info" className="mb-3" icon={<Target className="h-3 w-3" />}>Goals</Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Reduction goals</h1>
          <p className="mt-2 text-[var(--text-soft)]">Set targets, hit milestones, celebrate progress.</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>New goal</Button>
      </div>

      {goals.length === 0 ? (
        <Card padding="lg" hover={false} className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-eco-500/10">
            <Target className="h-7 w-7 text-eco-600" />
          </div>
          <h3 className="mt-4 font-display text-xl font-semibold">Set your first goal</h3>
          <p className="mt-2 text-sm text-[var(--text-soft)]">Goals turn abstract ambitions into trackable outcomes.</p>
          <Button className="mt-5" onClick={() => setOpen(true)} icon={<Plus className="h-4 w-4" />}>Create goal</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {goals.map((g) => {
            const progress = Math.min(100, (g.currentReduction / g.targetReduction) * 100);
            const daysLeft = Math.max(0, Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000));
            return (
              <Card key={g.id} padding="lg" hover={false}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-eco-500 to-aurora-500 text-white shadow-lg">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold">{g.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[var(--text-mute)]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {daysLeft} days left
                        </span>
                        <span>· {g.currentReduction}% / {g.targetReduction}%</span>
                        <Badge variant={progress >= 100 ? "success" : "info"}>
                          {progress >= 100 ? "Achieved!" : "In progress"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleProgress(g.id, g.currentReduction + 2)} icon={<TrendingDown className="h-3.5 w-3.5" />}>
                      +2%
                    </Button>
                    <Button size="sm" onClick={() => handleProgress(g.id, g.targetReduction)} icon={<Check className="h-3.5 w-3.5" />}>
                      Mark complete
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-baseline justify-between text-sm">
                    <span className="font-medium">{Math.round(progress)}% complete</span>
                    <span className="text-[var(--text-mute)]">{g.targetReduction - g.currentReduction}% to go</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-soft)]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-eco-500 to-aurora-500"
                    />
                  </div>
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-4">
                  {g.milestones.map((m, i) => (
                    <div key={i} className={cn(
                      "rounded-lg border p-3 text-center transition",
                      m.reached
                        ? "border-eco-500/30 bg-eco-500/10"
                        : "border-[var(--border)] bg-[var(--bg-soft)]/40"
                    )}>
                      <div className="flex items-center justify-center">
                        {m.reached ? (
                          <Trophy className="h-4 w-4 text-amber-500" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-[var(--text-mute)]" />
                        )}
                      </div>
                      <div className="mt-1.5 text-xs font-medium">{m.label}</div>
                      <div className="mt-0.5 text-[10px] text-[var(--text-mute)]">{m.value}%</div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tips */}
      <Card padding="md" hover={false} className="mt-8">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 text-eco-600" />
          <div>
            <h3 className="font-display font-semibold">Pro tip: SMART goals</h3>
            <p className="mt-1 text-sm text-[var(--text-soft)]">
              Specific, Measurable, Achievable, Relevant, Time-bound. "Cut monthly CO₂ by 20% in 60 days" beats "Reduce my footprint". Pulse's recommendations work best when paired with a clear goal.
            </p>
          </div>
        </div>
      </Card>

      {/* New Goal Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Create reduction goal" size="md">
        <form onSubmit={handleAdd} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Goal name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              required
              placeholder="e.g., Cut transport emissions by 30%"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Target reduction: <span className="text-eco-600">{target}%</span></label>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="w-full accent-eco-500"
            />
            <div className="mt-1 flex justify-between text-xs text-[var(--text-mute)]"><span>5%</span><span>50%</span></div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Timeframe: <span className="text-eco-600">{days} days</span></label>
            <input
              type="range"
              min={7}
              max={365}
              step={1}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full accent-eco-500"
            />
            <div className="mt-1 flex justify-between text-xs text-[var(--text-mute)]"><span>1 week</span><span>1 year</span></div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" icon={<Target className="h-4 w-4" />}>Create goal</Button>
          </div>
        </form>
      </Modal>

      {/* Celebration */}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              className="card-elev mx-4 max-w-md p-8 text-center"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-2xl shadow-amber-500/40">
                <PartyPopper className="h-10 w-10 text-white" />
              </div>
              <h3 className="mt-4 font-display text-3xl font-bold gradient-text">Goal achieved!</h3>
              <p className="mt-2 text-[var(--text-soft)]">You crushed it. Time to set an even bigger one.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
