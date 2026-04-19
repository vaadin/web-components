# Component Design Guidelines

This document captures high-level design principles for Vaadin web components. These guidelines inform feature design, API shape decisions, and spec authoring — before any implementation work begins.

For implementation details, see [WEB_COMPONENT_GUIDELINES.md](WEB_COMPONENT_GUIDELINES.md).

---

## Always offer a declarative API

Every Vaadin web component MUST have a declarative HTML API — a way to use the component by writing plain HTML markup, with no JavaScript required to populate it. This is true even for components whose children are normally data-driven at runtime (menus, lists, breadcrumbs, trees, tabs, nav, crumb trails, etc.).

**Why:**

- Web components are HTML first. If a component cannot be used from static HTML, it stops behaving like an HTML element.
- Developers reading the DOM in devtools, writing quick demos, or pasting examples into docs need a form they can see and edit as markup.
- Server-side rendering, static-site generation, and search-engine-visible output all depend on the component having a meaningful initial DOM.
- Testing and snapshotting are dramatically simpler when the component has a declarative form — tests can write HTML instead of wiring up JavaScript before every assertion.
- It forces the API to have a clean, serialisable shape: if every field of a data item can be expressed as an attribute, slot, or nested element, the data model is already well-defined.

**What this means in practice:**

- Child items should be real child elements (e.g. `<vaadin-side-nav-item>`, `<vaadin-tab>`, `<vaadin-breadcrumb-item>`), projectable via slots, and readable from static HTML.
- Per-item configuration should be expressible as attributes or slotted content on those child elements.
- The component must render correctly when it is first parsed from markup, before any script runs.

**Example — declarative form is the baseline:**

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/electronics">Electronics</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/electronics/laptops">Laptops</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>ThinkPad X1 Carbon</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

This must work with no JavaScript beyond the component import.

---

## Also offer a programmatic API when items are typically data-driven

When the typical real-world use of a component involves dynamically computed children (menu entries derived from route tables, breadcrumb trails derived from navigation history, list rows from a data provider, etc.), the component MUST ALSO expose a programmatic API that accepts the same data — usually as an `items` array of plain objects.

The two APIs are not alternatives; they coexist:

- The declarative form is the canonical shape and is what appears in documentation, examples, and tests by default.
- The programmatic form is what applications actually use at runtime when the content is not known at authoring time.
- Both forms MUST produce the same rendering and fire the same events; a developer should be able to switch between them without changing the component's behavior.

**Why both:**

- Declarative alone forces apps to manipulate DOM imperatively (creating child elements, setting attributes, appending) every time the data changes — slow, error-prone, and awkward with frameworks.
- Programmatic alone violates the "HTML first" principle and makes the component unusable from static markup.
- Offering both gives developers the ergonomics they need without sacrificing the component's identity as an HTML element.

**Example — same component, both APIs:**

```html
<!-- Declarative: canonical, works with no JS -->
<vaadin-menu-bar>
  <vaadin-menu-bar-item>File</vaadin-menu-bar-item>
  <vaadin-menu-bar-item>Edit</vaadin-menu-bar-item>
</vaadin-menu-bar>
```

```js
// Programmatic: same component, equivalent behaviour
document.querySelector('vaadin-menu-bar').items = [
  { text: 'File' },
  { text: 'Edit' },
];
```

---

## Which form is primary?

- **Rule of thumb:** if a component has any per-item state at all, it needs a declarative API. If that per-item content is typically computed at runtime in real applications, it also needs a programmatic API.
- **Exceptions:** a component whose children are purely internal (e.g. the button inside a `<vaadin-button>`) does not need either of these — it only has its own attributes and slots.
- When both APIs exist, document the declarative form first in the README and spec, then show the programmatic equivalent alongside.

---

## Relationship to specs

Spec files (`packages/{name}/spec/web-component-spec.md`) and their companion `web-component-api.md` MUST show both a declarative usage example and a programmatic usage example whenever both APIs exist. The "Key design decisions" section of the spec should explicitly state whether the component has a declarative API, a programmatic API, or both, and justify the choice against the use cases.

