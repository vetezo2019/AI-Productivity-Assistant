import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolForm } from "@/components/tool-form";

export const Route = createFileRoute("/_app/notes")({
  component: NotesPage,
});

function NotesPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript. Get a clean summary, decisions, and action items."
        icon={<FileText className="h-5 w-5 text-primary" />}
      />
      <ToolForm
        ctaLabel="Summarize"
        system="You are an executive assistant who produces excellent meeting summaries. Given raw notes or a transcript, output a structured markdown summary with these exact sections: '## TL;DR' (2-3 sentences), '## Key Discussion Points' (bullets), '## Decisions Made' (bullets, or 'None recorded'), '## Action Items' (bullets in the format '- [ ] Owner — Task — Due date if mentioned'), and '## Open Questions' (bullets). Be faithful to the notes — do not invent details."
        fields={[
          { name: "context", label: "Meeting context (optional)", placeholder: "e.g. Weekly product sync, Sept 14 — attendees: Alice, Bob, Priya", type: "input", rows: 1, required: false },
          { name: "notes", label: "Raw notes or transcript", placeholder: "Paste your meeting notes here...", rows: 14 },
        ]}
        buildPrompt={(v) =>
          `Meeting context: ${v.context || "(not provided)"}\n\nRaw notes:\n${v.notes}\n\nProduce the structured summary now.`
        }
      />
    </div>
  );
}
