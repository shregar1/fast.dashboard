"""Composite dashboard router.

Nests all dashboard routers (health, API, queues, tenants, secrets, workflows)
under a single router for inclusion in the app.
"""

from __future__ import annotations

from fastapi import APIRouter

from fast_dashboards.core.spa import SpaDashboardRouter
from fast_dashboards.operations.api_dashboard import ApiDashboardRouter
from fast_dashboards.operations.health import HealthDashboardRouter
from fast_dashboards.operations.queues_dashboard import QueuesDashboardRouter
from fast_dashboards.operations.secrets_dashboard import SecretsDashboardRouter
from fast_dashboards.operations.tenants_dashboard import TenantsDashboardRouter
from fast_dashboards.operations.workflows_dashboard import WorkflowsDashboardRouter


router = APIRouter()

# SPA shell first so its explicit routes shadow the legacy HTML pages.
# Legacy routers remain included for their JSON endpoints (e.g. /state, /endpoints).
router.include_router(SpaDashboardRouter)
router.include_router(HealthDashboardRouter)
router.include_router(ApiDashboardRouter)
router.include_router(QueuesDashboardRouter)
router.include_router(TenantsDashboardRouter)
router.include_router(SecretsDashboardRouter)
router.include_router(WorkflowsDashboardRouter)

__all__ = ["router"]
