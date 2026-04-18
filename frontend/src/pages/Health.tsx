import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { MetricCard } from "@/components/MetricCard";
import { StatusDot } from "@/components/StatusDot";
import { ErrorState } from "@/components/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { usePollingQuery } from "@/hooks/usePollingQuery";
import type { HealthState, ServiceCheck } from "@/types";

function tone(status: string): "success" | "error" | "muted" {
  if (status === "healthy") return "success";
  if (status === "unhealthy") return "error";
  return "muted";
}

function ServiceCard({ svc }: { svc: ServiceCheck }) {
  const t = tone(svc.status);
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="text-2xl leading-none">{svc.icon}</div>
            <div>
              <div className="font-medium">{svc.name}</div>
              <div className="text-xs text-muted-foreground">{svc.key}</div>
            </div>
          </div>
          <StatusDot tone={t} pulse={svc.status === "healthy"} />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Badge variant={t === "success" ? "success" : t === "error" ? "destructive" : "secondary"}>
            {svc.status}
          </Badge>
          <span className="text-xs text-muted-foreground">{svc.enabled ? "enabled" : "disabled"}</span>
        </div>
        {svc.message && <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{svc.message}</p>}
      </CardContent>
    </Card>
  );
}

export default function HealthPage() {
  const { data, error, isLoading, isFetching } = usePollingQuery<HealthState>(
    "health",
    "/dashboard/health/state"
  );

  return (
    <div>
      <PageHeader
        title="Service Health"
        subtitle="Real-time monitoring of infrastructure services and datastores"
        isFetching={isFetching}
      />

      {error && <ErrorState error={error} />}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-5">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Health Score
                </div>
                <div className="mt-2 text-3xl font-semibold">{data.summary.health_percent}%</div>
                <Progress className="mt-3" value={data.summary.health_percent} />
              </CardContent>
            </Card>
            <MetricCard label="Healthy" value={data.summary.healthy} tone="success" />
            <MetricCard label="Unhealthy" value={data.summary.unhealthy} tone="error" />
            <MetricCard
              label="Disabled"
              value={data.summary.skipped}
              tone="muted"
              hint={`${data.summary.enabled}/${data.summary.total} enabled`}
            />
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.services.map((svc) => (
                  <ServiceCard key={svc.key} svc={svc} />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
