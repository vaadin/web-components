# Breadcrumbs Flow Developer API

<!--
Flow (Java) developer-facing API derived from requirements.md (universal + flow) and web-component-api.md. Shows the most idiomatic, minimal Java API a Flow developer would use.

NOT a specification — no connector files, no @Synchronize wiring, no method bodies, no serialisation analysis.

The Flow API ALWAYS wraps the web component. Every attribute/property/slot/event/CSS custom property in web-component-api.md is reachable from Java — see the Web API coverage check at the end.
-->

## 1. Displaying the ancestor trail as links

Covers requirement(s): 1, 2

```java
Breadcrumbs breadcrumbs = new Breadcrumbs(Mode.MANUAL);
breadcrumbs.add(
        new BreadcrumbsItem("Home", HomeView.class),
        new BreadcrumbsItem("Developer Guide", DeveloperGuideView.class),
        new BreadcrumbsItem("API Reference", ApiReferenceView.class),
        new BreadcrumbsItem("Authentication", AuthenticationView.class),
        new BreadcrumbsItem("OAuth2")); // last item without a path is the current page
add(breadcrumbs);
```

```java
// String-path overload for cases with no Flow route class
breadcrumbs.add(
        new BreadcrumbsItem("Home", "/"),
        new BreadcrumbsItem("External", "https://example.com/docs"));
```

**Why this shape:**

- `Breadcrumbs` has an explicit `Mode` that determines who owns the trail.
- The nested enum `Breadcrumbs.Mode` has two values:
  - `ROUTER` (default — auto-populated from Flow routing metadata, see section 8)
  - `MANUAL` (the application manages the items).
- The mode is chosen at construction — `new Breadcrumbs()` defaults to `ROUTER`, `new Breadcrumbs(Mode.MANUAL)` is explicit.
- Adding or removing children while in `ROUTER` mode throws `IllegalStateException`, so the two models never silently mix.
- In `MANUAL` mode, `Breadcrumbs` is a standard Flow container implementing `HasComponentsOfType<BreadcrumbsItem>`, whose inherited typed container methods accept only `BreadcrumbsItem` instances at compile time (flow-spec.md "Component Classes" lists the full method set).
- The web component itself accepts only `<vaadin-breadcrumbs-item>` light-DOM children, so the Flow component-tree model maps directly to the underlying DOM.
- `BreadcrumbsItem` mirrors `SideNavItem`'s constructor overloads — a no-path form (current page), string-path and route-class forms (the route-class form is the type-safe primary one, per guidelines/02-design.md "Integrate with Flow Router"), and a parameterised form, each with a prefix-component variant (see section 4); flow-spec.md "Component Classes" lists the signatures.
- The "current" distinction needs no extra API — an item without a path is the current item, matching the web component's declarative convention.

---

## 2. Optionally omitting the current page

Covers requirement(s): 3

```java
// All items linkable — no current-page item included
Breadcrumbs breadcrumbs = new Breadcrumbs(Mode.MANUAL);
breadcrumbs.add(
        new BreadcrumbsItem("Home", HomeView.class),
        new BreadcrumbsItem("Developer Guide", DeveloperGuideView.class),
        new BreadcrumbsItem("API Reference", ApiReferenceView.class));
```

**Why this shape:** No dedicated API. When every added item has a path, no current-page indicator appears — the application simply decides whether to include a final no-path item. The Flow API inherits this from the web component's declarative convention, keeping the wrapper thin.

---

## 3. Overflow collapse and expansion

Covers requirement(s): 6, 7

```java
Breadcrumbs breadcrumbs = new Breadcrumbs(Mode.MANUAL);
breadcrumbs.add(
        new BreadcrumbsItem("Home", HomeView.class),
        new BreadcrumbsItem("Documents", DocumentsView.class),
        new BreadcrumbsItem("Projects", ProjectsView.class),
        new BreadcrumbsItem("2026", YearView.class, new RouteParameters("year", "2026")),
        new BreadcrumbsItem("Q1", QuarterView.class, new RouteParameters("quarter", "q1")),
        new BreadcrumbsItem("Reports", ReportsView.class),
        new BreadcrumbsItem("Summary"));

// Localise the overflow button's accessible label
breadcrumbs.setI18n(new BreadcrumbsI18n().setMoreItems("Show hidden items"));
```

**Why this shape:** Overflow collapse and the expansion menu opened by the overflow indicator (req 7) are handled entirely inside the web component — the collapsed items reappear as menu rows sourced from the same `BreadcrumbsItem` components the container already holds, so no Flow-side surface is needed to wire them up. The only Flow-visible concern is the overflow indicator's accessible label, localised via a nested `BreadcrumbsI18n` class following the `SideNavI18n` / `MenuBarI18n` convention, exposed via `setI18n(BreadcrumbsI18n)` / `getI18n()` on `Breadcrumbs` (see flow-spec.md "i18n" for the class shape).

