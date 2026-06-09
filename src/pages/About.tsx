import { Link } from "react-router-dom";
import { Leaf, Users, Heart, Globe2, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Primitives";
import { Button } from "../components/ui/Button";

const team = [
  { name: "Ananya Sharma", role: "Co-founder & CEO", bio: "Former climate scientist at Berkeley. Built EcoPulse because no tool was making sustainability feel approachable.", avatar: "AS" },
  { name: "Marcus Webb", role: "Co-founder & CTO", bio: "Ex-Stripe engineer. Architecting the AI systems that make our recommendations feel personal, not generic.", avatar: "MW" },
  { name: "Lin Hayashi", role: "Head of Design", bio: "Previously at Linear. Obsessed with making complex data feel calm and actionable.", avatar: "LH" },
  { name: "Sofia Romero", role: "Climate Lead", bio: "IPCC contributor. Ensures every recommendation is grounded in real climate science.", avatar: "SR" },
];

const values = [
  { icon: Heart, title: "Empathy first", description: "No judgment, no shaming. Climate action that works is climate action that feels good." },
  { icon: Sparkles, title: "Personalized intelligence", description: "Generic eco-tips don't work. We use AI to find what works for you, specifically." },
  { icon: Globe2, title: "Grounded in science", description: "Every metric, every recommendation, every target is rooted in peer-reviewed climate research." },
  { icon: Users, title: "Built with community", description: "1.2M users actively shape our roadmap. We listen, iterate, and ship what matters." },
];

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <Badge variant="success" className="mb-4">Our mission</Badge>
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl text-balance">
          Make climate action <span className="gradient-text">the obvious choice</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--text-soft)] text-pretty">
          We believe the gap between caring about the climate and acting on it is mostly a design problem. EcoPulse exists to close that gap.
        </p>
      </div>

      <Card padding="lg" hover={false} className="mt-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">Why we built this</h2>
            <p className="mt-3 text-[var(--text-soft)]">
              The carbon footprint space is full of guilt, complexity, and generic advice. We wanted something different — a tool that felt like a smart friend, not a stern parent.
            </p>
            <p className="mt-3 text-[var(--text-soft)]">
              EcoPulse was born from a simple question: <em className="text-[var(--text)]">"What would it take to make 1 billion people actually reduce their emissions — not just feel bad about them?"</em>
            </p>
            <p className="mt-3 text-[var(--text-soft)]">
              The answer was personalization, intelligent design, and making the journey genuinely rewarding. That's what we ship.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { v: "1.2M+", l: "Active users" },
              { v: "847k t", l: "CO₂ tracked" },
              { v: "32%", l: "Avg reduction" },
              { v: "4.9★", l: "User rating" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-5 text-center">
                <div className="font-display text-2xl font-bold gradient-text">{s.v}</div>
                <div className="mt-1 text-xs text-[var(--text-mute)]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="mt-20">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight">What we believe</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <Card key={v.title} padding="md" hover>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-eco-500/10 text-eco-600">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">{v.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight">The team</h2>
        <p className="mt-3 text-center text-[var(--text-soft)]">Climate scientists, design lovers, and engineers who care.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <Card key={m.name} padding="md" hover>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-eco-500 to-aurora-500 text-lg font-semibold text-white">
                {m.avatar}
              </div>
              <h3 className="mt-4 font-display font-semibold">{m.name}</h3>
              <div className="text-xs text-eco-600">{m.role}</div>
              <p className="mt-2 text-sm text-[var(--text-soft)]">{m.bio}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-20 text-center">
        <Leaf className="mx-auto h-10 w-10 text-eco-500" />
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight">Join the movement</h2>
        <p className="mt-3 text-[var(--text-soft)]">Whether you're a climate veteran or just starting, EcoPulse has a place for you.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link to="/signup">
            <Button iconRight={<ArrowRight className="h-4 w-4" />}>Get started</Button>
          </Link>
          <a href="#"><Button variant="secondary">Read our blog</Button></a>
        </div>
      </div>
    </div>
  );
}
