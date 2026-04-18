import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { ErrorState } from "@/components/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusDot } from "@/components/StatusDot";
import { getJSON, postJSON } from "@/lib/api";
import { formatMs, cn } from "@/lib/utils";
import type { EndpointSample, EndpointTestResult } from "@/types";
import { Play, Loader2 } from "lucide-react";

const METHOD_CLASS: Record<string, string> = {
  GET: "bg-blue-500/15 text-blue-400",
  POST: "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]",
  PUT: "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))]",
  PATCH: "bg-purple-500/15 text-purple-400",
  DELETE: "bg-destructive/15 text-destructive",
};

export default function ApiActivityPage() {
  const { data, error, isLoading, isFetching } = useQuery<EndpointSample[]>({
    queryKey: ["api-endpoints"],
    queryFn: () => getJSON<EndpointSample[]>("/dashboard/api/endpoints"),
  });

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, EndpointTestResult>>({});
  const [running, setRunning] = useState<string | null>(null);

  const selected = useMemo(
    () => data?.find((e) => e.key === selectedKey) ?? null,
    [data, selectedKey]
  );
  const result = selectedKey ? results[selectedKey] : undefined;

  async function run() {
    if (!selected) return;
    setRunning(selected.key);
    try {
      const r = await postJSON<EndpointTestResult>(`/dashboard/api/test/${selected.key}`, {});
      setResults((prev) => ({ ...prev, [selected.key]: r }));
    } catch (e) {
      setResults((prev) => ({
        ...prev,
        [selected.key]: { ok: false, status: 0, latency_ms: 0, error: String(e) },
      }));
    } finally {
      setRunning(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="API Activity"
        subtitle="Configure sample requests for your endpoints and run live checks"
        isFetching={isFetching}
      />

      {error && <ErrorState error={error} />}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Endpoints</CardTitle>
            <Badge variant="secondary">{data?.length ?? 0}</Badge>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-14" />
                ))}
              </div>
            ) : (
              <ScrollArea className="h-[560px]">
                <ul className="divide-y divide-border/60">
                  {(data ?? []).map((ep) => {
                    const r = results[ep.key];
                    const dotTone = r ? (r.ok ? "success" : "error") : "muted";
                    return (
                      <li key={ep.key}>
                        <button
                          type="button"
                          onClick={() => setSelectedKey(ep.key)}
                          className={cn(
                            "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/20",
                            selectedKey === ep.key && "bg-accent/30"
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 inline-flex h-6 shrink-0 items-center rounded px-2 text-[10px] font-semibold",
                              METHOD_CLASS[ep.method] ?? "bg-muted text-foreground"
                            )}
                          >
                            {ep.method}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{ep.name}</div>
                            <div className="truncate font-mono text-xs text-muted-foreground">{ep.path}</div>
                          </div>
                          <StatusDot tone={dotTone} className="mt-2" />
                        </button>
                      </li>
                    );
                  })}
                  {data && data.length === 0 && (
                    <li className="px-4 py-12 text-center text-sm text-muted-foreground">
                      No endpoints registered.
                    </li>
                  )}
                </ul>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Details</CardTitle>
            {selected && (
              <span
                className={cn(
                  "inline-flex h-6 items-center rounded px-2 text-[10px] font-semibold",
                  METHOD_CLASS[selected.method] ?? "bg-muted"
                )}
              >
                {selected.method}
              </span>
            )}
          </CardHeader>
          <CardContent>
            {!selected ? (
              <div className="flex h-[480px] items-center justify-center text-sm text-muted-foreground">
                Select an endpoint to view details.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    {selected.description || `${selected.method} ${selected.path}`}
                  </div>
                  <div className="mt-1 font-mono text-xs text-muted-foreground">{selected.path}</div>
                </div>

                <div>
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Sample request
                  </div>
                  <pre className="max-h-72 overflow-auto rounded-md border border-border/60 bg-secondary/40 p-3 text-xs">
                    {JSON.stringify(selected.sampleRequest ?? {}, null, 2)}
                  </pre>
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={run} disabled={running === selected.key}>
                    {running === selected.key ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Running…
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" /> Run sample
                      </>
                    )}
                  </Button>
                  {result && (
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant={result.ok ? "success" : "destructive"}>
                        {result.status || "ERR"}
                      </Badge>
                      <span className="text-muted-foreground">{formatMs(result.latency_ms)}</span>
                    </div>
                  )}
                </div>

                {result && (
                  <div>
                    <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Response
                    </div>
                    <pre className="max-h-72 overflow-auto rounded-md border border-border/60 bg-secondary/40 p-3 text-xs">
                      {result.error ?? result.body ?? "(empty)"}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
