import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { createThread, loadThreads } from "@/lib/chat-store";

export const Route = createFileRoute("/_app/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const threads = loadThreads();
    const target = threads[0] ?? createThread();
    navigate({ to: "/chat/$threadId", params: { threadId: target.id }, replace: true });
  }, [navigate]);
  return null;
}
