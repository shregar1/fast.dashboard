import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { ErrorState } from "@/components/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { usePollingQuery } from "@/hooks/usePollingQuery";
import type { SecretBackend, SecretsState } from "@/types";
import { cn } from "@/lib/utils";

function BackendCard({ backend }: { backend: SecretBackend }) {
  const details: Array<[string, string | undefined]> = [
    ["URL", backend.url],
    ["Mount", backend.mountPoint],
    ["Region", backend.region],
    ["Prefix", backend.prefix],
    ["Project", backend.projectId],
    ["Vault URL", backend.vaultUrl],
  ];
  return (
    <div
      className={cn(
        "rounded-lg border border-l-4 p-4",
        backend.enabled ? "border-l-[hsl(var(--success))]" : "border-l-muted"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">{backend.icon}</span>
          <div className="text-sm font-medium">{backend.name}</div>
        </div>
        <Badge variant={backend.enabled ? "success" : "secondary"}>
          {backend.enabled ? "Active" : "Inactive"}
        </Badge>
      </div>
      <div className="mt-3 text-xs text-muted-foreground">{backend.status}</div>
      <div className="mt-2 space-y-1 text-xs">
        {details
          .filter(([, v]) => !!v)
          .map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span className="text-muted-foreground">{k}:</span>
              <span className="truncate font-mono">{v}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function SecretsPage() {
  const { data, error, isLoading, isFetching } = usePollingQuery<SecretsState>(
    "secrets",
    "/dashboard/secrets/state"
  );

  return (
    <div>
      <PageHeader
        title="Secrets & Config"
        subtitle="Secrets backends and environment configuration"
        isFetching={isFetching}
      />

      {error && <ErrorState error={error} />}

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      ) : data ? (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Backends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.values(data.backends).map((b, i) => (
                  <BackendCard key={i} backend={b} />
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Health Check</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl">{data.health.icon}</div>
                <div className="mt-2 text-sm font-medium">{data.health.ok ? "OK" : "Error"}</div>
                <div className="mt-1 text-xs text-muted-foreground">{data.health.status}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Environment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-semibold">{data.envDiff.diff.total_vars}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">Total vars</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold">
                      {data.envDiff.diff.added + data.envDiff.diff.removed + data.envDiff.diff.changed}
                    </div>
                    <div className="text-[10px] uppercase text-muted-foreground">Changes</div>
                  </div>
                </div>
                <Progress
                  className="mt-4"
                  value={
                    data.envDiff.diff.total_vars > 0
                      ? ((data.envDiff.diff.added + data.envDiff.diff.changed) /
                          data.envDiff.diff.total_vars) *
                        100
                      : 0
                  }
                />
                <div className="mt-2 text-center text-[10px] uppercase text-muted-foreground">
                  Diff from example
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
