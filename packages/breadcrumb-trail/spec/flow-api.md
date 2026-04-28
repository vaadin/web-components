# BreadcrumbTrail Flow Developer API

<!--
Flow (Java) developer-facing API derived from requirements.md (universal + flow) and web-component-api.md. Shows the most idiomatic, minimal Java API a Flow developer would use.

NOT a specification — no connector files, no @Synchronize wiring, no method bodies, no serialisation analysis.

The Flow API ALWAYS wraps the web component. Every attribute/property/slot/event/CSS custom property in web-component-api.md is reachable from Java — see the Web API coverage check at the end.
-->

## 1. Displaying the ancestor trail as links

Covers requirement(s): 1, 2

```java
BreadcrumbTrail breadcrumbTrail = new BreadcrumbTrail(Mode.MANUAL);
breadcrumbTrail.add(
        new BreadcrumbItem("Home", HomeView.class),
        new BreadcrumbItem("Developer Guide", DeveloperGuideView.class),
        new BreadcrumbItem("API Reference", ApiReferenceView.class),
        new BreadcrumbItem("Authentication", AuthenticationView.class),
        new BreadcrumbItem("OAuth2")); // last item without a path is the current page
add(breadcrumbTrail);
```

```java
// String-path overload for cases with no Flow route class
breadcrumbTrail.add(
        new BreadcrumbItem("Home", "/"),
        new BreadcrumbItem("External", "https://example.com/docs"));
```

**Why this shape:** `BreadcrumbTrail` has an explicit `Mode` that determines who owns the trail. The nested enum `BreadcrumbTrail.Mode` has two values: `ROUTER` (default — auto-populated from Flow routing metadata, see section 8) and `MANUAL` (the application manages the items). The mode is chosen at construction — `new BreadcrumbTrail()` defaults to `ROUTER`, `new BreadcrumbTrail(Mode.MANUAL)` is explicit. Adding or removing children while in `ROUTER` mode throws `IllegalStateException`, so the two models never silently mix. In `MANUAL` mode, `BreadcrumbTrail` is a standard Flow container — it implements `HasComponentsOfType<BreadcrumbItem>` and accepts items through the inherited `add(BreadcrumbItem...)` / `addComponentAsFirst(BreadcrumbItem)` / `addComponentAtIndex(int, BreadcrumbItem)` / `remove(BreadcrumbItem...)` / `removeAll()` methods, with compile-time enforcement that only `BreadcrumbItem` instances can be added. On the web-component side the `items` JS property takes data objects, but that is a client-side concern; in Flow, items are `BreadcrumbItem` components. `BreadcrumbItem` offers the same constructor overloads as `SideNavItem`: `(label)` for the current page (no path), `(label, String path)` for hand-managed paths, `(label, Class<? extends Component> view)` as the type-safe primary form required by `DESIGN_GUIDELINES.md` "Integrate with Flow Router", and `(label, Class<? extends Component> view, RouteParameters routeParameters)` for parameterised routes. Each path-taking overload also has a prefix-component variant ending in `Component prefixComponent` (see section 4). The "current" distinction needs no extra API — an item without a path is the current item, matching the web component's declarative convention.

---

## 2. Optionally omitting the current page

Covers requirement(s): 3

```java
// All items linkable — no current-page item included in the trail
BreadcrumbTrail breadcrumbTrail = new BreadcrumbTrail(Mode.MANUAL);
breadcrumbTrail.add(
        new BreadcrumbItem("Home", HomeView.class),
        new BreadcrumbItem("Developer Guide", DeveloperGuideView.class),
        new BreadcrumbItem("API Reference", ApiReferenceView.class));
```

**Why this shape:** No dedicated API. When every added item has a path, no current-page indicator appears — the application simply decides whether to include a final no-path item. The Flow API inherits this from the web component's declarative convention, keeping the wrapper thin.

---

## 3. Overflow collapse and expansion

Covers requirement(s): 6, 7

```java
BreadcrumbTrail breadcrumbTrail = new BreadcrumbTrail(Mode.MANUAL);
breadcrumbTrail.add(
        new BreadcrumbItem("Home", HomeView.class),
        new BreadcrumbItem("Documents", DocumentsView.class),
        new BreadcrumbItem("Projects", ProjectsView.class),
        new BreadcrumbItem("2026", YearView.class, new RouteParameters("year", "2026")),
        new BreadcrumbItem("Q1", QuarterView.class, new RouteParameters("quarter", "q1")),
        new BreadcrumbItem("Reports", ReportsView.class),
        new BreadcrumbItem("Summary"));

// Localise the overflow button's accessible label
breadcrumbTrail.setI18n(new BreadcrumbTrailI18n().setMoreItems("Show hidden items"));
```

