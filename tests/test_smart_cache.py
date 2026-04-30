"""Compatibility: implementation and full tests live under ``fastx_platform.caching``."""

from __future__ import annotations


def test_core_smart_cache_reexports_platform_singleton() -> None:
    from fastx_dashboards.core.smart_cache import smart_cache as from_dashboards
    from fastx_platform.caching import smart_cache as from_platform

    assert from_dashboards is from_platform
