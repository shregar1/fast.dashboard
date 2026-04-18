import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "default" | "success" | "error" | "warning" | "muted";
}) {
  const valueColor = {
    default: "text-foreground",
    success: "text-[hsl(var(--success))]",
    error: "text-destructive",
    warning: "text-[hsl(var(--warning))]",
    muted: "text-muted-foreground",
  }[tone];

  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className={cn("mt-2 text-3xl font-semibold", valueColor)}>{value}</div>
        {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}
