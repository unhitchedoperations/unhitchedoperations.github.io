# unhitchedoperations.github.io
The official website for Unhitched Operations.

## GitHub Pages build and obfuscation

This repo includes a GitHub Actions workflow at `.github/workflows/pages-build-deploy.yml` that:
- builds a static site into the `docs/` folder,
- minifies HTML,
- minifies JS and CSS,
- obfuscates JS for production,
- commits and pushes the built `docs/` folder to `main`.

The workflow is shell-only (no external `uses:` actions), so it is compatible with strict org action policies.

### Manual run toggle (no file edit needed)

When running the workflow from the Actions tab (`workflow_dispatch`), choose:
- `obfuscate_js = true` to minify + obfuscate JS
- `obfuscate_js = false` to minify only (debug-friendly)

Automatic pushes to `main` always obfuscate JavaScript (production guardrail).