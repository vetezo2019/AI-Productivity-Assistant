import type { UIMessage } from "ai";

export interface ChatThread {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
}

const KEY = "workai.chat.threads.v1";

function rid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function loadThreads(): ChatThread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatThread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveThreads(threads: ChatThread[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(threads));
}

export function createThread(): ChatThread {
  const thread: ChatThread = {
    id: rid(),
    title: "New conversation",
    updatedAt: Date.now(),
    messages: [],
  };
  const all = loadThreads();
  saveThreads([thread, ...all]);
  return thread;
}

export function upsertThread(thread: ChatThread) {
  const all = loadThreads();
  const idx = all.findIndex((t) => t.id === thread.id);
  if (idx === -1) all.unshift(thread);
  else all[idx] = thread;
  all.sort((a, b) => b.updatedAt - a.updatedAt);
  saveThreads(all);
}

export function deleteThread(id: string) {
  const all = loadThreads().filter((t) => t.id !== id);
  saveThreads(all);
  return all;
}

export function getThread(id: string): ChatThread | null {
  return loadThreads().find((t) => t.id === id) ?? null;
}

export function deriveTitle(messages: UIMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New conversation";
  const text = first.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim();
  if (!text) return "New conversation";
  return text.length > 48 ? text.slice(0, 48) + "…" : text;
}