**Why this shape:** Overflow collapse and the expansion menu opened by the overflow indicator (req 7) are handled entirely inside the web component — the collapsed items reappear as menu rows sourced from the same `BreadcrumbItem` components the container already holds, so no Flow-side surface is needed to wire them up. The only Flow-visible concern is the overflow indicator's accessible label, localised via a nested `BreadcrumbTrailI18n` class following the `SideNavI18n` / `MenuBarI18n` convention: `Serializable`, `@JsonInclude(JsonInclude.Include.NON_NULL)`, fluent setters. Exposed via `setI18n(BreadcrumbTrailI18n)` / `getI18n()` on `BreadcrumbTrail`.

---

## 4. Icons alongside item text

Covers requirement(s): 8

```java
// Inline with construction — one line per item
BreadcrumbTrail breadcrumbTrail = new BreadcrumbTrail(Mode.MANUAL);
breadcrumbTrail.add(
        new BreadcrumbItem("Home", HomeView.class, new Icon(VaadinIcon.HOME)),
        new BreadcrumbItem("Documents", DocumentsView.class, new Icon(VaadinIcon.FOLDER)),
        new BreadcrumbItem("Report.pdf"));
```

```java
// Or set the prefix after construction
BreadcrumbItem home = new BreadcrumbItem("Home", HomeView.class);
home.setPrefixComponent(new Icon(VaadinIcon.HOME));
```

**Why this shape:** `BreadcrumbItem` implements `HasPrefix` from `vaadin-flow-components-base`, giving every item `setPrefixComponent` / `getPrefixComponent`. In addition, each path-taking constructor has a prefix-component variant — `(label, String path, Component prefix)`, `(label, Class<? extends Component> view, Component prefix)`, `(label, Class<? extends Component> view, RouteParameters params, Component prefix)` — matching `SideNavItem` exactly so the icon-with-path case (by far the common one) reads as a single line. The web component uses `slot="prefix"` on `<vaadin-breadcrumb-item>` and mirroring that through `HasPrefix` reuses the surface Flow developers already know. web-component-api.md explicitly does not support icons via the programmatic `items` property; Flow sidesteps that limitation because its programmatic API is component-based (`add(BreadcrumbItem...)`), not a data-object array, so icons work the same way whether the prefix is passed through a constructor or assigned via `setPrefixComponent` after construction.

---

## 5. Dynamic trail updates

Covers requirement(s): 9

```java
// Imperative form — rebuild the trail when the browsed category changes
BreadcrumbTrail breadcrumbTrail = new BreadcrumbTrail(Mode.MANUAL);
breadcrumbTrail.add(
        new BreadcrumbItem("Home", HomeView.class),
        new BreadcrumbItem("Electronics", CategoryView.class, new RouteParameters("slug", "electronics")),
        new BreadcrumbItem("Laptops", CategoryView.class, new RouteParameters("slug", "laptops")),
        new BreadcrumbItem("Gaming"));

categorySelector.addValueChangeListener(event -> {
    Category category = event.getValue();
    breadcrumbTrail.removeAll();
    breadcrumbTrail.add(
            new BreadcrumbItem("Home", HomeView.class),
            new BreadcrumbItem(category.getName(), CategoryView.class,
                    new RouteParameters("slug", category.getSlug())),
            new BreadcrumbItem(category.getChild().getName()));
});
```

```java
// Reactive form — run an effect that rebuilds the children when a signal changes
ValueSignal<Category> current = new ValueSignal<>(initialCategory);

BreadcrumbTrail breadcrumbTrail = new BreadcrumbTrail(Mode.MANUAL);
Signal.effect(breadcrumbTrail, () -> {
    Category category = current.get();
    breadcrumbTrail.removeAll();
    breadcrumbTrail.add(
            new BreadcrumbItem("Home", HomeView.class),
            new BreadcrumbItem(category.getName(), CategoryView.class,
                    new RouteParameters("slug", category.getSlug())),
            new BreadcrumbItem(category.getChild().getName()));
});

// Any code that updates the signal flows through to the breadcrumb
current.set(nextCategory);
```

