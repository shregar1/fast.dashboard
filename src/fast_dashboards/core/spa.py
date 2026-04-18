"""SPA shell router.

Serves the Vite + React + shadcn/ui single-page app built into
`fast_dashboards/static/`. When included in the composite dashboard router
BEFORE the legacy HTML routers, its explicit routes shadow the legacy HTML
pages so visitors see the SPA while JSON endpoints remain untouched.

Usage (already wired in `core/router.py`):
    router.include_router(SpaDashboardRouter)
    router.include_router(HealthDashboardRouter)
    ...

Routes registered:
    GET /dashboard                    -> index.html (SPA shell)
    GET /dashboard/health             -> index.html
    GET /dashboard/api                -> index.html
    GET /dashboard/queues             -> index.html
    GET /dashboard/secrets            -> index.html
    GET /dashboard/tenants            -> index.html
    GET /dashboard/workflows          -> index.html
    GET /dashboard/_static/{path}     -> static asset (js/css/images)
"""

from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, HTMLResponse, Response

_STATIC_DIR = Path(__file__).resolve().parent.parent / "static"
_INDEX_HTML = _STATIC_DIR / "index.html"

_SPA_ROUTES = (
    "/dashboard",
    "/dashboard/health",
    "/dashboard/api",
    "/dashboard/queues",
    "/dashboard/secrets",
    "/dashboard/tenants",
    "/dashboard/workflows",
)

_FALLBACK_HTML = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>FastMVC Dashboard</title>
<style>body{background:#020617;color:#e5e7eb;font-family:system-ui;padding:40px;max-width:720px;margin:auto}
code{background:#0b1120;padding:2px 6px;border-radius:4px}</style></head>
<body><h1>Dashboard SPA not built</h1>
<p>The React dashboard has not been built yet. Run:</p>
<pre><code>cd fast_dashboards/frontend && npm install && npm run build</code></pre>
<p>This will emit static assets to <code>fast_dashboards/src/fast_dashboards/static/</code>.</p>
</body></html>
"""


def _read_index() -> str:
    if _INDEX_HTML.is_file():
        return _INDEX_HTML.read_text(encoding="utf-8")
    return _FALLBACK_HTML


SpaDashboardRouter = APIRouter(tags=["Dashboard SPA"])


def _make_shell_handler():
    async def _shell() -> HTMLResponse:
        return HTMLResponse(_read_index())

    return _shell


for _path in _SPA_ROUTES:
    SpaDashboardRouter.add_api_route(
        _path,
        _make_shell_handler(),
        methods=["GET"],
        response_class=HTMLResponse,
        include_in_schema=False,
    )


@SpaDashboardRouter.get(
    "/dashboard/_static/{file_path:path}",
    include_in_schema=False,
)
async def spa_static(file_path: str) -> Response:
    """Serve a Vite-built asset from the package static directory."""
    candidate = (_STATIC_DIR / file_path).resolve()
    try:
        candidate.relative_to(_STATIC_DIR.resolve())
    except ValueError as exc:
        raise HTTPException(status_code=404) from exc
    if not candidate.is_file():
        raise HTTPException(status_code=404)
    return FileResponse(candidate)


__all__ = ["SpaDashboardRouter"]
