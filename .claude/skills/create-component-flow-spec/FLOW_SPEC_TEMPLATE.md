# {ComponentName} Flow Component Specification

<!--
Full Flow implementation specification derived from flow-api.md, grounded in the actual source of the flow-components repository.

This IS a specification — it includes module layout, class declarations, annotations, shared mixin interfaces, method signatures, @Synchronize properties, events, i18n, theme variants, connector plan, server/client sync concerns, serialisation, and TestBench elements.

Usage examples and API rationale live in flow-api.md. This spec references them by section number/name where relevant (e.g., "see flow-api.md §3 Programmatic items") rather than duplicating them.

Key design decisions document deviations from flow-api.md with rationale.

Do NOT include features that no universal/flow requirement supports.
DO study existing flow-components source for reusable shared mixins, naming conventions, and shared modules.
-->

> Wraps the experimental web component `<vaadin-{name}>`. Flow users enable it via the same feature flag surfaced by the web component (see web component spec / `web-component-api.md`).

## Key Design Decisions

<!--
One entry per significant choice. For any deviation from flow-api.md, state what it proposed, what changed, and why (e.g., existing Flow component uses a different name for the same concept, or a shared mixin already provides equivalent functionality in a different shape).

Reference flow-api.md sections by number/name when discussing the API feature that motivated the decision.

Also document:
- Mixin interface selection (which `Has*` interfaces from `vaadin-flow-components-base` are implemented, why)
- Constructor overloads (which overloads are offered and why)
- Event class naming
- Whether a JS connector is needed and why
- Serialisation notes (non-trivial fields)
- Router-agnostic stance (if component exposes path/URL)
-->

1. **{Decision}** — {rationale}.
2. **{Decision}** — {rationale}.
3. **Connector needed: yes / no** — {rationale, e.g., "No connector: all state is set via Element properties/attributes" or "Connector needed: items array is regenerated client-side after DOM mutations, mirroring MenuBar"}.

---

## Module / Package Layout

```
flow-components/
└── vaadin-{name}-flow-parent/
    ├── pom.xml
    ├── vaadin-{name}-flow/
    │   ├── pom.xml
    │   └── src/
    │       ├── main/java/com/vaadin/flow/component/{packageName}/
    │       │   ├── {Name}.java
    │       │   ├── {Name}Item.java              # if applicable
    │       │   ├── Has{Name}Items.java          # if applicable
    │       │   ├── {Name}Variant.java           # if applicable
    │       │   └── {Name}I18n.java              # if applicable (or nested class inside {Name}.java)
    │       ├── main/resources/META-INF/resources/frontend/
    │       │   └── {name}Connector.js           # only if "Connector needed: yes"
    │       └── test/java/com/vaadin/flow/component/{packageName}/tests/
    │           ├── {Name}Test.java
    │           ├── {Name}SerializableTest.java
    │           └── {Name}VariantTest.java       # if applicable
    ├── vaadin-{name}-flow-integration-tests/
    │   ├── pom.xml
    │   └── src/
    │       ├── main/java/com/vaadin/flow/component/{packageName}/tests/
    │       │   └── {Name}Page.java              # @Route view(s)
    │       └── test/java/com/vaadin/flow/component/{packageName}/tests/
    │           └── {Name}IT.java                # extends AbstractComponentIT
    └── vaadin-{name}-testbench/
        ├── pom.xml
        └── src/main/java/com/vaadin/flow/component/{packageName}/testbench/
            ├── {Name}Element.java               # @Element("vaadin-{name}")
            └── {Name}ItemElement.java           # if applicable
```

Package name: `com.vaadin.flow.component.{packageName}` (choose the established short form — e.g. `sidenav`, `menubar`, `breadcrumb`).

---

## Component Classes

### `{Name}` — main component

```java
@Tag("vaadin-{name}")
@NpmPackage(value = "@vaadin/{name}", version = "{WEB_COMPONENT_VERSION}")
@JsModule("@vaadin/{name}/src/vaadin-{name}.js")
public class {Name} extends Component
        implements HasStyle, HasSize, HasThemeVariant<{Name}Variant>,
                   Has{Name}Items, /* other shared mixins */ {
    // Fields (all Serializable)
    private {Name}I18n i18n;

    // Constructors
    public {Name}() { ... }
    public {Name}(String label) { ... }

    // Public API (signatures only — bodies belong to the implementation task)
    public void setLabel(String label);
    public String getLabel();

    public void setI18n({Name}I18n i18n);
    public {Name}I18n getI18n();

    // etc.
}
```

**Implemented mixin interfaces:** `HasStyle`, `HasSize`, `HasThemeVariant<{Name}Variant>`, … (list all with one-line justification per requirement/web-API surface).

**@Synchronize'd properties:** list each `@Synchronize`-annotated getter with the client property name and change-event it observes. Example: `@Synchronize("opened-changed") public boolean isOpened()`.

**Events:** list each event class that belongs to this component. Example:

```java
@DomEvent("navigate")
public static class {Name}NavigateEvent extends ComponentEvent<{Name}> {
    private final String path;
    public {Name}NavigateEvent({Name} source, boolean fromClient,
                               @EventData("event.detail.path") String path) { ... }
    public String getPath() { return path; }
}
public Registration addNavigateListener(ComponentEventListener<{Name}NavigateEvent> listener);
```

---

### `{Name}Item` — child element (if applicable)

{Same structure: annotations, class declaration, fields, constructors, public methods, events.}

---

### `Has{Name}Items` — shared children interface (if applicable)

{If multiple classes (e.g. a container and a sub-container) both hold items, extract the API into a `Has{Name}Items` interface with default methods mirroring `HasSideNavItems`.}

---

## i18n

```java
@JsonInclude(JsonInclude.Include.NON_NULL)
public static class {Name}I18n implements Serializable {
    private String navigationLabel;
    private String overflow;

    public String getNavigationLabel() { return navigationLabel; }
    public {Name}I18n setNavigationLabel(String navigationLabel) { ... return this; }

    // etc.
}
```

Exposed on `{Name}` via `setI18n({Name}I18n)` / `getI18n()`. Serialised to JSON via `JacksonUtils.beanToJson(...)` and pushed to the client property `i18n` via `Element.setPropertyJson(...)` in an attach handler.

| Field | Type | Default (English) | Web component i18n field | Notes |
|---|---|---|---|---|
| `navigationLabel` | String | `"Breadcrumb"` | `navigationLabel` | Landmark ARIA label |
| `overflow` | String | `"Show hidden ancestors"` | `overflow` | Overflow control label |

---

## Theme Variants

```java
public enum {Name}Variant implements ThemeVariant {
    // Lumo-only
    LUMO_SMALL("small"),
    // Aura-only
    // (none if not applicable)
    // Cross-theme
    PRIMARY("primary");

    private final String variant;
    {Name}Variant(String variant) { this.variant = variant; }
    public String getVariantName() { return variant; }
}
```

Deprecation policy: when the web component renames or drops a theme attribute, keep the old enum constant `@Deprecated` and map it to the same string, mirroring `ButtonVariant`.

---

## Connector

### Option A — No connector needed

State this explicitly: "No connector required. All state is set via Element attributes/properties directly from server-side Java."

### Option B — Connector needed

```
File: src/main/resources/META-INF/resources/frontend/{name}Connector.js
Registered in: {Name}.java attach handler via element.executeJs(...)
Purpose: {what it does — e.g., "regenerate items array after DOM mutations for disabled/hidden attributes"}

Exports:
  window.Vaadin.Flow.{name}Connector = {
    initLazy(element) { ... }
  };

Contract:
  - element.$connector.generateItems() — called after any item attribute change to re-sync client items array
```

Explain which requirement(s) force a connector (usually data-driven items with per-item client-side state).

---

## Server/Client Sync Concerns

- **Serialisation.** Every field declared above is `Serializable`. Any listener, controller, or collection must use `Serializable*` variants. Highlight any field that required special handling.
- **Signal support.** If text/label/value properties can be bound to a `Signal<T>`, document the `SignalPropertySupport<T>` field and the corresponding constructor / setter overloads (mirroring `Button(Signal<String> textSignal)`). State that signal binding is via the `signal-rules` skill convention if present in the component.
- **Routing.** The component is router-agnostic. Path/URL setters accept strings; the application drives navigation. Flow does NOT call `RouteConfiguration` inside the component.
- **DisabledUpdateMode.** State the default (usually unchanged) and whether this component needs to override it (e.g. for click-handler-on-disabled).
- **Disable-on-click.** If applicable, reuse `DisableOnClickController<{Name}>` from shared/internal.

---

## TestBench Elements

### `{Name}Element`

```java
@Element("vaadin-{name}")
public class {Name}Element extends TestBenchElement {
    public List<{Name}ItemElement> getItems() { ... }
    public {Name}ItemElement getCurrentItem() { ... }
    // Expose one query method per web-component part/slot that integration tests need.
}
```

### `{Name}ItemElement` (if applicable)

{Same structure. Expose: getText, isCurrent, click, etc.}

---

## Reuse and Proposed Adjustments to Existing Modules

<!--
Include this section if the specification reuses or requires changes to code outside the new component's own `vaadin-{name}-flow-parent/` module — typically shared interfaces in `vaadin-flow-components-base`.

For each entry:
- Name the file, class or interface, and whether it is used as-is or needs modification.
- If modification is needed, describe the specific change.
- Explain why the new component needs it.
- List other components that use the same code and could be affected.

Omit this section entirely if no reuse or adjustments are needed.
-->

---

## Coverage

For each universal/flow requirement:

| Requirement | Addressed in spec section(s) |
|---|---|
| 1. {title} | Component Classes → `{Name}`; {Name}Item; addItem API |
| 2. {title} | Events → `{Name}NavigateEvent`; HasSize; … |