---

## Be router-agnostic

Vaadin web components MUST NOT contain integration code for any specific client-side router (Vaadin Router, React Router, Vue Router, Angular Router, etc.). Components that render navigational links should assume that an SPA router, if one is present in the application, automatically intercepts link clicks and handles navigation — the component itself does not call into a router and does not need to know one exists.

**What this means in practice:**

- Render plain `<a href="...">` elements for navigation. Let the browser activate the link by default; an SPA router (if any) will intercept the click at the document level and convert it into a client-side navigation.
- Do NOT import any router package, do NOT call router APIs, and do NOT special-case any specific router's behavior.
- Do NOT try to detect whether a router is installed. The component behaves the same either way: with no router, the browser performs a full page load; with a router, the router takes over silently.
- If the component needs to know which item represents the "current" page (for highlighting, `aria-current`, etc.), expose a router-neutral input — typically a `location` property or a per-item `path`/`current` attribute — that the application updates from whatever routing mechanism it uses. The component must not read `window.location` and react to history events on its own as its primary mechanism; the application drives it.
- If the component needs to give the application a chance to intercept activation (for example, to perform an unsaved-changes check before navigating), expose a generic callback property or fire a cancellable event. The hook must be described in router-neutral terms ("called when an item is activated"), not in terms of any specific router's API.

**Why:**

- Real applications use many different routers, and many use none at all. Baking knowledge of one router into a component makes the component unusable for everyone else.
- Navigation concerns (history management, scroll restoration, code splitting, guards, transitions) belong to the application layer. A UI component should describe *what* the user is navigating to, not *how* navigation happens.
- A plain `<a href>` is the most accessible primitive available: keyboard activation, middle-click, "open in new tab", "copy link address", focus rings, and screen-reader link semantics all work for free. Replacing it with a click handler breaks all of these.
- Server-side rendering and search-engine crawlers see real `href` attributes and can follow them without executing any JavaScript.

**Examples of acceptable router-neutral hooks** (already used by existing components):

- A `location` property whose value is opaque to the component and only serves as a change trigger so the component can re-evaluate which item is current.
- An `onNavigate` callback that receives the activated item and can return `false` to suppress the default link behavior.
- A per-item attribute like `router-ignore` that forces a full page load even when a router is present.

None of these mention a specific router by name, and all of them work equally well with any router or with no router at all.

---

## Name boolean attributes for the non-default state

HTML boolean attributes work by presence/absence: the attribute present means `true`, the attribute absent means `false`. There is no way to set a boolean attribute to `false` — you can only remove it. This creates a hard naming constraint:

**The attribute name MUST describe the non-default state** — the state that is activated when the attribute is added.

**Examples that follow this rule:**

- `disabled` — default is enabled (no attribute); adding `disabled` switches to the non-default state.
- `readonly` — default is editable; adding `readonly` switches to the non-default state.
- `required` — default is optional; adding `required` switches to the non-default state.
- `hidden` — default is visible; adding `hidden` switches to the non-default state.

**Why this matters:**

- An `enabled` attribute would mean the default state (enabled) requires every element to carry `enabled` — and removing it would disable the element, which is backwards.

**When introducing a new boolean property** on a web component, always ask: "what is the default?" and name the attribute for the opposite state. If the default is "collapsed", the attribute should be `expanded`. If the default is "open", the attribute should be `closed` (though for overlays the convention is `opened` since the default is closed).

---

## Design for API ergonomics

When shaping the developer-facing API, optimise for the common case and let complexity emerge on demand:

- **Make common cases easy.** The most frequent requirement should require the least code. A developer using the component in its most basic form should not have to configure anything.
- **Progressive disclosure.** Simple usage is simple; complex usage is possible. Additional power is opt-in through extra attributes, slots, or properties — never required for the basic case.
- **Follow existing Vaadin conventions.** When the same concept already exists in another Vaadin component, match its naming, slot structure, event shape, and theming hooks. Consistency across the component set is more valuable than local cleverness.
- **No bloat.** Every property, slot, attribute, event, part, and CSS custom property must trace back to at least one requirement. If no requirement needs it, do not add it.

