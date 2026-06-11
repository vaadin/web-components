# Breadcrumbs Flow Component Specification

> Wraps the experimental web component `<vaadin-breadcrumbs>`. Flow users enable it via the `com.vaadin.experimental.breadcrumbsComponent` feature flag — defined by a `BreadcrumbsFeatureFlagProvider` registered in this module (no Flow core change needed). The flag key matches the `window.Vaadin.featureFlags.breadcrumbsComponent` flag on the web-component side, so a single entry in `vaadin-featureflags.properties` controls both sides.

## Key Design Decisions

1. **`Mode` enum drives ownership.** Following flow-api.md §1 and §9, `Breadcrumbs.Mode` is a public nested enum with values `ROUTER` (default) and `MANUAL`. The mode is set at construction (`new Breadcrumbs()` / `new Breadcrumbs(Mode)`) and can be switched at runtime via `setMode(Mode)`. `add`/`remove`/`removeAll` throw `IllegalStateException` while in `Mode.ROUTER`. `setMode(Mode)` is symmetric: both transitions clear the current children and install the new mode's wiring — `ROUTER → MANUAL` drops router-derived items and unregisters the navigation listener, `MANUAL → ROUTER` drops manually-added items and starts the router listener plus an initial rebuild. See "Mode switching" below for the full contract.

2. **`HasComponentsOfType<BreadcrumbsItem>` for child management.** Per flow-api.md §1 "Why this shape". The Flow core interface extends `HasElement, HasEnabled` and supplies the full child-management surface as default methods (see the class skeleton in "Component Classes"), all of which must be intercepted by the `Mode.ROUTER` guard (see KDD §1). `HasEnabled` is inherited transitively — it does not need to appear in `Breadcrumbs`'s `implements` list.

3. **Router integration via `AfterNavigationListener`.** For `Mode.ROUTER`, the component registers `UI.addAfterNavigationListener(...)` in its attach handler and unregisters in detach. The listener walks the route hierarchy — `@RouteParent` first, then URL-prefix — and calls `updateChildrenInternal(List<BreadcrumbsItem>)` to replace the trail. `updateChildrenInternal` sets an internal `boolean routerUpdateInProgress` flag, routes the update through the normal component API (`removeAll()` + `add(...)`), then clears the flag; the `Mode.ROUTER` guard on the public methods skips the throw when the flag is set.

4. **`@RouteParent` annotation lives in Flow core.** Per flow-api.md §10. `com.vaadin.flow.router.RouteParent` is introduced in Flow core alongside `@Route`, `@RouteAlias`, `@ParentLayout`. The breadcrumb module only consumes it — it neither defines it nor re-exports it. See "Reuse and Proposed Adjustments" for the Flow core dependency.

5. **Route-hierarchy walking is a Flow core feature, not a breadcrumb-specific resolver.** The "given a route class, walk up via `@RouteParent` then URL-prefix fallback" algorithm is useful to any navigation component (back-button helpers, SEO link-graph generators, sitemap renderers), so it lives in Flow core next to `@RouteParent` itself. The breadcrumb consumes it via a public helper — see "Reuse and Proposed Adjustments → Flow core: route-hierarchy walker". The resolver reads only static metadata (`@PageTitle`, `@RouteParent`) and therefore never instantiates ancestor views; the breadcrumbs adds the dynamic-title step for the current (already-instantiated) view itself.

6. **No connector needed.** All state is set via standard Element attributes/properties from server-side Java — `setPath` writes the `path` attribute, `setPrefixComponent` uses `SlotUtils.setSlot` for the prefix slot, `setI18n` pushes a JSON object to the `i18n` client property. The web component's overflow behaviour is entirely client-side, and the web component itself only accepts `<vaadin-breadcrumbs-item>` light-DOM children (no programmatic `items` data-array property — see web-component-api.md §6 and its Discussion). No connector file under `src/main/resources/META-INF/resources/frontend/`.

7. **No events.** Neither `Breadcrumbs` nor `BreadcrumbsItem` exposes a server-side event (no click listeners, no navigate events — see flow-api.md Discussion "Why no click listener on `BreadcrumbsItem`?"). Items render as anchors and the Flow router intercepts clicks at the document level.

8. **No `@Synchronize`'d properties.** No client-driven state round-trips to the server. `has-overflow` is a visual state attribute the server does not need to observe.

9. **Theme variants via `HasThemeVariant<BreadcrumbsVariant>`.** Per guidelines/09-theming.md. `Breadcrumbs` implements `HasThemeVariant<BreadcrumbsVariant>`; the `BreadcrumbsVariant` enum carries `SLASH` (base-styles separator), `LUMO_PRIMARY` (Lumo), and `AURA_ACCENT` (Aura). See "Theme Variants" for the enum and inherited API, and the Discussion ("Why does `Breadcrumbs` expose theme variants?") for the rationale.

10. **`BreadcrumbsI18n` is a nested static class.** Follows the `SideNavI18n` / `MenuBarI18n` convention — `Serializable`, `@JsonInclude(JsonInclude.Include.NON_NULL)`, fluent setters returning `BreadcrumbsI18n`. Serialised with `JacksonUtils.beanToJson` and pushed to the client via `getElement().setPropertyJson("i18n", ...)` in the attach handler (so re-attach re-sets the property for the fresh client-side element). `setI18n` rejects `null` (`Objects.requireNonNull`) — see the i18n section.

11. **Package name `com.vaadin.flow.component.breadcrumbs`.** Mirrors `com.vaadin.flow.component.sidenav` — the short form that drops internal hyphens.

