import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Send, Trash2, MessageSquare, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  createThread,
  deleteThread,
  deriveTitle,
  getThread,
  loadThreads,
  upsertThread,
  type ChatThread,
} from "@/lib/chat-store";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SYSTEM = `You are WorkAI — a helpful, concise, professional AI workplace assistant for working professionals. Help with drafting, summarizing, planning, researching, and brainstorming. Use markdown for structure. Be direct and useful. If you're uncertain about something, say so plainly.`;

export function ChatWindow({ threadId }: { threadId: string }) {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load thread on mount / threadId change
  useEffect(() => {
    const all = loadThreads();
    setThreads(all);
    let thread = all.find((t) => t.id === threadId);
    if (!thread) {
      thread = {
        id: threadId,
        title: "New conversation",
        updatedAt: Date.now(),
        messages: [],
      };
      upsertThread(thread);
      setThreads(loadThreads());
    }
    setInitialMessages(thread.messages);
    setReady(true);
  }, [threadId]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { system: SYSTEM },
      }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (e) => toast.error(e.message || "Chat error"),
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Persist messages when they change
  useEffect(() => {
    if (!ready) return;
    if (messages.length === 0) return;
    const existing = getThread(threadId);
    const title = existing?.title && existing.title !== "New conversation"
      ? existing.title
      : deriveTitle(messages);
    upsertThread({
      id: threadId,
      title,
      updatedAt: Date.now(),
      messages,
    });
    setThreads(loadThreads());
  }, [messages, ready, threadId]);

  // Autoscroll
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  // Focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId, status]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage({ text });
  };

  const handleNewThread = () => {
    const t = createThread();
    setThreads(loadThreads());
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = deleteThread(id);
    setThreads(remaining);
    if (id === threadId) {
      const next = remaining[0] ?? createThread();
      setThreads(loadThreads());
      navigate({ to: "/chat/$threadId", params: { threadId: next.id }, replace: true });
    }
  };

  return (
    <div className="h-[calc(100vh-3rem-2rem)] sm:h-[calc(100vh-3rem-3rem)] lg:h-[calc(100vh-3rem-4rem)] -m-4 sm:-m-6 lg:-m-8 grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)]">
      {/* Threads sidebar */}
      <div className="border-r border-border bg-card/30 flex flex-col min-h-0">
        <div className="p-3 border-b border-border">
          <Button onClick={handleNewThread} className="w-full" variant="secondary">
            <Plus className="h-4 w-4 mr-2" /> New conversation
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {threads.length === 0 && (
              <div className="text-xs text-muted-foreground text-center py-6 px-3">
                No conversations yet.
              </div>
            )}
            {threads.map((t) => (
              <div
                key={t.id}
                onClick={() => navigate({ to: "/chat/$threadId", params: { threadId: t.id } })}
                className={cn(
                  "group flex items-center gap-2 rounded-md px-2.5 py-2 cursor-pointer text-sm transition-colors",
                  t.id === threadId
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50 text-foreground/80",
                )}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-60" />
                <span className="flex-1 truncate">{t.title}</span>
                <button
                  type="button"
                  onClick={(e) => handleDelete(t.id, e)}
                  className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity p-1"
                  aria-label="Delete conversation"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Conversation */}
      <div className="flex flex-col min-h-0">
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
            {messages.length === 0 && (
              <div className="text-center py-16">
                <div
                  className="inline-grid h-12 w-12 place-items-center rounded-2xl mb-4"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-lg font-semibold">How can I help today?</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Ask me to draft, summarize, brainstorm, explain, or plan anything for your work.
                </p>
              </div>
            )}

            {messages.map((m) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              return (
                <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  {m.role === "user" ? (
                    <div
                      className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm"
                      style={{
                        background: "var(--color-primary)",
                        color: "var(--color-primary-foreground)",
                      }}
                    >
                      {text}
                    </div>
                  ) : (
                    <div className="max-w-[90%] prose-chat">
                      <ReactMarkdown>{text}</ReactMarkdown>
                    </div>
                  )}
                </div>
              );
            })}

            {status === "submitted" && (
              <div className="flex justify-start">
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking...
                </div>
              </div>
            )}

            {error && (
              <div className="text-xs text-destructive border border-destructive/30 bg-destructive/10 rounded-md p-3">
                {error.message}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border bg-background/80 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
            <div className="surface-panel p-2 flex items-end gap-2">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Message WorkAI... (Shift+Enter for newline)"
                rows={1}
                className="flex-1 resize-none border-0 bg-transparent focus-visible:ring-0 max-h-40 min-h-[40px] py-2"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                style={{ background: "var(--gradient-primary)" }}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground/70 mt-2 text-center">
              AI responses may be inaccurate. Review before relying on them. Don't paste confidential information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
