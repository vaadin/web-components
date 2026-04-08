# Vaadin Breadcrumb Flow Component — Implementation Spec

## Overview

Server-side Java API for the `<vaadin-breadcrumb>` web component, following the patterns established in the `vaadin/flow-components` repository. The Flow component provides a type-safe Java API for building breadcrumb navigation in Vaadin Flow applications, with special attention to Vaadin Router integration for SPA-style navigation.

## Usage Examples

### Basic Usage

```java
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.add(
    new BreadcrumbItem("Home", "/"),
    new BreadcrumbItem("Products", "/products"),
    new BreadcrumbItem("Widgets", "/products/widgets"),
    new BreadcrumbItem("Sprocket")  // current page — no href
);
add(breadcrumb);
```

### With Items API

```java
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.setItems(
    List.of(
        new BreadcrumbItem("Home", "/"),
        new BreadcrumbItem("Products", "/products"),
        new BreadcrumbItem("Widgets")
    )
);
```

### Router Integration (Automatic from Route Hierarchy)

```java
// In a view that implements HasUrlParameter or uses @Route with layout
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.setItems(
    new BreadcrumbItem("Home", HomeView.class),
    new BreadcrumbItem("Products", ProductsView.class),
    new BreadcrumbItem("Widgets")  // current page
);
```

### Responsive Overflow

Overflow is automatic — the component manages item visibility based on available width. Items are shown in priority order: current page, parent, root, then remaining ancestors. No configuration needed.

```java
// Long trail — middle items auto-collapse when space is limited
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.add(
    new BreadcrumbItem("Home", "/"),
    new BreadcrumbItem("Products", "/products"),
    new BreadcrumbItem("Widgets", "/products/widgets"),
    new BreadcrumbItem("Sprockets", "/products/widgets/sprockets"),
    new BreadcrumbItem("Turbo Sprocket")
);
// At narrow width: Home / ... / Sprockets / Turbo Sprocket
// Hidden items accessible via overflow popover
```

### With Icons

```java
BreadcrumbItem homeItem = new BreadcrumbItem("Home", "/");
homeItem.setPrefixComponent(VaadinIcon.HOME.create());

Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.add(
    homeItem,
    new BreadcrumbItem("Products", "/products"),
    new BreadcrumbItem("Widgets")
);
```

### With Item Click Listener (SPA Navigation)

```java
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.add(
    new BreadcrumbItem("Home", "/"),
    new BreadcrumbItem("Products", "/products"),
    new BreadcrumbItem("Widgets")
);
breadcrumb.addItemClickListener(event -> {
    event.getSource(); // the Breadcrumb component
    BreadcrumbItem item = event.getItem();
    // SPA navigation via Vaadin Router
    UI.getCurrent().navigate(item.getHref());
});
```

### Automatic Route-Based Breadcrumbs (Advanced)

```java
// Helper that generates breadcrumbs from the current route chain
@Route(value = "products/widgets", layout = MainLayout.class)
public class WidgetsView extends VerticalLayout implements AfterNavigationObserver {

    private final Breadcrumb breadcrumb = new Breadcrumb();

    public WidgetsView() {
        add(breadcrumb);
    }

    @Override
    public void afterNavigation(AfterNavigationEvent event) {
        List<BreadcrumbItem> items = BreadcrumbHelper.fromRouteChain(event);
        breadcrumb.setItems(items);
    }
}
```

---

## Implementation Plan

### Phase 1: Core Component (Aligned with Web Component Phase 1)

#### Java Classes

**`Breadcrumb`** — main container component

```java
@Tag("vaadin-breadcrumb")
@NpmPackage(value = "@vaadin/breadcrumb", version = "...")
@JsModule("@vaadin/breadcrumb/vaadin-breadcrumb.js")
public class Breadcrumb extends Component implements HasComponents, HasStyle, HasSize {

    // --- Label ---
    public String getLabel();
    public void setLabel(String label);

    // --- Items API ---
    public void setItems(List<BreadcrumbItem> items);
    public void setItems(BreadcrumbItem... items);
    public List<BreadcrumbItem> getItems();

    // --- Add/Remove (slot-based) ---
    public void add(BreadcrumbItem... items);
    public void remove(BreadcrumbItem... items);
    public void removeAll();
}
```

**`BreadcrumbItem`** — individual item

```java
@Tag("vaadin-breadcrumb-item")
public class BreadcrumbItem extends Component implements HasText, HasStyle, HasComponents {

    // --- Constructors ---
    public BreadcrumbItem();
    public BreadcrumbItem(String text);
    public BreadcrumbItem(String text, String href);
    public BreadcrumbItem(String text, Class<? extends Component> navigationTarget);

    // --- Properties ---
    public String getHref();
    public void setHref(String href);

    public boolean isDisabled();
    public void setDisabled(boolean disabled);

    // --- Prefix component ---
    public void setPrefixComponent(Component component);
    public Component getPrefixComponent();
}
```