**Why this shape:** In `Mode.MANUAL`, imperative updates use the standard component-tree primitives `add(...)`, `remove(...)`, `removeAll()` inherited from `HasComponentsOfType<BreadcrumbItem>` — the same API a Flow developer uses for any container, with the generic parameter ensuring only `BreadcrumbItem` instances can be passed. Reactive updates use `Signal.effect(component, Runnable)`, Flow core's primitive for running a callback whenever the observed signals change; the effect is the right granularity here because the trail is rebuilt as a tree operation (`removeAll` + `add`), not a single property set. This avoids inventing a component-specific `bindItems` surface when the generic effect primitive already covers the case. The web component itself accepts only `<vaadin-breadcrumb-item>` light-DOM children (no parallel `items` data-array property — see web-component-api.md §6), so the Flow wrapper has nothing else to map.

---

## 6. Navigation landmark

Covers requirement(s): 10

```java
BreadcrumbTrail breadcrumbTrail = new BreadcrumbTrail(Mode.MANUAL);
breadcrumbTrail.setAriaLabel("Product navigation");
breadcrumbTrail.add(
        new BreadcrumbItem("Home", HomeView.class),
        new BreadcrumbItem("Products", ProductsView.class),
        new BreadcrumbItem("Laptops"));
```

**Why this shape:** `BreadcrumbTrail` implements `HasAriaLabel` from Flow core — the standard Vaadin way to expose an accessible name. The web component already renders itself as a `<nav>` landmark automatically (see web-component-api.md §7), so the only Flow-facing API is the label. No component-specific default label is provided (confirmed in requirements.md Discussion).

---

## 7. Current page announced as current

Covers requirement(s): 11

```java
// No Flow API needed — the last item without a path is automatically
// the current page, and the web component applies aria-current="page" to it.
breadcrumbTrail.add(
        new BreadcrumbItem("Home", HomeView.class),
        new BreadcrumbItem("Docs", DocsView.class),
        new BreadcrumbItem("OAuth2")); // aria-current="page" applied automatically
```

**Why this shape:** Requirement 11 is satisfied entirely by the web component's built-in behaviour (see web-component-api.md §8): the last no-path item receives `aria-current="page"` without developer action. Introducing a Flow-side `setCurrent(...)` API would duplicate the "no path means current" convention established in requirement 1 and the web component API, violating the no-bloat principle.

---

## 8. Default trail derived from the router hierarchy

Covers requirement(s): 13

```java
@Route("")
@PageTitle("Home")
public class HomeView extends Div { ... }

@Route("customers")
@PageTitle("Customers")
public class CustomersView extends Div { ... }

@Route("customers/archive")
@PageTitle("Archive")
public class ArchiveView extends Div {
    public ArchiveView() {
        // Zero configuration: router mode is the default, populates from routing metadata.
        add(new BreadcrumbTrail());
        // Renders as: Home › Customers › Archive
    }
}
```

**Why this shape:** A `BreadcrumbTrail` constructed with the default (`Mode.ROUTER`) populates itself from static route metadata. `@PageTitle` supplies each item's label and `@RouteParent` (or URL-prefix walking, see section 10) supplies the hierarchy — so auto-population never instantiates ancestor views. For the current (instantiated) view, `HasDynamicTitle` is honoured so a dynamic self-label works without further configuration. Data-dependent ancestor labels (e.g. "Acme Corp" for a specific customer) are out of scope for auto-population — applications that need them switch the trail to `Mode.MANUAL` and build it themselves (section 9). This is a Flow-only behaviour; the web component itself remains router-agnostic.

---

## 9. Opting out of automatic trail population

Covers requirement(s): 14

```java
// Explicitly declare manual ownership in the constructor, then add items.
BreadcrumbTrail breadcrumbTrail = new BreadcrumbTrail(Mode.MANUAL);
breadcrumbTrail.add(
        new BreadcrumbItem("Catalog", CatalogView.class),
        new BreadcrumbItem(category.getName()));
```

```java
// Async loading — MANUAL mode leaves the trail empty until the data arrives,
// so the router-derived default never flashes in.
BreadcrumbTrail breadcrumbTrail = new BreadcrumbTrail(Mode.MANUAL);
loadCategoryAsync(category -> breadcrumbTrail.add(buildTrail(category)));
```