---

## 4. Icons alongside item text

Covers requirement(s): 8

```java
// Inline with construction — one line per item
Breadcrumbs breadcrumbs = new Breadcrumbs(Mode.MANUAL);
breadcrumbs.add(
        new BreadcrumbsItem("Home", HomeView.class, new Icon(VaadinIcon.HOME)),
        new BreadcrumbsItem("Documents", DocumentsView.class, new Icon(VaadinIcon.FOLDER)),
        new BreadcrumbsItem("Report.pdf"));
```

```java
// Or set the prefix after construction
BreadcrumbsItem home = new BreadcrumbsItem("Home", HomeView.class);
home.setPrefixComponent(new Icon(VaadinIcon.HOME));
```

**Why this shape:** `BreadcrumbsItem` implements `HasPrefix` from `vaadin-flow-components-base`, giving every item `setPrefixComponent` / `getPrefixComponent`. In addition, each path-taking constructor has a prefix-component variant — `(label, String path, Component prefix)`, `(label, Class<? extends Component> view, Component prefix)`, `(label, Class<? extends Component> view, RouteParameters params, Component prefix)` — matching `SideNavItem` exactly so the icon-with-path case (by far the common one) reads as a single line. The web component uses `slot="prefix"` on `<vaadin-breadcrumbs-item>` and mirroring that through `HasPrefix` reuses the surface Flow developers already know. Icons work the same way whether the prefix is passed through a constructor or assigned via `setPrefixComponent` after construction.

---

## 5. Dynamic updates

Covers requirement(s): 9

```java
// Imperative form — rebuild when the browsed category changes
Breadcrumbs breadcrumbs = new Breadcrumbs(Mode.MANUAL);
breadcrumbs.add(
        new BreadcrumbsItem("Home", HomeView.class),
        new BreadcrumbsItem("Electronics", CategoryView.class, new RouteParameters("slug", "electronics")),
        new BreadcrumbsItem("Laptops", CategoryView.class, new RouteParameters("slug", "laptops")),
        new BreadcrumbsItem("Gaming"));

categorySelector.addValueChangeListener(event -> {
    Category category = event.getValue();
    breadcrumbs.removeAll();
    breadcrumbs.add(
            new BreadcrumbsItem("Home", HomeView.class),
            new BreadcrumbsItem(category.getName(), CategoryView.class,
                    new RouteParameters("slug", category.getSlug())),
            new BreadcrumbsItem(category.getChild().getName()));
});
```

```java
// Reactive form — run an effect that rebuilds the children when a signal changes
ValueSignal<Category> current = new ValueSignal<>(initialCategory);

Breadcrumbs breadcrumbs = new Breadcrumbs(Mode.MANUAL);
Signal.effect(breadcrumbs, () -> {
    Category category = current.get();
    breadcrumbs.removeAll();
    breadcrumbs.add(
            new BreadcrumbsItem("Home", HomeView.class),
            new BreadcrumbsItem(category.getName(), CategoryView.class,
                    new RouteParameters("slug", category.getSlug())),
            new BreadcrumbsItem(category.getChild().getName()));
});

// Any code that updates the signal flows through to the breadcrumbs
current.set(nextCategory);
```

**Why this shape:** In `Mode.MANUAL`, imperative updates use the standard component-tree primitives `add(...)`, `remove(...)`, `removeAll()` inherited from `HasComponentsOfType<BreadcrumbsItem>` — the same API a Flow developer uses for any container, with the generic parameter ensuring only `BreadcrumbsItem` instances can be passed. Reactive updates use `Signal.effect(component, Runnable)`, Flow core's primitive for running a callback whenever the observed signals change; the effect is the right granularity here because the trail is rebuilt as a tree operation (`removeAll` + `add`), not a single property set. This avoids inventing a component-specific `bindItems` surface when the generic effect primitive already covers the case. The web component itself accepts only `<vaadin-breadcrumbs-item>` light-DOM children (no parallel `items` data-array property — see web-component-api.md §6), so the Flow wrapper has nothing else to map.

---

## 6. Navigation landmark

Covers requirement(s): 10

```java
Breadcrumbs breadcrumbs = new Breadcrumbs(Mode.MANUAL);
breadcrumbs.setAriaLabel("Product navigation");
breadcrumbs.add(
        new BreadcrumbsItem("Home", HomeView.class),
        new BreadcrumbsItem("Products", ProductsView.class),
        new BreadcrumbsItem("Laptops"));
```

