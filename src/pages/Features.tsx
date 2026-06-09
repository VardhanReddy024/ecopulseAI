import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, BarChart3, Trophy, Target, Trees, Sparkles, ArrowRight, Zap, Globe2, Activity, CheckCircle2 } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Primitives";
import { Button } from "../components/ui/Button";

const featureGroups = [
  {
    title: "Intelligence layer",
    description: "AI that actually understands context",
    features: [
      { icon: Brain, title: "Contextual recommendations", description: "Not generic advice — Pulse models your specific commute, diet, and home setup to find savings you'd actually do." },
      { icon: Sparkles, title: "Pattern detection", description: "Subtle trends emerge: a weekend flight habit, a leaky electric dryer, seasonal food waste spikes. Pulse catches them." },
      { icon: Zap, title: "Instant 'what if' simulator", description: "Wonder what would happen if you went electric next car? Pulse shows you the impact before you commit." },
    ],
  },
  {
    title: "Tracking & analytics",
    description: "Numbers, beautifully",
    features: [
      { icon: BarChart3, title: "Real-time dashboard", description: "Live emissions tracking across all 5 categories. Drill into any day, week, or month." },
      { icon: Activity, title: "Activity log", description: "Log eco-actions and see their CO₂ impact compound. Bike to work = -0 kg, plant-based day = -5.5 kg." },
      { icon: Globe2, title: "Global comparison", description: "See how you compare to country averages, Paris Agreement targets, and similar lifestyles." },
    ],
  },
  {
    title: "Motivation & community",
    description: "Streaks, badges, friendly competition",
    features: [
      { icon: Trophy, title: "Daily challenges", description: "Curated challenges matched to your profile. From 'no-plastic day' to '30-day EV commitment'." },
      { icon: Target, title: "Smart goals", description: "Set a reduction target. Get AI-suggested milestones. Celebrate every percentage point." },
      { icon: Trees, title: "Tangible impact", description: "See your savings in trees planted, flights avoided, ice caps preserved. Numbers you can feel." },
    ],
  },
];

export default function Features() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="info" className="mb-4">Features</Badge>
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl text-balance">
          Everything you need to <span className="gradient-text">cut your footprint</span>
        </h1>
        <p className="mt-6 text-lg text-[var(--text-soft)] text-pretty">
          EcoPulse combines AI, behavioral science, and beautiful design to make sustainability feel achievable — not overwhelming.
        </p>
      </div>

      {featureGroups.map((group, gi) => (
        <div key={gi} className="mt-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight">{group.title}</h2>
              <p className="mt-2 text-[var(--text-soft)]">{group.description}</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {group.features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card hover padding="lg" className="h-full">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-eco-500/10 text-eco-600">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">{f.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-24">
        <Card padding="lg" className="bg-gradient-to-br from-eco-500/10 via-transparent to-aurora-500/10">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <Badge variant="success" className="mb-3">Pulse AI Chatbot</Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight">Your personal climate copilot</h2>
              <p className="mt-3 text-[var(--text-soft)]">Ask anything. Get answers grounded in your data, science, and what actually works for people like you.</p>
              <ul className="mt-5 space-y-2">
                {["Practical, non-judgmental advice", "Personalized to your footprint", "Cites the why behind every tip", "Free, unlimited conversations"].map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-eco-500" /> {b}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-2">
                <Link to="/chat">
                  <Button iconRight={<ArrowRight className="h-4 w-4" />}>Chat with Pulse</Button>
                </Link>
              </div>
            </div>
            <div className="card-elev p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-eco-500" />
                <div className="text-xs font-medium text-eco-600">Pulse</div>
              </div>
              <p className="text-sm leading-relaxed">Your highest-emission category is **transport** at 142 kg CO₂/month. That's roughly 38% of your footprint. Try this: replacing 2 weekly car trips with public transit could save ~480 kg CO₂/year. Want me to model the impact of switching to an EV at your next car replacement?</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
