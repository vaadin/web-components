# Breadcrumb Flow Component Specification

<!--
Full Flow implementation specification derived from flow-developer-api.md, grounded in the actual source of the flow-components repository.

Conventions follow SideNav/SideNavItem (HasSideNavItems pattern, HasPrefix, path + view-class setters, I18n, @Synchronize on current) and the DESIGN_GUIDELINES.md / FLOW_COMPONENT_GUIDELINES.md principles.
-->

> Wraps the experimental web component `<vaadin-breadcrumb>`. Flow users enable it via the same feature flag surfaced by the web component (`window.Vaadin.featureFlags.breadcrumbComponent = true`).

## Key Design Decisions

1. **`HasBreadcrumbItems` interface mirrors `HasSideNavItems`.** A new `HasBreadcrumbItems` interface provides `addItem(BreadcrumbItem...)`, `addItemAsFirst(BreadcrumbItem)`, `addItemAtIndex(int, BreadcrumbItem)`, `getItems()`, `remove(BreadcrumbItem...)`, `removeAll()`. Only `Breadcrumb` implements it (unlike SideNav where both SideNav and SideNavItem implement `HasSideNavItems` for nested hierarchies). The breadcrumb has a flat item list — no nesting.

2. **`BreadcrumbItem` follows `SideNavItem` conventions.** Implements `HasPrefix` (for `slot="prefix"` icons), `HasTooltip`, and `HasEnabled` (disabled items render with `path` removed on the client). Constructor overloads accept `(String label)`, `(String label, String path)`, `(String label, Class<? extends Component> view)`, `(String label, Class<? extends Component> view, RouteParameters)`, and icon variants `(Component icon, String path)`, `(String label, String path, Component prefixComponent)`, `(String label, Class<? extends Component> view, Component prefixComponent)`.

3. **`current` on `BreadcrumbItem` is writable (not read-only), diverging from `SideNavItem`.** SideNavItem's `current` is `readOnly: true` and auto-computed from location + path. Breadcrumb's `current` is application-controlled via `setCurrent(boolean)` / `isCurrent()`. The `asCurrent()` fluent method returns `this` after `setCurrent(true)` for builder-style construction (see flow-developer-api.md §1).

4. **`setItems(BreadcrumbItem...)` replaces all children.** Calls `removeAll()` then `addItem(items)`. This is a convenience for trail replacement on navigation (flow-developer-api.md §3, §4).

5. **`setSeparator(Component)` / `getSeparator()` for the separator slot.** Maps to `slot="separator"` on the web component. When not set, the default directional chevron is used. Follows `set{Slot}Component` / `get{Slot}Component` naming from `HasPrefix`/`HasSuffix`, shortened to `setSeparator` since the slot name is `separator`.

6. **`BreadcrumbI18n` is a nested static class inside `Breadcrumb`.** Following `SideNavI18n` convention (nested in `SideNav`). Fields: `navigationLabel` (default `"Breadcrumb"`) and `overflow` (default `"Show hidden ancestors"`). Fluent setters returning `this`. `@JsonInclude(NON_NULL)`, `implements Serializable`. Serialised via `JacksonUtils.beanToJson(...)` and pushed to the client property `i18n` via `Element.setPropertyJson(...)`.

7. **`NavigateEvent` carries the activated item.** `@DomEvent("navigate")` with `@EventData` for `event.detail.path` and `event.detail.current`. The event class is `Breadcrumb.NavigateEvent` (nested). When the item was constructed with a view class, the resolved URL is available from `event.getItem().getPath()`.

8. **Automatic trail from view hierarchy (requirement 19, flow-only).** When no items are explicitly supplied, the `Breadcrumb` component builds its trail from the Flow router's view hierarchy on each `AfterNavigationEvent`. This is implemented by listening to `AfterNavigationObserver` in the attach handler. It reads the route chain from `AfterNavigationEvent.getActiveChain()` and builds `BreadcrumbItem` instances. Each layout/view in the chain produces one item; labels come from `@PageTitle`, `HasDynamicTitle.getPageTitle()`, or the class simple name as fallback. The auto-trail is replaced whenever `addItem` / `setItems` is called — explicit items disable auto mode.

