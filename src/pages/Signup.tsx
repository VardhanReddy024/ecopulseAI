import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User as UserIcon, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAppStore } from "../store/appStore";
import { isFirebaseConfigured, signUp } from "../services/firebase";
import { Leaf } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const setUser = useAppStore((s) => s.setUser);
  const loadDemoData = useAppStore((s) => s.loadDemoData);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      if (isFirebaseConfigured) {
        const u = await signUp(email, password, name);
        setUser({ uid: u.uid, email: u.email!, displayName: name, createdAt: Date.now() });
      } else {
        setUser({ uid: "demo", email, displayName: name, createdAt: Date.now() });
        loadDemoData();
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    setUser({ uid: "demo", email: "demo@ecopulse.ai", displayName: "Demo User", createdAt: Date.now() });
    loadDemoData();
    navigate("/dashboard");
  };

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabels = ["", "Weak", "Good", "Strong"];
  const strengthColors = ["bg-[var(--border)]", "bg-rose-500", "bg-amber-500", "bg-eco-500"];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl items-center gap-12 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-500 to-aurora-500 shadow-lg shadow-eco-500/25">
            <Leaf className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Start your <span className="gradient-text">climate journey</span>
          </h1>
          <p className="mt-4 text-lg text-[var(--text-soft)] text-pretty">
            Free forever. 60-second setup. No credit card. Join 1.2M+ people reducing their footprint with intelligence, not guilt.
          </p>
          <Card padding="md" hover={false} className="mt-8">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-eco-500 to-aurora-500 text-xs font-semibold text-white">AS</div>
              <div>
                <div className="text-sm font-medium">Ananya S.</div>
                <div className="text-xs text-[var(--text-mute)]">Cut 28% in 3 months</div>
                <p className="mt-2 text-sm text-[var(--text-soft)]">"EcoPulse helped me see exactly where my emissions came from. The AI recommendations felt like they were made for me."</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card padding="lg" hover={false} className="card-elev">
            <div className="mb-6 text-center lg:hidden">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-500 to-aurora-500 shadow-lg">
                <Leaf className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Create your account</h2>
            <p className="mt-1 text-sm text-[var(--text-soft)]">Get started in less than a minute.</p>

            {error && (
              <div role="alert" className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 text-xs text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Full name</label>
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-mute)]" />
                  <input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input pl-9"
                    placeholder="Maya Chen"
                    autoComplete="name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-mute)]" />
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-9"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-mute)]" />
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-9 pr-10"
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-mute)] hover:text-[var(--text)]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex h-1 flex-1 gap-0.5">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`h-full flex-1 rounded-full transition-colors ${i <= passwordStrength ? strengthColors[passwordStrength] : "bg-[var(--border)]"}`} />
                      ))}
                    </div>
                    <span className="text-xs text-[var(--text-mute)]">{strengthLabels[passwordStrength]}</span>
                  </div>
                )}
              </div>

              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" required className="mt-0.5 rounded border-[var(--border)]" />
                <span className="text-[var(--text-soft)]">
                  I agree to the <a href="#" className="text-eco-600 hover:underline">Terms</a> and <a href="#" className="text-eco-600 hover:underline">Privacy Policy</a>
                </span>
              </label>

              <Button type="submit" loading={loading} className="w-full" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                Create account
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-xs text-[var(--text-mute)]">OR</span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <button
              onClick={handleDemo}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-transparent px-4 py-2.5 text-sm font-medium text-[var(--text-soft)] transition hover:border-eco-500/40 hover:text-eco-600"
            >
              <Sparkles className="h-4 w-4" /> Try demo — no signup
            </button>

            <p className="mt-5 text-center text-sm text-[var(--text-soft)]">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-eco-600 hover:underline">Sign in</Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
