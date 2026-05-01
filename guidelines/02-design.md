# Design

These are high-level principles to apply when shaping a new component's
API and behaviour, before any implementation work begins. Implementation
mechanics live in the chapters that follow.

## Declarative vs Imperative API

### Declarative HTML API

- Whenever possible, Vaadin web components must provide declarative HTML
  API, to allow initializing the component by writing plain HTML markup,
  with no JavaScript required.
- Declarative API is a default choice for components that manage a set of
  children that are normally data-driven at runtime (such as accordion,
  list-box, navigation, tabs).
- Overlay-based components (dialog, confirm-dialog, popover) must prefer
  HTML API over the deprecated `renderer` API — it is leftover from
  pre-V25 era, where teleportation was used.
- Declarative API makes testing easier by allowing to use HTML fixtures
  (or Lit templates), with the configuration driven by attributes and
  nested elements assigned to slots.
- Server-side rendering and static site generation are not a priority
  for Vaadin components. However, HTML API is still beneficial in terms
  of having a meaningful initial DOM.
- Clean HTML API makes it easier for developers to read and modify the
  DOM in DevTools, as well as to author documentation with code examples
  and implement quick demos.

### Imperative API

- Imperative, data-driven API is acceptable for components that manage
  complex DOM structures and generally is recommended in 2 different
  cases:
  - Component uses virtualizer engine to manage reusing DOM nodes.
    Examples: Grid and its derivatives (GridPro, CRUD), ComboBox and
    MultiSelectComboBox, VirtualList.
  - Component uses complex nested structure that would not be possible to
    implement simply with `<slot>` without moving or modifying the HTML
    declared by the user, which would be intrusive. Examples: ContextMenu,
    MenuBar.
- Combining imperative API with declarative (HTML) API is possible in
  some cases (example: Select component) but should generally be avoided
  to keep implementation simpler.
- Imperative API is usually represented by either `items` property
  (setting items eagerly) or `dataProvider` property (lazy-loading, used
  by Flow components under the hood).
- When providing TypeScript types for `items` property, use
  `{ComponentName}ItemData` to avoid naming conflicts as e.g. `SelectItem`
  can be a TS type for `vaadin-select-item`.
- Components offering imperative API can accept generator-like function
  properties to allow applying state based on the item — e.g.
  `itemLabelGenerator` or `itemClassNameGenerator`.

## Naming Conventions

### Boolean attributes naming

HTML boolean attributes work by presence/absence: present means `true`,
absent means `false`. There is no way to set a boolean attribute to
`false` — you can only remove it. The attribute name MUST therefore
describe the **non-default state** — the state that's activated when the
attribute is added.

Examples that follow the rule: `disabled` (default: enabled),
`readonly` (default: editable), `required` (default: optional),
`hidden` (default: visible). An `enabled` attribute would be backwards.

### Protected API extendability

When designing internal protected API for reusing by different
components, aim to avoid hardcoding tag names and instead make them
configurable. A common convention is using `_tagNamePrefix` in a mixin
and then overriding it in components consuming this mixin. Examples
include: combo-box, multi-select-combo-box and time-picker, context-menu
and menu-bar.

## Design Principles

### API ergonomics

Optimise for the common case and let complexity emerge on demand:

- **Make common cases easy.** The most frequent requirement should
  require the least code; basic usage should not need any configuration.
- **Progressive disclosure.** Additional power is opt-in through extra
  attributes, slots, or properties — never required for the basic case.
- **No bloat.** Every property, slot, attribute, event, part, and CSS
  custom property must trace back to a real need. If nothing needs it,
  do not add it.

### Consistency over novelty

If an existing Vaadin component solves a similar problem, match its
naming, structure, and mixin usage. Deviate only when a real requirement
demands it, and document the deviation.

### Completeness over minimalism

Missing API is worse than extra API when a real use case is at stake. The
right move when a use case needs a hook is to add the hook — not to
defer or rely on application-side workarounds.

### Composition over re-implementation

If the requirement can be fulfilled by slotting an existing Vaadin
component (e.g. `<vaadin-icon>`, `<vaadin-tooltip>`) or reusing an
existing mixin or controller, prefer that over writing new code. Shared
primitives already carry the keyboard, theming, and edge-case work that a
new implementation would have to redo. See
[Common packages](05-common-packages.md) for the catalogue.

### Ship new components as experimental

Every new component enters the library behind a feature flag and
graduates to stable only after its API has been validated in real use.
The class declares `static experimental = true`; applications opt in via
`window.Vaadin.featureFlags.{camelName}Component = true`. Breaking
changes to an experimental API do not require a deprecation cycle — the
flag is the contract that says "not yet stable."

## Behaviour principles

### Graceful behaviour before connection

Calling action methods (`focus()`, `open()`, `scrollToIndex()`, etc.) on
a component that is not yet in the DOM must silently do nothing — not
throw, not queue the action for later. The caller is responsible for
ensuring the component is connected before invoking actions; the
component is responsible for not exploding when they forget.

### Property order independence

A component must behave identically regardless of whether properties are
set before or after it is added to the DOM. Setting `disabled`, `value`,
`items`, theme variants, etc. on a disconnected element and then
appending it must produce the same result as appending first and setting
properties afterwards.

### No error throws for user input

Components should not throw in response to application-provided values
that are out of range, the wrong type after coercion, or otherwise
unexpected. Emit a `console.warn` so the developer sees the problem
during development. The default posture is resilience: a single bad
property value must not crash the page.

### Do not clamp the value exceeding limits

When a value violates a constraint such as `min` or `max`, the component
must keep the value as set and mark itself invalid — it must not silently
adjust the value to the nearest valid one. Silent clamping surprises both
developers (who notice their value changed without being asked) and end
users (who see something different from what was assigned). Validation is
the right channel for surfacing the problem.

## UX principles

### RTL support

Components must lay out correctly in right-to-left contexts without any
application-side intervention. Use logical CSS properties
(`margin-inline-start`, `padding-inline-end`, `inset-inline-start`, etc.)
and mirror directional icons. See [Theming](10-theming.md) for the
implementation conventions.

### Small viewport support

Text size, line height, and layout must remain usable on small viewports.
Components do not hard-code minimum sizes; baselines come from the theme.

## Minimal clickable area

Components must ensure interactive elements meet the WCAG 2.2 minimum
target size. Individual components apply the necessary CSS — typically
padding — in their base styles so that elements like buttons, checkboxes,
and radios have at least 24px hit areas.
