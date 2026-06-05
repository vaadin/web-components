# Reproducing a web-component bug

Work in `<WC_ROOT>` (the web-components checkout, resolved in SKILL.md). Run `yarn` commands from there, and write/read paths under it — your shell's working directory at launch is the skill folder, not the repo root, so always use the absolute root or `cd "<WC_ROOT>"` first.

## 1. Create the dev page

Add `<WC_ROOT>/dev/repro-<issue>.html`. The page must import `./common.js` (shared dev styles) and the component package, then place the markup that reproduces the bug.

Minimal template:

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

Notes:
- Look at an existing `dev/<component>.html` for the correct tag names, slots, and attributes — and copy from it rather than recalling markup. Confirm the component actually exists as `packages/<name>` with a `vaadin-<name>` element before using it; do not substitute a remembered theme/styling idiom for a real element (e.g. a badge is the `<vaadin-badge>` element, not a `<span theme="badge">`). This is the Phase 1.5 resolution step — get it wrong and the whole reproduction tests the wrong artifact.
- If the bug needs scripting (events, programmatic API), add it in the module `<script>` after the import. Give elements `id`s so playwright-cli can target them.
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

Start it in the background, from `<WC_ROOT>`. The default theme is `base:light`; use a theme-specific command for visual/theme bugs:

```bash
cd "<WC_ROOT>" && yarn start           # base styles, port 8000, opens /dev in a browser
cd "<WC_ROOT>" && yarn start:lumo      # Lumo theme
cd "<WC_ROOT>" && yarn start:aura      # Aura theme
```

The server serves the repo root, so the page is at:

```
http://localhost:8000/dev/repro-<issue>.html
```

It is ready almost immediately — confirm with `curl -sf http://localhost:8000/dev/repro-<issue>.html >/dev/null && echo ready` before driving the browser. The server hot-reloads on file edits, so you can tweak the page and re-snapshot without restarting.

## 3. Source layout for root-cause search

- Component implementation: `packages/<component>/src/`
- Shared mixins/utilities: `packages/component-base/src/`, `packages/a11y-base/src/`, `packages/field-base/src/`
- Theme styles: `packages/vaadin-lumo-styles/`, `packages/aura/`
- Theming infrastructure: `packages/vaadin-themable-mixin/`
