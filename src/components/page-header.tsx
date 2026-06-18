import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, description, icon, actions }: PageHeaderProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 mb-6">
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border"
            style={{ background: "var(--gradient-surface)" }}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight truncate">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}

export function AiDisclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[11px] text-muted-foreground/80 ${className}`}>
      AI-generated content may contain inaccuracies. Always review and edit before sending or sharing.
    </p>
  );
}