```java
// Switch mode after construction if the intent changes later.
breadcrumbTrail.setMode(Mode.MANUAL);
BreadcrumbTrail.Mode current = breadcrumbTrail.getMode();
```

```java
// In ROUTER mode, calling add(...) is a programming error.
BreadcrumbTrail routerTrail = new BreadcrumbTrail(); // defaults to Mode.ROUTER
routerTrail.add(new BreadcrumbItem("Home", HomeView.class));
// → throws IllegalStateException: BreadcrumbTrail is in Mode.ROUTER;
//   switch to Mode.MANUAL before adding items.
```

**Why this shape:** `BreadcrumbTrail.Mode` with values `ROUTER` (default) and `MANUAL` makes the two configuration styles explicit. The application picks one at construction (`new BreadcrumbTrail(Mode.MANUAL)`) or via `setMode(Mode)` at any time; `getMode()` reads the current value. Children can only be added or removed while in `Mode.MANUAL` — calling `add`, `remove`, or `removeAll` while in `Mode.ROUTER` throws `IllegalStateException`, so the two models never silently mix. `MANUAL` mode also keeps the trail empty until the application populates it, which covers the asynchronous-loading scenario without requiring a placeholder child: the router-derived default simply does not run.

---

## 10. Route-parent annotation overrides URL-based parent lookup

Covers requirement(s): 15

```java
@Route("orders/edit/:orderId")
@RouteParent(OrdersView.class)
@PageTitle("Edit Order")
public class EditOrderView extends Div { ... }
```

```java
// Renders as: Home › Orders › Edit Order
// (instead of Home › Orders › Edit › Edit Order implied by the URL segments)
```

**Why this shape:** A class-level annotation `@RouteParent(Class<? extends Component>)` declares a view's parent in the application's route hierarchy, overriding URL-prefix walking. It is deliberately named in route-hierarchy terms rather than breadcrumb-specific terms — the relationship it expresses ("this route's conceptual parent is that route") is independent of breadcrumb rendering and can be consumed by any navigation component that needs to traverse the hierarchy. An annotation (vs a method on a new interface) is the right shape for this because the information is static and known at compile time — mirroring how `@Route`, `@RouteAlias`, and `@PageTitle` are themselves annotations. Walking continues from the declared parent using the same rules, so chains of `@RouteParent` compose naturally. The annotation lives alongside the other Flow route metadata on the view class.

---

## Web API coverage check

| Web API surface (from web-component-api.md) | Flow API | Notes |
|---|---|---|
| `<vaadin-breadcrumb-trail>` element | `new BreadcrumbTrail()` | constructor; `HasSize`, `HasStyle`, `HasAriaLabel`, `HasComponentsOfType<BreadcrumbItem>` |
| `<vaadin-breadcrumb-item>` child | `HasComponentsOfType<BreadcrumbItem>#add(BreadcrumbItem...)`, `addComponentAsFirst(BreadcrumbItem)`, `addComponentAtIndex(int, BreadcrumbItem)`, `remove(BreadcrumbItem...)`, `removeAll()` | standard component-tree management, typed to `BreadcrumbItem` at compile time; no component-specific `setItems`/`addItem` |
| `path` attribute on item | `BreadcrumbItem#setPath(String)` / `setPath(Class<? extends Component>)` / `setPath(Class, RouteParameters)` / constructor overloads | type-safe primary form per `DESIGN_GUIDELINES.md` "Integrate with Flow Router" |
| last-item-without-path → current item | implicit — construct with `new BreadcrumbItem(String label)` (no path) | no dedicated current flag |
| `aria-current="page"` on current item | — (set automatically by the web component) | no Flow API needed |
| `slot="prefix"` on item | `BreadcrumbItem implements HasPrefix` → `setPrefixComponent(Component)` | shared mixin from `vaadin-flow-components-base` |
| Programmatic items data array | — (no such property on the web component, see web-component-api.md §6) | not applicable; Flow manages items as a tree of `BreadcrumbItem` components via `HasComponentsOfType<BreadcrumbItem>` |
| `i18n` JS property | `BreadcrumbTrail#setI18n(BreadcrumbTrailI18n)` / `getI18n()` | nested class; `Serializable`, `@JsonInclude(NON_NULL)`, fluent setters |
| `i18n.moreItems` | `BreadcrumbTrailI18n#setMoreItems(String)` / `getMoreItems()` | overflow button accessible label |
| `<nav>` landmark rendering | — (automatic in web component) | no Flow API needed |
| `aria-label` on the host | `BreadcrumbTrail implements HasAriaLabel` | `setAriaLabel(String)` / `getAriaLabel()` from Flow core |
| `--vaadin-breadcrumb-trail-separator` CSS custom property | `BreadcrumbTrail#getStyle().set("--vaadin-breadcrumb-trail-separator", ...)` via `HasStyle` | per `DESIGN_GUIDELINES.md` "Styling lives in CSS, not Java" — no dedicated Java setter |
| RTL separator flipping | — (handled in CSS when `dir="rtl"`) | inherited from the application / `HasStyle` |
| Flow: auto-populate from router | `BreadcrumbTrail.Mode` enum (`ROUTER`, `MANUAL`); `new BreadcrumbTrail()` / `new BreadcrumbTrail(Mode)`; `setMode(Mode)` / `getMode()` | default `ROUTER`; `add`/`remove`/`removeAll` throw `IllegalStateException` while in `ROUTER` mode |
| Flow: route-parent override | `@RouteParent(Class<? extends Component>)` | class-level annotation on `@Route` views |

