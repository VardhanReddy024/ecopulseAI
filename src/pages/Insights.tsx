import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import {
  Sparkles, TrendingDown, Lightbulb, Bus, Bike, Plane, Sun, Salad, Shirt,
  Smartphone, Recycle, Trash2, ArrowRight, Brain, Zap, MessageCircle
} from "lucide-react";
import { useAppStore } from "../store/appStore";
import { Card, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Primitives";
import { Button } from "../components/ui/Button";
import { generateRecommendations } from "../services/carbonEngine";
import type { Recommendation } from "../types";
import { cn } from "../utils/cn";

const iconMap: Record<string, any> = {
  Bus, Bike, Plane, Sun, Salad, Shirt, Smartphone, Recycle, Trash2, Utensils: Salad, Apple: Salad, Lightbulb, UtensilsCrossed: Salad,
};

const tooltipStyle = {
  backgroundColor: "var(--bg-elev)",
  border: "1px solid var(--border)",
  borderRadius: "0.625rem",
  fontSize: "0.75rem",
  padding: "0.5rem 0.75rem",
};

export default function Insights() {
  const { footprintInput, footprintResult } = useAppStore();
  const recommendations = useMemo(() => {
    if (!footprintInput || !footprintResult) return [];
    return generateRecommendations(footprintInput, footprintResult);
  }, [footprintInput, footprintResult]);

  const totalImpact = recommendations.reduce((sum, r) => sum + r.impact, 0);
  const quickWins = recommendations.filter((r) => r.effort === "low").slice(0, 3);
  const chartData = recommendations.slice(0, 6).map((r) => ({
    name: r.title.split(" ").slice(0, 3).join(" "),
    impact: r.impact,
    color: r.effort === "low" ? "#10b981" : r.effort === "medium" ? "#22d3ee" : "#f59e0b",
  }));

  if (!footprintInput || !footprintResult) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4">
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 text-eco-500" />
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight">No data to analyze</h2>
          <p className="mt-2 text-[var(--text-soft)]">Calculate your footprint first to unlock AI insights.</p>
          <Link to="/calculator">
            <Button className="mt-5" iconRight={<ArrowRight className="h-4 w-4" />}>Go to calculator</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Badge variant="info" className="" icon={<Sparkles className="h-3 w-3" />}>AI Personalized</Badge>
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">Your reduction playbook</h1>
        <p className="mt-2 text-[var(--text-soft)]">
          Pulse analyzed your footprint and identified {recommendations.length} opportunities to reduce up to <span className="font-semibold text-eco-600">{totalImpact.toLocaleString()} kg CO₂/year</span>.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card padding="md" hover={false}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-eco-500/10 text-eco-600">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[var(--text-mute)]">Total potential reduction</div>
              <div className="font-display text-2xl font-bold gradient-text">{totalImpact.toLocaleString()} kg/yr</div>
            </div>
          </div>
        </Card>
        <Card padding="md" hover={false}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aurora-500/10 text-aurora-600">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[var(--text-mute)]">Quick wins</div>
              <div className="font-display text-2xl font-bold">{quickWins.length} actions</div>
            </div>
          </div>
        </Card>
        <Card padding="md" hover={false}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[var(--text-mute)]">Personalized for you</div>
              <div className="font-display text-2xl font-bold">{recommendations.length} tips</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart + Quick wins */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card padding="md" hover={false} className="lg:col-span-2">
          <CardHeader title="Top opportunities" subtitle="Ranked by kg CO₂ saved per year" icon={<TrendingDown className="h-5 w-5" />} />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-mute)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--text-mute)" fontSize={11} tickLine={false} axisLine={false} width={110} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--bg-soft)" }} />
                <Bar dataKey="impact" radius={[0, 6, 6, 0]}>
                  {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="md" hover={false}>
          <CardHeader title="Quick wins" subtitle="Low effort, high impact" icon={<Zap className="h-5 w-5" />} />
          <div className="space-y-2">
            {quickWins.map((r) => {
              const Icon = iconMap[r.icon] || Lightbulb;
              return (
                <div key={r.id} className="rounded-lg border border-[var(--border)] bg-[var(--bg-soft)]/40 p-3">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-eco-500/10 text-eco-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium leading-snug">{r.title}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <span className="font-semibold text-eco-600">~{r.impact} kg/yr</span>
                        <span className="text-[var(--text-mute)]">· {r.timeframe}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Detailed recommendations */}
      <div className="mt-8">
        <h2 className="font-display text-2xl font-bold tracking-tight">All recommendations</h2>
        <p className="mt-1 text-sm text-[var(--text-soft)]">Each tip is grounded in your specific lifestyle and footprint data.</p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {recommendations.map((r, i) => (
          <RecommendationCard key={r.id} rec={r} index={i} />
        ))}
      </div>

      {/* CTA */}
      <Card padding="lg" hover={false} className="mt-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-500 to-aurora-500 text-white shadow-lg">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold">Want more personalized advice?</h3>
              <p className="mt-1 text-sm text-[var(--text-soft)]">Ask Pulse anything about your footprint, lifestyle changes, or specific eco decisions.</p>
            </div>
          </div>
          <Link to="/chat">
            <Button iconRight={<ArrowRight className="h-4 w-4" />}>Open Pulse chat</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const Icon = iconMap[rec.icon] || Lightbulb;
  const effortColors = {
    low: "border-eco-500/30 bg-eco-500/5 text-eco-700 dark:text-eco-300",
    medium: "border-aurora-500/30 bg-aurora-500/5 text-aurora-700 dark:text-aurora-300",
    high: "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card hover padding="md" className="h-full">
        <div className="flex items-start gap-3">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border", effortColors[rec.effort])}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-semibold leading-snug">{rec.title}</h3>
              <Badge variant="success" className="shrink-0">~{rec.impact} kg/yr</Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">{rec.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className={cn("rounded-full border px-2 py-0.5 capitalize", effortColors[rec.effort])}>
                {rec.effort} effort
              </span>
              <span className="text-[var(--text-mute)]">· {rec.timeframe}</span>
              <span className="text-[var(--text-mute)]">· {rec.category}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
