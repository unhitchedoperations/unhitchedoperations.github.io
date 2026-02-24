# unhitchedoperations.github.io
The official website for Unhitched Operations

# TODO list
- 4. Point your domain (optional but recommended)
If you own a domain (e.g., unhitchedops.com):

In the repo, click “Add file” → “Create new file.”

Name it CNAME (no extension), and inside put just your domain, e.g.:

unhitchedops.com

Save/commit.

In your domain registrar’s DNS settings, create:

A CNAME record for www pointing to username.github.io.

Optionally use an A/ALIAS/redirect at the root to send unhitchedops.com → www.unhitchedops.com (registrar‑specific).

5. Update content going forward
To change text, click index.html → the pencil icon → edit → “Commit changes.”

The site auto‑rebuilds; refresh after ~30–60 seconds.

If you tell me your business name, tagline, and preferred call‑to‑action (call, text, or “Book now”), I can draft a ready‑to‑paste index.html tailored for you.


### Local testing
http://localhost:8000/

## GitHub Pages build and obfuscation

This repo includes a GitHub Actions workflow at `.github/workflows/pages-build-deploy.yml` that:
- builds a deployable `dist/` folder,
- minifies JS and CSS,
- obfuscates JS for production,
- deploys to the `gh-pages` branch used by GitHub Pages.

The workflow is shell-only (no external `uses:` actions), so it is compatible with strict org action policies.

### Manual run toggle (no file edit needed)

When running the workflow from the Actions tab (`workflow_dispatch`), choose:
- `obfuscate_js = true` to minify + obfuscate JS
- `obfuscate_js = false` to minify only (debug-friendly)

Automatic pushes to `main` always obfuscate JavaScript (production guardrail).

### Disable obfuscation for debugging

In `.github/workflows/pages-build-deploy.yml`, set:

`OBFUSCATE_JS: "false"`

This keeps minification enabled but skips JavaScript obfuscation.