12. **Module `vaadin-breadcrumbs-flow-parent`.** Standard parent-child split `vaadin-{name}-flow-parent` / `vaadin-{name}-flow` / `vaadin-{name}-flow-integration-tests` / `vaadin-{name}-testbench`.

13. **Serialisation.** The `AfterNavigationListener` `Registration` returned from the attach handler is held as a `transient` field and rebuilt in the attach handler on re-attach (Flow may replace the client-side element). `BreadcrumbsI18n` implements `Serializable`. `Mode` enum is inherently serialisable. No other non-trivial state.

---

## Module / Package Layout

```
flow-components/
└── vaadin-breadcrumbs-flow-parent/
    ├── pom.xml
    ├── vaadin-breadcrumbs-flow/
    │   ├── pom.xml
    │   └── src/
    │       ├── main/java/com/vaadin/flow/component/breadcrumbs/
    │       │   ├── Breadcrumbs.java                # host element, Mode enum, BreadcrumbsI18n nested class
    │       │   ├── BreadcrumbsItem.java                 # <vaadin-breadcrumbs-item>
    │       │   ├── BreadcrumbsVariant.java              # ThemeVariant enum (SLASH, LUMO_PRIMARY, AURA_ACCENT)
    │       │   ├── BreadcrumbsFeatureFlagProvider.java  # defines the Feature constant
    │       │   └── ExperimentalFeatureException.java   # local exception with a helpful message
    │       ├── main/resources/
    │       │   └── META-INF/services/
    │       │       └── com.vaadin.experimental.FeatureFlagProvider   # one-line ServiceLoader registration
    │       └── test/java/com/vaadin/flow/component/breadcrumbs/tests/
    │           ├── BreadcrumbsTest.java
    │           ├── BreadcrumbsModeTest.java
    │           ├── BreadcrumbsItemTest.java
    │           ├── BreadcrumbsVariantTest.java
    │           ├── BreadcrumbsSerializableTest.java
    │           ├── BreadcrumbsI18nTest.java
    │           └── FeatureFlagTest.java
    ├── vaadin-breadcrumbs-flow-integration-tests/
    │   ├── pom.xml
    │   └── src/
    │       ├── main/java/com/vaadin/flow/component/breadcrumbs/tests/
    │       │   ├── ManualBreadcrumbsPage.java     # @Route for Mode.MANUAL
    │       │   ├── RouterBreadcrumbsPage.java     # @Route for Mode.ROUTER
    │       │   ├── RouteParentPage.java               # @Route with @RouteParent
    │       │   ├── DynamicTitlePage.java              # HasDynamicTitle on current view
    │       │   └── IconBreadcrumbsPage.java       # prefix icons
    │       └── test/java/com/vaadin/flow/component/breadcrumbs/tests/
    │           ├── ManualBreadcrumbsIT.java
    │           ├── RouterBreadcrumbsIT.java
    │           ├── RouteParentIT.java
    │           └── IconBreadcrumbsIT.java
    └── vaadin-breadcrumbs-testbench/
        ├── pom.xml
        └── src/main/java/com/vaadin/flow/component/breadcrumbs/testbench/
            ├── BreadcrumbsElement.java            # @Element("vaadin-breadcrumbs")
            └── BreadcrumbsItemElement.java             # @Element("vaadin-breadcrumbs-item")
```

Java package: `com.vaadin.flow.component.breadcrumbs`.

Integration-tests module must include `src/main/resources/vaadin-featureflags.properties` enabling `com.vaadin.experimental.breadcrumbsComponent=true`, mirroring `vaadin-master-detail-layout-flow-integration-tests`.

---

## Component Classes

### `Breadcrumbs` — container

```java
@Tag("vaadin-breadcrumbs")
@NpmPackage(value = "@vaadin/breadcrumbs", version = "25.2.0-alpha{N}")
@JsModule("@vaadin/breadcrumbs/src/vaadin-breadcrumbs.js")
public class Breadcrumbs extends Component
        implements HasSize, HasStyle, HasAriaLabel,
                   HasThemeVariant<BreadcrumbsVariant>,
                   HasComponentsOfType<BreadcrumbsItem> {

    public enum Mode {
        ROUTER,
        MANUAL
    }

    // State
    private Mode mode;
    private BreadcrumbsI18n i18n;
    private transient Registration navigationRegistration;

    // Constructors
    public Breadcrumbs();                       // defaults to Mode.ROUTER
    public Breadcrumbs(Mode mode);

    // Mode
    public Mode getMode();
    public void setMode(Mode mode);                 // switching resets the internal state

    // Items — all inherited from HasComponentsOfType<BreadcrumbsItem>, each
    // overridden to throw IllegalStateException if Mode.ROUTER (unless the
    // internal routerUpdateInProgress flag is set — see KDD §3):
    //   add(BreadcrumbsItem...) / add(Collection<BreadcrumbsItem>)
    //   addComponentAsFirst(BreadcrumbsItem)
    //   addComponentAtIndex(int, BreadcrumbsItem)
    //   remove(BreadcrumbsItem...) / remove(Collection<BreadcrumbsItem>)
    //   removeAll()
    //   replace(BreadcrumbsItem, BreadcrumbsItem)
    //   bindChildren(Signal<List<S>>, SerializableFunction<S, BreadcrumbsItem>)
    //
    // getChildren() / children stream — always allowed.

    // i18n
    public BreadcrumbsI18n getI18n();
    public void setI18n(BreadcrumbsI18n i18n);

    // Accessible name — inherited from HasAriaLabel:
    //   setAriaLabel(String)
    //   getAriaLabel()

    // Lifecycle
    @Override
    protected void onAttach(AttachEvent attachEvent);   // checks feature flag; re-pushes i18n; wires router listener if ROUTER
    @Override
    protected void onDetach(DetachEvent detachEvent);   // unregisters router listener

    // Nested i18n class — see §i18n below
    public static class BreadcrumbsI18n implements Serializable { ... }
}
```

