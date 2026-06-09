import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, Mail, Calendar, LogOut, Sparkles, Bell, Shield, ChevronRight, Leaf, Settings, BarChart3, Trash2 } from "lucide-react";
import { useAppStore } from "../store/appStore";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Primitives";
import { Button } from "../components/ui/Button";

export default function Profile() {
  const { user, setUser, footprintResult, xp, streak, achievements, resetAll, loadDemoData } = useAppStore();
  const navigate = useNavigate();
  const [confirmReset, setConfirmReset] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <UserIcon className="mx-auto h-12 w-12 text-eco-500" />
        <h2 className="mt-4 font-display text-2xl font-bold">Sign in to view profile</h2>
        <p className="mt-2 text-[var(--text-soft)]">Your progress, achievements, and preferences live here.</p>
        <Button className="mt-6" onClick={() => navigate("/login")}>Sign in</Button>
      </div>
    );
  }

  const unlockedBadges = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-500 to-aurora-500 text-3xl font-semibold text-white shadow-xl shadow-eco-500/30">
          {user.displayName?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold tracking-tight">{user.displayName}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[var(--text-mute)]">
            <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {user.email}</span>
            <span>·</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="success" icon={<Leaf className="h-3 w-3" />}>Climate Champion</Badge>
            <Badge variant="info" icon={<Sparkles className="h-3 w-3" />}>{xp.toLocaleString()} XP</Badge>
            {streak > 0 && <Badge variant="warning">🔥 {streak}-day streak</Badge>}
          </div>
        </div>
        <Button variant="secondary" onClick={() => navigate("/dashboard")} iconRight={<BarChart3 className="h-4 w-4" />}>
          Dashboard
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card padding="md" hover={false}>
          <div className="text-xs uppercase tracking-wider text-[var(--text-mute)]">Monthly CO₂</div>
          <div className="mt-1 font-display text-2xl font-bold">{footprintResult?.monthly ?? "—"} kg</div>
          <div className="text-xs text-[var(--text-mute)]">{footprintResult ? `${footprintResult.annual.toLocaleString()} kg/yr` : "Calculate to see"}</div>
        </Card>
        <Card padding="md" hover={false}>
          <div className="text-xs uppercase tracking-wider text-[var(--text-mute)]">Eco rating</div>
          <div className="mt-1 font-display text-2xl font-bold gradient-text">{footprintResult?.rating.label ?? "—"}</div>
          <div className="text-xs text-[var(--text-mute)]">{footprintResult ? "Based on your footprint" : "Complete calculator first"}</div>
        </Card>
        <Card padding="md" hover={false}>
          <div className="text-xs uppercase tracking-wider text-[var(--text-mute)]">Badges unlocked</div>
          <div className="mt-1 font-display text-2xl font-bold">{unlockedBadges} <span className="text-sm font-normal text-[var(--text-mute)]">of {achievements.length}</span></div>
          <div className="mt-2 flex gap-1">
            {achievements.slice(0, 8).map((a) => (
              <div key={a.id} className={`h-4 w-4 rounded ${a.unlocked ? "bg-gradient-to-br from-amber-400 to-orange-500" : "bg-[var(--border)]"}`} />
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl font-bold tracking-tight">Settings</h2>
        <Card padding="none" hover={false} className="mt-4 overflow-hidden">
          <SettingsRow icon={<UserIcon className="h-4 w-4" />} title="Account details" subtitle="Name, email, password" />
          <SettingsRow icon={<Bell className="h-4 w-4" />} title="Notifications" subtitle="Weekly summaries, challenge reminders" trailing={<Badge>On</Badge>} />
          <SettingsRow icon={<Shield className="h-4 w-4" />} title="Privacy & data" subtitle="Control what's stored and shared" />
          <SettingsRow icon={<Settings className="h-4 w-4" />} title="Preferences" subtitle="Units, language, region" />
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl font-bold tracking-tight">Demo data</h2>
        <Card padding="md" hover={false} className="mt-4">
          <p className="text-sm text-[var(--text-soft)]">Useful for exploring the app. Reloads sample footprint, challenges, and activity log.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" icon={<Sparkles className="h-4 w-4" />} onClick={loadDemoData}>Reload demo data</Button>
            {!confirmReset ? (
              <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} onClick={() => setConfirmReset(true)}>Reset all data</Button>
            ) : (
              <Button variant="danger" onClick={() => { resetAll(); setUser(null); }}>Click again to confirm</Button>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button variant="ghost" icon={<LogOut className="h-4 w-4" />} onClick={() => { setUser(null); navigate("/"); }}>
          Sign out
        </Button>
      </div>
    </div>
  );
}

function SettingsRow({ icon, title, subtitle, trailing }: { icon: React.ReactNode; title: string; subtitle: string; trailing?: React.ReactNode }) {
  return (
    <button className="group flex w-full items-center gap-4 border-b border-[var(--border)] p-4 text-left transition last:border-b-0 hover:bg-[var(--bg-soft)]">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg-soft)] text-[var(--text-soft)] transition group-hover:bg-eco-500/10 group-hover:text-eco-600">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-[var(--text-mute)]">{subtitle}</div>
      </div>
      {trailing}
      <ChevronRight className="h-4 w-4 text-[var(--text-mute)]" />
    </button>
  );
}
