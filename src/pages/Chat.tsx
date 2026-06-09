import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, User as UserIcon, Trash2, Loader2, Bot, Leaf } from "lucide-react";
import { useAppStore } from "../store/appStore";
import { sendMessage, SUGGESTED_PROMPTS } from "../services/chatbot";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { cn } from "../utils/cn";

export default function Chat() {
  const { chatHistory, addChatMessage, clearChat, footprintResult, footprintInput } = useAppStore();
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [chatHistory, pending]);

  const handleSend = async (text: string) => {
    const message = text.trim();
    if (!message || pending) return;
    addChatMessage({ role: "user", content: message });
    setInput("");
    setPending(true);
    try {
      const reply = await sendMessage(message, chatHistory, { footprint: footprintResult ?? undefined, input: footprintInput ?? undefined });
      addChatMessage({ role: "assistant", content: reply });
    } finally {
      setPending(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-5xl flex-col px-4 py-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-500 to-aurora-500 text-white shadow-lg shadow-eco-500/25">
              <Bot className="h-5 w-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-eco-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-eco-500" />
            </span>
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight">Pulse</h1>
            <p className="text-xs text-[var(--text-mute)]">Your AI sustainability copilot</p>
          </div>
        </div>
        {chatHistory.length > 0 && (
          <Button variant="ghost" size="sm" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={clearChat}>
            Clear
          </Button>
        )}
      </div>

      {/* Chat area */}
      <Card padding="none" hover={false} className="flex flex-1 flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {chatHistory.length === 0 ? (
            <EmptyState onSelect={() => {}} />
          ) : (
            <div className="space-y-4">
              {chatHistory.map((m) => (
                <MessageBubble key={m.id} role={m.role} content={m.content} />
              ))}
              {pending && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-eco-500 to-aurora-500 text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--bg-soft)]/60 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-soft)]">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Pulse is thinking…
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Suggestions (only when empty) */}
        {chatHistory.length === 0 && (
          <div className="border-t border-[var(--border)] px-4 py-3 sm:px-6">
            <div className="mb-2 text-xs font-medium text-[var(--text-mute)]">Try asking</div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="rounded-full border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-1.5 text-xs text-[var(--text-soft)] transition hover:border-eco-500/40 hover:text-eco-600"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-[var(--border)] p-3 sm:p-4">
          <div className="flex items-end gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]/40 p-2 focus-within:border-eco-500/50 focus-within:bg-[var(--bg-elev)]">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask Pulse anything about sustainability…"
              rows={1}
              className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-[var(--text-mute)]"
              style={{ maxHeight: "120px" }}
            />
            <Button
              size="sm"
              onClick={() => handleSend(input)}
              disabled={!input.trim() || pending}
              icon={pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            >
              Send
            </Button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-[var(--text-mute)]">
            Pulse can make mistakes. Verify important information independently.
          </p>
        </div>
      </Card>
    </div>
  );
}

function EmptyState(_: { onSelect: (s: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-500 to-aurora-500 text-white shadow-lg">
        <Leaf className="h-7 w-7" />
      </div>
      <h2 className="font-display text-2xl font-bold tracking-tight">Hi, I'm Pulse 👋</h2>
      <p className="mt-2 max-w-md text-sm text-[var(--text-soft)]">
        I help you understand and reduce your carbon footprint with personalized, practical advice grounded in real science.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 max-w-2xl">
        {[
          { icon: Sparkles, title: "Personalized", desc: "Advice tailored to your actual footprint" },
          { icon: Bot, title: "Always available", desc: "Quick answers, any time of day" },
        ].map((f) => (
          <div key={f.title} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]/40 p-3 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-eco-500/10 text-eco-600">
              <f.icon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-medium">{f.title}</div>
              <div className="text-xs text-[var(--text-mute)]">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white",
          isUser
            ? "bg-gradient-to-br from-indigo-500 to-purple-600"
            : "bg-gradient-to-br from-eco-500 to-aurora-500"
        )}
      >
        {isUser ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]",
          isUser
            ? "rounded-tr-sm bg-eco-500 text-white"
            : "rounded-tl-sm border border-[var(--border)] bg-[var(--bg-soft)]/60 text-[var(--text)]"
        )}
      >
        {content.split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-2" : ""}>
            {renderInline(line)}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

function renderInline(text: string): React.ReactNode {
  // Bold and inline code
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|`(.+?)`/g;
  let last = 0;
  let m;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<strong key={key++} className="font-semibold">{m[1]}</strong>);
    if (m[2]) parts.push(<code key={key++} className="rounded bg-black/20 px-1 py-0.5 text-[0.85em] font-mono">{m[2]}</code>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
