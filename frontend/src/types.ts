// Response types mirroring the existing FastAPI JSON endpoints.

export interface ServiceCheck {
  name: string;
  key: string;
  enabled: boolean;
  status: "healthy" | "unhealthy" | "skipped" | string;
  message: string;
  icon: string;
  color: string;
}

export interface HealthSummary {
  total: number;
  healthy: number;
  unhealthy: number;
  skipped: number;
  enabled: number;
  overall_status: "healthy" | "warning" | "critical" | string;
  health_percent: number;
}

export interface HealthState {
  services: ServiceCheck[];
  summary: HealthSummary;
}

export interface EndpointSample {
  key: string;
  name: string;
  method: string;
  path: string;
  description: string;
  sampleRequest: Record<string, unknown>;
  sampleQuery: Record<string, unknown>;
  sampleHeaders: Record<string, unknown>;
  enabled: boolean;
}

export interface EndpointTestResult {
  ok: boolean;
  status: number;
  latency_ms: number;
  body?: string;
  error?: string;
}

export interface QueueInfo {
  backend: string;
  name: string;
  messages: number;
  inFlight: number;
  delayed: number;
  icon: string;
  color: string;
  error?: string;
}

export interface JobWorker {
  enabled: boolean;
  workers?: number;
  active?: number;
  queueSize?: number;
  failed?: number;
  icon: string;
  color: string;
  status: string;
  error?: string;
}

export interface QueuesState {
  queues: QueueInfo[];
  jobs: {
    celery: JobWorker;
    rq: JobWorker;
    dramatiq: JobWorker;
  };
}

export interface SecretBackend {
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
  status: string;
  url?: string;
  mountPoint?: string;
  region?: string;
  prefix?: string;
  projectId?: string;
  vaultUrl?: string;
}

export interface SecretsState {
  backends: {
    vault: SecretBackend;
    aws: SecretBackend;
    gcp: SecretBackend;
    azure: SecretBackend;
  };
  health: {
    hasBackend: boolean;
    ok: boolean;
    status: string;
    icon: string;
    color: string;
  };
  envDiff: {
    hasEnv: boolean;
    diff: {
      added: number;
      removed: number;
      changed: number;
      total_vars: number;
    };
  };
}

export interface TenantRecord {
  id: string;
  name: string;
  slug?: string;
  is_active?: boolean;
  config?: { features?: string[] };
  [k: string]: unknown;
}

export interface IdpInfo {
  name: string;
  enabled: boolean;
  configured: boolean;
  redirectUri?: string;
  icon: string;
  color: string;
}

export interface FlagInfo {
  enabled: boolean;
  mode: string;
  userKey?: string;
  url?: string;
  appName?: string;
  icon: string;
  color: string;
}

export interface TenantsState {
  tenants: TenantRecord[];
  idps: Record<string, IdpInfo>;
  flags: { launchdarkly: FlagInfo; unleash: FlagInfo };
  quotas: {
    enabled: boolean;
    defaultPerMinute: number;
    defaultBurst: number;
    overrides: number;
  };
}

export interface WorkflowRun {
  id: string;
  name: string;
  status: "success" | "running" | "failed" | string;
  time: string;
}

export interface WorkflowsState {
  engine: {
    enabled: boolean;
    engineName: string | null;
    status: string;
    temporal?: string | null;
    prefect?: string | null;
    dagster?: string | null;
  };
  runs: WorkflowRun[];
}
