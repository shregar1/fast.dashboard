# Contributing to fastmvc_dashboards

Thank you for your interest in contributing.

## Development setup

```bash
git clone https://github.com/shregar1/fastmvc-dashboards.git
cd fastmvc-dashboards
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\\Scripts\\activate
pip install -e ".[dev]" || pip install -e .
pip install -r requirements.txt  # optional dev stack
pre-commit install
```

## Quality checks

```bash
make test
make lint
make format
```

See `Makefile` for all targets.

## Commits

Use clear commit messages (e.g. conventional commits: `feat:`, `fix:`, `docs:`).

Pull requests against `main` are welcome.
