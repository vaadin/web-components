# BreadcrumbTrail Flow Component Specification

> Wraps the experimental web component `<vaadin-breadcrumb-trail>`. Flow users enable it via the `com.vaadin.experimental.breadcrumbTrailComponent` feature flag — defined by a `BreadcrumbTrailFeatureFlagProvider` registered in this module (no Flow core change needed). The flag key matches the `window.Vaadin.featureFlags.breadcrumbTrailComponent` flag on the web-component side, so a single entry in `vaadin-featureflags.properties` controls both sides.

## Key Design Decisions

1. **`Mode` enum drives ownership.** Following flow-api.md §1 and §9, `BreadcrumbTrail.Mode` is a public nested enum with values `ROUTER` (default) and `MANUAL`. The mode is set at construction (`new BreadcrumbTrail()` / `new BreadcrumbTrail(Mode)`) and can be switched at runtime via `setMode(Mode)`. `add`/`remove`/`removeAll` throw `IllegalStateException` while in `Mode.ROUTER`. `setMode` semantics are asymmetric: `ROUTER → MANUAL` clears any router-derived items and unregisters the navigation listener; `MANUAL → ROUTER` requires the trail to already be empty and throws `IllegalStateException` otherwise — the application must `removeAll()` first if it wants the switch. See "Mode switching" below for the full contract.

