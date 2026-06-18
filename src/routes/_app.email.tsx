import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolForm } from "@/components/tool-form";

export const Route = createFileRoute("/_app/email")({
  component: EmailPage,
});

function EmailPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Smart Email Generator"
        description="Generate professional emails tailored to your recipient, tone, and intent."
        icon={<Mail className="h-5 w-5 text-primary" />}
      />
      <ToolForm
        ctaLabel="Draft Email"
        system="You are an expert business writer. Write clear, professional emails in the requested tone. Use a proper greeting, concise body paragraphs, and a sign-off. Output ONLY the email — subject line on the first line as 'Subject: ...', then a blank line, then the email body. Use plain text, no markdown formatting."
        fields={[
          { name: "recipient", label: "Recipient", placeholder: "e.g. My manager, Sarah from Acme Corp, the engineering team", type: "input", rows: 1 },
          { name: "intent", label: "What is the email about?", placeholder: "e.g. Asking for a 1-week deadline extension on the Q3 report due to a data issue.", rows: 4 },
          { name: "tone", label: "Tone", placeholder: "e.g. Professional but warm / Direct / Apologetic / Enthusiastic", type: "input", rows: 1 },
          { name: "points", label: "Key points to include (optional)", placeholder: "- Mention I've already drafted sections 1-3\n- Propose next Friday as the new date", rows: 3, required: false },
        ]}
        buildPrompt={(v) =>
          `Write an email with the following details.\n\nRecipient: ${v.recipient}\nTone: ${v.tone}\n\nPurpose / context:\n${v.intent}\n\nKey points to include:\n${v.points || "(none specified — use your judgment)"}\n\nProduce the subject line and email body now.`
        }
      />
    </div>
  );
}
