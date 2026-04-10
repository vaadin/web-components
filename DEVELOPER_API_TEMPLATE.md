# {ComponentName} Developer API

<!--
This file describes the ideal developer-facing API for the component,
derived from the end-user use cases. It focuses on what would be the most
convenient way for a Vaadin developer to use this component in HTML / JS.

This is NOT a specification — it does not define shadow DOM structure,
internal mixins, implementation details, or cross-component consistency
constraints. Those come later in the spec-component step.

Each section maps to one or more use cases from use-cases.md and contains
concrete HTML/JS code examples showing the ideal API usage.

The code examples should use high-level Vaadin conventions:
- Tag names follow the `vaadin-{kebab-name}` pattern
- Data-driven components use an `items` array
- Common slot names: prefix, suffix, label, helper, etc.
- Events follow existing Vaadin patterns where applicable

Do NOT study the repository source code when writing this document.
DO check Vaadin documentation via MCP for similar areas — the docs describe
the intended developer experience (best practices, usage examples, patterns)
and are the right source for understanding how the API should feel.
Design the API from a developer ergonomics perspective, informed by
the use cases, Vaadin documentation (via MCP), and external design systems.
Feasibility and implementation complexity are NOT concerns at this stage.
-->

## 1. {Use case title from use-cases.md}

Covers use case(s): 1

```html
<!-- HTML/JS code example showing how a developer would ideally use
     the component for this use case -->
```

**Why this shape:** Brief note on why this API is convenient for the
developer — what makes it easy, intuitive, or consistent.

---

## 2. {Use case title}

Covers use case(s): 2

```html
<!-- Code example -->
```

**Why this shape:** ...

---

## 3. {Use case title}

Covers use case(s): 3, 4

```html
<!-- Code example -->
```

**Why this shape:** ...

---

## Cross-Cutting Concerns

### Accessibility

How the developer would configure accessibility features (e.g. labels,
keyboard interaction, ARIA attributes) across all use cases.

### Theming / Styling

How the developer would customize the component's appearance — parts,
CSS custom properties, theme variants.

### Data Binding

How the developer would bind dynamic data, react to changes, and integrate
the component with application state.

---

## Components Worth Investigating

<!--
List existing Vaadin components or framework parts that the spec-component
step should study for consistency or reuse. Explain WHY each is relevant.
This replaces blind searching through packages/.
-->

- **vaadin-component-name** — relevant because ...
- **vaadin-other-component** — relevant because ...