2. **`HasComponentsOfType<BreadcrumbItem>` for child management.** Per flow-api.md §1 "Why this shape". Implemented by the type-parameterised children interface from Flow core ([PR #24186](https://github.com/vaadin/flow/pull/24186)). The interface extends `HasElement, HasEnabled` and supplies — as default methods — `add(T...)`, `add(Collection<T>)`, `remove(T...)`, `remove(Collection<T>)`, `removeAll()`, `addComponentAtIndex(int, T)`, `addComponentAsFirst(T)`, `replace(T, T)`, and `bindChildren(Signal<List<S>>, SerializableFunction<S, T>)`. All of these are available on `BreadcrumbTrail` without the component re-implementing them, and all of them must be intercepted by the `Mode.ROUTER` guard (see KDD §1). `HasEnabled` is inherited transitively — it does not need to appear in `BreadcrumbTrail`'s `implements` list.

3. **Router integration via `AfterNavigationListener`.** For `Mode.ROUTER`, the component registers `UI.addAfterNavigationListener(...)` in its attach handler and unregisters in detach. The listener walks the route hierarchy — `@RouteParent` first, then URL-prefix — and calls `updateChildrenInternal(List<BreadcrumbItem>)` to replace the trail. `updateChildrenInternal` sets an internal `boolean routerUpdateInProgress` flag, routes the update through the normal component API (`removeAll()` + `add(...)`), then clears the flag; the `Mode.ROUTER` guard on the public methods skips the throw when the flag is set. This means router-derived items are regular child components — `getChildren()` returns them, serialisation captures them, and the Flow virtual-children mechanism is not involved.

4. **`@RouteParent` annotation lives in Flow core.** Per flow-api.md §10. `com.vaadin.flow.router.RouteParent` is introduced in Flow core alongside `@Route`, `@RouteAlias`, `@ParentLayout`. The breadcrumb module only consumes it — it neither defines it nor re-exports it. See "Reuse and Proposed Adjustments" for the Flow core dependency.

5. **Router-walker algorithm resolves a route's ancestors by metadata only.** It never instantiates ancestor views. For each walked route it reads `@PageTitle` for the label; for the terminal (current) view, `HasDynamicTitle.getPageTitle()` is called on the already-instantiated view instance. `@RouteParent` is checked first; if absent, URL-prefix walking strips the last path segment and resolves via `RouteConfiguration.forSessionScope().getRoute(...)`. Cycles (a → b → a) are detected by a visited-set and truncated at the first repeat; an `@RouteParent` pointing at a class without `@Route` falls back to URL-prefix walking for that step.

6. **No connector needed.** All state is set via standard Element attributes/properties from server-side Java — `setPath` writes the `path` attribute, `setPrefixComponent` uses `SlotUtils.setSlot` for the prefix slot, `setI18n` pushes a JSON object to the `i18n` client property. The web component's overflow behaviour is entirely client-side. No client-side items array is regenerated from server-side changes (Flow manages items as a component tree, not a data array — see flow-api.md coverage-table row "items JS property"). No connector file under `src/main/resources/META-INF/resources/frontend/`.

7. **No events.** Neither `BreadcrumbTrail` nor `BreadcrumbItem` exposes a server-side event (no click listeners, no navigate events — see flow-api.md Discussion "Why no click listener on `BreadcrumbItem`?"). Items render as anchors and the Flow router intercepts clicks at the document level.

8. **No `@Synchronize`'d properties.** No client-driven state round-trips to the server. `has-overflow` is a visual state attribute the server does not need to observe.

9. **No theme variants.** Per flow-api.md Discussion "Why no theme variants?" — no `BreadcrumbTrailVariant` enum.

10. **`BreadcrumbTrailI18n` is a nested static class.** Follows the `SideNavI18n` / `MenuBarI18n` convention — `Serializable`, `@JsonInclude(JsonInclude.Include.NON_NULL)`, fluent setters returning `BreadcrumbTrailI18n`. Serialised with `JacksonUtils.beanToJson` and pushed to the client via `getElement().setPropertyJson("i18n", ...)` in the attach handler (so re-attach re-sets the property for the fresh client-side element).

11. **Package name `com.vaadin.flow.component.breadcrumbtrail`.** Mirrors `com.vaadin.flow.component.sidenav` — the short form that drops internal hyphens.

12. **Module `vaadin-breadcrumb-trail-flow-parent`.** Standard parent-child split `vaadin-{name}-flow-parent` / `vaadin-{name}-flow` / `vaadin-{name}-flow-integration-tests` / `vaadin-{name}-testbench`.

13. **Serialisation.** The `AfterNavigationListener` `Registration` returned from the attach handler is held as a `transient` field and rebuilt in the attach handler on re-attach (Flow may replace the client-side element). `BreadcrumbTrailI18n` implements `Serializable`. `Mode` enum is inherently serialisable. No other non-trivial state.

---

## Module / Package Layout

```
flow-components/
└── vaadin-breadcrumb-trail-flow-parent/
    ├── pom.xml
    ├── vaadin-breadcrumb-trail-flow/
    │   ├── pom.xml
    │   └── src/
    │       ├── main/java/com/vaadin/flow/component/breadcrumbtrail/
    │       │   ├── BreadcrumbTrail.java                # host element, Mode enum, BreadcrumbTrailI18n nested class
    │       │   ├── BreadcrumbItem.java                 # <vaadin-breadcrumb-item>
    │       │   ├── BreadcrumbTrailFeatureFlagProvider.java  # defines the Feature constant
    │       │   ├── ExperimentalFeatureException.java   # local exception with a helpful message
    │       │   └── internal/
    │       │       └── RouteParentResolver.java        # static helper that walks the hierarchy,
    │       │                                           #   consuming com.vaadin.flow.router.RouteParent
    │       ├── main/resources/
    │       │   └── META-INF/services/
    │       │       └── com.vaadin.experimental.FeatureFlagProvider   # one-line ServiceLoader registration
    │       └── test/java/com/vaadin/flow/component/breadcrumbtrail/tests/
    │           ├── BreadcrumbTrailTest.java
    │           ├── BreadcrumbTrailModeTest.java
    │           ├── BreadcrumbItemTest.java
    │           ├── BreadcrumbTrailSerializableTest.java
    │           ├── BreadcrumbTrailI18nTest.java
    │           ├── RouteParentResolverTest.java
    │           └── FeatureFlagTest.java
    ├── vaadin-breadcrumb-trail-flow-integration-tests/
    │   ├── pom.xml
    │   └── src/
    │       ├── main/java/com/vaadin/flow/component/breadcrumbtrail/tests/
    │       │   ├── ManualBreadcrumbTrailPage.java     # @Route for Mode.MANUAL
    │       │   ├── RouterBreadcrumbTrailPage.java     # @Route for Mode.ROUTER
    │       │   ├── RouteParentPage.java               # @Route with @RouteParent
    │       │   ├── DynamicTitlePage.java              # HasDynamicTitle on current view
    │       │   └── IconBreadcrumbTrailPage.java       # prefix icons
    │       └── test/java/com/vaadin/flow/component/breadcrumbtrail/tests/
    │           ├── ManualBreadcrumbTrailIT.java
    │           ├── RouterBreadcrumbTrailIT.java
    │           ├── RouteParentIT.java
    │           └── IconBreadcrumbTrailIT.java
    └── vaadin-breadcrumb-trail-testbench/
        ├── pom.xml
        └── src/main/java/com/vaadin/flow/component/breadcrumbtrail/testbench/
            ├── BreadcrumbTrailElement.java            # @Element("vaadin-breadcrumb-trail")
            └── BreadcrumbItemElement.java             # @Element("vaadin-breadcrumb-item")
```

Java package: `com.vaadin.flow.component.breadcrumbtrail`.

Integration-tests module must include `src/main/resources/vaadin-featureflags.properties` enabling `com.vaadin.experimental.breadcrumbTrailComponent=true`, mirroring `vaadin-master-detail-layout-flow-integration-tests`.

---

## Component Classes

### `BreadcrumbTrail` — container

```java
@Tag("vaadin-breadcrumb-trail")
@NpmPackage(value = "@vaadin/breadcrumb-trail", version = "25.2.0-alpha{N}")
@JsModule("@vaadin/breadcrumb-trail/src/vaadin-breadcrumb-trail.js")
public class BreadcrumbTrail extends Component
        implements HasSize, HasStyle, HasAriaLabel,
                   HasComponentsOfType<BreadcrumbItem> {

    public enum Mode {
        ROUTER,
        MANUAL
    }

    // State
    private Mode mode;
    private BreadcrumbTrailI18n i18n;
    private transient Registration navigationRegistration;

    // Constructors
    public BreadcrumbTrail();                       // defaults to Mode.ROUTER
    public BreadcrumbTrail(Mode mode);

    // Mode
    public Mode getMode();
    public void setMode(Mode mode);                 // switching resets the internal state

    // Items — all inherited from HasComponentsOfType<BreadcrumbItem>, each
    // overridden to throw IllegalStateException if Mode.ROUTER (unless the
    // internal routerUpdateInProgress flag is set — see KDD §3):
    //   add(BreadcrumbItem...) / add(Collection<BreadcrumbItem>)
    //   addComponentAsFirst(BreadcrumbItem)
    //   addComponentAtIndex(int, BreadcrumbItem)
    //   remove(BreadcrumbItem...) / remove(Collection<BreadcrumbItem>)
    //   removeAll()
    //   replace(BreadcrumbItem, BreadcrumbItem)
    //   bindChildren(Signal<List<S>>, SerializableFunction<S, BreadcrumbItem>)
    //
    // getChildren() / children stream — always allowed.

    // i18n
    public BreadcrumbTrailI18n getI18n();
    public void setI18n(BreadcrumbTrailI18n i18n);

    // Accessible name — inherited from HasAriaLabel:
    //   setAriaLabel(String)
    //   getAriaLabel()

    // Lifecycle
    @Override
    protected void onAttach(AttachEvent attachEvent);   // checks feature flag; re-pushes i18n; wires router listener if ROUTER
    @Override
    protected void onDetach(DetachEvent detachEvent);   // unregisters router listener

    // Nested i18n class — see §i18n below
    public static class BreadcrumbTrailI18n implements Serializable { ... }
}
```

**Implemented mixin interfaces:**

- `HasSize` — covers requirement that the component can be sized by the application (universal API hygiene).
- `HasStyle` — required for requirement 5 (customise separator via `--vaadin-breadcrumb-trail-separator` CSS custom property) and for `getStyle()` access per `DESIGN_GUIDELINES.md` "Styling lives in CSS, not Java".
- `HasAriaLabel` — requirement 10 (navigation landmark accessible name). Flow core interface.
- `HasComponentsOfType<BreadcrumbItem>` — requirement 1, 9 (add/remove/manage items with compile-time type safety). Flow core interface. All inherited mutating methods — `add(T...)` / `add(Collection<T>)` / `remove(T...)` / `remove(Collection<T>)` / `removeAll()` / `addComponentAsFirst(T)` / `addComponentAtIndex(int, T)` / `replace(T, T)` / `bindChildren(Signal<List<S>>, SerializableFunction<S, T>)` — are overridden to throw `IllegalStateException` when `Mode.ROUTER` (unless the internal `routerUpdateInProgress` flag is set).

**@Synchronize'd properties:** none.

**Events:** none.

**Feature-flag check.** `onAttach` calls `BreadcrumbTrail.checkFeatureFlag(attachEvent.getUI())` following the pattern from `MasterDetailLayout.checkFeatureFlag`: throws `ExperimentalFeatureException` when `FeatureFlags.BREADCRUMB_TRAIL_COMPONENT` is disabled.

**Router mode wiring (attach).** The component relies on Flow's existing router and router-utils API; no new per-call mechanism is invented. Two entry points feed the resolver:

- `UI.addAfterNavigationListener(AfterNavigationListener)` — public API on `UI`. The listener receives an `AfterNavigationEvent` whose `getLocation()`, `getActiveChain()`, and `getRouteParameters()` are all public accessors. This catches every navigation for the lifetime of the attachment (including long-lived shell placement).
- An initial, synchronous rebuild in `onAttach` itself, for the case where the breadcrumb is added to a view that has already finished rendering (so no navigation is pending and the listener has nothing to fire on). Flow core does not currently expose a public "read current navigation state" API at arbitrary times — `UI.getInternals().getActiveViewLocation()` and `UI.getInternals().getActiveRouterTargetsChain()` are the de facto accessors (public methods, but on `UIInternals` which sits in `com.vaadin.flow.component.internal`). See "Reuse and Proposed Adjustments → Flow core dependencies" for the proposal to promote these to a public `Router`/`RouteUtil` entry point.

```java
protected void onAttach(AttachEvent attachEvent) {
    super.onAttach(attachEvent);
    checkFeatureFlag(attachEvent.getUI());

    if (mode == Mode.ROUTER) {
        UI ui = attachEvent.getUI();
        navigationRegistration = ui.addAfterNavigationListener(this::rebuildFromRouter);

        // Initial population: read current navigation state from the UI.
        // Today this goes through UIInternals; see the Proposed Adjustments
        // section for the preferred public-API landing.
        UIInternals internals = ui.getInternals();
        rebuildFromRouter(internals.getActiveViewLocation(),
                          internals.getActiveRouterTargetsChain(),
                          RouteConfiguration.forRegistry(
                                  ComponentUtil.getRouter(this).getRegistry()));
    }
}
```

`rebuildFromRouter` has two overloads that normalise on the same private builder:

```java
// Overload 1 — AfterNavigationEvent-driven (ongoing navigations)
void rebuildFromRouter(AfterNavigationEvent event);

// Overload 2 — direct state (initial attach)
void rebuildFromRouter(Location currentLocation,
                      List<HasElement> activeChain,
                      RouteConfiguration routeConfiguration);
```

Both overloads ultimately call `RouteParentResolver.resolveTrail(...)` with the same parameter shape (see "`RouteParentResolver` (internal)" below), then `updateChildrenInternal(trail)`. Both guard against stale callbacks: `if (!isAttached()) return;` first.

`updateChildrenInternal(List<BreadcrumbItem> trail)`:

```java
private boolean routerUpdateInProgress;

void updateChildrenInternal(List<BreadcrumbItem> trail) {
    routerUpdateInProgress = true;
    try {
        removeAll();                                  // reaches super.removeAll() via HasComponentsOfType
        add(trail.toArray(BreadcrumbItem[]::new));    // reaches super.add(T...)
    } finally {
        routerUpdateInProgress = false;
    }
}
```

The public `add` / `addComponentAsFirst` / `addComponentAtIndex` / `remove` / `removeAll` / `replace` / `bindChildren` overrides check `mode == Mode.ROUTER && !routerUpdateInProgress` and throw `IllegalStateException` if so. This means router-derived items are regular logical children — `getChildren()` returns them, serialisation captures them, no virtual-children machinery is involved.

**Mode switching.** `setMode(Mode newMode)`:
- If already equal, no-op.
- On transition `ROUTER → MANUAL`: clear any router-derived items via `updateChildrenInternal(List.of())`, unregister the navigation listener.
- On transition `MANUAL → ROUTER`: throw `IllegalStateException` if the component has any children — the caller must `removeAll()` first. Otherwise register the navigation listener (if attached) and trigger an initial `rebuildFromRouter`. If not attached, registration happens in the next `onAttach`.

---

### `BreadcrumbItem` — child element

```java
@Tag("vaadin-breadcrumb-item")
@NpmPackage(value = "@vaadin/breadcrumb-trail", version = "25.2.0-alpha{N}")
@JsModule("@vaadin/breadcrumb-trail/src/vaadin-breadcrumb-item.js")
public class BreadcrumbItem extends Component
        implements HasEnabled, HasPrefix, HasTooltip {

    // Constructors — mirror SideNavItem's overload set
    public BreadcrumbItem(String label);                                                            // current page (no path)
    public BreadcrumbItem(String label, String path);
    public BreadcrumbItem(String label, Class<? extends Component> view);
    public BreadcrumbItem(String label, Class<? extends Component> view, RouteParameters params);
    public BreadcrumbItem(String label, String path, Component prefixComponent);
    public BreadcrumbItem(String label, Class<? extends Component> view, Component prefixComponent);
    public BreadcrumbItem(String label, Class<? extends Component> view,
                          RouteParameters params, Component prefixComponent);

    // Label — default-slot text content of the item
    public String getLabel();
    public void setLabel(String label);

    // Path
    public String getPath();
    public void setPath(String path);
    public void setPath(Class<? extends Component> view);
    public void setPath(Class<? extends Component> view, RouteParameters parameters);

    // Target — applies only when path is set; writes the `target` attribute
    public String getTarget();
    public void setTarget(String target);
    public boolean isOpenInNewBrowserTab();
    public void setOpenInNewBrowserTab(boolean openInNewBrowserTab);   // convenience: target = "_blank" / null

    // Prefix — inherited from HasPrefix:
    //   setPrefixComponent(Component)
    //   getPrefixComponent()

    // Tooltip — inherited from HasTooltip:
    //   setTooltipText(String)
    //   getTooltip()
}
```

**Implemented mixin interfaces:**

- `HasEnabled` — lets the application disable individual items (e.g. an ancestor the user has no permission to visit).
- `HasPrefix` — requirement 8 (icons). `slot="prefix"` on `<vaadin-breadcrumb-item>`, shared mixin from `vaadin-flow-components-base`.
- `HasTooltip` — useful for long labels that may not fit. Shared mixin.

**Not `HasText`.** The default slot contains the label text, so `HasText` would technically work, but mirroring `SideNavItem`'s `setLabel`/`getLabel` naming keeps the two components consistent and avoids exposing two ways (`setText`/`setLabel`) to set the same content. `setLabel(String)` delegates internally to `getElement().setText(label)`.

**No `HasSuffix`** — web-component-api.md explicitly excludes it. If added later on the web-component side, the Flow class adds `HasSuffix` to the `implements` clause; that is strictly additive.

**No click listener** — flow-api.md Discussion "Why no click listener on `BreadcrumbItem`?" The web component renders an anchor; the Flow router intercepts clicks.

**Path resolution.** `setPath(Class<? extends Component>)` and `setPath(Class, RouteParameters)` mirror `SideNavItem.setPath(...)` exactly: `RouteConfiguration.forRegistry(ComponentUtil.getRouter(this).getRegistry()).getUrl(view, params)` and the resulting string is written to the `path` attribute. Router-agnosticism: Flow wraps the routing resolution, but the anchor `<a href="...">` is still plain HTML — Flow does not intercept clicks at the component level.

**Target handling.** The `target` attribute on `<vaadin-breadcrumb-item>` (exposed by web-component-spec.md) is reachable via `setTarget(String)` / `getTarget()`, with `setOpenInNewBrowserTab(boolean)` as a convenience wrapper mirroring `SideNavItem`. `target` only applies when `path` is set — consistent with the web component's behaviour.

**No @Synchronize'd properties.** `path` and `target` are server-driven.

**Events:** none.

---

## i18n

```java
@JsonInclude(JsonInclude.Include.NON_NULL)
public static class BreadcrumbTrailI18n implements Serializable {
    private String moreItems;

    public String getMoreItems();
    public BreadcrumbTrailI18n setMoreItems(String moreItems);
}
```

Exposed on `BreadcrumbTrail` via `setI18n(BreadcrumbTrailI18n)` / `getI18n()`. Serialised via `JacksonUtils.beanToJson(i18n)` and pushed to the client through `getElement().setPropertyJson("i18n", json)` inside the attach handler (so that on re-attach the fresh client element receives the property again). Null `i18n` results in the property not being set, letting the web component's default take over.

| Field | Type | Default (English) | Web-component `i18n` field | Notes |
|---|---|---|---|---|
| `moreItems` | String | `null` (web component default: `""`) | `moreItems` | `aria-label` of the overflow button (see web-component-api.md §4) |

Setter returns `this` so calls can be chained: `new BreadcrumbTrailI18n().setMoreItems("Show hidden items")`.

---

## Theme Variants

Not applicable. No `BreadcrumbTrailVariant` enum is introduced. See flow-api.md Discussion "Why no theme variants?"

---

## Connector

**No connector required.** All state is set via Element attributes and properties directly from server-side Java:

- `path` — `setAttribute("path", ...)` on `BreadcrumbItem`
- `target` — `setAttribute("target", ...)` on `BreadcrumbItem`
- `prefix` slot — managed by `HasPrefix` / `SlotUtils.setSlot(this, "prefix", component)`
- `i18n` — `setPropertyJson("i18n", JacksonUtils.beanToJson(i18n))` on `BreadcrumbTrail`
- `aria-label` — `HasAriaLabel` attribute
- Item set — light-DOM children (component tree), observed client-side by `SlotController`

No JavaScript file under `src/main/resources/META-INF/resources/frontend/`.

---

## Server/Client Sync Concerns

- **Serialisation.** All public fields are `Serializable`:
  - `Mode` enum (intrinsically serialisable).
  - `BreadcrumbTrailI18n` (implements `Serializable`, only holds a `String`).
  - `navigationRegistration` field holding the `AfterNavigationListener` `Registration` is declared `transient` — it is non-serialisable and is re-created in `onAttach` on every re-attach.
  - `routerUpdateInProgress` is a `boolean` — serialisable; its default `false` value is correct after deserialisation.
  - `BreadcrumbItem` introduces no new fields: label goes through `getElement().setText(...)`, path and target are element attributes, and the prefix component reference is held by `SlotUtils` as a slot child under the element tree — all of which are captured by the standard `Component` serialisation.

- **Signal support.** `BreadcrumbItem` does not expose `bindText(Signal<String>)` — there is no `SignalPropertySupport<String>` wired up for the label. Reactive trails are achieved at the container level via `Signal.effect(breadcrumbTrail, () -> { removeAll(); add(...); })` per flow-api.md §5. This mirrors the decision not to expose `bindItems`; introducing a `bindLabel` on items would invite new state-management edge cases without a concrete use case that `Signal.effect` cannot already cover. A future `BreadcrumbItem.bindLabel(Signal<String>)` is a strictly additive option if real applications want it.

- **Routing.** The component is router-aware (`Mode.ROUTER` populates the trail from `AfterNavigationEvent`), but it does NOT navigate — it only reads current route + registered routes. `BreadcrumbItem` resolves `Class<? extends Component>` → URL via `RouteConfiguration`; the anchor `<a href>` is plain HTML and Flow's router intercepts clicks at the document level the same way it does for `SideNavItem` links.

- **`DisabledUpdateMode`.** No override. Standard Flow disabled propagation is sufficient.

- **Disable-on-click.** Not applicable.

- **Feature-flag check.** `onAttach` runs `checkFeatureFlag(attachEvent.getUI())` before doing any other setup; throws `ExperimentalFeatureException` if the flag is disabled. Same pattern as `MasterDetailLayout`.

---

## Feature Flag

The component is experimental and the Flow wrapper is gated by a feature flag defined locally in this module — mirroring the convention used by `Badge`, `Slider`, and the other experimental components in flow-components. No Flow core change is needed.

### `BreadcrumbTrailFeatureFlagProvider`

```java
package com.vaadin.flow.component.breadcrumbtrail;

import java.util.List;

import com.vaadin.experimental.Feature;
import com.vaadin.experimental.FeatureFlagProvider;

public class BreadcrumbTrailFeatureFlagProvider implements FeatureFlagProvider {

    public static final Feature BREADCRUMB_TRAIL_COMPONENT = new Feature(
            "Breadcrumb Trail component",                                   // title
            "breadcrumbTrailComponent",                                     // id — matches web-component flag
            "https://github.com/vaadin/platform/issues/{platform-issue-id}", // tracking issue
            true,                                                           // requiresServerRestart
            "com.vaadin.flow.component.breadcrumbtrail.BreadcrumbTrail");   // primary class owning the flag

    @Override
    public List<Feature> getFeatures() {
        return List.of(BREADCRUMB_TRAIL_COMPONENT);
    }
}
```

### ServiceLoader registration

File: `src/main/resources/META-INF/services/com.vaadin.experimental.FeatureFlagProvider`

```
com.vaadin.flow.component.breadcrumbtrail.BreadcrumbTrailFeatureFlagProvider
```

Flow's `FeatureFlags` discovers the provider via the standard `java.util.ServiceLoader` mechanism at startup. No build-time code generation.

### `ExperimentalFeatureException`

```java
package com.vaadin.flow.component.breadcrumbtrail;

public class ExperimentalFeatureException extends RuntimeException {
    public ExperimentalFeatureException() {
        super("""
                The Breadcrumb Trail component is currently an experimental feature \
                and needs to be explicitly enabled. The component can be \
                enabled using Copilot, in the experimental features tab, \
                or by adding a \
                `src/main/resources/vaadin-featureflags.properties` file \
                with the following content: \
                `com.vaadin.experimental.breadcrumbTrailComponent=true`""");
    }
}
```

### Attach-time check

`BreadcrumbTrail.onAttach` calls a private `checkFeatureFlag(UI)` that follows the `Badge` / `Slider` / `MasterDetailLayout` pattern exactly:

```java
private void checkFeatureFlag(UI ui) {
    FeatureFlags featureFlags = FeatureFlags
            .get(ui.getSession().getService().getContext());
    if (!featureFlags.isEnabled(
            BreadcrumbTrailFeatureFlagProvider.BREADCRUMB_TRAIL_COMPONENT)) {
        throw new ExperimentalFeatureException();
    }
}
```

Integration-tests module enables the flag at startup with `src/main/resources/vaadin-featureflags.properties` containing `com.vaadin.experimental.breadcrumbTrailComponent=true`. Unit tests use the `@EnableFeatureFlagExtension` JUnit 6 extension or the equivalent fixture used by other experimental-component tests.

---

## `@RouteParent` Annotation

`com.vaadin.flow.router.RouteParent` is introduced in Flow core (see "Reuse and Proposed Adjustments → Flow core dependencies"). The breadcrumb module only reads it — it does not redefine or re-export it.

Expected shape in Flow core:

```java
package com.vaadin.flow.router;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RouteParent {
    /**
     * The view class that is the conceptual parent of the annotated
     * {@link Route @Route} class.
     *
     * The parent class should itself be annotated with {@code @Route}. If
     * it is not, consumers of this annotation (e.g. the breadcrumb
     * resolver) fall back to URL-prefix walking for this step.
     */
    Class<? extends Component> value();
}
```

The annotation is read by `RouteParentResolver.resolveParent(Class)` using reflection. No framework-level route registration change is needed — `@Route` is discovered the same way it already is; `@RouteParent` is only read by consumers like the breadcrumb's resolver.

### `RouteParentResolver` (internal)

Walks the route hierarchy using Flow's existing router / router-utils API. Every call below is either a public Flow method or a semi-public helper in `com.vaadin.flow.router.internal.RouteUtil` / `com.vaadin.flow.component.internal.UIInternals` that we already rely on.

```java
package com.vaadin.flow.component.breadcrumbtrail.internal;

final class RouteParentResolver {

    static List<BreadcrumbItem> resolveTrail(
            Class<? extends Component> currentRoute,
            Component currentViewInstance,
            RouteParameters currentRouteParameters,
            RouteConfiguration routeConfiguration);
}
```

**Flow APIs used (all public or explicitly enumerated in "Reuse"):**

| Purpose | API call | Visibility |
|---|---|---|
| Resolve `Class<? extends Component>` → URL | `RouteConfiguration#getUrl(Class, RouteParameters)` | public |
| Resolve URL prefix → route class | `RouteConfiguration#getRoute(String, List<String>)` / `getRoute(String)` | public |
| Obtain the registry-scoped config | `RouteConfiguration.forRegistry(ComponentUtil.getRouter(this).getRegistry())` | public (mirrors `SideNavItem.setPath(Class)`) |
| Read the current view's dynamic title | `HasDynamicTitle#getPageTitle()` on the view instance | public |
| Read a route class's static title | `routeClass.getAnnotation(PageTitle.class).value()` | public (`@PageTitle`) |
| Read a route's declared parent | `routeClass.getAnnotation(RouteParent.class).value()` | public (Flow core annotation — see Reuse) |
| Identify the current-view instance at navigation time | `AfterNavigationEvent#getActiveChain()` → last element implementing `Component` | public |
| Current route params at navigation time | `AfterNavigationEvent#getRouteParameters()` | public |
| Current location at navigation time | `AfterNavigationEvent#getLocation()` | public |

**Algorithm:**

1. **Current item.** Label: `currentViewInstance instanceof HasDynamicTitle h ? h.getPageTitle() : readPageTitle(currentRoute)`. Path: no path (current item is the non-link). Construct `new BreadcrumbItem(label)`.
2. **Walk ancestors.** Maintain `Set<Class<? extends Component>> visited = new HashSet<>()`, initialised with `currentRoute`. Current walk target = `currentRoute`.
   - **Find parent class.** If target has `@RouteParent`, read its value. If the declared parent has `@Route`, jump there. Otherwise (annotation absent, or points at a non-`@Route` class), fall back to URL-prefix walking: take the current target's URL via `RouteConfiguration#getUrl(target, RouteParameters.empty())`, strip the last `/`-separated segment, call `RouteConfiguration#getRoute(strippedUrl)`. The `Optional<Class<? extends Component>>` returned is the parent if present.
   - **Terminate.** Stop when no parent is found (reached root), or when the parent is already in `visited` (cycle), or when URL-prefix walking produces an empty URL.
   - **Otherwise.** Read `@PageTitle` on the parent class (absent → skip this level and continue walking from the parent). Resolve its URL via `RouteConfiguration#getUrl(parentClass, RouteParameters.empty())`. Prepend a `new BreadcrumbItem(title, parentClass)` to the trail. Add parent to `visited`. Repeat with parent as the new target.
3. **Return the trail root-first.**

**Cycle behaviour:** `@RouteParent(X.class)` where X is already in `visited` stops the walk at the first repeat — no item is added for the repeated class. Matches flow-api.md Discussion "What happens if `@RouteParent` forms a cycle or points at a class without `@Route`?".

**Parent without `@Route`:** `@RouteParent(X.class)` where X has no `@Route` annotation is treated as if the annotation were absent — the walker falls back to URL-prefix walking for that step. Matches flow-api.md Discussion.

**Route parameters on ancestors:** the walker uses `RouteParameters.empty()` when resolving an ancestor's URL because ancestor routes may have a different parameter set from the current route. Applications that need ancestor labels with live data should use `Mode.MANUAL` and build the trail themselves (flow-api.md §9).

---

## TestBench Elements

### `BreadcrumbTrailElement`

```java
@Element("vaadin-breadcrumb-trail")
public class BreadcrumbTrailElement extends TestBenchElement {

    public List<BreadcrumbItemElement> getItems();

    public BreadcrumbItemElement getCurrentItem();          // the item with the `current` state attribute (last no-path)

    public BreadcrumbItemElement getItemByLabel(String label);

    public BreadcrumbItemElement getItemByPath(String path);

    public boolean hasOverflow();                           // reads has-overflow attribute

    public TestBenchElement getOverflowButton();            // shadow-DOM part="overflow-button"

    public void openOverflowOverlay();                       // click overflow button

    public TestBenchElement getOverflowOverlay();           // the <vaadin-breadcrumb-trail-overlay> element

    public List<TestBenchElement> getOverflowItems();       // links inside the open overlay
}
```

### `BreadcrumbItemElement`

```java
@Element("vaadin-breadcrumb-item")
public class BreadcrumbItemElement extends TestBenchElement {

    public String getLabel();

    public String getPath();

    public String getTarget();

    public boolean isCurrent();                             // reads `current` state attribute

    public boolean hasPrefix();                             // reads `has-prefix` state attribute

    public TestBenchElement getPrefixSlotContent();

    @Override
    public void click();                                    // clicks the anchor in shadow DOM
}
```

Queries use the same pattern as `SideNavElement` / `SideNavItemElement`: `$("vaadin-breadcrumb-item").all()` for items, shadow-DOM CSS for parts and slotted content.

---

## Reuse and Proposed Adjustments to Existing Modules

### Flow core: "read current navigation state" public helper — Proposed

The resolver's initial-attach path needs to read the active location and active router-targets chain without a pending `AfterNavigationEvent`. Today this goes through `UIInternals.getActiveViewLocation()` and `UIInternals.getActiveRouterTargetsChain()` — both public methods on a type that sits in `com.vaadin.flow.component.internal`. The `internal` package suffix signals "not part of the stable public API".

Preferred landing: a small public facade on `Router` or `RouteUtil`:

```java
// in com.vaadin.flow.router.Router (or RouteConfiguration):
public Optional<Location> getActiveLocation(UI ui);
public List<HasElement> getActiveRouterTargetsChain(UI ui);
// or a single call:
public Optional<NavigationState> getActiveNavigationState(UI ui);
```

Any variant that exposes the same information through a public, documented entry point is fine. Until this lands, the resolver calls `UIInternals` directly and acknowledges the compatibility risk — the semi-public calls have been stable for many Vaadin releases, and any flow-components code using them would need to migrate in the same release as the public facade anyway.

Affects: Flow core. Additive — a thin wrapper over existing `UIInternals` methods.

### `com.vaadin.flow.router.RouteParent` — Flow core dependency

`@RouteParent` is not tied to breadcrumb rendering — per flow-api.md Discussion "Why `@RouteParent` rather than a breadcrumb-specific name?", the annotation belongs in `com.vaadin.flow.router` alongside `@Route`, `@RouteAlias`, `@ParentLayout`. This lets any future navigation component (back-helpers, parent-link renderers, SEO link-graph utilities) consume the same declaration.

The annotation will land in Flow core and this module depends on it. Ensure `flow-components-bom` targets a Flow version that includes the `RouteParent` annotation.

Affects: no flow-components module defines this annotation; the breadcrumb module imports `com.vaadin.flow.router.RouteParent` and reads it via reflection in `RouteParentResolver`.

### `HasComponentsOfType<T>` in Flow core — Dependency

The Flow wrapper uses `com.vaadin.flow.component.HasComponentsOfType<BreadcrumbItem>` from Flow core ([PR #24186](https://github.com/vaadin/flow/pull/24186)). The interface extends `HasElement, HasEnabled` and provides the full child-management surface as default methods — `add(T...)`, `add(Collection<T>)`, `remove(T...)`, `remove(Collection<T>)`, `removeAll()`, `addComponentAtIndex(int, T)`, `addComponentAsFirst(T)`, `replace(T, T)`, and `bindChildren(Signal<List<S>>, SerializableFunction<S, T>)`. `BreadcrumbTrail` overrides each of these mutating methods so it can enforce the `Mode.ROUTER` guard (see KDD §3 for the `routerUpdateInProgress` bypass).

Affects: `flow-components-bom` pom.xml Flow version property — ensure it is raised to the Flow version that includes PR #24186.

### `vaadin-flow-components-base` — Used as-is

- `HasPrefix` — prefix slot for `BreadcrumbItem`.
- `HasTooltip` — tooltip support on `BreadcrumbItem`.

No modifications.

### Flow core `HasAriaLabel`, `HasEnabled`, `HasSize`, `HasStyle` — Used as-is

No modifications.

---

## Coverage

| Requirement | Addressed in spec section(s) |
|---|---|
| 1. Displaying the ancestor trail | Component Classes → `BreadcrumbTrail` (`HasComponentsOfType<BreadcrumbItem>`); `BreadcrumbItem` (constructors with label + path) |
| 2. Current page indication | `BreadcrumbItem(String label)` (no path) — web component renders as non-link, applies `current` state attribute |
| 3. Optionally omitting the current page | No API — application chooses whether to add a no-path final item |
| 4. Visual separator between items | Web component + theme (no Flow API) |
| 5. Customizable separator appearance | `HasStyle` → `getStyle().set("--vaadin-breadcrumb-trail-separator", ...)` |
| 6. Overflow collapse of intermediate items | Web component (no Flow API) |
| 7. Expanding collapsed items | Web component; `BreadcrumbTrailI18n.moreItems` sets the overflow button's `aria-label` |
| 8. Items may display icons | `BreadcrumbItem implements HasPrefix` + constructor overloads ending in `Component prefixComponent` |
| 9. Dynamic trail updates | `HasComponentsOfType<BreadcrumbItem>` `add`/`remove`/`removeAll` in `Mode.MANUAL`; inherited `bindChildren(Signal<List<...>>, factory)` or `Signal.effect(breadcrumbTrail, ...)` for reactive updates |
| 10. Navigation landmark | `BreadcrumbTrail implements HasAriaLabel` |
| 11. Current page announced as current | Web component (no Flow API) |
| 12. Directional separator flips in RTL | Web component + theme (no Flow API) |
| 13. Flow: Default trail derived from router | `Mode.ROUTER` (default); `onAttach` registers `AfterNavigationListener`; `RouteParentResolver.resolveTrail` walks `@PageTitle` + `@RouteParent` + URL prefixes; `HasDynamicTitle` honoured for the current view |
| 14. Flow: Opting out of automatic trail population | `Mode.MANUAL` (via constructor or `setMode`); `add`/`remove`/`removeAll` throw `IllegalStateException` in `Mode.ROUTER` |
| 15. Flow: Sitemap parent annotation overrides URL-based parent lookup | `@RouteParent` annotation; `RouteParentResolver` consults it before URL-prefix walking |
| 16. Flow: Routes can dynamically supply their breadcrumb contribution | Covered via the manual-construction pattern: `Mode.MANUAL` + application-side data loading + `add(...)` (see flow-api.md Discussion "How is requirement 16 … covered without a dedicated API?"). No new Flow API in this iteration — explicitly documented as a possible future addition. |

---

## Discussion

Questions raised during spec production, with their resolutions.

**Q: How does `Mode.ROUTER` react to navigation?**

`onAttach` registers `UI.addAfterNavigationListener(event -> rebuildFromRouter(...))` and holds the returned `Registration` in a transient field. `onDetach` unregisters. Each navigation rebuilds the trail via `RouteParentResolver.resolveTrail` and calls an internal `updateChildrenInternal(List<BreadcrumbItem>)` that bypasses the `Mode.ROUTER` guard on `add`/`remove`/`removeAll` — user code cannot reach this path.

**Q: What happens if the user calls `setMode(Mode.ROUTER)` on a trail that already has children?**

`setMode` throws `IllegalStateException`. Switching into `ROUTER` requires an empty trail because the router populator is about to install its own children; silently discarding the user's items would be surprising. Applications can call `removeAll()` before `setMode(Mode.ROUTER)` if they really want the switch.

**Q: Is there a way to drive the trail reactively from a `Signal<List<BreadcrumbItem>>`?**

Not via a dedicated `bindItems` method. Per flow-api.md Discussion "Why no dedicated `bindItems(Signal<...>)` method?", Flow core's `Signal.effect(component, Runnable)` is sufficient — the effect re-runs whenever observed signals change, and the callback does `removeAll()` + `add(...)`. This keeps the API surface small and lets the `bindItems` decision be revisited after real usage.

**Q: Why `Mode` instead of a `Breadcrumb{Trail,Router}Mode` or similar prefixed enum?**

Nested enum `BreadcrumbTrail.Mode` is the Vaadin convention for short enum types strongly tied to a single component (e.g. `Dialog.Position`, `Notification.Position`). Fully-qualified `BreadcrumbTrail.Mode.MANUAL` and imported `Mode.MANUAL` both read naturally.

**Q: Can `BreadcrumbItem.bindLabel(Signal<String>)` be added later without breaking the API?**

Yes — additive. The constructor set stays the same; `bindLabel` would be a new method next to `setLabel`. It is deferred because no requirement in requirements.md (universal + flow) asks for per-item reactive labels, and the item-tree reactive pattern (`Signal.effect` on the container) already covers every case.

**Q: Does the router listener need to guard against the detached-component case?**

Yes — the listener is unregistered in `onDetach`, but a navigation may fire between the detach event and the registration cleanup on another thread. `rebuildFromRouter` guards with `if (!isAttached()) return;` so a stray late callback is a no-op.

**Q: Why does `getI18n()` return the last-set value (or `null`) rather than lazily creating a default `BreadcrumbTrailI18n`?**

For consistency with `SideNav.getI18n()`, which returns `null` until `setI18n(...)` is called. Applications that want to tweak a single field build a new instance: `trail.setI18n(new BreadcrumbTrailI18n().setMoreItems("Show hidden items"))`. A lazy-init getter would hide the fact that the i18n object is a JSON payload pushed to the client — making it feel like a reactive bean when it isn't. The current shape also lets `null` mean "use the web component's built-in defaults", which is a meaningful state the lazy-init pattern cannot express.

