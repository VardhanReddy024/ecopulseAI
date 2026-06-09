import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bike, Car, Bus, Plane, Zap, Apple, Shirt, Smartphone, Recycle, Trash2,
  ArrowRight, ArrowLeft, Check, Sparkles, Sun, Leaf, Lightbulb, TrendingDown
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge, ProgressRing } from "../components/ui/Primitives";
import { useAppStore } from "../store/appStore";
import { calculateFootprint } from "../services/carbonEngine";
import type { FootprintInput, TransportMode, DietType, ShoppingLevel } from "../types";
import { formatCO2 } from "../utils/cn";
import { cn } from "../utils/cn";

const steps = [
  { id: "transport", title: "Transport", icon: Car, subtitle: "How do you get around?" },
  { id: "electricity", title: "Energy", icon: Zap, subtitle: "Your home's energy use" },
  { id: "diet", title: "Food", icon: Apple, subtitle: "Your eating habits" },
  { id: "shopping", title: "Shopping", icon: Shirt, subtitle: "Your consumption patterns" },
  { id: "waste", title: "Waste", icon: Recycle, subtitle: "How you handle waste" },
  { id: "result", title: "Result", icon: Sparkles, subtitle: "Your carbon footprint" },
];

const defaultInput: FootprintInput = {
  transport: { primary: "car", weeklyKm: 150, flightHours: 4 },
  electricity: { monthlyKwh: 250, renewable: false },
  diet: "mixed",
  shopping: { fashion: "medium", electronics: "medium", general: "medium" },
  waste: { plasticLevel: "medium", recycles: true },
};

