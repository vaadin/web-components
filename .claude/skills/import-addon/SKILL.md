---
name: import-addon
description: Creates a new Vaadin web component based on the existing Vaadin component factory add-on
argument-hint: <addon-url> <component-name>
allowed-tools: Read(*),Glob(*),Grep(*),Bash(gh issue *),Bash(gh search *),Bash(gh repo *),Bash(gh api *),Bash(mkdir -p spec),WebSearch(*),WebFetch(*),Write(spec/:*)
---

You are a developer planning the import of a Vaadin component factory add-on from `$0` into this monorepo as a new web component named `$1`.

The output is ONLY a spec written to `spec/$1-web-component.md`. No code.

## Steps

### 1. Research the add-on and prior discussion

- Read the add-on source at `$0`, focusing on its **public API**: properties, attributes, methods, events, slots, CSS custom properties, `part` attributes.
- Search GitHub issues in `vaadin/web-components` (open AND closed) for mentions of this component. Components may be referred to by different names — search broadly.
- Search `vaadin-component-factory` org for a matching Flow component (`gh search repos --owner=vaadin-component-factory <keyword>`). If found, check its API for additional features or requirements.

### 2. Analyze reference libraries

Survey these libraries for the equivalent component. Focus on: common API surface, accessibility patterns (ARIA roles, keyboard interaction), and edge cases.

- **MUI** (mui.com) — widely used, strong API design
- **React Aria / React Spectrum** (Adobe) — accessibility-first behavior patterns
- **Base UI** (base-ui.com) — headless, WAI-ARIA compliant
- **Web Awesome** (webawesome.com) — web components reference
- **Lion** (lion.js.org) — accessible web components by ING

If a docs page returns empty or unusable content (SPA shell), use `WebSearch` to find the API reference or GitHub source instead.

### 3. Analyze this monorepo for patterns

- Read `WEB_COMPONENT_GUIDELINES.md` for build conventions.
- Find similar components in `packages/` — look at their mixins, DOM structure, theming, and event patterns.
- Identify reusable mixins (ElementMixin, ThemableMixin, FocusMixin, etc.) and shared styles.
- **Compare the add-on's API against Vaadin naming conventions.** Flag deviations and propose Vaadin-aligned alternatives.

### 4. Write the spec to `spec/$1-web-component.md`

Create the `spec/` directory in the repo root if needed, then write the spec using this structure:

```markdown
# <component-name> Web Component

## Usage Examples

<!-- HTML snippets for the 3-5 most common use cases -->

## Public API

- **Properties**
- **Methods**
- **Events**
- **Slots**
- **Parts**
- **CSS Custom Properties**

## Accessibility

- Keyboard interaction
- ARIA roles and attributes
- Screen reader behavior

## Phased Implementation Plan

### Phase 1 — MVP

<!-- Core functionality, minimal API surface -->

### Phase 2+

<!-- Additional features, each phase scoped clearly -->

## Migration Notes

<!-- Differences from the add-on that existing users should know -->

## Documentation Outline

<!-- Sections for vaadin.com/docs -->
```

## Guidelines

- Scale depth to component complexity — a simple presentational component needs a shorter spec than a complex interactive one.
- Phase 1 should get the basics right with a stable API. Later phases add features without breaking it.
- API means: public properties/attributes, public methods, DOM structure with `part` attributes, CSS custom properties, state attributes, events.
- Be thorough in research but concise in the spec.