9. **Connector needed: no.** All state is set via Element properties/attributes. Items are light-DOM children managed server-side. The `items` JS property on the web component is not used from Flow — Flow creates real `<vaadin-breadcrumb-item>` child elements instead. The overflow detection, separator cloning, and overflow menu are all handled by the web component internally.

10. **Router integration follows SideNavItem.** `BreadcrumbItem.setPath(Class<? extends Component>)` resolves the URL via `RouteConfiguration` at set-time and writes it to the `path` element property. String-based `setPath(String)` is also available. The component does not call the router during navigation — the `<a href>` on the web component side handles it, and the Flow router intercepts the click.

---

## Module / Package Layout

```
flow-components/
└── vaadin-breadcrumb-flow-parent/
    ├── pom.xml
    ├── vaadin-breadcrumb-flow/
    │   ├── pom.xml
    │   └── src/
    │       ├── main/java/com/vaadin/flow/component/breadcrumb/
    │       │   ├── Breadcrumb.java
    │       │   ├── BreadcrumbItem.java
    │       │   └── HasBreadcrumbItems.java
    │       └── test/java/com/vaadin/flow/component/breadcrumb/tests/
    │           ├── BreadcrumbTest.java
    │           ├── BreadcrumbItemTest.java
    │           └── BreadcrumbSerializableTest.java
    ├── vaadin-breadcrumb-flow-integration-tests/
    │   ├── pom.xml
    │   └── src/
    │       ├── main/java/com/vaadin/flow/component/breadcrumb/tests/
    │       │   └── BreadcrumbPage.java
    │       └── test/java/com/vaadin/flow/component/breadcrumb/tests/
    │           └── BreadcrumbIT.java
    └── vaadin-breadcrumb-testbench/
        ├── pom.xml
        └── src/main/java/com/vaadin/flow/component/breadcrumb/testbench/
            ├── BreadcrumbElement.java
            └── BreadcrumbItemElement.java
```

Package name: `com.vaadin.flow.component.breadcrumb`

---

## Component Classes

### `Breadcrumb` — main component

```java
@Tag("vaadin-breadcrumb")
@NpmPackage(value = "@vaadin/breadcrumb", version = "25.2.0-alpha7")
@JsModule("@vaadin/breadcrumb/src/vaadin-breadcrumb.js")
public class Breadcrumb extends Component
        implements HasBreadcrumbItems, HasSize, HasStyle,
                   AfterNavigationObserver {

    // Fields
    private BreadcrumbI18n i18n;
    private Component separatorComponent;
    private boolean explicitItems = false;

    // Constructors
    public Breadcrumb() {}
    public Breadcrumb(BreadcrumbItem... items) {
        this();
        addItem(items);
    }

    // --- Items API (delegated to HasBreadcrumbItems default methods) ---

    // setItems replaces all children
    public void setItems(BreadcrumbItem... items);
    public void setItems(List<BreadcrumbItem> items);

    // --- Separator ---
    public void setSeparator(Component separator);
    public Component getSeparator();

    // --- I18n ---
    public void setI18n(BreadcrumbI18n i18n);
    public BreadcrumbI18n getI18n();

    // --- Navigate event ---
    public Registration addNavigateListener(
            ComponentEventListener<NavigateEvent> listener);

    // --- Auto-trail from router ---
    @Override
    public void afterNavigation(AfterNavigationEvent event);

    // --- Nested event class ---
    @DomEvent("navigate")
    public static class NavigateEvent extends ComponentEvent<Breadcrumb> {
        private final String path;
        private final boolean current;

        public NavigateEvent(Breadcrumb source, boolean fromClient,
                @EventData("event.detail.path") String path,
                @EventData("event.detail.current") boolean current) {
            super(source, fromClient);
            this.path = path;
            this.current = current;
        }

        public String getPath() { return path; }
        public boolean isCurrent() { return current; }

        /**
         * Returns the BreadcrumbItem that was activated, or null if
         * the item cannot be found (e.g. fired from overflow menu).
         */
        public BreadcrumbItem getItem();
    }

    // --- Nested I18n class ---
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class BreadcrumbI18n implements Serializable {
        private String navigationLabel;
        private String overflow;

        public String getNavigationLabel() { return navigationLabel; }
        public BreadcrumbI18n setNavigationLabel(String navigationLabel) {
            this.navigationLabel = navigationLabel;
            return this;
        }

        public String getOverflow() { return overflow; }
        public BreadcrumbI18n setOverflow(String overflow) {
            this.overflow = overflow;
            return this;
        }
    }
}
```