**Why this shape:** `Breadcrumbs` implements `HasAriaLabel` from Flow core — the standard Vaadin way to expose an accessible name. The web component already renders itself as a `<nav>` landmark automatically (see web-component-api.md §7), so the only Flow-facing API is the label. No component-specific default label is provided (confirmed in requirements.md Discussion).

---

## 7. Current page announced as current

Covers requirement(s): 11

```java
// No Flow API needed — the last item without a path is automatically
// the current page, and the web component applies aria-current="page" to it.
breadcrumbs.add(
        new BreadcrumbsItem("Home", HomeView.class),
        new BreadcrumbsItem("Docs", DocsView.class),
        new BreadcrumbsItem("OAuth2")); // aria-current="page" applied automatically
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
        add(new Breadcrumbs());
        // Renders as: Home › Customers › Archive
    }
}
```

**Why this shape:** A `Breadcrumbs` constructed with the default (`Mode.ROUTER`) populates itself from static route metadata. `@PageTitle` supplies each item's label and `@RouteParent` (or URL-prefix walking, see section 10) supplies the hierarchy — so auto-population never instantiates ancestor views. For the current (instantiated) view, `HasDynamicTitle` is honoured so a dynamic self-label works without further configuration. Data-dependent ancestor labels (e.g. "Acme Corp" for a specific customer) are out of scope for auto-population — applications that need them switch the trail to `Mode.MANUAL` and build it themselves (section 9). This is a Flow-only behaviour; the web component itself remains router-agnostic.

---

## 9. Opting out of automatic trail population

Covers requirement(s): 14

```java
// Explicitly declare manual ownership in the constructor, then add items.
Breadcrumbs breadcrumbs = new Breadcrumbs(Mode.MANUAL);
breadcrumbs.add(
        new BreadcrumbsItem("Catalog", CatalogView.class),
        new BreadcrumbsItem(category.getName()));
```

```java
// Async loading — MANUAL mode leaves the trail empty until the data arrives,
// so the router-derived default never flashes in.
Breadcrumbs breadcrumbs = new Breadcrumbs(Mode.MANUAL);
loadCategoryAsync(category -> breadcrumbs.add(buildTrail(category)));
```

```java
// Switch mode after construction if the intent changes later.
breadcrumbs.setMode(Mode.MANUAL);
Breadcrumbs.Mode current = breadcrumbs.getMode();
```

```java
// In ROUTER mode, calling add(...) is a programming error.
Breadcrumbs breadcrumbs = new Breadcrumbs(); // defaults to Mode.ROUTER
breadcrumbs.add(new BreadcrumbsItem("Home", HomeView.class));
// → throws IllegalStateException: Breadcrumbs is in Mode.ROUTER;
//   switch to Mode.MANUAL before adding items.
```

**Why this shape:** `Breadcrumbs.Mode` with values `ROUTER` (default) and `MANUAL` makes the two configuration styles explicit. The application picks one at construction (`new Breadcrumbs(Mode.MANUAL)`) or via `setMode(Mode)` at any time; `getMode()` reads the current value. Children can only be added or removed while in `Mode.MANUAL` — calling `add`, `remove`, or `removeAll` while in `Mode.ROUTER` throws `IllegalStateException`, so the two models never silently mix. `MANUAL` mode also keeps the trail empty until the application populates it, which covers the asynchronous-loading scenario without requiring a placeholder child: the router-derived default simply does not run.

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

**Why this shape:** `@RouteParent(Class<? extends Component>)` declares a view's parent in the route hierarchy, overriding URL-prefix walking. Chains of `@RouteParent` compose naturally, and the annotation sits on the view class alongside the other route metadata (`@Route`, `@PageTitle`). The annotation is provided by Flow core, which also supports a dynamic `resolver()` for parents that depend on route parameters.

---

## 11. Theme variants

Covers requirement(s): 5

```java
Breadcrumbs breadcrumbs = new Breadcrumbs(Mode.MANUAL);
breadcrumbs.addThemeVariants(BreadcrumbsVariant.SLASH); // "/" separator instead of the chevron
```

**Why this shape:** The web component ships a `theme="slash"` separator variant, exposed through the standard `HasThemeVariant<BreadcrumbsVariant>` surface (guidelines/09-theming.md) rather than a bespoke setter — the same pattern as every other themable Vaadin component, so `addThemeVariants` / `setThemeVariants` / `bindThemeVariant` come for free. `BreadcrumbsVariant.SLASH.getVariantName()` returns the exact `slash` token; `LUMO_PRIMARY` and `AURA_ACCENT` map to the Lumo `primary` and Aura `accent` link-color variants.

