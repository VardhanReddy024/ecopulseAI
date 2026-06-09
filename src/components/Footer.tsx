import { Link } from "react-router-dom";
import { Leaf, Send, Code2, Briefcase, AtSign, MapPin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-[var(--border)] bg-[var(--bg-soft)]/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5" aria-label="EcoPulse AI home">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-eco-500 to-aurora-500 shadow-lg shadow-eco-500/25">
                <Leaf className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-display text-base font-bold">EcoPulse <span className="gradient-text">AI</span></div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-mute)]">Carbon Intelligence</div>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--text-soft)]">
              AI-powered carbon footprint awareness. Understand, track, and reduce your environmental impact with personalized, actionable intelligence.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[Send, Code2, Briefcase, AtSign].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--text-mute)] transition hover:border-eco-500/40 hover:text-eco-600"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-mute)]">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/features" className="text-[var(--text-soft)] hover:text-eco-600">Features</Link></li>
              <li><Link to="/calculator" className="text-[var(--text-soft)] hover:text-eco-600">Calculator</Link></li>
              <li><Link to="/insights" className="text-[var(--text-soft)] hover:text-eco-600">AI Insights</Link></li>
              <li><Link to="/challenges" className="text-[var(--text-soft)] hover:text-eco-600">Challenges</Link></li>
              <li><Link to="/chat" className="text-[var(--text-soft)] hover:text-eco-600">Pulse Chat</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-mute)]">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-[var(--text-soft)] hover:text-eco-600">About</Link></li>
              <li><a href="#" className="text-[var(--text-soft)] hover:text-eco-600">Blog</a></li>
              <li><a href="#" className="text-[var(--text-soft)] hover:text-eco-600">Careers</a></li>
              <li><a href="#" className="text-[var(--text-soft)] hover:text-eco-600">Press</a></li>
              <li><a href="#" className="text-[var(--text-soft)] hover:text-eco-600">Partners</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-mute)]">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-[var(--text-soft)] hover:text-eco-600">Documentation</a></li>
              <li><a href="#" className="text-[var(--text-soft)] hover:text-eco-600">API Reference</a></li>
              <li><a href="#" className="text-[var(--text-soft)] hover:text-eco-600">Methodology</a></li>
              <li><a href="#" className="text-[var(--text-soft)] hover:text-eco-600">Privacy</a></li>
              <li><a href="#" className="text-[var(--text-soft)] hover:text-eco-600">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-[var(--text-mute)]">
            © 2025 EcoPulse AI. Built with <Heart className="inline h-3 w-3 text-rose-500" /> for a habitable planet.
          </p>
          <div className="flex items-center gap-2 text-xs text-[var(--text-mute)]">
            <MapPin className="h-3 w-3" /> San Francisco · Berlin · Singapore
          </div>
        </div>
      </div>
    </footer>
  );
}