**Implemented mixin interfaces:**

- `HasSize` — covers requirement that the component can be sized by the application (universal API hygiene).
- `HasStyle` — required for requirement 5 (customise separator via `--vaadin-breadcrumbs-separator` CSS custom property) and for `getStyle()` access per `DESIGN_GUIDELINES.md` "Styling lives in CSS, not Java".
- `HasAriaLabel` — requirement 10 (navigation landmark accessible name). Flow core interface.
- `HasThemeVariant<BreadcrumbsVariant>` — requirement 5 plus general theming. Shared interface from `vaadin-flow-components-base`. See "Theme Variants" for the variant enum and the inherited method surface.
- `HasComponentsOfType<BreadcrumbsItem>` — requirement 1, 9 (add/remove/manage items with compile-time type safety). Flow core interface. All inherited mutating methods (see the class skeleton above) are overridden to throw `IllegalStateException` when `Mode.ROUTER` (unless the internal `routerUpdateInProgress` flag is set).

**@Synchronize'd properties:** none.

**Events:** none.

**Feature-flag check.** `onAttach` calls `Breadcrumbs.checkFeatureFlag(attachEvent.getUI())` following the pattern from `MasterDetailLayout.checkFeatureFlag`: throws `ExperimentalFeatureException` when `FeatureFlags.BREADCRUMBS_COMPONENT` is disabled.

**Router mode wiring (attach).** The component relies on Flow's existing router and router-utils API; no new per-call mechanism is invented. Two entry points feed the resolver:

- `UI.addAfterNavigationListener(AfterNavigationListener)` — public API on `UI`. The listener receives an `AfterNavigationEvent` whose `getLocation()`, `getActiveChain()`, and `getRouteParameters()` are all public accessors. This catches every navigation for the lifetime of the attachment (including long-lived shell placement).
- An initial, synchronous rebuild in `onAttach` itself, for the case where the breadcrumbs are added to a view that has already finished rendering (so no navigation is pending and the listener has nothing to fire on). Flow core does not currently expose a public "read current navigation state" API at arbitrary times — `UI.getInternals().getActiveViewLocation()` and `UI.getInternals().getActiveRouterTargetsChain()` are the de facto accessors (public methods, but on `UIInternals` which sits in `com.vaadin.flow.component.internal`). See "Reuse and Proposed Adjustments → Flow core dependencies" for the proposal to promote these to a public `Router`/`RouteUtil` entry point.

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

Both overloads ultimately build the trail via the same private routine (see "How `Breadcrumbs` builds the trail" below), which calls the Flow core `RouteHierarchy` walker, wraps the returned ancestor classes into `BreadcrumbsItem` instances, and hands the result to `updateChildrenInternal(trail)`. Both guard against stale callbacks: `if (!isAttached()) return;` first.

`updateChildrenInternal(List<BreadcrumbsItem> trail)`:

```java
private boolean routerUpdateInProgress;

void updateChildrenInternal(List<BreadcrumbsItem> trail) {
    routerUpdateInProgress = true;
    try {
        removeAll();                                  // reaches super.removeAll() via HasComponentsOfType
        add(trail.toArray(BreadcrumbsItem[]::new));    // reaches super.add(T...)
    } finally {
        routerUpdateInProgress = false;
    }
}
```

The overridden mutating methods check `mode == Mode.ROUTER && !routerUpdateInProgress` and throw `IllegalStateException` if so. This means router-derived items are regular logical children — `getChildren()` returns them, serialisation captures them, no virtual-children machinery is involved.

**Mode switching.** `setMode(Mode newMode)`:
- If already equal, no-op.
- On transition `ROUTER → MANUAL`: clear any router-derived items via `updateChildrenInternal(List.of())`, unregister the navigation listener. Subsequent `add(...)` calls are the application's responsibility.
- On transition `MANUAL → ROUTER`: clear any manually-added items via `updateChildrenInternal(List.of())` (same bypass — the children are replaced by the router-derived trail anyway). Register the navigation listener if attached and trigger an initial `rebuildFromRouter`; if not attached, registration happens in the next `onAttach`.

---

### `BreadcrumbsItem` — child element

```java
@Tag("vaadin-breadcrumbs-item")
@NpmPackage(value = "@vaadin/breadcrumbs", version = "25.2.0-alpha{N}")
@JsModule("@vaadin/breadcrumbs/src/vaadin-breadcrumbs-item.js")
public class BreadcrumbsItem extends Component
        implements HasText, HasEnabled, HasPrefix {

    // Constructors — mirror SideNavItem's overload set
    public BreadcrumbsItem(String text);                                                            // current page (no path)
    public BreadcrumbsItem(String text, String path);
    public BreadcrumbsItem(String text, Class<? extends Component> view);
    public BreadcrumbsItem(String text, Class<? extends Component> view, RouteParameters params);
    public BreadcrumbsItem(String text, String path, Component prefixComponent);
    public BreadcrumbsItem(String text, Class<? extends Component> view, Component prefixComponent);
    public BreadcrumbsItem(String text, Class<? extends Component> view,
                          RouteParameters params, Component prefixComponent);

    // Text — inherited from HasText:
    //   setText(String)
    //   getText()
    //   bindText(Signal<String>) — returns SignalBinding<String>

    // Path
    public String getPath();
    public void setPath(String path);
    public void setPath(Class<? extends Component> view);
    public void setPath(Class<? extends Component> view, RouteParameters parameters);

    // Prefix — inherited from HasPrefix:
    //   setPrefixComponent(Component)
    //   getPrefixComponent()
}
```

