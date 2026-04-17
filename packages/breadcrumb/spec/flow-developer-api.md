# Breadcrumb Flow Developer API

<!--
Flow (Java) developer-facing API derived from requirements.md (universal + flow) and the web-component developer-api.md. Shows the most idiomatic, minimal Java API a Flow developer would use.

NOT a specification — no connector files, no @Synchronize wiring, no method bodies, no serialisation analysis. Those come in `create-component-flow-spec`.

Conventions follow SideNav/SideNavItem (hierarchical children, path + view-class, HasPrefix, I18n) and the DESIGN_GUIDELINES.md principles (progressive disclosure through constructors, imperative-first with signal bindings, mixin composition, router integration).
-->

## 1. Declarative trail with typed items

Covers requirement(s): 1, 3, 4

```java
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.addItem(
    new BreadcrumbItem("Home", "/"),
    new BreadcrumbItem("Electronics", "/electronics"),
    new BreadcrumbItem("Laptops", "/electronics/laptops"),
    new BreadcrumbItem("ThinkPad X1 Carbon").asCurrent()
);
layout.add(breadcrumb);
```

**Why this shape:** Follows the `SideNav` / `SideNavItem` pattern — typed children added via `addItem(BreadcrumbItem...)` provided by a `HasBreadcrumbItems` mixin interface. Each item has a label and an optional path; the last item is marked as the current page. The separator between items is rendered by the web component — the Java API does not model it as data. `asCurrent()` is a fluent convenience returning `this` after `setCurrent(true)`, keeping one-liner construction readable.

---

## 2. Router-integrated navigation

Covers requirement(s): 2

```java
// Type-safe: links resolve from @Route annotations
breadcrumb.addItem(
    new BreadcrumbItem("Docs", DocsView.class),
    new BreadcrumbItem("Getting Started", GettingStartedView.class),
    new BreadcrumbItem("Installation").asCurrent()
);

// Parameterised route
breadcrumb.addItem(
    new BreadcrumbItem("Organization", OrgView.class),
    new BreadcrumbItem("Invoice #4521",
            InvoiceView.class,
            new RouteParameters("invoiceId", "4521"))
        .asCurrent()
);

// String path fallback (external links, hand-managed paths)
breadcrumb.addItem(
    new BreadcrumbItem("Home", "/"),
    new BreadcrumbItem("External docs", "https://docs.example.com")
);
```

**Why this shape:** Per DESIGN_GUIDELINES.md "Integrate with Flow Router", the primary form accepts `Class<? extends Component>` so that URL resolution is automatic and renaming a route updates the breadcrumb. String-path overloads coexist for external URLs and paths without a view class — the same dual-form `SideNavItem` already uses. `RouteParameters` support follows `SideNavItem(label, view, routeParameters)`.

---

## 3. Reflecting the application's navigation path (polyhierarchy)

Covers requirement(s): 5

```java
// User arrived via the deals path
breadcrumb.setItems(
    new BreadcrumbItem("Home", "/"),
    new BreadcrumbItem("This Week's Deals", "/deals/this-week"),
    new BreadcrumbItem("ThinkPad X1 Carbon").asCurrent()
);

// Same product, arrived via the category tree
breadcrumb.setItems(
    new BreadcrumbItem("Home", "/"),
    new BreadcrumbItem("Electronics", "/electronics"),
    new BreadcrumbItem("Laptops", "/electronics/laptops"),
    new BreadcrumbItem("ThinkPad X1 Carbon").asCurrent()
);
```

**Why this shape:** The component does not own a hierarchy model. The trail is whatever sequence the application supplies. `setItems(BreadcrumbItem...)` replaces the entire trail at once — useful when the trail changes on each navigation. This is the varargs counterpart to `addItem`; both exist following the convention of list-managing components (`SideNav.addItem` / `removeAll`, `MenuBar.addItem` / `removeAll`).

---

## 4. Programmatic items for dynamic trails

Covers requirement(s): 6

```java
// Build trail from data at runtime
List<Folder> folders = fileService.getAncestors(currentFolder);
breadcrumb.setItems(
    folders.stream()
        .map(f -> new BreadcrumbItem(f.getName(), f.getPath()))
        .toArray(BreadcrumbItem[]::new)
);
breadcrumb.getItems().getLast().setCurrent(true);
```

**Why this shape:** The same `setItems` shown above accepts an array built from data. `getItems()` returns `List<BreadcrumbItem>` following the `HasSideNavItems.getItems()` convention, allowing post-construction mutation like marking the last item as current.

