# AGENTS.md

## Cursor Cloud specific instructions

This is a static HTML website (commercial proposal for NID Studio) hosted on GitHub Pages at `propostanid.studio`.

### Branch structure

- `main`: deployment config only (README.md, CNAME)
- `gh-pages`: deployed static site (index.html, PDF, proposta-nid-studio.html)
- Feature branches may include `scripts/validate_proposta.py` for HTML validation

### Running the application locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080/ in a browser.

### Validation / Lint

```bash
python3 scripts/validate_proposta.py
```

This script (uses only Python standard library) validates:
- Required section IDs are present in index.html
- Internal anchor links resolve correctly
- PDF file exists and is referenced in HTML
- No iframes present

### Key notes

- No build step, no package manager, no external dependencies to install.
- Python 3.6+ is required only for the validation script (standard library only — no pip packages needed).
- The site uses Google Fonts and Unsplash images loaded from CDN; it renders without them but appears degraded.
- The PDF file (`NID_Studio_Proposta_GREMP3.pdf`) is ~12MB; avoid committing modified versions unnecessarily.
