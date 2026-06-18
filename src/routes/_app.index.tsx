import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Search, MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
});

const tools = [
  { to: "/email", title: "Smart Email Generator", desc: "Draft polished emails in seconds — set tone, intent, and key points.", icon: Mail, color: "from-violet-500 to-fuchsia-500" },
  { to: "/notes", title: "Meeting Notes Summarizer", desc: "Turn raw notes or transcripts into clean summaries with action items.", icon: FileText, color: "from-sky-500 to-cyan-500" },
  { to: "/tasks", title: "AI Task Planner", desc: "Break goals into prioritized, time-boxed steps you can act on today.", icon: ListChecks, color: "from-emerald-500 to-teal-500" },
  { to: "/research", title: "AI Research Assistant", desc: "Get structured briefings on any topic with key facts and questions.", icon: Search, color: "from-amber-500 to-orange-500" },
  { to: "/chat", title: "AI Chatbot", desc: "Free-form conversation with memory across threads, for anything else.", icon: MessageSquare, color: "from-pink-500 to-rose-500" },
] as const;

function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground mb-4">
          <Sparkles className="h-3 w-3" /> Powered by Lovable AI
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Your <span className="gradient-text">AI workplace</span>, ready when you are.
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Five focused tools that handle the busywork — drafting, summarizing, planning, researching, and chatting — so you can spend your time on what matters.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="group">
            <Card className="p-5 h-full surface-panel transition-all hover:border-primary/40 hover:-translate-y-0.5"
              style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${t.color} mb-4`}>
                <t.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold mb-1.5">{t.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              <div className="flex items-center gap-1 text-xs text-primary mt-4 opacity-60 group-hover:opacity-100 transition">
                Open <ArrowRight className="h-3 w-3" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 p-5 rounded-xl border border-border bg-card/40">
        <h4 className="text-sm font-semibold mb-1.5">Responsible AI</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          WorkAI uses large language models to assist with drafting and ideation. Outputs may contain errors, omissions, or biased content.
          Always review AI-generated material before sending, sharing, or acting on it — especially for legal, medical, financial, or personnel matters.
          Avoid pasting confidential information you wouldn't share with a third-party service.
        </p>
      </div>
    </div>
  );
}