---

## 5. Items with icons

Covers requirement(s): 7

```java
// Icon-only root (home icon, no label)
BreadcrumbItem home = new BreadcrumbItem(VaadinIcon.HOME.create(), "/");

// Icon + label
BreadcrumbItem projects = new BreadcrumbItem("Projects", "/projects",
        VaadinIcon.FOLDER.create());

breadcrumb.addItem(home, projects,
    new BreadcrumbItem("Kickoff Notes").asCurrent());
```

**Why this shape:** `BreadcrumbItem` implements `HasPrefix` (from `vaadin-flow-components-base`), so `setPrefixComponent(Component)` is available for icons — the same slot `SideNavItem` uses. Constructor overloads accepting a prefix component follow `SideNavItem(label, path, prefixComponent)`. An icon-only item is constructed with just the icon and path (no label string).

---

## 6. Non-clickable items

Covers requirement(s): 8

```java
breadcrumb.addItem(
    new BreadcrumbItem("Organization", OrgView.class),
    new BreadcrumbItem("Billing"),               // no path → not a link
    new BreadcrumbItem("Invoice #4521").asCurrent()
);
```

**Why this shape:** Absence of a path means the item renders as plain text, not a link — matching the `SideNavItem` convention where omitting the path produces a non-navigable label. No `setDisabled` is needed; "no landing page" is not "disabled."

---

## 7. Omitting the current page

Covers requirement(s): 9

```java
// Current page included (default — mark the last item)
breadcrumb.addItem(
    new BreadcrumbItem("Docs", "/docs"),
    new BreadcrumbItem("Getting Started", "/docs/getting-started"),
    new BreadcrumbItem("Installation Guide").asCurrent()
);

// Upward-only navigation: simply don't add a current item
breadcrumb.addItem(
    new BreadcrumbItem("Docs", "/docs"),
    new BreadcrumbItem("Getting Started", "/docs/getting-started")
);
```

**Why this shape:** The application controls the item list. Omitting the current page means not adding it — no mode toggle or boolean flag required. This is the same non-API approach the web component uses.

---

## 8. Customizing the separator

Covers requirement(s): 10

```java
// Text separator
breadcrumb.setSeparator(new Span("/"));

// Icon separator
breadcrumb.setSeparator(VaadinIcon.ARROW_RIGHT.create());
```

**Why this shape:** `setSeparator(Component)` maps to the web component's `slot="separator"`. The component clones this content between each pair of items. When not set, the default directional chevron is used (which auto-flips in RTL). This follows the pattern of `set{Slot}Component` from the design guidelines, though named `setSeparator` since the slot name is `separator`.

---

## 9. Automatic width adaptation

Covers requirement(s): 11, 12, 13, 14

```java
// No Java API needed — the web component handles overflow automatically
breadcrumb.addItem(
    new BreadcrumbItem("Home", "/"),
    new BreadcrumbItem("Region", "/region"),
    new BreadcrumbItem("Country", "/region/country"),
    new BreadcrumbItem("State", "/region/country/state"),
    new BreadcrumbItem("City", "/region/country/state/city"),
    new BreadcrumbItem("Venue").asCurrent()
);
// The trail stays on one line; intermediate items collapse into an
// overflow menu when space is tight; the current item truncates as
// a last resort.
```

**Why this shape:** Requirements 11–14 describe automatic behaviour — single-line display, collapsing intermediates, overflow menu, and last-resort truncation — handled entirely by the web component. The Flow wrapper does not need to expose configuration for these; the developer writes the full trail and the component adapts. This mirrors `MenuBar`'s overflow behaviour (no Java API for when/how items overflow).

---

## 10. Localizable labels

Covers requirement(s): 15

```java
// Default: sensible English labels, no configuration needed
Breadcrumb breadcrumb = new Breadcrumb();

// Localized
BreadcrumbI18n i18n = new BreadcrumbI18n()
    .setNavigationLabel("Fil d'Ariane")
    .setOverflow("Afficher les ancêtres masqués");
breadcrumb.setI18n(i18n);
```

**Why this shape:** A nested `BreadcrumbI18n` class with fluent setters, `implements Serializable`, `@JsonInclude(NON_NULL)` — the exact pattern from `SideNavI18n`. Exposed via `setI18n(BreadcrumbI18n)` / `getI18n()`. The `navigationLabel` field provides the component-specific default landmark label ("Breadcrumb"); `overflow` labels the overflow control for assistive technology. All strings are optional with English defaults.

