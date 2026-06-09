import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, TrendingDown, Brain, MessageCircle,
  Trophy, Target, BarChart3, CheckCircle2, Star, Quote, ChevronRight,
  Trees, Globe2, Play, Award, Lightbulb
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Primitives";
import { useAppStore } from "../store/appStore";
import { useInView } from "../hooks/useInView";
import { formatNumber } from "../utils/cn";

const features = [
  {
    icon: Brain,
    title: "AI Personalized Insights",
    description: "Context-aware recommendations that understand your lifestyle, not generic advice.",
    color: "from-eco-500 to-emerald-600",
  },
  {
    icon: BarChart3,
    title: "Premium Analytics",
    description: "Track weekly, monthly, and category-wise emissions with beautiful, real-time charts.",
    color: "from-aurora-500 to-cyan-600",
  },
  {
    icon: MessageCircle,
    title: "Pulse AI Chatbot",
    description: "Ask anything about sustainability. Pulse gives practical, personalized guidance.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: Trophy,
    title: "Gamified Challenges",
    description: "Daily eco challenges, XP, badges, and streaks to keep you motivated long-term.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Target,
    title: "Smart Reduction Goals",
    description: "Set targets, track progress, hit milestones. We celebrate every step with you.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Trees,
    title: "Offset Visualization",
    description: "See your footprint translated into trees, flights, and everyday actions.",
    color: "from-lime-500 to-green-600",
  },
];

const steps = [
  { num: "01", title: "Calculate", description: "Answer 12 quick questions about your lifestyle." },
  { num: "02", title: "Discover", description: "AI analyzes your footprint and finds your biggest opportunities." },
  { num: "03", title: "Act", description: "Take on personalized challenges and track your progress." },
  { num: "04", title: "Reduce", description: "Hit goals, earn badges, and watch your impact shrink." },
];

const testimonials = [
  {
    quote: "EcoPulse helped me cut my footprint 28% in 3 months. The AI recommendations are scary-accurate.",
    name: "Maya Chen",
    role: "Product Designer",
    avatar: "MC",
    rating: 5,
  },
  {
    quote: "It's like having a climate coach in your pocket. The chat feature alone is worth it.",
    name: "David Park",
    role: "Software Engineer",
    avatar: "DP",
    rating: 5,
  },
  {
    quote: "The challenges make sustainability actually fun. My whole family uses it now.",
    name: "Aisha Okonkwo",
    role: "Teacher",
    avatar: "AO",
    rating: 5,
  },
  {
    quote: "I finally understand where my emissions come from. The dashboard is gorgeous too.",
    name: "Tomás Silva",
    role: "Architect",
    avatar: "TS",
    rating: 5,
  },
];

const trustedBy = ["Vertex Capital", "ClimateForge", "GreenGrid", "OpenEarth", "Terra.co", "Wavemaker"];

