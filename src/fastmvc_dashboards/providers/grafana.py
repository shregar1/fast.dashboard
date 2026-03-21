"""
Grafana dashboard URL helper with :mod:`fastmvc_dashboards.embed_signing` for optional signed query params.

Typical pattern: ``/d/{uid}/{slug}`` — ``dashboard_uid`` is the Grafana dashboard UID; ``resource_id``
is the URL slug segment (often short name).
"""

from __future__ import annotations

from ..embed_signing import sign_embed_url


class GrafanaEmbedProvider:
    """Build a signed Grafana ``/d/{uid}/{slug}`` URL (``sig`` + ``exp`` query params)."""

    def __init__(self, site_url: str, signing_secret: bytes, dashboard_uid: str) -> None:
        self._site = site_url.rstrip("/")
        self._secret = signing_secret
        self._uid = dashboard_uid

    def build_embed_url(self, *, resource_id: str, ttl_seconds: int) -> str:
        base = f"{self._site}/d/{self._uid}/{resource_id.lstrip('/')}"
        return sign_embed_url(base, self._secret, int(ttl_seconds))