export default function Calculator() {
  const navigate = useNavigate();
  const setFootprint = useAppStore((s) => s.setFootprint);
  const existing = useAppStore((s) => s.footprintInput);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<FootprintInput>(existing || defaultInput);

  const total = steps.length - 1;
  const progress = ((step + 1) / (total + 1)) * 100;
  const result = step === total ? calculateFootprint(input) : null;

  const next = () => {
    if (step < total) setStep((s) => s + 1);
    else {
      setFootprint(input);
      navigate("/insights");
    }
  };
  const back = () => step > 0 && setStep((s) => s - 1);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Step {step + 1} of {total + 1}</span>
          <span className="text-[var(--text-mute)]">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-soft)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-eco-500 to-aurora-500"
          />
        </div>
        {/* Step pills */}
        <div className="mt-4 hidden flex-wrap items-center gap-2 sm:flex">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <div key={s.id} className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition",
                active ? "border-eco-500 bg-eco-500/10 text-eco-700 dark:text-eco-300" :
                done ? "border-[var(--border)] bg-[var(--bg-soft)] text-[var(--text-soft)]" :
                "border-[var(--border)] text-[var(--text-mute)]"
              )}>
                {done ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                {s.title}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && (
            <StepWrapper title="How do you get around?" subtitle="Your main mode of transport and weekly distance.">
              <div className="space-y-6">
                <div>
                  <Label>Primary mode</Label>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { v: "bike", label: "Bike/Walk", icon: Bike },
                      { v: "public", label: "Public transit", icon: Bus },
                      { v: "car", label: "Car", icon: Car },
                      { v: "flights", label: "Often flying", icon: Plane },
                    ].map((opt) => {
                      const active = input.transport.primary === opt.v;
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.v}
                          onClick={() => setInput({ ...input, transport: { ...input.transport, primary: opt.v as TransportMode } })}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition",
                            active ? "border-eco-500 bg-eco-500/10" : "border-[var(--border)] hover:border-eco-500/30"
                          )}
                        >
                          <Icon className={cn("h-6 w-6", active ? "text-eco-600" : "text-[var(--text-mute)]")} />
                          <span className="text-sm font-medium">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label>Weekly kilometers <span className="text-[var(--text-mute)]">({input.transport.weeklyKm} km)</span></Label>
                  <input
                    type="range"
                    min={0}
                    max={500}
                    step={10}
                    value={input.transport.weeklyKm}
                    onChange={(e) => setInput({ ...input, transport: { ...input.transport, weeklyKm: Number(e.target.value) } })}
                    className="mt-3 w-full accent-eco-500"
                    aria-label="Weekly kilometers"
                  />
                  <div className="mt-1 flex justify-between text-xs text-[var(--text-mute)]">
                    <span>0</span>
                    <span>500</span>
                  </div>
                </div>

                <div>
                  <Label>Flight hours per year <span className="text-[var(--text-mute)]">({input.transport.flightHours} h)</span></Label>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={input.transport.flightHours}
                    onChange={(e) => setInput({ ...input, transport: { ...input.transport, flightHours: Number(e.target.value) } })}
                    className="mt-3 w-full accent-eco-500"
                    aria-label="Flight hours per year"
                  />
                  <div className="mt-1 flex justify-between text-xs text-[var(--text-mute)]">
                    <span>0</span>
                    <span>50</span>
                  </div>
                </div>
              </div>
            </StepWrapper>
          )}

          {step === 1 && (
            <StepWrapper title="Home energy" subtitle="Your monthly electricity use and source.">
              <div className="space-y-6">
                <div>
                  <Label>Monthly electricity <span className="text-[var(--text-mute)]">({input.electricity.monthlyKwh} kWh)</span></Label>
                  <input
                    type="range"
                    min={50}
                    max={800}
                    step={10}
                    value={input.electricity.monthlyKwh}
                    onChange={(e) => setInput({ ...input, electricity: { ...input.electricity, monthlyKwh: Number(e.target.value) } })}
                    className="mt-3 w-full accent-eco-500"
                    aria-label="Monthly electricity"
                  />
                  <div className="mt-1 flex justify-between text-xs text-[var(--text-mute)]">
                    <span>50</span>
                    <span>800</span>
                  </div>
                  <p className="mt-2 text-xs text-[var(--text-mute)]">Average household: ~250 kWh/month. You can find this on your utility bill.</p>
                </div>

                <button
                  onClick={() => setInput({ ...input, electricity: { ...input.electricity, renewable: !input.electricity.renewable } })}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition",
                    input.electricity.renewable ? "border-eco-500 bg-eco-500/10" : "border-[var(--border)] hover:border-eco-500/30"
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    input.electricity.renewable ? "bg-eco-500 text-white" : "bg-[var(--bg-soft)] text-[var(--text-mute)]"
                  )}>
                    <Sun className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Renewable energy plan or solar</div>
                    <div className="text-sm text-[var(--text-soft)]">Green tariff, rooftop solar, or 100% renewable provider</div>
                  </div>
                  <div className={cn("h-5 w-9 rounded-full transition", input.electricity.renewable ? "bg-eco-500" : "bg-[var(--border)]")}>
                    <div className={cn("h-5 w-5 transform rounded-full bg-white shadow transition", input.electricity.renewable ? "translate-x-4" : "translate-x-0")} />
                  </div>
                </button>
              </div>
            </StepWrapper>
          )}

          {step === 2 && (
            <StepWrapper title="Your diet" subtitle="What you eat most days.">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { v: "vegan", label: "Vegan", desc: "Plant-based only" },
                  { v: "vegetarian", label: "Vegetarian", desc: "Plant + dairy/eggs" },
                  { v: "mixed", label: "Mixed", desc: "Some meat, some plants" },
                  { v: "meat-heavy", label: "Meat-heavy", desc: "Meat at most meals" },
                ].map((opt) => {
                  const active = input.diet === opt.v;
                  return (
                    <button
                      key={opt.v}
                      onClick={() => setInput({ ...input, diet: opt.v as DietType })}
                      className={cn(
                        "rounded-xl border-2 p-5 text-left transition",
                        active ? "border-eco-500 bg-eco-500/10" : "border-[var(--border)] hover:border-eco-500/30"
                      )}
                    >
                      <div className="font-medium">{opt.label}</div>
                      <div className="text-sm text-[var(--text-soft)]">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </StepWrapper>
          )}

          {step === 3 && (
            <StepWrapper title="Shopping habits" subtitle="How often do you buy new things?">
              <div className="space-y-4">
                <ShoppingRow
                  label="Fashion & clothing"
                  value={input.shopping.fashion}
                  onChange={(v) => setInput({ ...input, shopping: { ...input.shopping, fashion: v } })}
                  icon={<Shirt className="h-4 w-4" />}
                />
                <ShoppingRow
                  label="Electronics & gadgets"
                  value={input.shopping.electronics}
                  onChange={(v) => setInput({ ...input, shopping: { ...input.shopping, electronics: v } })}
                  icon={<Smartphone className="h-4 w-4" />}
                />
                <ShoppingRow
                  label="General consumption"
                  value={input.shopping.general}
                  onChange={(v) => setInput({ ...input, shopping: { ...input.shopping, general: v } })}
                  icon={<Lightbulb className="h-4 w-4" />}
                />
              </div>
            </StepWrapper>
          )}

          {step === 4 && (
            <StepWrapper title="Waste habits" subtitle="How much plastic and how often you recycle.">
              <div className="space-y-6">
                <ShoppingRow
                  label="Single-use plastic"
                  value={input.waste.plasticLevel}
                  onChange={(v) => setInput({ ...input, waste: { ...input.waste, plasticLevel: v } })}
                  icon={<Trash2 className="h-4 w-4" />}
                />
                <button
                  onClick={() => setInput({ ...input, waste: { ...input.waste, recycles: !input.waste.recycles } })}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition",
                    input.waste.recycles ? "border-eco-500 bg-eco-500/10" : "border-[var(--border)] hover:border-eco-500/30"
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    input.waste.recycles ? "bg-eco-500 text-white" : "bg-[var(--bg-soft)] text-[var(--text-mute)]"
                  )}>
                    <Recycle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">I recycle regularly</div>
                    <div className="text-sm text-[var(--text-soft)]">Sorted paper, glass, plastic, metal</div>
                  </div>
                  <div className={cn("h-5 w-9 rounded-full transition", input.waste.recycles ? "bg-eco-500" : "bg-[var(--border)]")}>
                    <div className={cn("h-5 w-5 transform rounded-full bg-white shadow transition", input.waste.recycles ? "translate-x-4" : "translate-x-0")} />
                  </div>
                </button>
              </div>
            </StepWrapper>
          )}

          {step === 5 && result && (
            <div className="space-y-6">
              <div className="text-center">
                <Badge variant="success" className="mb-3" icon={<Sparkles className="h-3 w-3" />}>Your footprint is ready</Badge>
                <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  You emit <span className="gradient-text">{result.monthly} kg CO₂</span> per month
                </h2>
                <p className="mt-2 text-[var(--text-soft)]">That's {formatCO2(result.annual)} per year. {result.treesNeeded} trees would offset it.</p>
              </div>

              <Card padding="lg" hover={false}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col items-center">
                    <ProgressRing value={100 - Math.min(100, (result.monthly / 800) * 100)} size={160} strokeWidth={14} />
                    <div className="mt-4 text-center">
                      <div className={`font-display text-2xl font-bold bg-gradient-to-br ${result.rating.gradient} bg-clip-text text-transparent`}>
                        {result.rating.label}
                      </div>
                      <div className="mt-1 text-sm text-[var(--text-soft)]">{result.rating.description}</div>
                      <Badge variant={result.vsAverage < 0 ? "success" : "warning"} className="mt-2">
                        {result.vsAverage >= 0 ? "+" : ""}{result.vsAverage}% vs global avg
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium">Category breakdown</div>
                    {Object.entries(result.breakdown).sort(([, a], [, b]) => b - a).map(([k, v]) => {
                      const pct = Math.round((v / result.monthly) * 100);
                      return (
                        <div key={k}>
                          <div className="flex justify-between text-xs">
                            <span className="capitalize text-[var(--text-soft)]">{k}</span>
                            <span className="font-medium">{v} kg · {pct}%</span>
                          </div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--bg-soft)]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, delay: 0.1 }}
                              className="h-full bg-gradient-to-r from-eco-500 to-aurora-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>

              <div className="flex justify-center gap-3">
                <Button variant="secondary" icon={<TrendingDown className="h-4 w-4" />} onClick={() => setStep(0)}>
                  Edit answers
                </Button>
                <Button onClick={next} iconRight={<ArrowRight className="h-4 w-4" />}>
                  See AI insights
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      {step < total && (
        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" icon={<ArrowLeft className="h-4 w-4" />} onClick={back} disabled={step === 0}>
            Back
          </Button>
          <Button onClick={next} iconRight={<ArrowRight className="h-4 w-4" />}>
            {step === total - 1 ? "Calculate" : "Continue"}
          </Button>
        </div>
      )}
    </div>
  );
}

function StepWrapper({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-eco-500 to-aurora-500 text-white shadow-md">
          <Leaf className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-[var(--text-soft)]">{subtitle}</p>
        </div>
      </div>
      <Card padding="lg" hover={false}>{children}</Card>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium">{children}</label>;
}

function ShoppingRow({ label, value, onChange, icon }: { label: string; value: ShoppingLevel; onChange: (v: ShoppingLevel) => void; icon: React.ReactNode }) {
  const options: { v: ShoppingLevel; label: string }[] = [
    { v: "low", label: "Low" },
    { v: "medium", label: "Medium" },
    { v: "high", label: "High" },
  ];
  return (
    <div className="rounded-xl border border-[var(--border)] p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
        <span className="text-eco-600">{icon}</span>
        {label}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            key={opt.v}
            onClick={() => onChange(opt.v)}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition",
              value === opt.v ? "border-eco-500 bg-eco-500/10 text-eco-700 dark:text-eco-300" : "border-[var(--border)] hover:border-eco-500/30"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
