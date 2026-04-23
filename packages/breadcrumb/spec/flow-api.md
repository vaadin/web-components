# Breadcrumb Flow Developer API

<!--
Flow (Java) developer-facing API derived from requirements.md (universal + flow) and web-component-api.md. Shows the most idiomatic, minimal Java API a Flow developer would use.

NOT a specification — no connector files, no @Synchronize wiring, no method bodies, no serialisation analysis.

The Flow API ALWAYS wraps the web component. Every attribute/property/slot/event/CSS custom property in web-component-api.md is reachable from Java — see the Web API coverage check at the end.
-->

## 1. Displaying the ancestor trail as links

Covers requirement(s): 1, 2

```java
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.addItem(new BreadcrumbItem("Home", HomeView.class));
breadcrumb.addItem(new BreadcrumbItem("Developer Guide", DeveloperGuideView.class));
breadcrumb.addItem(new BreadcrumbItem("API Reference", ApiReferenceView.class));
breadcrumb.addItem(new BreadcrumbItem("Authentication", AuthenticationView.class));
breadcrumb.addItem(new BreadcrumbItem("OAuth2")); // current page — no path
add(breadcrumb);
```

```java
// String-path overload for cases with no Flow route class
breadcrumb.addItem(new BreadcrumbItem("Home", "/"));
breadcrumb.addItem(new BreadcrumbItem("External", "https://example.com/docs"));
```