**Implemented mixin interfaces:**

- `HasText` — the default slot of `<vaadin-breadcrumbs-item>` holds the item's text content. `HasText` from Flow core provides `setText(String)` / `getText()` and `bindText(Signal<String>) → SignalBinding<String>` as default methods, so the signal-binding entry point for reactive item text is also available without additional code.
- `HasEnabled` — lets the application disable individual items (e.g. an ancestor the user has no permission to visit).
- `HasPrefix` — requirement 8 (icons). `slot="prefix"` on `<vaadin-breadcrumbs-item>`, shared mixin from `vaadin-flow-components-base`.

**No `HasSuffix`** — web-component-api.md explicitly excludes it. If added later on the web-component side, the Flow class adds `HasSuffix` to the `implements` clause; that is strictly additive.

**No click listener** — flow-api.md Discussion "Why no click listener on `BreadcrumbsItem`?" The web component renders an anchor; the Flow router intercepts clicks.

**Path resolution.** `setPath(Class<? extends Component>)` and `setPath(Class, RouteParameters)` mirror `SideNavItem.setPath(...)` exactly: `RouteConfiguration.forRegistry(ComponentUtil.getRouter(this).getRegistry()).getUrl(view, params)` and the resulting string is written to the `path` attribute. Router-agnosticism: Flow wraps the routing resolution, but the anchor `<a href="...">` is still plain HTML — Flow does not intercept clicks at the component level.

**No @Synchronize'd properties.** `path` is server-driven.

**Events:** none.

---

## i18n

```java
@JsonInclude(JsonInclude.Include.NON_NULL)
public static class BreadcrumbsI18n implements Serializable {
    private String moreItems;

    public String getMoreItems();
    public BreadcrumbsI18n setMoreItems(String moreItems);
}
```

Exposed on `Breadcrumbs` via `setI18n(BreadcrumbsI18n)` / `getI18n()`. Serialised via `JacksonUtils.beanToJson(i18n)` and pushed to the client through `getElement().setPropertyJson("i18n", json)` inside the attach handler (so that on re-attach the fresh client element receives the property again). `setI18n` rejects `null` with `Objects.requireNonNull("The i18n properties object should not be null")`, per guidelines/10-i18n-and-a11y.md. Before `setI18n` is first called, `getI18n()` returns `null` and no `i18n` property is pushed, so the web component uses its built-in defaults.

| Field | Type | Default (English) | Web-component `i18n` field | Notes |
|---|---|---|---|---|
| `moreItems` | String | `null` (web component default: `"More items"`) | `moreItems` | `aria-label` of the overflow button (see web-component-api.md §4) |

Setter returns `this` so calls can be chained: `new BreadcrumbsI18n().setMoreItems("Show hidden items")`.

---

## Theme Variants

`Breadcrumbs` implements `HasThemeVariant<BreadcrumbsVariant>` (from `vaadin-flow-components-base`), exposing the typed `addThemeVariants` / `removeThemeVariants` / `setThemeVariants` / `setThemeVariant` / `bindThemeVariant` / `bindThemeVariants` surface. The component writes none of these — every method is a default on the shared interface, so declaring the type parameter is the whole implementation.

`BreadcrumbsVariant` is a `ThemeVariant` enum whose `getVariantName()` returns the exact `theme` token the web component accepts (guidelines/09-theming.md), following the `SideNavVariant` shape:

```java
public enum BreadcrumbsVariant implements ThemeVariant {
    SLASH("slash"),
    LUMO_PRIMARY("primary"),
    AURA_ACCENT("accent");

    private final String variant;

    BreadcrumbsVariant(String variant) {
        this.variant = variant;
    }

    @Override
    public String getVariantName() {
        return variant;
    }
}
```

| Enum value | `theme` token | Web component support |
|---|---|---|
| `SLASH` | `slash` | Ships in base styles — renders a `/` separator instead of the chevron (web-component-spec.md "Theme" table). |
| `LUMO_PRIMARY` | `primary` | Lumo variant — restores a distinct link color (web-component-spec.md "Theme" table). |
| `AURA_ACCENT` | `accent` | Aura variant — restores a distinct link color (web-component-spec.md "Theme" table). |

Every value maps to a `theme` token the web component actually honours, as guidelines/09-theming.md requires.

A `BreadcrumbsVariantTest` maps each enum value to its expected token (guidelines/12-testing.md).

---

## Connector

**No connector required.** All state is set via Element attributes and properties directly from server-side Java:

- `path` — `setAttribute("path", ...)` on `BreadcrumbsItem`
- `prefix` slot — managed by `HasPrefix` / `SlotUtils.setSlot(this, "prefix", component)`
- `i18n` — `setPropertyJson("i18n", JacksonUtils.beanToJson(i18n))` on `Breadcrumbs`
- `aria-label` — `HasAriaLabel` attribute
- Item set — light-DOM children (component tree), observed client-side by `SlotController`

No JavaScript file under `src/main/resources/META-INF/resources/frontend/`.

---

## Feature Flag

The component is experimental and the Flow wrapper is gated by a feature flag defined locally in this module — mirroring the convention used by `Badge`, `Slider`, and the other experimental components in flow-components. No Flow core change is needed.

### `BreadcrumbsFeatureFlagProvider`

