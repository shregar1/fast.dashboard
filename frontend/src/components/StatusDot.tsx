import { cn } from "@/lib/utils";

export function StatusDot({
  tone,
  pulse,
  className,
}: {
  tone: "success" | "error" | "warning" | "muted" | "info";
  pulse?: boolean;
  className?: string;
}) {
  const bg = {
    success: "bg-[hsl(var(--success))]",
    error: "bg-destructive",
    warning: "bg-[hsl(var(--warning))]",
    muted: "bg-muted-foreground",
    info: "bg-primary",
  }[tone];
  return <span className={cn("inline-block h-2 w-2 rounded-full", bg, pulse && "pulse-dot", className)} />;
}