export default function Landing() {
  const { loadDemoData, user } = useAppStore();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);
  const { ref: statsRef, inView: statsInView } = useInView({ threshold: 0.2 });
  const [animatedStats, setAnimatedStats] = useState({ co2: 0, users: 0, reduction: 0 });

  useEffect(() => {
    if (!statsInView) return;
    const start = Date.now();
    const duration = 1800;
    const targets = { co2: 847000, users: 1247000, reduction: 32 };
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedStats({
        co2: Math.round(targets.co2 * eased),
        users: Math.round(targets.users * eased),
        reduction: Math.round(targets.reduction * eased),
      });
      if (t < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [statsInView]);

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-24 sm:pt-20 sm:pb-32">
        <div className="absolute inset-0 -z-10 bg-grid opacity-30" />
        <div className="absolute inset-0 -z-10 bg-dots opacity-20" />

        {/* Floating orbs */}
        <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-eco-500/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-aurora-500/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex"
            >
              <Badge variant="success" className="px-3 py-1" icon={<span className="pulse-dot" />}>
                <span>Live · 2025 Climate Action Cohort</span>
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl"
            >
              Know your carbon.
              <br />
              <span className="gradient-text">Cut it intelligently.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-soft)] text-pretty sm:text-xl"
            >
              EcoPulse AI combines behavioral science with personalized intelligence to help you understand your footprint — and actually do something about it.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link to={user ? "/dashboard" : "/signup"}>
                <Button size="lg" iconRight={<ArrowRight className="h-4 w-4" />} className="w-full sm:w-auto">
                  Start free — no credit card
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button size="lg" variant="secondary" icon={<Play className="h-4 w-4" />} className="w-full sm:w-auto">
                  See how it works
                </Button>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 text-sm text-[var(--text-mute)]"
            >
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-eco-500" /> Free forever
              </span>
              <span className="mx-3">·</span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-eco-500" /> 60-second setup
              </span>
              <span className="mx-3">·</span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-eco-500" /> Privacy-first
              </span>
            </motion.p>
          </div>

          {/* Hero visual — mock dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mx-auto mt-16 max-w-5xl sm:mt-20"
          >
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-eco-500/40 via-aurora-500/40 to-indigo-500/40 opacity-50 blur-2xl" />
            <div className="card-elev noise relative overflow-hidden p-1">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)]">
                <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="ml-2 flex-1 text-center text-xs font-medium text-[var(--text-mute)]">ecopulse.ai/dashboard</div>
                </div>
                <div className="grid gap-px bg-[var(--border)] sm:grid-cols-3">
                  <div className="bg-[var(--bg-elev)] p-6">
                    <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-mute)]">Monthly CO₂</div>
                    <div className="mt-2 font-display text-3xl font-bold">324 <span className="text-base font-normal text-[var(--text-mute)]">kg</span></div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-eco-600">
                      <TrendingDown className="h-3.5 w-3.5" /> 18% vs last month
                    </div>
                    <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-eco-500/10">
                      <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-eco-500 to-aurora-500" />
                    </div>
                  </div>
                  <div className="bg-[var(--bg-elev)] p-6">
                    <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-mute)]">Top opportunity</div>
                    <div className="mt-2 font-display text-lg font-semibold leading-tight">Switch to public transit</div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-aurora-600">
                      <Lightbulb className="h-3.5 w-3.5" /> Save ~480 kg/yr
                    </div>
                    <div className="mt-4 flex gap-1">
                      {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.7].map((h, i) => (
                        <div key={i} className="h-8 flex-1 rounded bg-gradient-to-t from-eco-500/40 to-aurora-500/40" style={{ height: `${h * 32}px` }} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-[var(--bg-elev)] p-6">
                    <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-mute)]">Streak</div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <div className="font-display text-3xl font-bold">14</div>
                      <div className="text-sm text-[var(--text-mute)]">days</div>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
                      <Award className="h-3.5 w-3.5" /> 220 XP earned
                    </div>
                    <div className="mt-4 flex gap-1">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className={`h-2 flex-1 rounded-full ${i < 5 ? "bg-eco-500" : "bg-[var(--border)]"}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="border-y border-[var(--border)] bg-[var(--bg-soft)]/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="text-center">
              <div className="font-display text-4xl font-bold gradient-text sm:text-5xl">{formatNumber(animatedStats.users)}</div>
              <div className="mt-2 text-sm text-[var(--text-mute)]">CO₂-conscious users</div>
            </div>
            <div className="text-center">
              <div className="font-display text-4xl font-bold gradient-text sm:text-5xl">{formatNumber(animatedStats.co2 / 1000)}k t</div>
              <div className="mt-2 text-sm text-[var(--text-mute)]">Emissions tracked</div>
            </div>
            <div className="text-center">
              <div className="font-display text-4xl font-bold gradient-text sm:text-5xl">{animatedStats.reduction}%</div>
              <div className="mt-2 text-sm text-[var(--text-mute)]">Average reduction</div>
            </div>
            <div className="text-center">
              <div className="font-display text-4xl font-bold gradient-text sm:text-5xl">4.9★</div>
              <div className="mt-2 text-sm text-[var(--text-mute)]">Across 12k reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="info" className="mb-4">Why EcoPulse</Badge>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              Sustainability, <span className="gradient-text">personalized</span>
            </h2>
            <p className="mt-5 text-lg text-[var(--text-soft)] text-pretty">
              We don't believe in generic eco-tips. EcoPulse learns your life, your constraints, and your goals — then builds a reduction plan that actually fits.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Card hover padding="lg" className="h-full">
                  <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-lg`}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">{f.description}</p>
                  <div className="mt-5 inline-flex items-center text-sm font-medium text-eco-600">
                    Learn more <ChevronRight className="ml-0.5 h-4 w-4" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-soft)]/40 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="success" className="mb-4">The process</Badge>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              From footprint to action in <span className="gradient-text">60 seconds</span>
            </h2>
            <p className="mt-5 text-lg text-[var(--text-soft)]">No spreadsheets. No jargon. Just clarity.</p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="card-elev p-6">
                  <div className="font-display text-5xl font-bold text-eco-500/20">{s.num}</div>
                  <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-[var(--text-soft)]">{s.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-[var(--text-mute)] lg:block">
                    <ChevronRight className="h-6 w-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="info" className="mb-4">Loved by climate-concious humans</Badge>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              Trusted by <span className="gradient-text">climate champions</span>
            </h2>
          </div>

          <div className="mt-12 mb-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {trustedBy.map((b) => (
              <div key={b} className="font-display text-lg font-semibold text-[var(--text-mute)]/60 transition hover:text-[var(--text-mute)]">
                {b}
              </div>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card hover padding="md" className="h-full">
                  <Quote className="h-5 w-5 text-eco-500/40" />
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-soft)]">"{t.quote}"</p>
                  <div className="mt-4 flex items-center gap-3 border-t border-[var(--border)] pt-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-eco-500 to-aurora-500 text-xs font-semibold text-white">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-[var(--text-mute)]">{t.role}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-eco-600 via-aurora-600 to-indigo-700" />
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-eco-300/20 blur-3xl" />

            <div className="relative px-8 py-16 text-center sm:px-16 sm:py-24">
              <Globe2 className="mx-auto h-12 w-12 text-white/90" />
              <h2 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl text-balance">
                The climate window is closing.<br />Start today.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-eco-50/90 text-pretty">
                Join 1.2M+ people turning awareness into action. Your future self — and the planet — will thank you.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to={user ? "/dashboard" : "/signup"}>
                  <Button
                    size="lg"
                    className="!bg-white !text-eco-700 hover:!bg-eco-50 hover:!text-eco-800"
                    iconRight={<ArrowRight className="h-4 w-4" />}
                  >
                    {user ? "Open dashboard" : "Start your free footprint"}
                  </Button>
                </Link>
                {!user && (
                  <button
                    onClick={() => { loadDemoData(); window.location.href = "/dashboard"; }}
                    className="text-sm font-medium text-eco-50/90 underline-offset-4 hover:underline"
                  >
                    or try the demo →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
