import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolForm } from "@/components/tool-form";

export const Route = createFileRoute("/_app/tasks")({
  component: TasksPage,
});

function TasksPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="AI Task Planner"
        description="Turn a goal into a concrete, prioritized plan you can act on."
        icon={<ListChecks className="h-5 w-5 text-primary" />}
      />
      <ToolForm
        ctaLabel="Build Plan"
        system="You are a productivity coach. Given a goal, deadline, and constraints, produce a focused execution plan in markdown with these sections: '## Goal' (one sentence restating the goal), '## Milestones' (3-6 numbered milestones with rough dates if a deadline is given), '## This Week' (3-7 concrete tasks as '- [ ] Task — estimated time'), '## Risks & Mitigations' (bullets), and '## Definition of Done'. Be specific, realistic, and avoid vague advice."
        fields={[
          { name: "goal", label: "What's the goal?", placeholder: "e.g. Launch a beta of our customer onboarding tool", rows: 2 },
          { name: "deadline", label: "Deadline / timeframe", placeholder: "e.g. 6 weeks from today", type: "input", rows: 1 },
          { name: "context", label: "Constraints & context", placeholder: "e.g. Team of 2 engineers, 10 hrs/week, must integrate with HubSpot, no budget for external tools", rows: 4, required: false },
        ]}
        buildPrompt={(v) =>
          `Goal: ${v.goal}\nDeadline: ${v.deadline}\nContext / constraints:\n${v.context || "(none provided)"}\n\nProduce the plan now.`
        }
      />
    </div>
  );
}