**Implemented mixin interfaces:**
- `HasSize` — breadcrumb can be sized (e.g. `setWidth("100%")`)
- `HasStyle` — for inline style and class management
- `HasBreadcrumbItems` — adds `addItem`, `getItems`, `remove`, `removeAll`
- `AfterNavigationObserver` — for automatic trail building from the route hierarchy (requirement 19)

**@Synchronize'd properties:** None. The `current` attribute on items is set server-side only; the overflow state is client-only.

**Events:**
- `NavigateEvent` — `@DomEvent("navigate")`, carries `path` and `current`. Listener: `addNavigateListener(...)`.

---

### `BreadcrumbItem` — individual trail item

```java
@Tag("vaadin-breadcrumb-item")
@NpmPackage(value = "@vaadin/breadcrumb", version = "25.2.0-alpha7")
@JsModule("@vaadin/breadcrumb/src/vaadin-breadcrumb-item.js")
public class BreadcrumbItem extends Component
        implements HasPrefix, HasTooltip, HasEnabled {

    private Element labelElement;

    // --- Constructors ---
    public BreadcrumbItem(String label) {
        setLabel(label);
    }

    public BreadcrumbItem(String label, String path) {
        setPath(path);
        setLabel(label);
    }

    public BreadcrumbItem(String label, Class<? extends Component> view) {
        setPath(view);
        setLabel(label);
    }

    public <T, C extends Component & HasUrlParameter<T>> BreadcrumbItem(
            String label, Class<? extends C> view, T parameter) {
        this(label, view, HasUrlParameterFormat.getParameters(parameter));
    }

    public BreadcrumbItem(String label, Class<? extends Component> view,
            RouteParameters routeParameters) {
        setPath(view, routeParameters);
        setLabel(label);
    }

    public BreadcrumbItem(String label, String path,
            Component prefixComponent) {
        setPath(path);
        setLabel(label);
        setPrefixComponent(prefixComponent);
    }

    public BreadcrumbItem(String label, Class<? extends Component> view,
            Component prefixComponent) {
        setPath(view);
        setLabel(label);
        setPrefixComponent(prefixComponent);
    }

    public BreadcrumbItem(Component prefixComponent, String path) {
        setPath(path);
        setPrefixComponent(prefixComponent);
    }

    // --- Label ---
    public void setLabel(String label);
    public String getLabel();

    // --- Path (string) ---
    public void setPath(String path);
    public String getPath();

    // --- Path (view class, router-integrated) ---
    public void setPath(Class<? extends Component> view);
    public <T, C extends Component & HasUrlParameter<T>> void setPath(
            Class<? extends C> view, T parameter);
    public void setPath(Class<? extends Component> view,
            RouteParameters routeParameters);

    // --- Current ---
    public void setCurrent(boolean current);
    public boolean isCurrent();

    /**
     * Fluent convenience: sets current to true and returns this.
     */
    public BreadcrumbItem asCurrent() {
        setCurrent(true);
        return this;
    }
}
```

**Implemented mixin interfaces:**
- `HasPrefix` — for `slot="prefix"` icon support (from `vaadin-flow-components-base`)
- `HasTooltip` — for tooltip on truncated items
- `HasEnabled` — for non-clickable items (disabled removes the path link effect)

**@Synchronize'd properties:** None. `current` is set server-side only.

---

### `HasBreadcrumbItems` — children management interface

