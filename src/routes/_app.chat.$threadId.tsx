import { createFileRoute } from "@tanstack/react-router";
import { ChatWindow } from "@/components/chat-window";

export const Route = createFileRoute("/_app/chat/$threadId")({
  component: ChatThreadPage,
});

function ChatThreadPage() {
  const { threadId } = Route.useParams();
  return <ChatWindow key={threadId} threadId={threadId} />;
}
