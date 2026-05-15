# ToggleSwitch Implementation Notes

## Task 1 — Package scaffolding and dev page

- **Commit:** (this commit)
- **Date:** 2026-05-07
- **Decisions:**
  - Class chain ships without `CheckboxMixin` for Task 1: `ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))`. This keeps the scaffolding pure — `render()` can be a literal `html\`\`` placeholder, no slot-controllers are wired, no shadow DOM template is forced. Task 2 swaps `CheckboxMixin` into the chain together with the shadow DOM template that supplies the slots its slot-controllers need.
  - `static get experimental() { return true; }` — verified that `defineCustomElement` derives the flag name from the camel-cased tag suffix (`toggle-switch` → `toggleSwitchComponent`); the recent `guidelines/02-design.md` direction prefers this over the older string-return form used by `breadcrumbs`.
  - `toggleSwitchStyles` exported as `[]` (empty array) — matches the `checkbox` / `radio-button` shape that Task 4 will populate as `[field, checkable('switch', 'toggle-switch'), toggleSwitch]`. Differs from the singular `CSSResult` used by `breadcrumbs`, but that's because `breadcrumbs` doesn't compose with the field/checkable styles.
  - `@vaadin/checkbox` is declared as a runtime dependency in `package.json` from Task 1 even though the import lands in Task 2 — the manifest is established once, here.
- **Surprises:** —
- **Spec adjustments:**
  - Task 1 in `web-component-tasks.md` rewritten to drop `CheckboxMixin` from the class chain (was adding it during scaffolding and forcing a non-empty `render()`); Task 2 now owns the mixin swap together with the full shadow DOM template.