## Discussion

**Q: Why add prefix-component overloads to the `BreadcrumbItem` constructors?**

Icons are the primary real-world use of the prefix slot (home icon on the root, folder icon on category items), and calling `setPrefixComponent(...)` on a separate line after construction is noticeably more verbose than the idiomatic Flow form for other components. `SideNavItem` — the closest convention anchor — already exposes the same prefix-component overloads, so BreadcrumbTrail matching them keeps the two components consistent and lets the most common declaration (icon + label + route) fit on one line. `setPrefixComponent` remains available for the case where the prefix is determined after construction (e.g. dynamic icon based on data), so the convenience overloads do not reduce flexibility.

**Q: Why an explicit `Mode` enum instead of inferring ownership from whether children were added?**

Earlier iterations of this design relied on an internal "no children at attach = auto-populate" heuristic. That works for the happy path but becomes ambiguous in edge cases: re-attach after `removeAll`, children added in `BeforeEnter` vs. in the constructor, async loading, tests that move the component. An explicit `Mode` enum removes the ambiguity — the application declares its intent at construction (or via `setMode`), and the component enforces the contract. Calling `add`, `remove`, or `removeAll` while in `Mode.ROUTER` throws `IllegalStateException` rather than silently discarding the call or mixing the two models, so the footgun turns into a clear failure at the point of misuse. A boolean `setAutoPopulate(boolean)` was considered but rejected because "automatic" does not name the *source* of the items; `ROUTER` makes the meaning explicit and leaves room for other modes (e.g. a future `PROVIDER` mode tied to a deferred `BreadcrumbProvider`) without a breaking name change.

**Q: How is requirement 16 (data-driven trails that depend on runtime data) covered without a dedicated API?**

It is covered by manual construction: the application loads the data it needs in the view and calls `add(...)` / `removeAll()` (section 5 and section 9) to build the trail. Every dynamic case — the customer-name example, per-user conditional items, trails derived from domain state — can be expressed this way using the standard component-tree APIs. For reactive updates, `Signal.effect(breadcrumbTrail, ...)` rebuilds the children whenever observed signals change. A dedicated declarative mechanism (for example a `BreadcrumbTrailProvider` that receives a `BreadcrumbTrailContext` describing the current navigation, and returns the full trail so that the breadcrumb recomputes itself on each route change) was designed out through several iterations and ultimately excluded from this first version. The reasons: the manual-construction path already works end-to-end; a good provider API carries non-trivial surface (a context type, lookup helpers for static metadata, rules for when the provider runs, per-instance vs. application-wide scope) that is hard to get right without real application feedback; and once introduced the provider shape is hard to evolve. A provider API remains a likely future addition once usage patterns are known — this version intentionally keeps the surface small.

**Q: Why is there no section for the separator (reqs 4, 5, 12)?**

Separator presence (req 4), customisation (req 5), and RTL flipping (req 12) are all handled entirely by the web component and the theme — there is no Flow-specific Java API to demonstrate. Per `DESIGN_GUIDELINES.md` "Styling lives in CSS, not Java", visual customisations like the separator icon are exposed as CSS custom properties on the host, not as Java setters: applications use `HasStyle#getStyle().set("--vaadin-breadcrumb-trail-separator", ...)` or a theme stylesheet. A dedicated "here's how to call `getStyle()`" section would duplicate generic Flow knowledge without adding BreadcrumbTrail-specific value, so these requirements are documented solely in the Web API coverage table (the `--vaadin-breadcrumb-trail-separator` row and the RTL row).