**Why this shape:** The container exposes items via `addItem(BreadcrumbItem...)`, `getItems()`, and `removeAll()` following the `SideNav` + `HasSideNavItems` convention — the web component accepts `<vaadin-breadcrumb-item>` children, so the Flow wrapper mirrors that with typed child components. `BreadcrumbItem` offers the same constructor overloads as `SideNavItem`: `(label)` for the current page (no path), `(label, String path)` for hand-managed paths, `(label, Class<? extends Component> view)` as the type-safe primary form required by `DESIGN_GUIDELINES.md` "Integrate with Flow Router", and `(label, Class<? extends Component> view, RouteParameters routeParameters)` for parameterised routes (using Flow's `com.vaadin.flow.router.RouteParameters`). The "current" distinction needs no extra API — an item without a path is the current item, matching the web component's declarative convention.

---

## 2. Optionally omitting the current page

Covers requirement(s): 3

```java
// All items linkable — no current-page item included in the trail
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.addItem(new BreadcrumbItem("Home", HomeView.class));
breadcrumb.addItem(new BreadcrumbItem("Developer Guide", DeveloperGuideView.class));
breadcrumb.addItem(new BreadcrumbItem("API Reference", ApiReferenceView.class));
```

**Why this shape:** No dedicated API. When every added item has a path, no current-page indicator appears — the application simply decides whether to include a final no-path item. The Flow API inherits this from the web component's declarative convention, keeping the wrapper thin.

---

## 3. Customizable separator appearance (incl. RTL)

Covers requirement(s): 4, 5, 12

```java
Breadcrumb breadcrumb = new Breadcrumb();
// Default: theme renders a chevron separator between items.

// Override the separator icon by setting the CSS custom property
breadcrumb.getStyle().set("--vaadin-breadcrumb-separator",
        "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" "
        + "viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" "
        + "stroke-width=\"2\"><line x1=\"7\" y1=\"4\" x2=\"17\" y2=\"20\"/></svg>')");
```

**Why this shape:** The separator is customised exclusively via the `--vaadin-breadcrumb-separator` CSS custom property (see web-component-api.md §3). `Breadcrumb` implements `HasStyle` like every other Vaadin Flow component, so applications write directly to `getStyle()` without a bespoke Java method — introducing a dedicated `setSeparator(...)` API would duplicate what `HasStyle` already exposes and would encode a styling concern in the component's Java surface. RTL flipping is handled entirely by the theme (the base style flips the separator when `dir="rtl"`), so no Flow-side API is needed for requirement 12 either.

---

## 4. Overflow collapse and expansion

Covers requirement(s): 6, 7

```java
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.addItem(new BreadcrumbItem("Home", HomeView.class));
breadcrumb.addItem(new BreadcrumbItem("Documents", DocumentsView.class));
breadcrumb.addItem(new BreadcrumbItem("Projects", ProjectsView.class));
breadcrumb.addItem(new BreadcrumbItem("2026", YearView.class, new RouteParameters("year", "2026")));
breadcrumb.addItem(new BreadcrumbItem("Q1", QuarterView.class, new RouteParameters("quarter", "q1")));
breadcrumb.addItem(new BreadcrumbItem("Reports", ReportsView.class));
breadcrumb.addItem(new BreadcrumbItem("Summary"));

// Localise the overflow button's accessible label
breadcrumb.setI18n(new BreadcrumbI18n().setMoreItems("Show hidden items"));
```

**Why this shape:** Overflow collapse and the expansion menu opened by the overflow indicator (req 7) are handled entirely inside the web component — the collapsed items reappear as menu rows sourced from the same `BreadcrumbItem` components the container already holds, so no Flow-side surface is needed to wire them up. The only Flow-visible concern is the overflow indicator's accessible label, localised via a nested `BreadcrumbI18n` class following the `SideNavI18n` / `MenuBarI18n` convention: `Serializable`, `@JsonInclude(JsonInclude.Include.NON_NULL)`, fluent setters. Exposed via `setI18n(BreadcrumbI18n)` / `getI18n()` on `Breadcrumb`.

---

## 5. Icons alongside item text

Covers requirement(s): 8

```java
BreadcrumbItem home = new BreadcrumbItem("Home", HomeView.class);
home.setPrefixComponent(new Icon(VaadinIcon.HOME));

BreadcrumbItem documents = new BreadcrumbItem("Documents", DocumentsView.class);
documents.setPrefixComponent(new Icon(VaadinIcon.FOLDER));

BreadcrumbItem current = new BreadcrumbItem("Report.pdf");

Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.addItem(home, documents, current);
```

**Why this shape:** `BreadcrumbItem` implements `HasPrefix` from `vaadin-flow-components-base`. The web component uses `slot="prefix"` on `<vaadin-breadcrumb-item>` — mirroring that through `HasPrefix` (same slot name) costs one line and reuses the existing `setPrefixComponent` / `getPrefixComponent` surface that Flow developers already know from `SideNavItem`, text-fields, etc. The web-component-api.md explicitly does not support icons via the programmatic `items` property; Flow avoids that restriction entirely because its programmatic API is component-based (`BreadcrumbItem`), not data-object based, so icons work the same way whether the developer adds items one at a time or in bulk via `setItems(...)`.

---

## 6. Dynamic trail updates

Covers requirement(s): 9

```java
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.setAutoPopulate(false);

breadcrumb.setItems(List.of(
        new BreadcrumbItem("Home", HomeView.class),
        new BreadcrumbItem("Electronics", CategoryView.class, new RouteParameters("slug", "electronics")),
        new BreadcrumbItem("Laptops", CategoryView.class, new RouteParameters("slug", "laptops")),
        new BreadcrumbItem("Gaming")));

// Rebuild the trail when the browsed category changes
categorySelector.addValueChangeListener(event -> {
    Category category = event.getValue();
    breadcrumb.setItems(List.of(
            new BreadcrumbItem("Home", HomeView.class),
            new BreadcrumbItem(category.getName(), CategoryView.class,
                    new RouteParameters("slug", category.getSlug())),
            new BreadcrumbItem(category.getChild().getName())));
});
```

**Why this shape:** `setItems(List<BreadcrumbItem>)` replaces the current trail in one call (`removeAll` + add in sequence) — the idiomatic "replace the whole collection" operation for data-driven trails. Adding `setItems` alongside `addItem(...)` matches `MenuBar`'s dual approach (items JS property + `addItem` for incremental building). The web component's `items` JS property (see web-component-api.md §6) is reachable through this Java method: the Flow wrapper always represents items as `BreadcrumbItem` components, so a single API works for both declarative and data-driven usage. Both `addItem(...)` and `setItems(...)` also implicitly disable `autoPopulate` (see section 10), so no extra call is needed to keep the application-supplied trail from being overwritten by the router-derived default.

---

## 7. Navigation landmark

Covers requirement(s): 10

```java
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.setAriaLabel("Product navigation");
breadcrumb.addItem(new BreadcrumbItem("Home", HomeView.class));
breadcrumb.addItem(new BreadcrumbItem("Products", ProductsView.class));
breadcrumb.addItem(new BreadcrumbItem("Laptops"));
```

**Why this shape:** `Breadcrumb` implements `HasAriaLabel` from Flow core — the standard Vaadin way to expose an accessible name. The web component already renders itself as a `<nav>` landmark automatically (see web-component-api.md §7), so the only Flow-facing API is the label. No component-specific default label is provided (confirmed in requirements.md Discussion).

---

## 8. Current page announced as current

Covers requirement(s): 11

```java
// No Flow API needed — the last added item without a path
// is automatically the current page, and the web component
// applies aria-current="page" to it.
breadcrumb.addItem(new BreadcrumbItem("Home", HomeView.class));
breadcrumb.addItem(new BreadcrumbItem("Docs", DocsView.class));
breadcrumb.addItem(new BreadcrumbItem("OAuth2")); // aria-current="page" applied automatically
```

**Why this shape:** Requirement 11 is satisfied entirely by the web component's built-in behaviour (see web-component-api.md §8): the last no-path item receives `aria-current="page"` without developer action. Introducing a Flow-side `setCurrent(...)` API would duplicate the "no path means current" convention established in requirement 1 and the web component API, violating the no-bloat principle.

---

## 9. Default trail derived from the router hierarchy

Covers requirement(s): 13

```java
@Route("customers/:customerId/orders")
@PageTitle("Orders")
public class OrdersView extends Div {
    public OrdersView() {
        // Zero configuration: empty breadcrumb auto-populates from the router.
        add(new Breadcrumb());
        // Renders as: Home › Customers › Acme Corp › Orders
    }
}
```

```java
@Route("")
@PageTitle("Home")
public class HomeView extends Div { ... }

@Route("customers")
@PageTitle("Customers")
public class CustomersView extends Div { ... }

@Route("customers/:customerId")
public class CustomerDetailView extends Div implements HasDynamicTitle {
    @Override
    public String getPageTitle() {
        return loadCustomer(customerId).getName(); // e.g. "Acme Corp"
    }
}
```

**Why this shape:** `new Breadcrumb()` with no explicit items triggers router-based auto-population at attach time. Each ancestor's label comes from the matched route's view title — reusing Flow's existing `@PageTitle` / `HasDynamicTitle` contract so the breadcrumb label and browser tab title stay in sync without the developer declaring them twice. This is a Flow-only behaviour; the web component itself remains router-agnostic.

---

## 10. Opting out of automatic trail population

Covers requirement(s): 14

```java
// The common case: just add items. autoPopulate disables itself.
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.addItem(new BreadcrumbItem("Catalog", CatalogView.class));
breadcrumb.addItem(new BreadcrumbItem(category.getName()));
```

```java
// Async loading — suppress auto-population up front so the router-derived
// trail does not flash before the application's items arrive.
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.setAutoPopulate(false);
loadCategoryAsync(category -> breadcrumb.setItems(buildTrail(category)));
```

```java
// Check the current setting
boolean autoPopulate = breadcrumb.isAutoPopulate(); // true by default; false after addItem / setItems
```

**Why this shape:** A single boolean property `autoPopulate` — true by default, settable per instance — lets an application disable router-derived population when it wants full control of the trail (requirement 14). `addItem(...)` and `setItems(...)` implicitly set it to `false`, so the typical "I want to supply my own items" case needs no extra ceremony. Explicit `setAutoPopulate(false)` remains useful when the application wants to suppress the router-derived trail before any items are added (for example, to avoid a visible flicker during asynchronous data loading). The getter/setter pair follows the Flow convention for boolean properties (`isCollapsible` / `setCollapsible` on `SideNav`). Per-instance control keeps breadcrumbs independent of one another, and when `autoPopulate` is off the `HasBreadcrumbTrail` contributions (section 12) are not consulted either — the application is in full control and only the items it supplies are shown.

---

## 11. Sitemap parent annotation overrides URL-based parent lookup

Covers requirement(s): 15

```java
@Route("orders/edit/:orderId")
@SitemapParent(OrdersView.class)
@PageTitle("Edit Order")
public class EditOrderView extends Div { ... }
```

```java
// Renders as: Home › Orders › Edit Order
// (instead of Home › Orders › Edit › Edit Order implied by the URL segments)
```

**Why this shape:** A class-level annotation `@SitemapParent(Class<? extends Component>)` declares a view's parent in the application's conceptual sitemap, overriding URL-prefix walking. It is deliberately named in sitemap/route-hierarchy terms rather than breadcrumb-specific terms — the relationship it expresses ("this route's conceptual parent in the sitemap is that route") is independent of breadcrumb rendering and can be consumed by any navigation component that needs to traverse the hierarchy. An annotation (vs a method on a new interface) is the right shape for this because the information is static and known at compile time — mirroring how `@Route`, `@RouteAlias`, and `@PageTitle` are themselves annotations. Walking continues from the declared parent using the same rules, so chains of `@SitemapParent` compose naturally. The annotation lives alongside the other Flow route metadata on the view class.

---

## 12. Routes can dynamically supply their breadcrumb contribution

Covers requirement(s): 16

```java
@Route("customers/:customerId")
public class CustomerView extends Div implements HasBreadcrumbTrail {

    private Customer customer;

    public CustomerView() {
        // ... load customer based on route parameter ...
    }

    @Override
    public List<BreadcrumbItem> getBreadcrumbTrail() {
        // Replace the default self-item with an extra ancestor plus a custom label
        return List.of(
                new BreadcrumbItem(customer.getSegment().getName(),
                        SegmentView.class,
                        new RouteParameters("segmentId", customer.getSegment().getId())),
                new BreadcrumbItem(customer.getName()));
        // Renders as: Home › Customers › Enterprise › Acme Corp
    }
}
```

**Why this shape:** `HasBreadcrumbTrail` is a view-side interface analogous to Flow core's `HasDynamicTitle` — a `@Route` class implements it to contribute dynamic content evaluated at navigation time. The method returns a `List<BreadcrumbItem>` that substitutes for the view's default single (route-derived) item, so a view can replace its own label, insert extra ancestors, or both (the requirement's "replace the view's default item, add additional ancestors, or both"). Auto-population walks the ancestor chain; at each step, if the view implements `HasBreadcrumbTrail`, its returned items are spliced in at that position; otherwise the default `@PageTitle`-derived item is used. The name "Trail" is chosen to avoid collision with `HasSideNavItems` (a container interface) — `HasBreadcrumbTrail` is applied to views and is semantically distinct.

---

## Web API coverage check

| Web API surface (from web-component-api.md) | Flow API | Notes |
|---|---|---|
| `<vaadin-breadcrumb>` element | `new Breadcrumb()` | constructor; `HasSize`, `HasStyle`, `HasAriaLabel` |
| `<vaadin-breadcrumb-item>` child | `Breadcrumb#addItem(BreadcrumbItem...)`, `setItems(List)`, `removeAll()`, `getItems()` | component-tree pattern following `HasSideNavItems` |
| `path` attribute on item | `BreadcrumbItem#setPath(String)` / `setPath(Class<? extends Component>)` / `setPath(Class, RouteParameters)` / constructor overloads | type-safe primary form per `DESIGN_GUIDELINES.md` "Integrate with Flow Router" |
| last-item-without-path → current item | implicit — construct with `new BreadcrumbItem(String label)` (no path) | no dedicated current flag |
| `aria-current="page"` on current item | — (set automatically by the web component) | no Flow API needed |
| `slot="prefix"` on item | `BreadcrumbItem implements HasPrefix` → `setPrefixComponent(Component)` | shared mixin from `vaadin-flow-components-base` |
| `items` JS property | `Breadcrumb#setItems(List<BreadcrumbItem>)` | component-based equivalent; wrapper renders via child elements, not a raw data array |
| `i18n` JS property | `Breadcrumb#setI18n(BreadcrumbI18n)` / `getI18n()` | nested class; `Serializable`, `@JsonInclude(NON_NULL)`, fluent setters |
| `i18n.moreItems` | `BreadcrumbI18n#setMoreItems(String)` / `getMoreItems()` | overflow button accessible label |
| `<nav>` landmark rendering | — (automatic in web component) | no Flow API needed |
| `aria-label` on the host | `Breadcrumb implements HasAriaLabel` | `setAriaLabel(String)` / `getAriaLabel()` from Flow core |
| `--vaadin-breadcrumb-separator` CSS custom property | `Breadcrumb#getStyle().set("--vaadin-breadcrumb-separator", ...)` via `HasStyle` | no dedicated Java setter — styling concern |
| RTL separator flipping | — (handled in CSS when `dir="rtl"`) | inherited from the application / `HasStyle` |
| Flow: auto-populate from router | `Breadcrumb#setAutoPopulate(boolean)` / `isAutoPopulate()` | Flow-only; default `true`; `addItem` and `setItems` implicitly flip it to `false` |
| Flow: sitemap parent override | `@SitemapParent(Class<? extends Component>)` | class-level annotation on `@Route` views |
| Flow: dynamic trail contribution | `HasBreadcrumbTrail` interface on `@Route` views | `getBreadcrumbTrail(): List<BreadcrumbItem>` |

## Discussion

**Q: Why `setAutoPopulate(boolean)` rather than making auto-population implicit based on whether items are present?**

Explicit opt-out is predictable. "Empty means auto" creates race conditions: if the application populates items asynchronously (e.g. after a data load), an initial auto-populate fires and is later overwritten, causing a visible flicker. A boolean flag set once at construction lets the breadcrumb know the application's intent deterministically, regardless of when items arrive.

**Q: Why `HasBreadcrumbTrail` and not `HasBreadcrumbItems`?**

`HasSideNavItems` is already a container-side interface (a component that holds items). Using `HasBreadcrumbItems` on view classes would overload the same naming pattern with opposite semantics (view provides vs. container contains), which is confusing at a glance. "Trail" is the term the requirements consistently use for the sequence of breadcrumb items from root to current, and matches the view-side contribution semantics cleanly.

**Q: Why a `@SitemapParent` annotation AND a `HasBreadcrumbTrail` interface — why not one mechanism for both?**

The two requirements (15 and 16) express different needs. Annotation fits req 15: the parent is static, known at compile time, and can be validated by tooling. Interface fits req 16: the contribution depends on runtime data (e.g. the loaded customer). Collapsing into one mechanism would force the static case to go through a method call that always returns the same thing, or force the dynamic case to squeeze its logic into annotation values — each awkward. The two coexist: if both are present on a view, `HasBreadcrumbTrail#getBreadcrumbTrail()` wins because it expresses the more complete intent.

**Q: Why no `setSeparator(Component)` or `setSeparator(String)` Java method?**

The separator is a pure CSS concern in the web component — a `::after` pseudo-element shaped by `mask-image`. Adding a Java setter would have to resolve a `Component` or `String` into a `url(...)` CSS value, duplicate `HasStyle`'s existing capability, and create a second way to do the same thing. `getStyle().set("--vaadin-breadcrumb-separator", ...)` is the idiomatic Flow path to a CSS custom property and avoids bloat.

**Q: Why no click listener on `BreadcrumbItem`?**

Items render as plain anchors (`<a href>`) under the hood. With `setPath(Class<? extends Component>)`, Flow's router intercepts the click and navigates without full page reload. With `setPath(String)`, the browser follows the href. Neither path requires a Flow-level listener, and adding one would invite developers to implement navigation twice (once as a listener, once as a route). `SideNavItem` follows the same philosophy — no `addClickListener`.

**Q: Why no theme variants?**

web-component-api.md does not expose any theme variants for Breadcrumb — the component has a single canonical appearance with theme-layer differences only (Lumo vs Aura). No `BreadcrumbVariant` enum is added because there is nothing for it to contain. One can be introduced later if variants emerge.

**Q: Why does `autoPopulate` default to `true`?**

Because the zero-configuration case is the common one — a Flow application already declares its sitemap as `@Route` classes with `@PageTitle` values, so a view that simply writes `add(new Breadcrumb())` should get a working trail without any further setup. requirements.md frames this explicitly: "Defaulting to router-derived items (req 13) lets the trivial case work with zero configuration." Applications that want full control opt out per instance with `setAutoPopulate(false)`, or — more commonly — just add items, which disables auto-population implicitly.

**Q: Why do `addItem(...)` and `setItems(...)` implicitly disable `autoPopulate`?**

The two states "I want the router-derived trail" and "I want to supply my own items" are effectively mutually exclusive in real usage — nobody wants the router trail mixed with hand-supplied items. Requiring an explicit `setAutoPopulate(false)` before any `addItem(...)` call is a footgun: forget it and you get a duplicated or surprising trail. Inferring intent from the first mutating call removes the footgun without taking control away from developers who genuinely want to manage the flag (async loading before items arrive, re-enabling via `setAutoPopulate(true)` after a `removeAll()`). This matches how similar "auto" features in Flow back off the moment the developer signals manual control.

**Q: Why does `setItems(List<BreadcrumbItem>)` manipulate child components rather than set a raw data-object array like the web component's `items` JS property?**

The Flow wrapper always represents items as typed `BreadcrumbItem` components so that the same API shape works for prefix-icon support, type-safe route bindings, and tooltip extension points. This diverges from the web component's data-object `items` property but matches the idiomatic Flow component-tree model used by `SideNav`. `setItems(List)` is therefore a convenience for bulk replacement (`removeAll` + `addItem`), not a thin pass-through of the web component's property. web-component-api.md already notes that the programmatic `items` property does not support prefix icons; the Flow wrapper sidesteps that limitation because its programmatic form is component-based.

**Q: What happens if `@SitemapParent` forms a cycle or points at a class without `@Route`?**

These are implementation concerns the spec (`create-component-flow-spec`) will resolve — the expected behaviour is that cycles are detected and truncated, and a parent class without `@Route` is treated as if the annotation were absent (fall back to URL-prefix walking). The API surface here is only the annotation itself; the resolution algorithm belongs to the specification.

**Q: Why `@SitemapParent` rather than a breadcrumb-specific name?**

The annotation expresses a sitemap / route-hierarchy relationship — "the conceptual parent of this route is that route" — which is not inherently tied to breadcrumb rendering. Naming it `@SitemapParent` (vs. `@BreadcrumbParent` or `@BreadcrumbRouteParent`) keeps the declaration reusable: any future navigation component that needs to walk the sitemap (e.g. a back-navigation helper, a sitemap-aware SEO generator, a parent-link utility) can consume the same annotation without the name implying it belongs to Breadcrumb alone. This also avoids coupling application-level sitemap metadata to a specific presentation component — the view author declares a sitemap fact, not a breadcrumb hint.

**Q: Why is `BreadcrumbI18n` a class rather than a single setter for `moreItems`?**

Only one translatable string exists today, but the nested-class shape follows `SideNavI18n` and `MenuBarI18n` so that future accessibility strings (for example an announcement when the trail updates, or per-item aria-label fallback text) can be added without a breaking API change. Keeping the JSON-backed i18n object convention consistent across Vaadin Flow components also lets Vaadin's i18n tooling treat them uniformly.
