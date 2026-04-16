# {ComponentName} Flow Developer API

<!--
Flow (Java) developer-facing API derived from requirements.md (universal + flow) and the web-component developer-api.md. Shows the most idiomatic, minimal Java API a Flow developer would use.

NOT a specification — no connector files, no @Synchronize wiring, no method bodies, no serialisation analysis. Those come in `create-component-flow-spec`.

Each section maps to one or more requirements and contains a Java code example.

The Flow API ALWAYS wraps the web component. Every attribute/property/slot/event/CSS custom property in developer-api.md must be reachable from Java — see the Web API coverage check at the end.

DO use flow-components conventions: `HasPrefix`, `HasSuffix`, `HasTooltip`, `HasThemeVariant<>`, `HasSideNavItems`-style children, nested `XxxI18n` classes.
DO NOT read Flow component method bodies — only class declarations and shared mixin interfaces.
DO NOT read web component source.
-->

## 1. {Requirement title from requirements.md}

Covers requirement(s): 1

```java
// Java usage example
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.addItem(new BreadcrumbItem("Home", "/"));
breadcrumb.addItem(new BreadcrumbItem("Electronics", "/electronics"));
breadcrumb.addItem(new BreadcrumbItem("ThinkPad X1 Carbon").asCurrent());
add(breadcrumb);
```

**Why this shape:** ...

---

## 2. {Requirement title}

Covers requirement(s): 2

```java
// Java usage example
```

**Why this shape:** ...

---

## 3. {Requirement title}

Covers requirement(s): 3, 4

```java
// Java usage example
```

**Why this shape:** ...

---

## Web API coverage check

<!--
Verify every web-component API surface from developer-api.md is reachable from Flow. For each item, state the Java API that exposes it, or explicitly mark it as "internal / not reachable from Flow" with a rationale.
-->

| Web API surface (from developer-api.md) | Flow API | Notes |
|---|---|---|
| `<vaadin-{name}>` element | `new {Name}()` | constructor |
| `<vaadin-{name}-item>` child | `addItem({Name}Item...)` | via `Has{Name}Items` interface |
| `path` attribute | `{Name}Item#setPath(String)` | — |
| `current` attribute | `{Name}Item#setCurrent(boolean)` | reflected back via `@Synchronize` in the spec |
| `slot="prefix"` | implements `HasPrefix` | from `vaadin-flow-components-base` |
| `slot="separator"` | `setSeparator(Component)` | — |
| `items` JS property | `setItems(List<{Name}Item>)` | alternative to `addItem` |
| `location` JS property | (exposed via `UI.getCurrent().getPage().getHistory()` externally) | router-agnostic — Flow does not wrap this |
| `onNavigate` callback | `addNavigateListener(ComponentEventListener<{Name}NavigateEvent>)` | — |
| `i18n` JS property | `setI18n({Name}I18n)` | serialised to JSON via Jackson |
| `navigationLabel` (i18n) | `{Name}I18n#setNavigationLabel(String)` | fluent |
| CSS custom property `--vaadin-{name}-separator-color` | (styling only — no Flow API needed) | use `HasStyle` / `getStyle()` |