**Q: Why no click listener on `BreadcrumbItem`?**

Items render as plain anchors (`<a href>`) under the hood. With `setPath(Class<? extends Component>)`, Flow's router intercepts the click and navigates without full page reload. With `setPath(String)`, the browser follows the href. Neither path requires a Flow-level listener, and adding one would invite developers to implement navigation twice (once as a listener, once as a route). `SideNavItem` follows the same philosophy — no `addClickListener`.

**Q: Why no theme variants?**

web-component-api.md does not expose any theme variants for BreadcrumbTrail — the component has a single canonical appearance with theme-layer differences only (Lumo vs Aura). No `BreadcrumbTrailVariant` enum is added because there is nothing for it to contain. One can be introduced later if variants emerge.

**Q: Why use `HasComponentsOfType<BreadcrumbItem>` rather than a bespoke `setItems(BreadcrumbItem...)` / `addItem(BreadcrumbItem...)` API?**

A breadcrumb is a container of items — in Flow terms, a component that holds child components. Expressing that through the standard `HasComponentsOfType<T>` interface from Flow core keeps the API consistent with every other typed Flow container, gives developers `add`, `addComponentAsFirst`, `addComponentAtIndex`, `remove`, and `removeAll` for free, and avoids inventing yet another bespoke item-collection surface. The generic parameter `BreadcrumbItem` gives compile-time enforcement that only `BreadcrumbItem` instances can be added, so developers get type safety without the component needing to reject foreign children at runtime. The web component itself only accepts `<vaadin-breadcrumb-item>` light-DOM children (no parallel data-array `items` property), so the Flow wrapper's component-tree model is a one-to-one fit.

**Q: Why no dedicated `bindItems(Signal<...>)` method?**

Flow core's `Signal.effect(component, Runnable)` already provides the primitive for reactive child-tree updates: the effect re-runs whenever observed signals change, and inside it the application calls `removeAll()` + `add(...)` to rebuild the trail. A component-specific `bindItems` would wrap that primitive in a convenience, but at the cost of an extra API surface, a `SignalBinding<List<BreadcrumbItem>>` return type, its own `BindingActiveException` lifecycle, and questions about how it composes with direct `add` calls. Keeping the reactive story on `Signal.effect` reuses an API developers already know and leaves the door open to introduce a sugar method later if real usage shows it is worth the surface.

**Q: What happens if `@RouteParent` forms a cycle or points at a class without `@Route`?**

These are implementation concerns the spec (`create-component-flow-spec`) will resolve — the expected behaviour is that cycles are detected and truncated, and a parent class without `@Route` is treated as if the annotation were absent (fall back to URL-prefix walking). The API surface here is only the annotation itself; the resolution algorithm belongs to the specification.

**Q: Why `@RouteParent` rather than a breadcrumb-specific name?**

The annotation expresses a route-hierarchy relationship — "the conceptual parent of this route is that route" — which is not inherently tied to breadcrumb rendering. Naming it `@RouteParent` (vs. `@BreadcrumbTrailParent` or `@BreadcrumbTrailRouteParent`) keeps the declaration reusable: any future navigation component that needs to walk the route hierarchy (e.g. a back-navigation helper, an SEO link-graph generator, a parent-link utility) can consume the same annotation without the name implying it belongs to BreadcrumbTrail alone. The `@Route*` prefix also groups it naturally with the existing routing annotations (`@Route`, `@RouteAlias`) in Flow core, so developers find it where they look for route metadata. This avoids coupling application-level hierarchy metadata to a specific presentation component — the view author declares a routing fact, not a breadcrumb hint.

**Q: Why is `BreadcrumbTrailI18n` a class rather than a single setter for `moreItems`?**

Only one translatable string exists today, but the nested-class shape follows `SideNavI18n` and `MenuBarI18n` so that future accessibility strings (for example an announcement when the trail updates, or per-item aria-label fallback text) can be added without a breaking API change. Keeping the JSON-backed i18n object convention consistent across Vaadin Flow components also lets Vaadin's i18n tooling treat them uniformly.
