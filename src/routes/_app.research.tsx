import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolForm } from "@/components/tool-form";

export const Route = createFileRoute("/_app/research")({
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="AI Research Assistant"
        description="Get a structured briefing on any topic. Note: based on model training data, not live web."
        icon={<Search className="h-5 w-5 text-primary" />}
      />
      <ToolForm
        ctaLabel="Research"
        system="You are a research analyst. Produce a structured briefing in markdown with these sections: '## Overview' (1 paragraph), '## Key Facts' (5-8 bullets), '## How it works / Background' (1-2 paragraphs), '## Considerations & Tradeoffs' (bullets), '## Open Questions to Investigate Further' (bullets), and '## Suggested Next Steps' (bullets). Be calibrated about uncertainty. If you're not sure, say so. Do not fabricate statistics, dates, or sources."
        fields={[
          { name: "topic", label: "Topic or question", placeholder: "e.g. What is RAG (retrieval-augmented generation) and when should we use it?", rows: 2 },
          { name: "audience", label: "Who is this briefing for?", placeholder: "e.g. Non-technical product manager", type: "input", rows: 1, required: false },
          { name: "depth", label: "Depth / focus (optional)", placeholder: "e.g. Focus on costs, vendor options, and implementation effort", rows: 3, required: false },
        ]}
        buildPrompt={(v) =>
          `Topic: ${v.topic}\nAudience: ${v.audience || "general professional"}\nFocus: ${v.depth || "balanced overview"}\n\nProduce the briefing now.`
        }
      />
    </div>
  );
}
