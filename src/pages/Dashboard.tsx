import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import {
  TrendingDown, TrendingUp, Leaf, Flame, Trophy, Sparkles, Calculator, Target,
  ArrowUpRight, Trees, Award, Zap, Activity, Lightbulb
} from "lucide-react";
import { useAppStore } from "../store/appStore";
import { Card, CardHeader } from "../components/ui/Card";
import { Badge, ProgressRing } from "../components/ui/Primitives";
import { Button } from "../components/ui/Button";
import { formatCO2 } from "../utils/cn";

const tooltipStyle = {
  backgroundColor: "var(--bg-elev)",
  border: "1px solid var(--border)",
  borderRadius: "0.625rem",
  fontSize: "0.75rem",
  padding: "0.5rem 0.75rem",
};

const categoryColors: Record<string, string> = {
  transport: "#10b981",
  electricity: "#22d3ee",
  diet: "#a3e635",
  shopping: "#f59e0b",
  waste: "#f97316",
};

export default function Dashboard() {
  const { footprintResult, footprintInput, xp, streak, achievements, challenges, activities, goals, user, loadDemoData } = useAppStore();

  const hasData = footprintResult && footprintInput;

  // Trend data: synthesize from current result over 8 weeks
  const trendData = useMemo(() => {
    if (!footprintResult) return [];
    const base = footprintResult.monthly / 4.33; // weekly
    return Array.from({ length: 8 }, (_, i) => {
      const reduction = Math.max(0, 1 - i * 0.025 - Math.random() * 0.04);
      return {
        week: `W${i + 1}`,
        emissions: Math.round(base * reduction * 10) / 10,
        target: Math.round(base * 0.7 * 10) / 10,
      };
    });
  }, [footprintResult]);

  const categoryData = useMemo(() => {
    if (!footprintResult) return [];
    return Object.entries(footprintResult.breakdown)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => ({ name: k, value: v, color: categoryColors[k] }));
  }, [footprintResult]);

  const monthlyBarData = useMemo(() => {
    return [
      { m: "Jan", v: 380 }, { m: "Feb", v: 365 }, { m: "Mar", v: 392 },
      { m: "Apr", v: 348 }, { m: "May", v: 332 }, { m: "Jun", v: 318 },
      { m: "Jul", v: footprintResult?.monthly ?? 0 },
    ];
  }, [footprintResult]);

  const earnedBadges = achievements.filter((a) => a.unlocked).length;
  const completedChallenges = challenges.filter((c) => c.completed).length;
  const activeGoal = goals[0];
  const goalProgress = activeGoal ? Math.min(100, (activeGoal.currentReduction / activeGoal.targetReduction) * 100) : 0;

  if (!hasData) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState onLoadDemo={loadDemoData} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-[var(--text-mute)]">Welcome back{user ? `, ${user.displayName.split(" ")[0]}` : ""}</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">Your dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/calculator">
            <Button variant="secondary" icon={<Calculator className="h-4 w-4" />}>Recalculate</Button>
          </Link>
          <Link to="/insights">
            <Button icon={<Sparkles className="h-4 w-4" />}>AI Insights</Button>
          </Link>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Leaf className="h-5 w-5" />}
          label="Monthly CO₂"
          value={`${footprintResult.monthly} kg`}
          change={-12}
          changeLabel="vs last month"
          accent="from-eco-500 to-emerald-600"
        />
        <StatCard
          icon={<Trees className="h-5 w-5" />}
          label="Annual estimate"
          value={formatCO2(footprintResult.annual)}
          change={-12}
          changeLabel="trending down"
          accent="from-aurora-500 to-cyan-600"
        />
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="Streak"
          value={`${streak} days`}
          changeLabel="Keep it going"
          accent="from-amber-500 to-orange-600"
        />
        <StatCard
          icon={<Award className="h-5 w-5" />}
          label="XP earned"
          value={xp.toLocaleString()}
          changeLabel={`${earnedBadges} badges`}
          accent="from-indigo-500 to-purple-600"
        />
      </div>

      {/* Charts row */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card padding="md" hover={false} className="lg:col-span-2">
          <CardHeader
            title="Weekly emissions"
            subtitle="Last 8 weeks · kg CO₂"
            icon={<Activity className="h-5 w-5" />}
            action={<Badge variant="success" icon={<TrendingDown className="h-3 w-3" />}>18% drop</Badge>}
          />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ left: -8, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="g-em" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g-tg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" stroke="var(--text-mute)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-mute)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--border)" }} />
                <Area type="monotone" dataKey="emissions" stroke="#10b981" strokeWidth={2.5} fill="url(#g-em)" />
                <Area type="monotone" dataKey="target" stroke="#22d3ee" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#g-tg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="md" hover={false}>
          <CardHeader title="Category breakdown" subtitle="Monthly CO₂ by source" icon={<Lightbulb className="h-5 w-5" />} />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {categoryData.map((d, i) => <Cell key={i} fill={d.color} stroke="var(--bg-elev)" strokeWidth={2} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-1.5">
            {categoryData.sort((a, b) => b.value - a.value).map((c) => {
              const pct = Math.round((c.value / footprintResult.monthly) * 100);
              return (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                    <span className="capitalize text-[var(--text-soft)]">{c.name}</span>
                  </div>
                  <span className="font-medium">{c.value} kg · {pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Secondary row */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card padding="md" hover={false}>
          <CardHeader
            title="Eco rating"
            subtitle={footprintResult.rating.description}
            icon={<Award className="h-5 w-5" />}
          />
          <div className="flex flex-col items-center py-2">
            <ProgressRing value={100 - Math.min(100, (footprintResult.monthly / 800) * 100)} size={140} strokeWidth={12} />
            <div className="mt-4 text-center">
              <div className={`font-display text-2xl font-bold bg-gradient-to-br ${footprintResult.rating.gradient} bg-clip-text text-transparent`}>
                {footprintResult.rating.label}
              </div>
              <p className="mt-1 text-xs text-[var(--text-mute)]">
                {footprintResult.vsAverage >= 0 ? "+" : ""}{footprintResult.vsAverage}% vs global average
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md" hover={false}>
          <CardHeader title="Active goal" subtitle={activeGoal?.title || "No active goal"} icon={<Target className="h-5 w-5" />} action={
            <Link to="/goals"><Button size="sm" variant="ghost" iconRight={<ArrowUpRight className="h-3 w-3" />}>All goals</Button></Link>
          } />
          {activeGoal ? (
            <>
              <div className="flex items-baseline justify-between">
                <span className="font-display text-3xl font-bold gradient-text">{Math.round(goalProgress)}%</span>
                <span className="text-xs text-[var(--text-mute)]">{activeGoal.currentReduction}% / {activeGoal.targetReduction}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--bg-soft)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${goalProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-eco-500 to-aurora-500"
                />
              </div>
              <div className="mt-4 space-y-2">
                {activeGoal.milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full ${m.reached ? "bg-eco-500 text-white" : "border border-[var(--border)]"}`}>
                      {m.reached && <Trophy className="h-3 w-3" />}
                    </div>
                    <span className={m.reached ? "text-[var(--text-soft)] line-through" : "text-[var(--text-soft)]"}>{m.label} · {m.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Target className="mb-3 h-8 w-8 text-[var(--text-mute)]" />
              <p className="text-sm text-[var(--text-soft)]">Set your first reduction goal.</p>
              <Link to="/goals" className="mt-3">
                <Button size="sm">Create goal</Button>
              </Link>
            </div>
          )}
        </Card>

        <Card padding="md" hover={false}>
          <CardHeader title="Monthly trend" subtitle="6 months of emissions" icon={<TrendingUp className="h-5 w-5" />} />
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBarData} margin={{ left: -16, right: 8, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--text-mute)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-mute)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--bg-soft)" }} />
                <Bar dataKey="v" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-[var(--text-mute)]">Best month</span>
            <span className="font-semibold text-eco-600">Jun · 318 kg</span>
          </div>
        </Card>
      </div>

      {/* Activity + Achievements */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card padding="md" hover={false}>
          <CardHeader
            title="Recent activity"
            subtitle="Your eco-action log"
            icon={<Zap className="h-5 w-5" />}
            action={<Link to="/challenges"><Button size="sm" variant="ghost">Log action</Button></Link>}
          />
          <div className="space-y-2">
            {activities.length === 0 && (
              <p className="py-6 text-center text-sm text-[var(--text-mute)]">No activity yet. Complete a challenge to start tracking.</p>
            )}
            {activities.slice(0, 5).map((a) => {
              const isNegative = a.co2 < 0;
              return (
                <div key={a.id} className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)]/40 p-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isNegative ? "bg-eco-500/10 text-eco-600" : "bg-amber-500/10 text-amber-600"}`}>
                    {isNegative ? <TrendingDown className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{a.description}</div>
                    <div className="text-xs text-[var(--text-mute)]">{a.amount} {a.unit} · {a.date}</div>
                  </div>
                  <div className={`text-sm font-semibold ${isNegative ? "text-eco-600" : "text-amber-600"}`}>
                    {isNegative ? "" : "+"}{a.co2.toFixed(1)} kg
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding="md" hover={false}>
          <CardHeader
            title="Achievements"
            subtitle={`${earnedBadges} of ${achievements.length} unlocked`}
            icon={<Trophy className="h-5 w-5" />}
          />
          <div className="grid grid-cols-4 gap-3">
            {achievements.map((a) => (
              <div key={a.id} className="group flex flex-col items-center gap-1.5">
                <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl ${a.unlocked ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30" : "bg-[var(--bg-soft)] text-[var(--text-mute)]"}`}>
                  <Award className="h-5 w-5" />
                  {a.unlocked && <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-eco-500 text-[8px] text-white">✓</span>}
                </div>
                <div className="text-center text-[10px] leading-tight text-[var(--text-mute)]">{a.title.split(" ")[0]}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]/40 p-3 text-sm">
            <div>
              <div className="font-medium">Challenges completed</div>
              <div className="text-xs text-[var(--text-mute)]">Keep the momentum</div>
            </div>
            <div className="font-display text-2xl font-bold gradient-text">{completedChallenges}</div>
          </div>
        </Card>
      </div>

      {/* AI insight callout */}
      <Card padding="md" hover={false} className="mt-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-eco-500 to-aurora-500 text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Pulse found 3 new opportunities for you</h3>
              <p className="mt-0.5 text-sm text-[var(--text-soft)]">Based on this week's activity, you could save up to 14 kg CO₂ with small adjustments.</p>
            </div>
          </div>
          <Link to="/insights">
            <Button iconRight={<ArrowUpRight className="h-4 w-4" />}>View insights</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value, change, changeLabel, accent }: { icon: React.ReactNode; label: string; value: string; change?: number; changeLabel: string; accent: string }) {
  return (
    <Card padding="md" hover>
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-md`}>
          {icon}
        </div>
        {change !== undefined && change < 0 && (
          <Badge variant="success" icon={<TrendingDown className="h-3 w-3" />}>{Math.abs(change)}%</Badge>
        )}
      </div>
      <div className="mt-3">
        <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-mute)]">{label}</div>
        <div className="mt-1 font-display text-2xl font-bold tracking-tight">{value}</div>
        <div className="mt-0.5 text-xs text-[var(--text-mute)]">{changeLabel}</div>
      </div>
    </Card>
  );
}

function EmptyState({ onLoadDemo }: { onLoadDemo: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-500 to-aurora-500 text-white shadow-lg">
        <Leaf className="h-8 w-8" />
      </div>
      <h2 className="font-display text-3xl font-bold tracking-tight">No footprint data yet</h2>
      <p className="mt-3 max-w-md text-[var(--text-soft)]">Calculate your carbon footprint in 60 seconds, or load demo data to explore the dashboard.</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link to="/calculator">
          <Button size="lg" iconRight={<ArrowUpRight className="h-4 w-4" />}>Calculate now</Button>
        </Link>
        <Button size="lg" variant="secondary" icon={<Sparkles className="h-4 w-4" />} onClick={onLoadDemo}>Load demo data</Button>
      </div>
    </div>
  );
}