#### File Structure (in `flow-components` repo)

```
vaadin-breadcrumb-flow-parent/
├── vaadin-breadcrumb-flow/
│   ├── src/main/java/com/vaadin/flow/component/breadcrumb/
│   │   ├── Breadcrumb.java
│   │   ├── BreadcrumbItem.java
│   │   └── BreadcrumbVariant.java  (if theme variants exist)
│   └── src/test/java/com/vaadin/flow/component/breadcrumb/
│       ├── BreadcrumbTest.java
│       └── BreadcrumbItemTest.java
├── vaadin-breadcrumb-flow-integration-tests/
│   ├── src/main/java/.../breadcrumb/
│   │   ├── BreadcrumbBasicPage.java
│   │   ├── BreadcrumbOverflowPage.java
│   │   └── BreadcrumbRouterPage.java
│   └── src/test/java/.../breadcrumb/
│       ├── BreadcrumbBasicIT.java
│       ├── BreadcrumbOverflowIT.java
│       └── BreadcrumbRouterIT.java
└── pom.xml
```

#### Unit Tests (`BreadcrumbTest.java`)

- Component creates correct DOM tag
- `setLabel()` sets `aria-label`
- `setItems()` creates child elements
- `add()`/`remove()`/`removeAll()` manage children
- `BreadcrumbItem` constructors set text and href correctly
- `setHref()`/`getHref()` work correctly
- `setDisabled()` reflects to attribute
- `setPrefixComponent()` adds component to prefix slot
- Navigation target constructor resolves to correct URL

#### Integration Tests

- Basic rendering and navigation
- Click on item navigates (full page reload mode)
- Accessibility: `aria-current="page"` on last item
- Disabled items are non-interactive

### Phase 2: Router Integration & Events (Aligned with Web Component Phase 3)

**Item click event:**

```java
public Registration addItemClickListener(
    ComponentEventListener<BreadcrumbItemClickEvent> listener);
```

```java
@DomEvent("item-click")
public class BreadcrumbItemClickEvent extends ComponentEvent<Breadcrumb> {
    private final BreadcrumbItem item;

    public BreadcrumbItemClickEvent(Breadcrumb source, boolean fromClient,
            @EventData("event.detail.item") JsonObject itemData) {
        super(source, fromClient);
        // resolve item from component children
    }

    public BreadcrumbItem getItem();
}
```

**SPA navigation support:**
- When `addItemClickListener` is registered, the component should use `event.preventDefault()` on the client side to suppress default link navigation
- The server-side listener can then call `UI.getCurrent().navigate()` for Vaadin Router SPA navigation
- This solves the long-standing pain point from VCF add-on issues #2 and #14 (breadcrumbs causing full page reloads instead of SPA navigation)

**Route helper (optional utility):**

```java
public class BreadcrumbHelper {
    /**
     * Generates breadcrumb items from the current route chain.
     * Inspects route hierarchy (parent layouts) and builds
     * items with correct hrefs and labels.
     */
    public static List<BreadcrumbItem> fromRouteChain(AfterNavigationEvent event);
}
```

Integration tests:
- Item click event fires with correct item
- SPA navigation works without page reload
- `BeforeLeaveEvent` fires correctly (unsaved data warnings work)
- Route helper generates correct breadcrumb items from route hierarchy

---

## Testing Strategy

### Unit Tests (JVM-only)
- All public API methods
- Property getters/setters
- Constructor variants
- Event registration

### Integration Tests (Browser-based via TestBench)
- Visual rendering
- Click navigation
- Keyboard navigation (Tab through items)
- Responsive overflow (priority-based item visibility at various widths)
- Overflow popover interaction
- SPA navigation via item-click event
- Accessibility verification (ARIA attributes)
- Screen reader testing with Axe

---

## Documentation Plan (vaadin.com/docs)

### Java API Examples

All documentation examples should use Java code with the Flow API:

1. **Overview** — What breadcrumbs are, when to use them, Java code example
2. **Basic Usage** — Constructor patterns, `add()` vs `setItems()`
3. **Navigation Targets** — Using `Class<? extends Component>` for type-safe route references
4. **Current Page** — Last item without href is automatically marked as current
5. **Icons** — Using `setPrefixComponent()` with `VaadinIcon`
6. **Overflow** — Automatic priority-based responsive overflow; overflow popover behavior
7. **Router Integration** — `addItemClickListener()` for SPA navigation; example with `UI.navigate()`; `BreadcrumbHelper.fromRouteChain()`
9. **Disabled Items** — `setDisabled()` for inaccessible parent pages
10. **Styling** — CSS custom properties, shadow parts
11. **Best Practices** — Keep trails short; use with `@Route` hierarchy; handle unsaved data with `BeforeLeaveEvent`
