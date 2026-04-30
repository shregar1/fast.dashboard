"""Composite dashboard router.

Nests all dashboard routers (health, API, queues, tenants, secrets, workflows)
under a single router for inclusion in the app.
"""

from __future__ import annotations

from fastapi import APIRouter

from fastx_dashboards.core.spa import SpaDashboardRouter
from fastx_dashboards.operations.api_dashboard import ApiDashboardRouter
from fastx_dashboards.operations.health import HealthDashboardRouter
from fastx_dashboards.operations.queues_dashboard import QueuesDashboardRouter
from fastx_dashboards.operations.secrets_dashboard import SecretsDashboardRouter
from fastx_dashboards.operations.tenants_dashboard import TenantsDashboardRouter
from fastx_dashboards.operations.workflows_dashboard import WorkflowsDashboardRouter


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
