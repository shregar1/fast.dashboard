"""
Dashboard embed providers (Metabase, Grafana, …).
"""

from __future__ import annotations

from .base import DashboardEmbedProvider
from .grafana import GrafanaEmbedProvider
from .metabase import MetabaseEmbedProvider

__all__ = [
    "DashboardEmbedProvider",
    "GrafanaEmbedProvider",
    "MetabaseEmbedProvider",
]