```java
package com.vaadin.flow.component.breadcrumbs;

import java.util.List;

import com.vaadin.experimental.Feature;
import com.vaadin.experimental.FeatureFlagProvider;

public class BreadcrumbsFeatureFlagProvider implements FeatureFlagProvider {

    public static final Feature BREADCRUMBS_COMPONENT = new Feature(
            "Breadcrumbs component",                                   // title
            "breadcrumbsComponent",                                     // id — matches web-component flag
            "https://github.com/vaadin/platform/issues/{platform-issue-id}", // tracking issue
            true,                                                           // requiresServerRestart
            "com.vaadin.flow.component.breadcrumbs.Breadcrumbs");   // primary class owning the flag

    @Override
    public List<Feature> getFeatures() {
        return List.of(BREADCRUMBS_COMPONENT);
    }
}
```

### ServiceLoader registration

File: `src/main/resources/META-INF/services/com.vaadin.experimental.FeatureFlagProvider`

```
com.vaadin.flow.component.breadcrumbs.BreadcrumbsFeatureFlagProvider
```

Flow's `FeatureFlags` discovers the provider via the standard `java.util.ServiceLoader` mechanism at startup. No build-time code generation.

### `ExperimentalFeatureException`

```java
package com.vaadin.flow.component.breadcrumbs;

public class ExperimentalFeatureException extends RuntimeException {
    public ExperimentalFeatureException() {
        super("""
                The Breadcrumbs component is currently an experimental feature \
                and needs to be explicitly enabled. The component can be \
                enabled using Copilot, in the experimental features tab, \
                or by adding a \
                `src/main/resources/vaadin-featureflags.properties` file \
                with the following content: \
                `com.vaadin.experimental.breadcrumbsComponent=true`""");
    }
}
```

### Attach-time check

`Breadcrumbs.onAttach` calls a private `checkFeatureFlag(UI)` that follows the `Badge` / `Slider` / `MasterDetailLayout` pattern exactly:

```java
private void checkFeatureFlag(UI ui) {
    FeatureFlags featureFlags = FeatureFlags
            .get(ui.getSession().getService().getContext());
    if (!featureFlags.isEnabled(
            BreadcrumbsFeatureFlagProvider.BREADCRUMBS_COMPONENT)) {
        throw new ExperimentalFeatureException();
    }
}
```

