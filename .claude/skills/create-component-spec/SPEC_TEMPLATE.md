# {ComponentName} Web Component Specification

<!--
Full implementation specification derived from developer-api.md, grounded in the actual source code of this repository.

This IS a specification — it includes shadow DOM structure, mixin chains, properties, slots, parts, events, CSS custom properties, and accessibility behavior.

Usage examples and API rationale live in developer-api.md. This spec references them by section number/name where relevant (e.g., "see developer-api.md §3 Custom separator") rather than duplicating them.

Key design decisions document deviations from developer-api.md with rationale.

Do NOT include features that no requirement supports.
DO study existing source code for reusable patterns, naming conventions, and shared modules.
-->

> This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.{camelName}Component = true`

## Key Design Decisions

<!--
One entry per significant choice. For any deviation from developer-api.md, state what it proposed, what changed, and why (e.g., existing component uses a different name for the same concept, or a shared mixin already provides equivalent functionality in a different shape).

Reference developer-api.md sections by number/name when discussing the API feature that motivated the decision.

Also document mixin selection, slot design, and event naming decisions.
-->

1. **{Decision}** — {rationale}.
2. **{Decision}** — {rationale}.

---

## Implementation

### Elements

**`<vaadin-{name}>`** — Container element

Shadow DOM:
```html
<!-- Shadow DOM structure -->
```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `propertyName` | `type` | `default` | Yes/No | Description |

| Slot | Description |
|---|---|
| (default) | Default slot content description |

| Part | Description |
|---|---|

| Event | Description |
|---|---|

| CSS Custom Property | Default | Description |
|---|---|---|

---

**`<vaadin-{name}-item>`** — Child element (if applicable)

Shadow DOM:
```html
<!-- Shadow DOM structure -->
```

| Property | Type | Default | Reflected | Description |
|---|---|---|---|---|
| `propertyName` | `type` | `default` | Yes/No | Description |

| Slot | Description |
|---|---|
| (default) | Default slot content description |

| Part | Description |
|---|---|

| Event | Description |
|---|---|

| CSS Custom Property | Default | Description |
|---|---|---|

---

## Reuse and Proposed Adjustments to Existing Modules

<!--
Only include this section if the specification requires changes to code outside the new component's own package — e.g., extending a shared mixin, adding a hook to a controller, or renaming a pattern for cross-component consistency.

For each adjustment:
- Name the file, class or mixin, and the specific change.
- Explain why the new component needs it.
- List other components that use the same code and could be affected.

Omit this section entirely if no adjustments are needed.
-->
