# Ashima Bhasin — NOIR / PINK Portfolio (V3)

A complete static, responsive, multi-page portfolio built with semantic **HTML**, modern **CSS**, and vanilla **JavaScript**. No build system, backend, API keys, framework, or database required.

## Pages

- `index.html` — home, selected work, skills, approach
- `projects.html` — all eight searchable/filterable projects
- `projects/*.html` — eight individual case-study pages
- `about.html` — background and focus
- `experience.html` — education, project contributions, work, volunteering
- `notes.html` + `notes/*.html` — three sample authored engineering notes
- `contact.html` — contact information and email-composer form
- `resume.html` — printable résumé (browser Print → Save as PDF)

## Run locally

### Option A — VS Code Live Server

1. Unzip the archive.
2. Open **ashima-portfolio-v2** in VS Code.
3. Install the **Live Server** extension.
4. Right-click `index.html` → **Open with Live Server**.

### Option B — Python

```bash
cd ashima-portfolio-v2
python -m http.server 8000
```

Open http://localhost:8000

## Interactive features

- Multi-page navigation, with responsive mobile menu
- Live project search and category filters
- Save/favorite project cards (localStorage; no account required)
- Saved-only view and live result counts
- Interactive browser-only SQL simulation on the homepage (not the real NEXUSDB engine)
- Ambient pointer glow, scroll entrance reveals and pink/black visual system
- Print-friendly résumé and article reading-time estimates
- Global command palette (`Ctrl+K` or `Cmd+K`)
- Dark/light theme with local persistence
- Reading progress bar
- Email copy button (requires a secure context or localhost in some browsers)
- Contact form validation and prefilled `mailto:` email draft
- Semantic headings, skip link, visible focus rings, reduced-motion support

## Publish with GitHub Pages

1. Create a public GitHub repository such as `ashima-portfolio`.
2. Upload **the contents of this folder** to the repository root (not the folder itself).
3. In GitHub, select **Settings → Pages → Build and deployment → Deploy from a branch**, choose `main` and `/ (root)`, then save.
4. GitHub will display your live website address once deployment completes.

All internal links use relative paths and support GitHub Pages project repositories.

## Important — personalize before publication

- Confirm your **email address** (currently `ashimabhasin489@gmail.com`) and correct if necessary in all HTML files and `assets/site.js`.
- Check whether you wish to publicly share your location, employment, education and project details.
- Replace abstract case-study graphics with original screenshots and media once you have the rights to publish them.
- Replace generic GitHub profile links with project-specific repository links when available.
- The SQL interactive example is simulated browser logic, **not a functioning Rust database engine**.
- The contact form **does not send an email automatically**. It opens the visitor's email application; a backend or form provider is needed for server-based delivery.
- NEXUSDB, capstone, and other developing projects are deliberately labeled as unfinished. Update claims only as work is completed and tested.
- The technical notes are drafts; edit them to represent your own personal voice before publishing under your name.

## File structure

```text
ashima-portfolio-v2/
├── index.html
├── projects.html
├── about.html
├── experience.html
├── notes.html
├── contact.html
├── projects/          # 8 HTML case studies
├── notes/             # 3 HTML notes
├── assets/
│   ├── site.css
│   ├── site.js
│   ├── enhancements.js
│   ├── favicon.svg
│   ├── projects.json
│   └── notes.json
└── README.md
```

`projects.json` and `notes.json` are optional content references for editing; the public pages are static HTML, so edits to these JSON files alone won't automatically update the displayed text.

## Contact Studio V4 upgrade

The `contact.html` page now loads `assets/contact.css` and `assets/contact.js`.

Features: topic presets, subject suggestions, real-time validation, message length meter, modal preview, copy/download draft, optional local browser draft saving, confirmation before clearing, and responsive black/deep-pink styling. The page uses a `mailto:` handoff. **It does not send email by itself** and no backend or third-party inbox service is connected. The visitor must press Send in their own email application. Saved drafts are stored locally in that visitor's browser only (including typed contact details) and can be erased with Reset. Don't type sensitive information into a saved draft.

To enable automatic message delivery later, connect a secure serverless form endpoint with spam protection, rate limiting, and an appropriate privacy notice; do not put email service private API keys into browser JavaScript.
