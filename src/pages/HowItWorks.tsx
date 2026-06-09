import { Link } from "react-router-dom";
import { Calculator, Sparkles, MessageCircle, Trophy, BarChart3, ArrowRight, Check } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Primitives";
import { Button } from "../components/ui/Button";

const steps = [
  {
    n: "01",
    icon: Calculator,
    title: "Calculate your footprint",
    description: "Our 12-question calculator takes 60 seconds. We cover transport, energy, food, shopping, and waste.",
    details: ["No manual logging required to start", "Auto-calculated from your inputs", "Instant eco-rating & breakdown"],
  },
  {
    n: "02",
    icon: Sparkles,
    title: "Get AI-powered recommendations",
    description: "Pulse analyzes your specific profile and ranks the highest-impact changes you can make.",
    details: ["Personalized, not generic", "Quantified kg CO₂ impact", "Effort-level rated"],
  },
  {
    n: "03",
    icon: Trophy,
    title: "Take on challenges",
    description: "Daily and weekly challenges matched to your goals. Earn XP, unlock badges, build streaks.",
    details: ["10+ curated challenge types", "Compound into real habits", "Visible progress celebration"],
  },
  {
    n: "04",
    icon: BarChart3,
    title: "Track & reduce",
    description: "Watch your dashboard show real reductions. Hit milestones. Get reminded to stay on track.",
    details: ["Real-time analytics", "Weekly progress reports", "Milestone celebrations"],
  },
];

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <Badge variant="info" className="mb-4">How it works</Badge>
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl text-balance">
          From <span className="gradient-text">zero</span> to climate-confident
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--text-soft)] text-pretty">
          A four-step system that's been used by 1.2M+ people to reduce their carbon footprint by an average of 32%.
        </p>
      </div>

      <div className="mt-16 space-y-6">
        {steps.map((s, i) => (
          <Card key={i} padding="lg" hover={false} className="overflow-hidden">
            <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start">
              <div className="flex items-center gap-4 sm:flex-col sm:items-start">
                <div className="font-display text-3xl font-bold text-eco-500/30">{s.n}</div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-eco-500 to-aurora-500 text-white shadow-lg">
                  <s.icon className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight">{s.title}</h2>
                <p className="mt-2 text-[var(--text-soft)]">{s.description}</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                  {s.details.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-eco-500" />
                      <span className="text-[var(--text-soft)]">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-20 text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight">Ready to start?</h2>
        <p className="mt-3 text-[var(--text-soft)]">The best time to start reducing was 10 years ago. The second best time is now.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link to="/signup">
            <Button size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>Create free account</Button>
          </Link>
          <Link to="/chat">
            <Button size="lg" variant="secondary" icon={<MessageCircle className="h-4 w-4" />}>Try Pulse first</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
