import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { ErrorState } from "@/components/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusDot } from "@/components/StatusDot";
import { MetricCard } from "@/components/MetricCard";
import { usePollingQuery } from "@/hooks/usePollingQuery";
import { cn } from "@/lib/utils";
import type { WorkflowsState } from "@/types";

const ENGINES = [
  { id: "temporal", name: "Temporal", icon: "⏳" },
  { id: "prefect", name: "Prefect", icon: "🐦" },
  { id: "dagster", name: "Dagster", icon: "🎯" },
];

function runTone(s: string) {
  if (s === "success") return "success" as const;
  if (s === "failed") return "error" as const;
  if (s === "running") return "info" as const;
  return "muted" as const;
}

export default function WorkflowsPage() {
  const { data, error, isLoading, isFetching } = usePollingQuery<WorkflowsState>(
    "workflows",
    "/dashboard/workflows/state"
  );

  const engine = data?.engine;
  const runs = data?.runs ?? [];
  const stats = {
    total: runs.length,
    success: runs.filter((r) => r.status === "success").length,
    failed: runs.filter((r) => r.status === "failed").length,
    running: runs.filter((r) => r.status === "running").length,
  };

  return (
    <div>
      <PageHeader
        title="Workflows"
        subtitle="Orchestrate and monitor background workflows"
        isFetching={isFetching}
      />

      {error && <ErrorState error={error} />}

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      ) : data ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Workflow Engine</CardTitle>
              <Badge variant={engine?.enabled ? "success" : "secondary"}>
                {engine?.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-border/60 p-4">
                  <div className="text-sm text-muted-foreground">Active engine</div>
                  <div className="mt-1 text-xl font-semibold capitalize">
                    {engine?.engineName ?? "Not configured"}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">{engine?.status}</div>
                  {engine?.temporal && (
                    <div className="mt-3 font-mono text-xs text-muted-foreground">
                      Address: {engine.temporal}
                    </div>
                  )}
                  {engine?.prefect && (
                    <div className="mt-3 font-mono text-xs text-muted-foreground">
                      API URL: {engine.prefect}
                    </div>
                  )}
                  {engine?.dagster && (
                    <div className="mt-3 font-mono text-xs text-muted-foreground">
                      gRPC: {engine.dagster}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {ENGINES.map((e) => {
                    const active = engine?.engineName === e.id;
                    return (
                      <div
                        key={e.id}
                        className={cn(
                          "flex flex-col items-center justify-center rounded-md border p-3 text-center transition-opacity",
                          active ? "border-primary/60 bg-primary/10" : "border-border/60 opacity-50"
                        )}
                      >
                        <span className="text-2xl">{e.icon}</span>
                        <span className="mt-1 text-xs font-medium">{e.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                <MetricCard label="Total runs" value={stats.total} />
                <MetricCard label="Success" value={stats.success} tone="success" />
                <MetricCard label="Failed" value={stats.failed} tone="error" />
                <MetricCard label="Running" value={stats.running} tone="warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Runs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {runs.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No recent workflow runs
                </div>
              ) : (
                runs.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-border/60 p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <StatusDot tone={runTone(r.status)} pulse={r.status === "running"} />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{r.name}</div>
                        <div className="truncate text-[10px] text-muted-foreground">{r.id}</div>
                      </div>
                    </div>
                    <div className="shrink-0 text-xs text-muted-foreground">{r.time}</div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