```java
public interface HasBreadcrumbItems extends HasElement {

    default void addItem(BreadcrumbItem... items) {
        for (BreadcrumbItem item : items) {
            getElement().appendChild(item.getElement());
        }
    }

    default void addItemAsFirst(BreadcrumbItem item) {
        getElement().insertChild(0, item.getElement());
    }

    default void addItemAtIndex(int index, BreadcrumbItem item) {
        getElement().insertChild(index, item.getElement());
    }

    default List<BreadcrumbItem> getItems() {
        return getElement().getChildren()
            .filter(e -> e.getTag().equals("vaadin-breadcrumb-item"))
            .map(e -> e.getComponent().orElse(null))
            .filter(BreadcrumbItem.class::isInstance)
            .map(BreadcrumbItem.class::cast)
            .collect(Collectors.toList());
    }

    default void remove(BreadcrumbItem... items) {
        for (BreadcrumbItem item : items) {
            getElement().removeChild(item.getElement());
        }
    }

    default void removeAll() {
        getItems().forEach(item ->
            getElement().removeChild(item.getElement()));
    }
}
```

---

## i18n

Nested in `Breadcrumb` as `Breadcrumb.BreadcrumbI18n` (see class definition above).

Exposed on `Breadcrumb` via `setI18n(BreadcrumbI18n)` / `getI18n()`. Serialised to JSON via `JacksonUtils.beanToJson(...)` and pushed to the client property `i18n` via `Element.setPropertyJson("i18n", ...)`.

| Field | Type | Default (English) | Web component i18n field | Notes |
|---|---|---|---|---|
| `navigationLabel` | String | `"Breadcrumb"` | `navigationLabel` | Landmark ARIA label (req 15) |
| `overflow` | String | `"Show hidden ancestors"` | `overflow` | Overflow button accessible label (req 13) |

---

## Theme Variants

No dedicated `BreadcrumbVariant` enum is needed for the initial release. The breadcrumb has no theme variants defined in the web component spec. If variants are added later, follow the standard `{Component}Variant implements ThemeVariant` pattern.

---

## Connector

**No connector required.** All state is set via Element properties/attributes. Items are light-DOM `<vaadin-breadcrumb-item>` children managed server-side. The web component handles overflow detection, separator cloning, and the overflow menu internally. The `items` JS property is not used from Flow.

---

## Server/Client Sync Concerns

- **Serialisation.** All fields are `Serializable`. `BreadcrumbI18n implements Serializable`. `BreadcrumbItem` extends `Component` (which is `Serializable`). The `separatorComponent` field is a `Component` reference (Serializable). The `labelElement` field in `BreadcrumbItem` is an `Element` (Serializable). No special handling needed.

- **Signal support.** Not applicable for the initial release. The breadcrumb has no obvious single-value property that benefits from reactive binding. If `bindLabel` or `bindItems` are needed in the future, they follow the `SignalPropertySupport` pattern from the guidelines. The `setCurrent(boolean)` on `BreadcrumbItem` could get a `bindCurrent(Signal<Boolean>)` later if demand arises.

- **Routing.** The component is router-agnostic. `BreadcrumbItem.setPath(Class<? extends Component> view)` resolves the URL via `RouteConfiguration.forSessionScope().getUrl(view)` at set-time and stores the resulting string path. The anchor on the web component side handles the actual navigation. The Flow router intercepts clicks on anchors pointing to known routes.

- **DisabledUpdateMode.** Default (unchanged). `BreadcrumbItem` implements `HasEnabled` — disabled items have their path removed client-side via the web component's rendering logic (`<a>` without `href`).

- **Auto-trail lifecycle.** The auto-trail feature (requirement 19) uses `AfterNavigationObserver`. When `Breadcrumb` is attached and no explicit items have been supplied, `afterNavigation(AfterNavigationEvent)` reads the active route chain and builds items. When `addItem`/`setItems` is called, a flag (`explicitItems = true`) disables auto mode.

---

## TestBench Elements

### `BreadcrumbElement`

