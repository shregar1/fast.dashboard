"""Tests for Metabase / Grafana embed providers."""

import pytest

pytest.importorskip("jwt")

from fastmvc_dashboards.providers.base import DashboardEmbedProvider
from fastmvc_dashboards.providers.grafana import GrafanaEmbedProvider
from fastmvc_dashboards.providers.metabase import MetabaseEmbedProvider


def test_metabase_embed_url():
    p = MetabaseEmbedProvider("https://metabase.example.com", "embedding-secret-32-chars-min")
    url = p.build_embed_url(resource_id="42", ttl_seconds=120)
    assert url.startswith("https://metabase.example.com/embed/dashboard/")
    assert len(url.split("/")[-1]) > 20


def test_metabase_invalid_resource_id():
    p = MetabaseEmbedProvider("https://mb.example.com", "secret")
    with pytest.raises(ValueError, match="numeric"):
        p.build_embed_url(resource_id="not-a-number", ttl_seconds=60)


def test_grafana_embed_url():
    p = GrafanaEmbedProvider(
        "https://grafana.example.com",
        b"signing-secret-bytes-here!!",
        dashboard_uid="abc123XY",
    )
    url = p.build_embed_url(resource_id="my-dashboard", ttl_seconds=300)
    assert "/d/abc123XY/my-dashboard" in url
    assert "sig=" in url and "exp=" in url


def test_dashboard_embed_provider_protocol():
    p = GrafanaEmbedProvider("https://g.example.com", b"k" * 32, "uid")
    assert isinstance(p, DashboardEmbedProvider)


def test_metabase_jwt_bytes_token_decoded(monkeypatch):
    import jwt

    def fake_encode(*_a, **_k):
        return b"token-bytes"

    monkeypatch.setattr(jwt, "encode", fake_encode)
    p = MetabaseEmbedProvider("https://mb.example.com", "secret")
    url = p.build_embed_url(resource_id="1", ttl_seconds=30)
    assert url.endswith("/token-bytes")
