import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { generateCompletion } from "@/lib/ai.functions";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { AiDisclaimer } from "./page-header";

interface ToolFormField {
  name: string;
  label: string;
  placeholder?: string;
  type?: "input" | "textarea";
  rows?: number;
  required?: boolean;
}

interface ToolFormProps {
  fields: ToolFormField[];
  buildPrompt: (values: Record<string, string>) => string;
  system: string;
  ctaLabel?: string;
}

export function ToolForm({ fields, buildPrompt, system, ctaLabel = "Generate" }: ToolFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const generate = useServerFn(generateCompletion);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const f of fields) {
      if (f.required !== false && !values[f.name]?.trim()) {
        toast.error(`Please fill in: ${f.label}`);
        return;
      }
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await generate({ data: { system, prompt: buildPrompt(values) } });
      setOutput(res.text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-5 surface-panel">
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <label className="text-sm font-medium">{f.label}</label>
              <Textarea
                rows={f.rows ?? (f.type === "input" ? 1 : 4)}
                placeholder={f.placeholder}
                value={values[f.name] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                className="bg-background/50 resize-none"
              />
            </div>
          ))}
          <Button type="submit" disabled={loading} className="w-full" style={{ background: "var(--gradient-primary)" }}>
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Generating...</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" /> {ctaLabel}</>
            )}
          </Button>
          <AiDisclaimer />
        </form>
      </Card>

      <Card className="p-5 surface-panel flex flex-col min-h-[400px]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Output</h3>
          {output && (
            <Button size="sm" variant="ghost" onClick={handleCopy}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="ml-1.5 text-xs">{copied ? "Copied" : "Copy"}</span>
            </Button>
          )}
        </div>

        {loading && !output && (
          <div className="flex-1 grid place-items-center text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
            </div>
          </div>
        )}

        {!loading && !output && (
          <div className="flex-1 grid place-items-center text-muted-foreground text-sm text-center px-6">
            Your AI-generated output will appear here. You can edit it after generation.
          </div>
        )}

        {output && (
          <Textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            className="flex-1 bg-background/50 resize-none font-mono text-sm leading-relaxed min-h-[300px]"
          />
        )}

        {output && (
          <details className="mt-3">
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
              Preview rendered markdown
            </summary>
            <div className="prose-chat mt-2 p-3 rounded-md bg-background/40 border border-border">
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          </details>
        )}
      </Card>
    </div>
  );
}
