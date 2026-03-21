# Publishing **fastmvc_dashboards** to PyPI

## Prerequisites

- PyPI account and [API token](https://pypi.org/manage/account/token/)
- `pip install build twine`

## Steps

1. Bump `version` in `pyproject.toml`.
2. Update `CHANGELOG.md`.
3. Run tests: `make test` or `pytest`.
4. Build: `make build` or `python -m build`.
5. Upload:

```bash
export TWINE_USERNAME=__token__
export TWINE_PASSWORD=<pypi-token>
twine upload dist/*
```

Package name on PyPI: **fastmvc_dashboards**. Import path (typical): `fastmvc_dashboards`.

Repository: `https://github.com/shregar1/fastmvc-dashboards` (adjust org if you fork).
