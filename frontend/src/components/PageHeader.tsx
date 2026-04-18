import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  isFetching,
}: {
  title: string;
  subtitle?: string;
  isFetching?: boolean;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <Badge variant="secondary" className="gap-1.5">
        {isFetching ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" /> Refreshing
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--success))] pulse-dot" /> Live
          </>
        )}
      </Badge>
    </div>
  );
}