---

## Web API coverage check

| Web API surface (from web-component-api.md) | Flow API | Notes |
|---|---|---|
| `<vaadin-breadcrumbs>` element | `new Breadcrumbs()` | constructor; `HasSize`, `HasStyle`, `HasAriaLabel`, `HasComponentsOfType<BreadcrumbsItem>` |
| `<vaadin-breadcrumbs-item>` child | `HasComponentsOfType<BreadcrumbsItem>` container methods | standard component-tree management, typed to `BreadcrumbsItem` at compile time; no component-specific `setItems`/`addItem` |
| `path` attribute on item | `BreadcrumbsItem#setPath(String)` / `setPath(Class<? extends Component>)` / `setPath(Class, RouteParameters)` / constructor overloads | type-safe primary form per `DESIGN_GUIDELINES.md` "Integrate with Flow Router" |
| last-item-without-path → current item | implicit — construct with `new BreadcrumbsItem(String label)` (no path) | no dedicated current flag |
| `aria-current="page"` on current item | — (set automatically by the web component) | no Flow API needed |
| `slot="prefix"` on item | `BreadcrumbsItem implements HasPrefix` → `setPrefixComponent(Component)` | shared mixin from `vaadin-flow-components-base` |
| Programmatic items data array | — (no such property on the web component, see web-component-api.md §6) | not applicable; Flow manages items as a tree of `BreadcrumbsItem` components via `HasComponentsOfType<BreadcrumbsItem>` |
| `i18n` JS property | `Breadcrumbs#setI18n(BreadcrumbsI18n)` / `getI18n()` | nested i18n class (see flow-spec.md "i18n") |
| `i18n.moreItems` | `BreadcrumbsI18n#setMoreItems(String)` / `getMoreItems()` | overflow button accessible label |
| `<nav>` landmark rendering | — (automatic in web component) | no Flow API needed |
| `aria-label` on the host | `Breadcrumbs implements HasAriaLabel` | `setAriaLabel(String)` / `getAriaLabel()` from Flow core |
| RTL separator flipping | — (handled in CSS when `dir="rtl"`) | inherited from the application / `HasStyle` |
| `theme` variants (`slash`, `primary`, `accent`; web-component-spec.md "Theme") | `Breadcrumbs implements HasThemeVariant<BreadcrumbsVariant>` → `addThemeVariants(BreadcrumbsVariant.…)` | typed theme variants; `getVariantName()` returns the `theme` token |
| Flow: auto-populate from router | `Breadcrumbs.Mode` enum (`ROUTER`, `MANUAL`); `new Breadcrumbs()` / `new Breadcrumbs(Mode)`; `setMode(Mode)` / `getMode()` | default `ROUTER`; `add`/`remove`/`removeAll` throw `IllegalStateException` while in `ROUTER` mode |
| Flow: route-parent override | `@RouteParent(Class<? extends Component>)` | class-level annotation on `@Route` views |

## Discussion

**Q: Why add prefix-component overloads to the `BreadcrumbsItem` constructors?**

Icons are the primary real-world use of the prefix slot (home icon on the root, folder icon on category items), and calling `setPrefixComponent(...)` on a separate line after construction is noticeably more verbose than the idiomatic Flow form for other components. `SideNavItem` — the closest convention anchor — already exposes the same prefix-component overloads, so Breadcrumbs matching them keeps the two components consistent and lets the most common declaration (icon + label + route) fit on one line. `setPrefixComponent` remains available for the case where the prefix is determined after construction (e.g. dynamic icon based on data), so the convenience overloads do not reduce flexibility.

**Q: Why an explicit `Mode` enum instead of inferring ownership from whether children were added?**

Earlier iterations of this design relied on an internal "no children at attach = auto-populate" heuristic. That works for the happy path but becomes ambiguous in edge cases: re-attach after `removeAll`, children added in `BeforeEnter` vs. in the constructor, async loading, tests that move the component. An explicit `Mode` enum removes the ambiguity — the application declares its intent at construction (or via `setMode`), and the component enforces the contract. Calling `add`, `remove`, or `removeAll` while in `Mode.ROUTER` throws `IllegalStateException` rather than silently discarding the call or mixing the two models, so the footgun turns into a clear failure at the point of misuse. A boolean `setAutoPopulate(boolean)` was considered but rejected because "automatic" does not name the *source* of the items; `ROUTER` makes the meaning explicit and leaves room for other modes (e.g. a future `PROVIDER` mode tied to a deferred `BreadcrumbProvider`) without a breaking name change.

