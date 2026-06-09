import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, AtSign } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAppStore } from "../store/appStore";
import { isFirebaseConfigured, signIn, signInWithGoogle } from "../services/firebase";
import { Leaf } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAppStore((s) => s.setUser);
  const loadDemoData = useAppStore((s) => s.loadDemoData);
  const [email, setEmail] = useState("demo@ecopulse.ai");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isFirebaseConfigured) {
        const u = await signIn(email, password);
        setUser({ uid: u.uid, email: u.email!, displayName: u.displayName || "User", createdAt: Date.now() });
      } else {
        // Local demo mode
        setUser({ uid: "demo", email, displayName: email.split("@")[0], createdAt: Date.now() });
        loadDemoData();
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Try demo mode below.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      if (isFirebaseConfigured) {
        const u = await signInWithGoogle();
        setUser({ uid: u.uid, email: u.email!, displayName: u.displayName || "User", createdAt: Date.now() });
      } else {
        setUser({ uid: "demo", email: "google@ecopulse.ai", displayName: "Demo User", createdAt: Date.now() });
        loadDemoData();
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    setUser({ uid: "demo", email: "demo@ecopulse.ai", displayName: "Demo User", createdAt: Date.now() });
    loadDemoData();
    navigate("/dashboard");
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl items-center gap-12 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-500 to-aurora-500 shadow-lg shadow-eco-500/25">
            <Leaf className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Welcome back to <span className="gradient-text">EcoPulse</span>
          </h1>
          <p className="mt-4 text-lg text-[var(--text-soft)] text-pretty">
            Your AI-powered carbon intelligence platform. Pick up where you left off — your footprint, your challenges, your impact.
          </p>
          <div className="mt-8 space-y-3 text-sm text-[var(--text-soft)]">
            {["Track your footprint across 5 categories", "Get AI-personalized reduction tips", "Earn XP, badges, and streaks", "Chat with Pulse anytime"].map((b) => (
              <div key={b} className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-eco-500/15 text-eco-600">
                  <Sparkles className="h-3 w-3" />
                </div>
                {b}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card padding="lg" hover={false} className="card-elev">
            <div className="mb-6 text-center lg:hidden">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-500 to-aurora-500 shadow-lg">
                <Leaf className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Sign in</h2>
            <p className="mt-1 text-sm text-[var(--text-soft)]">Continue your climate journey.</p>

            {!isFirebaseConfigured && (
              <div className="mt-4 rounded-lg border border-aurora-500/30 bg-aurora-500/5 p-3 text-xs text-aurora-700 dark:text-aurora-300">
                <strong>Demo mode:</strong> Firebase isn't configured. Use demo credentials or click "Continue as demo" to explore.
              </div>
            )}

            {error && (
              <div role="alert" className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 text-xs text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-mute)]" />
                  <input
                    id="email"
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
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-mute)]" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-9 pr-10"
                    placeholder="••••••••"
                    autoComplete="current-password"
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
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-[var(--border)]" />
                  <span className="text-[var(--text-soft)]">Remember me</span>
                </label>
                <a href="#" className="text-eco-600 hover:underline">Forgot password?</a>
              </div>

              <Button type="submit" loading={loading} className="w-full" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                Sign in
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-xs text-[var(--text-mute)]">OR</span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <button
              onClick={handleGoogle}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] px-4 py-2.5 text-sm font-medium transition hover:border-eco-500/40 hover:bg-[var(--bg-soft)]"
            >
              <AtSign className="h-4 w-4" /> Continue with Google
            </button>

            <button
              onClick={handleDemo}
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-transparent px-4 py-2.5 text-sm font-medium text-[var(--text-soft)] transition hover:border-eco-500/40 hover:text-eco-600"
            >
              <Sparkles className="h-4 w-4" /> Continue as demo (instant)
            </button>

            <p className="mt-5 text-center text-sm text-[var(--text-soft)]">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-eco-600 hover:underline">Sign up</Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