Integration-tests module enables the flag at startup with `src/main/resources/vaadin-featureflags.properties` containing `com.vaadin.experimental.breadcrumbsComponent=true`. Unit tests use the `@EnableFeatureFlagExtension` JUnit 6 extension or the equivalent fixture used by other experimental-component tests.

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
     * it is not, consumers of this annotation (e.g. the breadcrumbs
     * resolver) fall back to URL-prefix walking for this step.
     */
    Class<? extends Component> value();
}
```

The annotation is consumed by a Flow core helper (see "Reuse and Proposed Adjustments → Flow core: route-hierarchy walker") — not by breadcrumb-specific code — so any navigation component can use it.

### How `Breadcrumbs` builds the trail

The breadcrumb does no walking of its own. On each navigation it:

1. Identifies the current route class and the current view instance from `AfterNavigationEvent#getActiveChain()`.
2. Calls the Flow core walker to get the ancestor chain: `List<Class<? extends Component>> chain = RouteHierarchy.resolveAncestors(currentRoute, routeConfiguration);` (root-first, inclusive of `currentRoute` as the last entry — see the walker's contract in "Reuse and Proposed Adjustments").
3. For each ancestor class in `chain` except the last, reads its `@PageTitle` and resolves its URL via `RouteConfiguration#getUrl(ancestorClass, RouteParameters.empty())`, producing `new BreadcrumbsItem(title, ancestorClass)`.
4. For the last entry (the current route): uses `HasDynamicTitle#getPageTitle()` on the current view instance if it implements the interface, otherwise reads `@PageTitle` on the class. Constructs `new BreadcrumbsItem(title)` with no path — the current item is the non-link.
5. Calls `updateChildrenInternal(trail)`.

Everything the breadcrumbs contributes — the dynamic-title step for the current view, the wrapping into `BreadcrumbsItem` components, the `Mode.ROUTER` guard bypass — is breadcrumb-specific. The hierarchy walking, cycle detection, and `@RouteParent`-versus-URL-prefix fallback live in Flow core.

**Flow APIs used directly by the breadcrumbs (all public):**

| Purpose | API call |
|---|---|
| Current active chain at navigation time | `AfterNavigationEvent#getActiveChain()` |
| Current route params at navigation time | `AfterNavigationEvent#getRouteParameters()` |
| Current location at navigation time | `AfterNavigationEvent#getLocation()` |
| Resolve `Class<? extends Component>` → URL | `RouteConfiguration#getUrl(Class, RouteParameters)` |
| Obtain the registry-scoped config | `RouteConfiguration.forRegistry(ComponentUtil.getRouter(this).getRegistry())` |
| Read the current view's dynamic title | `HasDynamicTitle#getPageTitle()` on the view instance |
| Read a route class's static title | `routeClass.getAnnotation(PageTitle.class).value()` |
| Walk the route hierarchy | Flow core walker (see Reuse) |

**Route parameters on ancestors:** the breadcrumbs resolves ancestor URLs with `RouteParameters.empty()`, because ancestor routes may have a different parameter set from the current route. Applications that need ancestor labels with live data should use `Mode.MANUAL` and build the trail themselves (flow-api.md §9).

---

## TestBench Elements

### `BreadcrumbsElement`

```java
@Element("vaadin-breadcrumbs")
public class BreadcrumbsElement extends TestBenchElement {

    public List<BreadcrumbsItemElement> getItems();

    public BreadcrumbsItemElement getCurrentItem();          // the item with the `current` state attribute (last no-path)

    public BreadcrumbsItemElement getItemByText(String text);

    public BreadcrumbsItemElement getItemByPath(String path);

    public boolean hasOverflow();                           // reads has-overflow attribute

    public TestBenchElement getOverflowButton();            // shadow-DOM part="overflow-button"

    public void openOverflowOverlay();                       // click overflow button

    public TestBenchElement getOverflowOverlay();           // the <vaadin-breadcrumbs-overlay> element

    public List<TestBenchElement> getOverflowItems();       // links inside the open overlay
}
```

### `BreadcrumbsItemElement`

```java
@Element("vaadin-breadcrumbs-item")
public class BreadcrumbsItemElement extends TestBenchElement {

    public String getText();

    public String getPath();

    public boolean isCurrent();                             // reads `current` state attribute

    public boolean hasPrefix();                             // reads `has-prefix` state attribute

    public TestBenchElement getPrefixSlotContent();

    @Override
    public void click();                                    // clicks the anchor in shadow DOM
}
```

Queries use the same pattern as `SideNavElement` / `SideNavItemElement`: `$("vaadin-breadcrumbs-item").all()` for items, shadow-DOM CSS for parts and slotted content.

---

## Reuse and Proposed Adjustments to Existing Modules

### Flow core: a `Signal<NavigationState>` for the current route — Proposed

The resolver's initial-attach path needs to read the active location and active router-targets chain without a pending `AfterNavigationEvent`. Today this goes through `UIInternals.getActiveViewLocation()` and `UIInternals.getActiveRouterTargetsChain()` — both public methods on a type that sits in `com.vaadin.flow.component.internal`. The `internal` package suffix signals "not part of the stable public API".

Rather than promote these two accessors to a public facade, the preferred landing is a **reactive signal** exposing the UI's current navigation state:

```java
// in com.vaadin.flow.router.Router (or on UI directly):
public Signal<NavigationState> getCurrentNavigation();

// where NavigationState carries the same data the resolver needs:
public record NavigationState(
        Class<? extends Component> routeClass,
        Component viewInstance,                // for HasDynamicTitle
        RouteParameters routeParameters,
        Location location) {}

// finer-grained variants, so consumers rerun only on relevant changes:
public Signal<Class<? extends Component>> getCurrentRoute();
public Signal<RouteParameters>            getCurrentRouteParameters();
public Signal<Location>                   getCurrentLocation();
```

With this primitive in place, the breadcrumbs' router mode collapses to a single subscription:

```java
Signal.effect(breadcrumbs,
        () -> updateChildrenInternal(resolveTrail(Router.getCurrent().getCurrentNavigation().get())));
```

What falls away compared to the current listener-based design:

- **No `addAfterNavigationListener` / `Registration` lifecycle** — `Signal.effect(component, Runnable)` is already bound to the component's attach/detach; auto-unsubscribes on detach, re-subscribes on re-attach.
- **No `transient navigationRegistration` field** — signals handle lifecycle.
- **No stale-callback guard** — signal subscriptions stop delivering as soon as the component detaches.
- **No split between "initial state" and "subsequent events"** — `Signal#get()` always returns current truth, so the "what if the component attaches after the navigation already fired" edge case just works.
- **No `UIInternals` dependency anywhere in the breadcrumbs** — the signal is the public, documented accessor for current navigation state.

The signal composes beyond breadcrumbs: SideNav's current-item highlighting (today client-side URL matching) could become a server-side `Signal.computed(...)` over `getCurrentLocation`; a back-button's visibility could bind to whether `getCurrentRoute().get()` carries a `@RouteParent`; analytics hooks and page-title manipulators each become one-liners. `AfterNavigationListener` stays — the signal is a reactive overlay, not a replacement for the event API.

Until the signal ships, the resolver calls `UIInternals` directly and accepts the compatibility risk. Those accessors have been stable across many Vaadin releases, and any flow-components code depending on them would need to migrate in the same release as the signal lands anyway.

Affects: Flow core. Fits the broader direction of making Flow state reactive-first (alongside `ValueSignal`, `Signal.effect`, `HasComponentsOfType.bindChildren`).

### Flow core: route-hierarchy walker — Proposed

`@RouteParent` is generic routing metadata, so the code that reads it and walks the route hierarchy is generic too. Rather than ship breadcrumb-specific resolver logic that any future navigation component would have to duplicate, the walker lands in Flow core alongside `@RouteParent`.

Expected shape (names indicative; exact placement is a Flow-core decision):

```java
// in com.vaadin.flow.router
public final class RouteHierarchy {

    /**
     * Returns the chain of route classes from the root down to and
     * including {@code routeClass}, using {@code @RouteParent} when
     * present and falling back to URL-prefix walking otherwise. Cycles
     * are detected and truncated.
     *
     * @return a root-first list; the last element is always
     *         {@code routeClass} when it is routable.
     */
    public static List<Class<? extends Component>> resolveAncestors(
            Class<? extends Component> routeClass,
            RouteConfiguration routeConfiguration);

    /**
     * Returns the immediate parent of {@code routeClass}, or empty if
     * no parent can be resolved. Reads {@code @RouteParent} first, then
     * URL-prefix walks.
     */
    public static Optional<Class<? extends Component>> resolveParent(
            Class<? extends Component> routeClass,
            RouteConfiguration routeConfiguration);
}
```

**Algorithm contract** (implemented in Flow core; the breadcrumbs only consumes it):

1. Start with `routeClass`; if it has no `@Route` annotation, return an empty list (no hierarchy to walk).
2. Maintain `Set<Class<? extends Component>> visited`, initialised with `routeClass`.
3. At each step: read `@RouteParent` from the current class. If present and its value has `@Route`, jump there. Otherwise (annotation absent, or target is not a `@Route`), strip the last `/`-separated segment from the current class's URL (resolved via `RouteConfiguration#getUrl`) and call `RouteConfiguration#getRoute(strippedUrl)`; use that as the parent if present.
4. Terminate when no parent is found, when the candidate is already in `visited` (cycle), or when URL-prefix stripping produces an empty URL.
5. Return the list root-first, inclusive of the original `routeClass` as the last element.

This is additive to Flow core — one new class next to `@RouteParent`, no change to existing router API. Tests for the walker (including cycle handling and parent-without-`@Route` fallback) live with Flow core, not with the breadcrumbs module.

Affects: Flow core. The breadcrumb depends on it for `Mode.ROUTER` but adds no code of its own for hierarchy walking.

### `com.vaadin.flow.router.RouteParent` — Flow core dependency

`@RouteParent` is not tied to breadcrumb rendering — per flow-api.md Discussion "Why `@RouteParent` rather than a breadcrumb-specific name?", the annotation belongs in `com.vaadin.flow.router` alongside `@Route`, `@RouteAlias`, `@ParentLayout`. This lets any future navigation component (back-helpers, parent-link renderers, SEO link-graph utilities) consume the same declaration.

The annotation will land in Flow core and this module depends on it. Ensure `flow-components-bom` targets a Flow version that includes the `RouteParent` annotation.

Affects: no flow-components module defines this annotation; the breadcrumbs module imports `com.vaadin.flow.router.RouteParent` indirectly through the Flow core `RouteHierarchy` walker.

### `HasComponentsOfType<T>` in Flow core — Dependency

The Flow wrapper uses `com.vaadin.flow.component.HasComponentsOfType<BreadcrumbsItem>` from Flow core, which provides the full child-management surface as default methods (see the class skeleton in "Component Classes"). `Breadcrumbs` overrides each mutating method to enforce the `Mode.ROUTER` guard (see KDD §3 for the `routerUpdateInProgress` bypass).

### `vaadin-flow-components-base` — Used as-is

- `HasPrefix` — prefix slot for `BreadcrumbsItem`.

No modifications.

### Flow core `HasAriaLabel`, `HasEnabled`, `HasSize`, `HasStyle` — Used as-is

No modifications.

---

## Coverage

| Requirement | Addressed in spec section(s) |
|---|---|
| 1. Displaying the ancestor trail | Component Classes → `Breadcrumbs` (`HasComponentsOfType<BreadcrumbsItem>`); `BreadcrumbsItem` (constructors with text + path) |
| 2. Current page indication | `BreadcrumbsItem(String text)` (no path) — web component renders as non-link, applies `current` state attribute |
| 3. Optionally omitting the current page | No API — application chooses whether to add a no-path final item |
| 4. Visual separator between items | Web component + theme (no Flow API) |
| 5. Customizable separator appearance | `HasStyle` → `getStyle().set("--vaadin-breadcrumbs-separator", ...)`; `HasThemeVariant<BreadcrumbsVariant>` → `addThemeVariants(BreadcrumbsVariant.SLASH)` for the bundled slash separator |
| 6. Overflow collapse of intermediate items | Web component (no Flow API) |
| 7. Expanding collapsed items | Web component; `BreadcrumbsI18n.moreItems` sets the overflow button's `aria-label` |
| 8. Items may display icons | `BreadcrumbsItem implements HasPrefix` + constructor overloads ending in `Component prefixComponent` |
| 9. Dynamic trail updates | `HasComponentsOfType<BreadcrumbsItem>` `add`/`remove`/`removeAll` in `Mode.MANUAL`; inherited `bindChildren(Signal<List<...>>, factory)` or `Signal.effect(breadcrumbs, ...)` for reactive updates |
| 10. Navigation landmark | `Breadcrumbs implements HasAriaLabel` |
| 11. Current page announced as current | Web component (no Flow API) |
| 12. Directional separator flips in RTL | Web component + theme (no Flow API) |
| 13. Flow: Default trail derived from router | `Mode.ROUTER` (default); `onAttach` registers `AfterNavigationListener`; the Flow core `RouteHierarchy.resolveAncestors(...)` walker walks `@RouteParent` + URL prefixes; the breadcrumbs adds `@PageTitle` / `HasDynamicTitle` label resolution for the returned classes |
| 14. Flow: Opting out of automatic trail population | `Mode.MANUAL` (via constructor or `setMode`); `add`/`remove`/`removeAll` throw `IllegalStateException` in `Mode.ROUTER` |
| 15. Flow: Sitemap parent annotation overrides URL-based parent lookup | `@RouteParent` annotation in Flow core; `RouteHierarchy.resolveAncestors` consults it before URL-prefix walking |
| 16. Flow: Routes can dynamically supply their breadcrumb contribution | Covered via the manual-construction pattern: `Mode.MANUAL` + application-side data loading + `add(...)` (see flow-api.md Discussion "How is requirement 16 … covered without a dedicated API?"). No new Flow API in this iteration — explicitly documented as a possible future addition. |

---

## Discussion

Questions raised during spec production, with their resolutions.

**Q: How does `Mode.ROUTER` react to navigation?**

`onAttach` registers `UI.addAfterNavigationListener(event -> rebuildFromRouter(...))` and holds the returned `Registration` in a transient field. `onDetach` unregisters. Each navigation rebuilds the trail by calling the Flow core `RouteHierarchy.resolveAncestors(...)` walker, wrapping each returned class into a `BreadcrumbsItem`, and handing the list to an internal `updateChildrenInternal(List<BreadcrumbsItem>)` that bypasses the `Mode.ROUTER` guard on `add`/`remove`/`removeAll` — user code cannot reach this path.

**Q: What happens if the user calls `setMode(Mode.ROUTER)` on a trail that already has children?**

`setMode` clears the trail and installs the router-derived one — no exception. Both transitions (`ROUTER → MANUAL` and `MANUAL → ROUTER`) discard the existing children and let the new mode's wiring start fresh. Earlier designs considered throwing `IllegalStateException` on `MANUAL → ROUTER` with children, forcing the caller to `removeAll()` first; that was rejected because `setMode` semantically asks "change who owns the trail", which implies the old owner's items are no longer authoritative. Making the caller call `removeAll()` adds no safety — the next line of application code does exactly that — and creates a class of boilerplate-plus-exception traps when a mode switch happens in a handler that doesn't know what state the trail is in. The symmetric auto-clear rule is simpler and matches how `setItems`-shaped APIs behave elsewhere in Flow.

**Q: Is there a way to drive the trail reactively from a `Signal<List<BreadcrumbsItem>>`?**

Not via a dedicated `bindItems` method. Per flow-api.md Discussion "Why no dedicated `bindItems(Signal<...>)` method?", Flow core's `Signal.effect(component, Runnable)` is sufficient — the effect re-runs whenever observed signals change, and the callback does `removeAll()` + `add(...)`. This keeps the API surface small and lets the `bindItems` decision be revisited after real usage.

**Q: Why `Mode` instead of a prefixed enum like `BreadcrumbsMode` or `BreadcrumbsRouterMode`?**

Nested enum `Breadcrumbs.Mode` is the Vaadin convention for short enum types strongly tied to a single component (e.g. `Dialog.Position`, `Notification.Position`). Fully-qualified `Breadcrumbs.Mode.MANUAL` and imported `Mode.MANUAL` both read naturally.

**Q: Why is there no `setTarget(String)` / `setOpenInNewBrowserTab(boolean)` on `BreadcrumbsItem`?**

An earlier iteration mirrored `SideNavItem` and exposed `setTarget(String)` for setting the anchor's `target` attribute (e.g. `_blank` to open in a new tab). It was removed along with the underlying web-component property. Breadcrumb items are part of a hierarchical navigation trail within the current application — opening an ancestor in a new tab is not a supported interaction and introducing API for it encourages patterns that fight the component's purpose (the user would end up with two tabs for the same hierarchy, neither reflecting the other's state). If a concrete use case emerges later, adding `setTarget` is strictly additive.

**Q: Is per-item reactive text available?**

Yes — `BreadcrumbsItem` implements `HasText`, which provides `bindText(Signal<String>) → SignalBinding<String>` as a default method from Flow core. Applications that want per-item reactive text bind a signal to a specific item directly: `item.bindText(textSignal)`. The container-level reactive pattern (`Signal.effect` on the `Breadcrumbs`) remains the right choice when the whole trail's shape changes; `bindText` is for the narrower case where an item's text updates without the trail structure changing.

**Q: Does the router listener need to guard against the detached-component case?**

Yes — the listener is unregistered in `onDetach`, but a navigation may fire between the detach event and the registration cleanup on another thread. `rebuildFromRouter` guards with `if (!isAttached()) return;` so a stray late callback is a no-op.

**Q: Why does `getI18n()` return the last-set value (or `null`) rather than lazily creating a default `BreadcrumbsI18n`?**

For consistency with `SideNav.getI18n()`, which returns `null` until `setI18n(...)` is called. Applications that want to tweak a single field build a new instance: `trail.setI18n(new BreadcrumbsI18n().setMoreItems("Show hidden items"))`. A lazy-init getter would hide the fact that the i18n object is a JSON payload pushed to the client — making it feel like a reactive bean when it isn't. The `null` return value also expresses the unset state — before any `setI18n` call the web component falls back to its built-in defaults — which a lazy-init getter that eagerly creates a non-default object cannot represent.

**Q: Why does `setI18n` reject `null` rather than treating it as a reset?**

guidelines/10-i18n-and-a11y.md prescribes `Objects.requireNonNull` in `setI18n`, and every other Vaadin component with an i18n object follows it — accepting `null` would diverge from that shared contract. A `null`-as-reset path would also be redundant: the web-component defaults are already the unset state (see the previous entry), not something to reach by clearing a set value. If an explicit "reset to defaults" need emerges, a named method reads more clearly than overloading `null`. Rejecting `null` at the call site turns a likely mistake into an immediate, well-located failure.

**Q: Why does `Breadcrumbs` expose theme variants?**

The web component ships theme variants — `theme="slash"` in base styles, `theme="primary"` in Lumo, and `theme="accent"` in Aura (web-component-spec.md "Theme" table) — so the Flow wrapper exposes them the standard way rather than inventing setters. `BreadcrumbsVariant` mirrors the shipped tokens (`SLASH`, `LUMO_PRIMARY`, `AURA_ACCENT`), since guidelines/09-theming.md requires each `getVariantName()` to match a real `theme` token. An earlier revision exposed no variants because the web component had none; the slash variant changed that. Because `HasThemeVariant` lives in `vaadin-flow-components-base` and needs no unreleased Flow core API, this work can land ahead of the router-related tasks (flow-tasks.md Task 3).