**Q: How is requirement 16 (data-driven trails that depend on runtime data) covered without a dedicated API?**

It is covered by manual construction: the application loads the data it needs in the view and calls `add(...)` / `removeAll()` (section 5 and section 9) to build the trail. Every dynamic case — the customer-name example, per-user conditional items, trails derived from domain state — can be expressed this way using the standard component-tree APIs. For reactive updates, `Signal.effect(breadcrumbs, ...)` rebuilds the children whenever observed signals change. A dedicated declarative mechanism (for example a `BreadcrumbsProvider` that receives a `BreadcrumbsContext` describing the current navigation, and returns the full trail so that the breadcrumbs recomputes itself on each route change) was designed out through several iterations and ultimately excluded from this first version. The reasons: the manual-construction path already works end-to-end; a good provider API carries non-trivial surface (a context type, lookup helpers for static metadata, rules for when the provider runs, per-instance vs. application-wide scope) that is hard to get right without real application feedback; and once introduced the provider shape is hard to evolve. A provider API remains a likely future addition once usage patterns are known — this version intentionally keeps the surface small.

**Q: Why is there no section for the separator (reqs 4, 5, 12)?**

Separator presence (req 4), customisation (req 5), and RTL flipping (req 12) are all handled entirely by the web component and the theme — there is no Flow-specific Java API to demonstrate.

**Q: Why no click listener on `BreadcrumbsItem`?**

Items render as plain anchors (`<a href>`) under the hood. With `setPath(Class<? extends Component>)`, Flow's router intercepts the click and navigates without full page reload. With `setPath(String)`, the browser follows the href. Neither path requires a Flow-level listener, and adding one would invite developers to implement navigation twice (once as a listener, once as a route). `SideNavItem` follows the same philosophy — no `addClickListener`.

**Q: Why expose theme variants?**

The web component now ships a `theme="slash"` separator variant (web-component-spec.md "Theme" table), so `Breadcrumbs` exposes it the standard way — see section 11 for the `BreadcrumbsVariant` enum and usage. An earlier revision added no variants because the web component had none; the slash variant changed that.

**Q: Why use `HasComponentsOfType<BreadcrumbsItem>` rather than a bespoke `setItems(BreadcrumbsItem...)` / `addItem(BreadcrumbsItem...)` API?**

Breadcrumbs is a container of items — in Flow terms, a component that holds child components. Expressing that through the standard `HasComponentsOfType<T>` interface from Flow core keeps the API consistent with every other typed Flow container, gives developers the standard typed container methods for free, and avoids inventing yet another bespoke item-collection surface. The generic parameter `BreadcrumbsItem` gives compile-time enforcement that only `BreadcrumbsItem` instances can be added, so developers get type safety without the component needing to reject foreign children at runtime. The web component itself only accepts `<vaadin-breadcrumbs-item>` light-DOM children (no parallel data-array `items` property), so the Flow wrapper's component-tree model is a one-to-one fit.

**Q: Why no dedicated `bindItems(Signal<...>)` method?**

Flow core's `Signal.effect(component, Runnable)` already provides the primitive for reactive child-tree updates: the effect re-runs whenever observed signals change, and inside it the application calls `removeAll()` + `add(...)` to rebuild the trail. A component-specific `bindItems` would wrap that primitive in a convenience, but at the cost of an extra API surface, a `SignalBinding<List<BreadcrumbsItem>>` return type, its own `BindingActiveException` lifecycle, and questions about how it composes with direct `add` calls. Keeping the reactive story on `Signal.effect` reuses an API developers already know and leaves the door open to introduce a sugar method later if real usage shows it is worth the surface.

**Q: What happens if `@RouteParent` forms a cycle or points at a class without `@Route`?**

Flow core handles both: `RouteConfiguration#getRouteHierarchy` is cycle-guarded (it stops when a target repeats), and a parent that cannot be resolved from `@RouteParent` falls back to URL-prefix walking. The breadcrumb relies on that behaviour rather than implementing its own.

**Q: Why `@RouteParent` rather than a breadcrumb-specific name?**

The name is Flow core's: the annotation expresses a generic route relationship, not a breadcrumb hint, so it is not named after this component.

**Q: Why is `BreadcrumbsI18n` a class rather than a single setter for `moreItems`?**

Only one translatable string exists today, but the nested-class shape follows `SideNavI18n` and `MenuBarI18n` so that future accessibility strings (for example an announcement when the trail updates, or per-item aria-label fallback text) can be added without a breaking API change. Keeping the JSON-backed i18n object convention consistent across Vaadin Flow components also lets Vaadin's i18n tooling treat them uniformly.