---

## Consistency over novelty; completeness over minimalism

These two principles work together when reconciling an ideal API with the realities of the existing codebase:

- **Consistency over novelty.** If an existing Vaadin component solves a similar problem, match its naming, structure, and mixin usage. Deviate only when a requirement genuinely demands it — and document the deviation and its reason.
- **Completeness over minimalism.** Every requirement must be covered by the API. Missing API is worse than extra API when a real requirement is at stake. The right move when a requirement needs a hook is to add the hook — not to defer or rely on application-side workarounds.

These two rules create useful tension: consistency discourages inventing new API for its own sake, completeness discourages dropping API just to keep surface area small. Together they produce an API that is both familiar and sufficient.

---

## Composition over reimplementation

If a requirement can be fulfilled by slotting an existing Vaadin component (e.g. a `<vaadin-icon>`, a `<vaadin-tooltip>`) or by reusing an existing mixin or controller (`FocusMixin`, `TabindexMixin`, `SlotController`, `TooltipController`, etc.), prefer that over writing new code.

**Why:**

- Shared primitives already carry the accessibility, keyboard, and theming work that a new implementation would have to redo from scratch.
- Cross-component consistency benefits end users: the same tooltip in a button, a field, and a breadcrumb item behaves identically.
- Bugs fixed in a shared mixin propagate to every consumer for free.

**What this means in practice:**

- Before designing a new behaviour, check whether an existing mixin, controller, or sub-component already does it.
- If a shared module is *almost* right but needs an extension, design the extension for all consumers — not just the new component. Document the proposed change as a cross-cutting concern, not a private tweak.
- Avoid reimplementing things like focus handling, overlay positioning, slot observation, or tooltip management inside a new component; route them through the shared primitive.

---

## Ship new components as experimental

Every new component enters the library behind a feature flag and graduates to stable only after its API has been validated in practice.

**What this means in practice:**

- A new component's class declares `static experimental = true`, and the component is activated by the application via `window.Vaadin.featureFlags.{camelName}Component = true` before it is usable. The framework enforces this in `defineCustomElement`.
- The README and spec state clearly that the component is experimental and that its API may change before it becomes stable.
- Breaking changes to an experimental component's API do not require a deprecation cycle — the experimental label is the contract that says "not yet stable."
- A component graduates out of experimental only after its API has been exercised by real applications and any necessary adjustments have been made.

**Why:**

- A component's ideal API is hard to know from specification alone; feedback from real usage surfaces issues that no amount of up-front design catches.
- The feature flag makes it safe to publish early: applications that do not opt in are never affected by churn in an unstable API.
- Shipping behind a flag gives Vaadin room to iterate without breaking existing consumers.

---

## Differentiation drives scope

Every component's problem statement must explicitly name the adjacent components and patterns that it is NOT, and state what each of those does that this component does not handle — and vice versa.

This differentiation is the hard boundary that drives every later step:

- **Requirements research** accepts or rejects candidate requirements against it.
- **API design** rejects code examples that describe behaviour belonging to an adjacent component.
- **Specification** rejects features that blur the boundary.

**Why this matters:**

- Without explicit boundaries, a component tends to absorb adjacent responsibilities — a breadcrumb starts offering sibling navigation, a tab strip starts acting like a wizard, a side nav starts tracking the current page through history. Each addition seems small in isolation, but the cumulative effect is an overgrown component that does several jobs poorly instead of one job well.
- A component that overlaps with another creates confusion at the application level: developers don't know which to pick, and the two tend to diverge in subtle behaviour.
- Clear boundaries make the component's identity obvious, which in turn makes the API and documentation straightforward.

If research surfaces a compelling behaviour that falls outside the drawn boundary, the correct move is to record it in the Differentiation section as "not this component" rather than stretch the scope to include it.

