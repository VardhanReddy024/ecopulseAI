import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Menu, X, Sun, Moon, LogOut, User as UserIcon, Sparkles, BarChart3, Calculator, MessageCircle, Trophy, Target, LogIn, LayoutDashboard } from "lucide-react";
import { useAppStore } from "../store/appStore";
import { cn } from "../utils/cn";
import type { LucideIcon } from "lucide-react";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/about", label: "About" },
];

const appLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/calculator", label: "Calculator", icon: Calculator },
  { to: "/insights", label: "AI Insights", icon: Sparkles },
  { to: "/challenges", label: "Challenges", icon: Trophy },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/chat", label: "Pulse", icon: MessageCircle },
];

export function Navbar() {
  const { theme, toggleTheme, user, setUser, resetAll } = useAppStore();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const inApp = location.pathname !== "/" && !["/features", "/how-it-works", "/about", "/login", "/signup"].includes(location.pathname);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled ? "glass-strong border-b border-[var(--border)]" : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-2.5" aria-label="EcoPulse AI home">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-eco-500 to-aurora-500 shadow-lg shadow-eco-500/25">
              <Leaf className="h-5 w-5 text-white" strokeWidth={2.5} />
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-br from-eco-500 to-aurora-500 opacity-50 blur-md transition group-hover:opacity-80" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-base font-bold tracking-tight">EcoPulse <span className="gradient-text">AI</span></span>
              <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--text-mute)]">Carbon Intelligence</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {(inApp ? appLinks : publicLinks).map((link) => {
                const Icon = (link as { icon?: LucideIcon }).icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-eco-500/10 text-eco-700 dark:text-eco-300"
                          : "text-[var(--text-soft)] hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
                      )
                    }
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--text-soft)] transition hover:border-eco-500/40 hover:text-eco-600"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] px-2.5 text-sm font-medium transition hover:border-eco-500/40"
                  aria-label="User menu"
                  aria-expanded={profileOpen}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-eco-500 to-aurora-500 text-xs font-semibold text-white">
                    {user.displayName?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:inline">{user.displayName?.split(" ")[0]}</span>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.96 }}
                      className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] shadow-xl"
                    >
                      <div className="border-b border-[var(--border)] p-3">
                        <p className="text-sm font-medium">{user.displayName}</p>
                        <p className="truncate text-xs text-[var(--text-mute)]">{user.email}</p>
                      </div>
                      <div className="p-1">
                        <button onClick={() => navigate("/profile")} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-[var(--bg-soft)]">
                          <UserIcon className="h-4 w-4" /> Profile
                        </button>
                        <button onClick={() => navigate("/dashboard")} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-[var(--bg-soft)]">
                          <BarChart3 className="h-4 w-4" /> Dashboard
                        </button>
                        <button
                          onClick={() => { setUser(null); resetAll(); }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-500/10"
                        >
                          <LogOut className="h-4 w-4" /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : !inApp ? (
              <>
                <Link to="/login" className="hidden sm:inline-flex">
                  <button className="btn btn-ghost h-9 px-3 text-sm">
                    <LogIn className="h-4 w-4" /> Sign in
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="btn btn-primary h-9 px-3 text-sm">
                    Get started
                  </button>
                </Link>
              </>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex">
                <button className="btn btn-ghost h-9 px-3 text-sm">Sign in</button>
              </Link>
            )}

            <button
              onClick={() => setOpen((o) => !o)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[var(--border)] lg:hidden"
            >
              <div className="space-y-0.5 p-3">
                {(inApp ? appLinks : publicLinks).map((link) => {
                  const Icon = (link as { icon?: LucideIcon }).icon;
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                          isActive ? "bg-eco-500/10 text-eco-700 dark:text-eco-300" : "text-[var(--text-soft)] hover:bg-[var(--bg-soft)]"
                        )
                      }
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {link.label}
                    </NavLink>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
