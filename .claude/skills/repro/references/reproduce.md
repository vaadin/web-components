# Building and running the reproduction

Work in `<ROOT>` (this web-components checkout): a monorepo of Lit-based packages under `packages/`. Run `yarn` commands from `<ROOT>` and write files under it — never rely on relative paths.

## 1. Create the dev page

Add `<ROOT>/dev/repro-<issue>.html`. The page must import `./common.js` (shared dev styles) and the component package, then place the markup that reproduces the bug:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Repro #<issue></title>
    <script type="module" src="./common.js"></script>
    <script type="module">
      import '@vaadin/<component>';
    </script>
  </head>
  <body>
    <!-- minimal markup that reproduces the bug -->
    <vaadin-<component>></vaadin-<component>>
  </body>
</html>
```

- Copy tag names, slots, and attributes from an existing `dev/<component>.html` rather than recalling them (Phase 1 component resolution).
- If the bug needs scripting (events, programmatic API), add it in the module `<script>` after the import. Give elements `id`s so playwright-cli can target them.
- Prefer a **minimal pair**: the failing case plus a control next to it that isolates the trigger — it also feeds the root-cause analysis.
- **Feature-flagged components** (newer components not yet enabled by default) must enable the flag *before* importing — copy the pattern from `dev/breadcrumbs.html`:
  ```html
  <script type="module">
    window.Vaadin ||= {};
    window.Vaadin.featureFlags ||= {};
    window.Vaadin.featureFlags.<flagName> = true;
    import '@vaadin/<component>';
  </script>
  ```

## 2. Run the dev server

Start it in the background, from `<ROOT>`. The default theme is `base`; use the theme-specific command for visual/theme bugs:

```bash
cd "<ROOT>" && yarn start           # base styles, port 8000
cd "<ROOT>" && yarn start:lumo      # Lumo theme
cd "<ROOT>" && yarn start:aura      # Aura theme
```

The server serves the repo root, so the page is at `http://localhost:8000/dev/repro-<issue>.html`. It is ready almost immediately — confirm with `curl -sf http://localhost:8000/dev/repro-<issue>.html >/dev/null && echo ready` before driving the browser. It does **not** hot-reload: after editing the page, reload it in the browser (`page.reload()` or re-`open`) — no server restart needed.

If port 8000 is already in use, start on another port instead — `yarn start --port 8001` — and use that port in every URL.

## 3. Maintenance branches

Branches are named `<major>.<minor>` (e.g. `24.10`, `25.1`). The branch for "up to 24.10.x" is `24.10`.

**Pick the newest line that still reproduces — not necessarily the reported minor.** A bug filed against an old minor almost always still reproduces up its major line. Start at the latest line of the reported major; drop to an older minor only if it doesn't reproduce there (then you've also learned the upper bound).

Safety — never clobber the user's work:

1. Record the starting branch: `git -C <ROOT> rev-parse --abbrev-ref HEAD`.
2. Require a clean tree. If `git -C <ROOT> status --porcelain` is non-empty, stop and ask — do not stash or discard.
3. Fetch and check out: `git -C <ROOT> fetch origin <major>.<minor> && git -C <ROOT> checkout <major>.<minor>`.
4. **Run `yarn install` after every switch between version lines** (both directions — including switching back) — dependencies drift between lines and a stale `node_modules` produces misleading results.

A **"version-specific" verdict needs evidence at both ends**: reproduce on the affected branch **and** confirm it does *not* reproduce on the current checkout. If it doesn't reproduce even on the affected branch, say so.

## 4. Stop the server

Stop the background `yarn start` task you started.