---

## 11. Navigate event

Covers requirement(s): 2

```java
breadcrumb.addNavigateListener(event -> {
    BreadcrumbItem item = event.getItem();
    // Application-controlled navigation
    event.getSource().getUI().ifPresent(ui ->
        ui.navigate(item.getPath()));
});
```

**Why this shape:** The web component fires a `navigate` event when the user activates an ancestor item (matching `onNavigate` in the web API). The Flow event carries the activated `BreadcrumbItem` so the application can inspect it and route accordingly. When the breadcrumb uses `Class<? extends Component>` paths, the router resolves the URL from the `href` on the anchor — so for typical usage with view classes the listener is not needed (the anchor navigates directly). The listener is for SPAs or custom routing scenarios.

---

## 12. Automatic trail from the view hierarchy

Covers requirement(s): 19 (flow-only)

```java
// Simplest usage: add an unconfigured breadcrumb to a layout
@Route(value = "", layout = MainLayout.class)
public class MainLayout extends VerticalLayout implements RouterLayout {
    public MainLayout() {
        add(new Breadcrumb());  // auto-populates from the route hierarchy
    }
}

@Route(value = "billing", layout = MainLayout.class)
public class BillingLayout extends VerticalLayout implements RouterLayout {
}

@Route(value = "billing/invoices/:invoiceId", layout = BillingLayout.class)
public class InvoiceView extends VerticalLayout {
}
// Navigating to /billing/invoices/4521 renders:
// MainLayout › BillingLayout › Invoice #4521
// (labels derived from route/layout class names or @PageTitle)
```

```java
// Explicit items override automatic mode
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.addItem(
    new BreadcrumbItem("Home", "/"),
    new BreadcrumbItem("Deals", "/deals"),
    new BreadcrumbItem("ThinkPad X1 Carbon").asCurrent()
);
// Automatic mode is not used when items are explicitly supplied
```

**Why this shape:** Per the Discussion in requirements.md, `new Breadcrumb()` with no items auto-populates from the Flow router's view hierarchy — the chain of `RouterLayout` parents and the current `@Route`. Each item's label comes from `@PageTitle`, the route's simple class name, or a `BreadcrumbItemProvider` interface the layout can implement for custom labels. When items are explicitly supplied via `addItem` / `setItems`, the explicit trail takes precedence. This is a Flow-only feature since the web component has no access to a server-side route registry.

---

## Web API coverage check

| Web API surface (from developer-api.md) | Flow API | Notes |
|---|---|---|
| `<vaadin-breadcrumb>` element | `new Breadcrumb()` | constructor |
| `<vaadin-breadcrumb-item>` child | `addItem(BreadcrumbItem...)` / `setItems(BreadcrumbItem...)` | via `HasBreadcrumbItems` interface |
| `path` attribute | `BreadcrumbItem#setPath(String)` / `setPath(Class<?>)` / `setPath(Class<?>, RouteParameters)` | router-integrated + string fallback |
| `current` attribute | `BreadcrumbItem#setCurrent(boolean)` / `asCurrent()` | fluent convenience |
| `slot="prefix"` on item | `BreadcrumbItem` implements `HasPrefix` | from `vaadin-flow-components-base` |
| `slot="separator"` on breadcrumb | `Breadcrumb#setSeparator(Component)` / `getSeparator()` | — |
| `items` JS property | `Breadcrumb#setItems(BreadcrumbItem...)` | replaces children; both forms available |
| `location` JS property | Not wrapped — Flow router handles current-location matching server-side | automatic mode covers this |
| `onNavigate` callback | `Breadcrumb#addNavigateListener(ComponentEventListener<NavigateEvent>)` | returns `Registration` |
| `i18n` JS property | `Breadcrumb#setI18n(BreadcrumbI18n)` / `getI18n()` | serialised via Jackson |
| `i18n.navigationLabel` | `BreadcrumbI18n#setNavigationLabel(String)` | fluent |
| `i18n.overflow` | `BreadcrumbI18n#setOverflow(String)` | fluent |
| (automatic width adaptation) | No Flow API — web component handles automatically | — |
| (separators hidden from a11y tree) | No Flow API — web component handles automatically | — |
| (RTL separator mirroring) | No Flow API — web component handles automatically | — |
