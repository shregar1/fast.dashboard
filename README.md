# fastmvc_dashboards

**HTML dashboards for FastMVC:** FastAPI routers and shared layout/CSS for operational UIs—health, API activity, queues, tenants, secrets, workflows—and a reusable **`render_dashboard_page`** layout helper. Also **signed embed URLs** (time-limited HMAC) and **Metabase / Grafana** embed helpers behind one protocol.

**Python:** 3.10+ · **Dependencies:** `fastapi`, `httpx`, `loguru`, `pydantic>=2`, `sqlalchemy>=2` · **Optional:** `PyJWT` for Metabase (`pip install 'fastmvc_dashboards[metabase]'`).

## What you get

- **`sign_embed_url`**, **`verify_signed_embed_url`** — append `exp` + `sig` (HMAC-SHA256) for iframe-safe dashboard URLs.
- **`DashboardEmbedProvider`**, **`MetabaseEmbedProvider`**, **`GrafanaEmbedProvider`** — unified `build_embed_url(resource_id=..., ttl_seconds=...)`.
- **Composite `DashboardRouter`** — nested routers (health, API, queues, tenants, secrets, workflows); **lazy-imported** from the package root so `fastmvc_dashboards.layout` works without the full host app on `PYTHONPATH`.
- **`layout.render_dashboard_page`**, **`BASE_CSS`** — shared HTML shell for dashboards.
- **Per-area routers** — e.g. `HealthDashboardRouter`, `ApiDashboardRouter`, … (see `src/fastmvc_dashboards/`).

> **Note:** Many sub-routers expect host app modules (`core.datastores`, `start_utils`, configurations, …). Run inside a full FastMVC app or only import submodules you need (e.g. `layout`, `embed_signing`, `providers`).

## Install

```bash
pip install -e ./fastmvc_dashboards
```

## Optional dev extras

```bash
pip install -e ".[dev]"
```

## Related packages

- **`fastmvc_db`** — when dashboards query SQLAlchemy.
- Monorepo: [../README.md](../README.md).

## Tooling

See [CONTRIBUTING.md](CONTRIBUTING.md), [Makefile](Makefile), and [PUBLISHING.md](PUBLISHING.md).
