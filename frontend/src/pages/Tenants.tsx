import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { ErrorState } from "@/components/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusDot } from "@/components/StatusDot";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePollingQuery } from "@/hooks/usePollingQuery";
import type { TenantsState, TenantRecord, IdpInfo, FlagInfo } from "@/types";

function TenantCard({ t }: { t: TenantRecord }) {
  const letter = (t.name || t.id || "?").charAt(0).toUpperCase();
  const features = t.config?.features ?? [];
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/15 text-sm font-semibold text-primary">
        {letter}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-sm font-medium">{t.name || t.id}</div>
          <StatusDot tone={t.is_active ? "success" : "muted"} />
        </div>
        <div className="truncate text-xs text-muted-foreground">@{t.slug || t.id}</div>
        {features.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {features.slice(0, 6).map((f) => (
              <Badge key={f} variant="secondary" className="text-[10px]">
                {f}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function IdpCard({ id, idp }: { id: string; idp: IdpInfo }) {
  return (
    <div className="rounded-md border border-border/60 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{idp.icon}</span>
          <div className="text-xs font-medium">{idp.name || id}</div>
        </div>
        <StatusDot tone={idp.enabled ? "success" : "muted"} />
      </div>
      <div className="mt-2 text-[10px] text-muted-foreground">
        {idp.configured ? "✓ Configured" : "⚠ Not configured"}
      </div>
    </div>
  );
}

function FlagRow({ name, flag }: { name: string; flag: FlagInfo }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border/60 p-3">
      <div className="flex items-center gap-2">
        <span>{flag.icon}</span>
        <div>
          <div className="text-xs font-medium">{name}</div>
          <div className="text-[10px] text-muted-foreground">{flag.mode}</div>
        </div>
      </div>
      <div
        className={`inline-flex h-5 w-9 items-center rounded-full p-0.5 ${
          flag.enabled ? "bg-[hsl(var(--success))]" : "bg-muted"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-background transition-transform ${
            flag.enabled ? "translate-x-4" : ""
          }`}
        />
      </div>
    </div>
  );
}

export default function TenantsPage() {
  const { data, error, isLoading, isFetching } = usePollingQuery<TenantsState>(
    "tenants",
    "/dashboard/tenants/state"
  );

  return (
    <div>
      <PageHeader
        title="Tenants & Auth"
        subtitle="Multi-tenant configuration, identity providers, and feature flags"
        isFetching={isFetching}
      />

      {error && <ErrorState error={error} />}

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      ) : data ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Tenants</CardTitle>
              <Badge variant="secondary">{data.tenants.length}</Badge>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[480px]">
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.tenants.map((t) => (
                    <TenantCard key={t.id} t={t} />
                  ))}
                  {data.tenants.length === 0 && (
                    <div className="col-span-2 py-10 text-center text-sm text-muted-foreground">
                      No tenants configured
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Identity Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(data.idps).map(([id, idp]) => (
                    <IdpCard key={id} id={id} idp={idp} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Feature Flags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <FlagRow name="LaunchDarkly" flag={data.flags.launchdarkly} />
                <FlagRow name="Unleash" flag={data.flags.unleash} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Rate Limits</CardTitle>
                <Badge variant={data.quotas.enabled ? "success" : "secondary"}>
                  {data.quotas.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </CardHeader>
              <CardContent>
                {data.quotas.enabled ? (
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <div className="text-2xl font-semibold">{data.quotas.defaultPerMinute}</div>
                      <div className="text-[10px] uppercase text-muted-foreground">Req/min</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold">{data.quotas.defaultBurst}</div>
                      <div className="text-[10px] uppercase text-muted-foreground">Burst</div>
                    </div>
                    <div className="col-span-2 text-xs text-muted-foreground">
                      Custom overrides: {data.quotas.overrides} tenants
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">Disabled</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