```java
@Element("vaadin-breadcrumb")
public class BreadcrumbElement extends TestBenchElement {

    public List<BreadcrumbItemElement> getItems() {
        return $(BreadcrumbItemElement.class).all();
    }

    public BreadcrumbItemElement getCurrentItem() {
        return $(BreadcrumbItemElement.class)
            .withAttribute("current").first();
    }

    public boolean hasOverflow() {
        return !getPropertyBoolean("_hasOverflow")
            || (Boolean) executeScript(
                "return !this.shadowRoot.querySelector('[part=overflow-button]').hidden");
    }

    public void clickOverflowButton() {
        executeScript(
            "this.shadowRoot.querySelector('[part=overflow-button]').click()");
    }
}
```

### `BreadcrumbItemElement`

```java
@Element("vaadin-breadcrumb-item")
public class BreadcrumbItemElement extends TestBenchElement {

    public String getText() {
        return getPropertyString("textContent").trim();
    }

    public boolean isCurrent() {
        return hasAttribute("current");
    }

    public String getPath() {
        return getAttribute("path");
    }

    public void clickLink() {
        executeScript(
            "this.shadowRoot.querySelector('a').click()");
    }
}
```

---

## Reuse and Proposed Adjustments to Existing Modules

1. **`HasPrefix` (from `vaadin-flow-components-base`)** — Used as-is on `BreadcrumbItem`. Provides `setPrefixComponent` / `getPrefixComponent` mapping to `slot="prefix"`. No modification needed. Other users: `SideNavItem`, `Button`, all field components.

2. **`HasTooltip` (from `vaadin-flow-components-base`)** — Used as-is on `BreadcrumbItem`. Provides tooltip support for truncated items. No modification needed.

3. **`HasThemeVariant` (from `vaadin-flow-components-base`)** — Not used initially (no theme variants). Available for future use if variants are added.

4. **`SlotUtils` (from `vaadin-flow-components-base`)** — Used for the separator slot management in `Breadcrumb.setSeparator(Component)`. `SlotUtils.setSlot(this, "separator", component)` handles the slot attribute assignment. No modification needed.

---

## Coverage

| Requirement | Addressed in spec section(s) |
|---|---|
| 1. Displaying the ancestor trail | Component Classes → `Breadcrumb` + `BreadcrumbItem`; `HasBreadcrumbItems.addItem` |
| 2. Navigating to an ancestor level | `BreadcrumbItem.setPath`; `NavigateEvent`; Router integration |
| 3. Indicating the current page | `BreadcrumbItem.setCurrent` / `isCurrent` / `asCurrent` |
| 4. Visual separators between items | `Breadcrumb.setSeparator(Component)` |
| 5. Reflecting the application's navigation path | `Breadcrumb.setItems` for trail replacement; no hierarchy model |
| 6. Updating the trail as navigation state changes | `setItems` replaces trail; auto-trail via `AfterNavigationObserver` |
| 7. Items with icons | `BreadcrumbItem implements HasPrefix`; constructor overloads with `Component prefixComponent` |
| 8. Non-clickable ancestor items | Omit `path` → item renders as non-link text |
| 9. Optional inclusion of the current page | Application controls item list; omit last item for upward-only |
| 10. Customizing the separator | `Breadcrumb.setSeparator(Component)` |
| 11. Single-line presentation | Web component handles (no Flow API needed) |
| 12. Collapsing items when space is limited | Web component handles (no Flow API needed) |
| 13. Overflow control reveals collapsed items | Web component handles; `BreadcrumbI18n.overflow` labels the button |
| 14. Truncating the current item as a last resort | Web component handles (no Flow API needed) |
| 15. Default navigation landmark label | `BreadcrumbI18n.navigationLabel` defaults to `"Breadcrumb"` |
| 16. Announcing the current page to AT | `BreadcrumbItem.setCurrent` → `aria-current="page"` on web component |
| 17. Separators omitted from a11y tree | Web component handles (`aria-hidden="true"` on separators) |
| 18. Directional separator mirrors in RTL | Web component handles (CSS mirroring) |
| 19. Automatic trail from the view hierarchy (flow) | `Breadcrumb implements AfterNavigationObserver`; auto-trail logic |
