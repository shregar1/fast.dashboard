import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ErrorState({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <Card className="border-destructive/40">
      <CardContent className="flex items-start gap-3 p-5">
        <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
        <div>
          <div className="text-sm font-medium text-destructive">Failed to load data</div>
          <div className="mt-0.5 text-xs text-muted-foreground">{message}</div>
        </div>
      </CardContent>
    </Card>
  );
}
