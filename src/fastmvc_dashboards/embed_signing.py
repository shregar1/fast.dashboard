"""
Time-limited signed embed URLs (HMAC-SHA256).

Adds ``exp`` (Unix seconds) and ``sig`` (hex digest) query parameters. Suitable for
iframes and reverse-proxied dashboard embeds where the secret stays server-side.
"""

from __future__ import annotations

import hashlib
import hmac
import secrets
import time
import urllib.parse
from typing import Optional


def _canonical_query(params: dict[str, str]) -> str:
    items = sorted((k, str(v)) for k, v in params.items() if k != "sig")
    return urllib.parse.urlencode(items)


def _signing_message(path: str, params: dict[str, str]) -> bytes:
    q = _canonical_query(params)
    return f"{path}?{q}".encode("utf-8")


def sign_embed_url(
    url: str,
    secret: bytes,
    ttl_seconds: int,
    *,
    extra_params: Optional[dict[str, str]] = None,
) -> str:
    """
    Append ``exp`` and ``sig`` to ``url`` (merging any existing query string).

    ``ttl_seconds`` is added to the current time to set ``exp``.
    """
    parsed = urllib.parse.urlparse(url)
    path = parsed.path or "/"
    merged: dict[str, str] = {}
    if parsed.query:
        for k, v in urllib.parse.parse_qsl(parsed.query, keep_blank_values=True):
            merged[k] = v
    exp = int(time.time()) + int(ttl_seconds)
    merged["exp"] = str(exp)
    if extra_params:
        merged.update({k: str(v) for k, v in extra_params.items()})
    msg = _signing_message(path, merged)
    sig = hmac.new(secret, msg, hashlib.sha256).hexdigest()
    merged["sig"] = sig
    new_query = urllib.parse.urlencode(sorted(merged.items()))
    return urllib.parse.urlunparse(
        (parsed.scheme, parsed.netloc, path, parsed.params, new_query, parsed.fragment)
    )


def verify_signed_embed_url(url: str, secret: bytes) -> Optional[dict[str, str]]:
    """
    Verify ``sig`` and ``exp`` on ``url``. Returns all query parameters (including ``exp``)
    if valid, or ``None`` if missing params, bad signature, or expired.
    """
    parsed = urllib.parse.urlparse(url)
    path = parsed.path or "/"
    if not parsed.query:
        return None
    params = dict(urllib.parse.parse_qsl(parsed.query, keep_blank_values=True))
    sig = params.get("sig")
    exp_s = params.get("exp")
    if not sig or exp_s is None:
        return None
    try:
        exp = int(exp_s)
    except ValueError:
        return None
    if int(time.time()) > exp:
        return None
    msg = _signing_message(path, params)
    expected = hmac.new(secret, msg, hashlib.sha256).hexdigest()
    if not secrets.compare_digest(expected, sig):
        return None
    return params