---

## Universal behavioural requirements

Certain behaviours apply to EVERY Vaadin web component. These are enforced at the theme, mixin, and component-base level — they are not optional per component.

**Individual components' `requirements.md` files MUST NOT restate these as per-component requirements.** Repeated requirements drift: if "must support RTL" appears in fifty `requirements.md` files, some will get the phrasing wrong, some will add subtle contradictions, and the canonical list becomes impossible to evolve. Keep these rules here, once, and let component specs focus on what is specific to the component.

**A component's `requirements.md` may mention a universal concern only when the component genuinely adds something on top of the universal rule:**

- A concrete default value that the component introduces (e.g. a navigation landmark whose default label is `"Breadcrumb"`).
- A component-specific extension or override (e.g. a directional separator that flips in RTL).
- A specific interaction pattern that the universal rule does not pin down (e.g. an overflow menu that additionally opens with arrow keys).

When a component's requirement does mention a universal concern, it should state only the component-specific aspect and reference this section — not re-derive the universal rule.

For the implementation side of these rules, see [WEB_COMPONENT_GUIDELINES.md → Accessibility](WEB_COMPONENT_GUIDELINES.md#accessibility).

### Every interactive element has an accessible name

Every focusable element, button, link, control and landmark region the component contributes to the page has an accessible name so assistive technology can identify it. When the name comes from visible text it is automatic; when it does not (icon-only buttons, landmarks, dismiss controls, overflow controls), the component exposes a way for the application to supply one.

### Labels with defaults are customisable

Any text the component renders itself — landmark labels, placeholder strings, internal button labels ("More", "Clear selection", "Open menu"), error messages, tooltip defaults — is customisable by the application so it can be localised and adapted to the application's voice. Defaults are sensible English fallbacks, never hard-coded strings the application cannot change.

### Focus order follows visual order

Keyboard tab order and screen-reader reading order match the visual placement of elements. In RTL contexts, focus order mirrors together with the layout — if the rightmost item is first visually, it is first in focus order. Components do not reorder focus independently of their rendering.

### Right-to-left layout support

Every component lays out and behaves correctly in right-to-left contexts. Content reads right to left, directional icons flip to remain directionally correct in the reading order, keyboard and focus order mirror together with the layout, and no application-side intervention is required to make RTL work.

### Readable and tappable on small viewports

Text size, line height, and interactive-target size remain readable and tappable on small viewports. Minimum interactive target sizes follow WCAG 2.2 target-size guidance and are enforced at the theme level. Individual components do not need to restate the target-size rule per interactive element.

### Property order independence

A component must behave identically regardless of whether its properties are set before or after it is added to the DOM. Setting `disabled`, `value`, `items`, theme variants, or any other property on a disconnected element and then appending it to the document must produce the same result as appending first and setting properties afterwards. This is routinely tested and violations are treated as bugs.

### Graceful behaviour before connection

Calling action methods (`focus()`, `open()`, `scrollToIndex()`, etc.) on a component that is not yet in the DOM must silently do nothing — not throw, not queue the action for later. The caller is responsible for ensuring the component is connected before invoking actions that require a live DOM; the component is responsible for not exploding when they forget.

### No thrown errors for bad input; warnings instead

Components should not throw errors in response to application-provided values that are out of range, the wrong type after coercion, or otherwise unexpected. Instead, ignore the value or clamp it to the nearest valid state, and emit a `console.warn` so the developer sees the problem during development. Exceptions to this rule exist (e.g. `BindingActiveException` in Flow signal APIs), but the default posture is resilience: a single bad property value must not crash the entire page.

### Behaviours compose without ambiguity

When two behaviours can both be triggered by the same condition (a narrow container triggering both "truncate the label" and "collapse the item", a keyboard event that could match both a component-specific shortcut and a browser default, etc.), the interaction between them must be defined — which takes priority, what happens first, whether they can both apply. Leaving the composition undefined is a spec gap, not a stylistic choice.
