import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { ErrorState } from "@/components/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusDot } from "@/components/StatusDot";
import { usePollingQuery } from "@/hooks/usePollingQuery";
import type { JobWorker, QueueInfo, QueuesState } from "@/types";

function statusTone(s: string): "success" | "error" | "warning" | "muted" {
  if (s === "active" || s === "configured") return "success";
  if (s === "error") return "error";
  if (s === "idle") return "warning";
  return "muted";
}

function QueueRow({ q }: { q: QueueInfo }) {
  return (
    <div className="rounded-lg border border-border/60 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">{q.icon}</span>
          <div>
            <div className="text-sm font-medium">{q.name}</div>
            <div className="text-xs uppercase text-muted-foreground">{q.backend}</div>
          </div>
        </div>
        <Badge variant={q.error ? "destructive" : "success"}>{q.error ? "Error" : "Active"}</Badge>
      </div>
      {q.error ? (
        <div className="mt-3 text-xs text-destructive">{q.error}</div>
      ) : (
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            { l: "Messages", v: q.messages },
            { l: "In flight", v: q.inFlight },
            { l: "Delayed", v: q.delayed },
          ].map(({ l, v }) => (
            <div key={l} className="rounded-md bg-secondary/40 p-2">
              <div className="text-lg font-semibold">{v}</div>
              <div className="text-[10px] uppercase text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WorkerCard({ name, icon, worker }: { name: string; icon: string; worker: JobWorker }) {
  const rows: Array<[string, React.ReactNode]> = [];
  if (worker.workers !== undefined) rows.push(["Workers", worker.workers]);
  if (worker.active !== undefined) rows.push(["Active", worker.active]);
  if (worker.queueSize !== undefined) rows.push(["Queue", worker.queueSize]);
  if (worker.failed !== undefined) rows.push(["Failed", worker.failed]);
  rows.push(["Status", worker.status]);

  return (
    <div className="rounded-lg border border-border/60 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <div>
            <div className="text-sm font-medium">{name}</div>
            <div className="text-xs text-muted-foreground">{worker.enabled ? "enabled" : "disabled"}</div>
          </div>
        </div>
        <StatusDot tone={statusTone(worker.status)} pulse={worker.status === "active"} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {rows.slice(0, 3).map(([l, v]) => (
          <div key={l} className="rounded-md bg-secondary/40 p-2">
            <div className="truncate text-lg font-semibold">{v}</div>
            <div className="text-[10px] uppercase text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>
      {worker.error && <div className="mt-2 text-xs text-destructive">{worker.error}</div>}
    </div>
  );
}

export default function QueuesPage() {
  const { data, error, isLoading, isFetching } = usePollingQuery<QueuesState>(
    "queues",
    "/dashboard/queues/state"
  );

  return (
    <div>
      <PageHeader
        title="Queues & Jobs"
        subtitle="Message queues and background workers"
        isFetching={isFetching}
      />

      {error && <ErrorState error={error} />}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Message Queues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28" />)
            ) : data?.queues.length ? (
              data.queues.map((q, i) => <QueueRow key={`${q.backend}-${i}`} q={q} />)
            ) : (
              <div className="py-10 text-center text-sm text-muted-foreground">No queues configured</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Job Workers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28" />)
            ) : data ? (
              <>
                <WorkerCard name="Celery" icon="🌿" worker={data.jobs.celery} />
                <WorkerCard name="RQ" icon="🔴" worker={data.jobs.rq} />
                <WorkerCard name="Dramatiq" icon="🎭" worker={data.jobs.dramatiq} />
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
