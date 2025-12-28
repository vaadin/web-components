# Vaadin Breadcrumb Flow Component Specification

## Executive Summary

This specification defines the Java/Flow integration for the Vaadin Breadcrumb component, providing a type-safe, Java-friendly API for server-side applications. The implementation follows Vaadin Flow's established patterns and integrates seamlessly with Vaadin's routing system.

## Overview

The Flow Breadcrumb component wraps the `<vaadin-breadcrumb>` web component, providing:
- Type-safe Java API
- Integration with Vaadin Router
- Server-side item management
- Event handling with type safety
- Fluent builder API
- Automatic serialization/deserialization

## Usage Examples

### Basic Usage

```java
import com.vaadin.flow.component.breadcrumb.Breadcrumb;
import com.vaadin.flow.component.breadcrumb.BreadcrumbItem;

public class MainView extends VerticalLayout {
    public MainView() {
        Breadcrumb breadcrumb = new Breadcrumb();
        breadcrumb.setItems(
            new BreadcrumbItem("Home", "/"),
            new BreadcrumbItem("Products", "/products"),
            new BreadcrumbItem("Electronics", "/products/electronics"),
            new BreadcrumbItem("Laptops")
        );

        add(breadcrumb);
    }
}
```

### With Item Builder

```java
Breadcrumb breadcrumb = new Breadcrumb();

BreadcrumbItem home = new BreadcrumbItem.Builder()
    .label("Home")
    .href("/")
    .build();

BreadcrumbItem products = new BreadcrumbItem.Builder()
    .label("Products")
    .href("/products")
    .build();

BreadcrumbItem current = new BreadcrumbItem.Builder()
    .label("Laptops")
    .build();

breadcrumb.setItems(home, products, current);
```

### With Event Listener

```java
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.setItems(
    new BreadcrumbItem("Home", "/"),
    new BreadcrumbItem("Products", "/products"),
    new BreadcrumbItem("Current Page")
);

breadcrumb.addItemClickListener(event -> {
    BreadcrumbItem item = event.getItem();
    int index = event.getIndex();

    Notification.show("Clicked: " + item.getLabel());

    // Prevent default navigation for custom handling
    event.preventDefault();
});

add(breadcrumb);
```

### Automatic Router Integration

```java
import com.vaadin.flow.router.Route;
import com.vaadin.flow.router.PageTitle;

@Route("products/electronics/laptops")
@PageTitle("Laptops")
public class LaptopView extends VerticalLayout implements HasDynamicTitle {

    public LaptopView() {
        // Breadcrumb automatically generated from route hierarchy
        Breadcrumb breadcrumb = new Breadcrumb();
        breadcrumb.setAutoGenerateFromRoute(true);

        add(breadcrumb);
    }

    @Override
    public String getPageTitle() {
        return "Laptops - Product Catalog";
    }
}
```

### Manual Route Configuration

```java
public class MainLayout extends AppLayout implements RouterLayout {

    public MainLayout() {
        Breadcrumb breadcrumb = new Breadcrumb();

        // Configure route mapping
        breadcrumb.addRouteMapping("/", "Home");
        breadcrumb.addRouteMapping("/products", "Products");
        breadcrumb.addRouteMapping("/products/electronics", "Electronics");

        addToNavbar(breadcrumb);
    }
}
```

### Custom Separator

```java
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.setSeparator("›");

// Or with HTML content
breadcrumb.setSeparator(new Span("›"));
```

### Dynamic Item Update

```java
Breadcrumb breadcrumb = new Breadcrumb();

// Initial items
List<BreadcrumbItem> items = new ArrayList<>();
items.add(new BreadcrumbItem("Home", "/"));
items.add(new BreadcrumbItem("Products", "/products"));
breadcrumb.setItems(items);

// Update items dynamically
Button addItem = new Button("Add Category", e -> {
    items.add(new BreadcrumbItem("Electronics", "/products/electronics"));
    breadcrumb.setItems(items);
});
```

### Integration with Vaadin Flow Router

```java
import com.vaadin.flow.component.Component;
import com.vaadin.flow.router.BeforeEnterEvent;
import com.vaadin.flow.router.BeforeEnterObserver;

public class MainLayout extends AppLayout
        implements RouterLayout, BeforeEnterObserver {

    private final Breadcrumb breadcrumb;

    public MainLayout() {
        breadcrumb = new Breadcrumb();
        breadcrumb.setShowCurrentPage(true);
        addToNavbar(breadcrumb);
    }

    @Override
    public void beforeEnter(BeforeEnterEvent event) {
        // Update breadcrumbs based on current navigation
        List<BreadcrumbItem> items = generateBreadcrumbs(event);
        breadcrumb.setItems(items);
    }

    private List<BreadcrumbItem> generateBreadcrumbs(BeforeEnterEvent event) {
        List<BreadcrumbItem> items = new ArrayList<>();
        String path = event.getLocation().getPath();

        // Generate breadcrumbs from path
        String[] segments = path.split("/");
        StringBuilder currentPath = new StringBuilder();

        items.add(new BreadcrumbItem("Home", "/"));

        for (int i = 0; i < segments.length; i++) {
            if (!segments[i].isEmpty()) {
                currentPath.append("/").append(segments[i]);
                String label = formatLabel(segments[i]);
                String href = i < segments.length - 1 ? currentPath.toString() : null;

                items.add(new BreadcrumbItem(label, href));
            }
        }

        return items;
    }

    private String formatLabel(String segment) {
        return segment.substring(0, 1).toUpperCase() +
               segment.substring(1).replace("-", " ");
    }
}
```

### With Custom Renderer

```java
Breadcrumb breadcrumb = new Breadcrumb();

breadcrumb.setRenderer(item -> {
    if (item.hasProperty("icon")) {
        Icon icon = new Icon(item.getProperty("icon"));
        Span label = new Span(item.getLabel());
        return new HorizontalLayout(icon, label);
    }
    return new Span(item.getLabel());
});

BreadcrumbItem homeWithIcon = new BreadcrumbItem.Builder()
    .label("Home")
    .href("/")
    .property("icon", "vaadin:home")
    .build();

breadcrumb.setItems(homeWithIcon, ...);
```

## Implementation Plan

### Phase 1: Core Flow Component

**Priority: MUST HAVE**

Matches the web component's Phase 1 functionality with Java API.

#### Package Structure

```
vaadin-breadcrumb-flow-parent/
├── vaadin-breadcrumb-flow/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/vaadin/flow/component/breadcrumb/
│   │   │   │       ├── Breadcrumb.java
│   │   │   │       ├── BreadcrumbItem.java
│   │   │   │       ├── BreadcrumbItemClickEvent.java
│   │   │   │       └── BreadcrumbVariant.java
│   │   │   └── resources/
│   │   │       └── META-INF/
│   │   │           └── resources/
│   │   │               └── frontend/
│   │   └── test/
│   │       └── java/
│   │           └── com/vaadin/flow/component/breadcrumb/
│   │               ├── BreadcrumbTest.java
│   │               └── BreadcrumbItemTest.java
│   └── pom.xml
├── vaadin-breadcrumb-flow-integration-tests/
└── pom.xml
```

#### Class Implementation

##### Breadcrumb.java

```java
package com.vaadin.flow.component.breadcrumb;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.ComponentEvent;
import com.vaadin.flow.component.ComponentEventListener;
import com.vaadin.flow.component.DomEvent;
import com.vaadin.flow.component.HasSize;
import com.vaadin.flow.component.HasStyle;
import com.vaadin.flow.component.Synchronize;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.NpmPackage;
import com.vaadin.flow.shared.Registration;
import tools.jackson.databind.JsonNode;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

/**
 * Breadcrumb is a navigation component that shows the user's location
 * in an application's hierarchical structure.
 *
 * <p>
 * Example usage:
 * <pre>{@code
 * Breadcrumb breadcrumb = new Breadcrumb();
 * breadcrumb.setItems(
 *     new BreadcrumbItem("Home", "/"),
 *     new BreadcrumbItem("Products", "/products"),
 *     new BreadcrumbItem("Current Page")
 * );
 * }</pre>
 *
 * @see BreadcrumbItem
 */
@Tag("vaadin-breadcrumb")
@NpmPackage(value = "@vaadin/breadcrumb", version = "25.0.0")
@JsModule("@vaadin/breadcrumb/vaadin-breadcrumb.js")
public class Breadcrumb extends Component
        implements HasSize, HasStyle, HasTheme {

    private List<BreadcrumbItem> items = new ArrayList<>();
    private BreadcrumbItemRenderer renderer;

    /**
     * Creates an empty breadcrumb component.
     */
    public Breadcrumb() {
        setAriaLabel("Breadcrumbs");
    }

    /**
     * Creates a breadcrumb component with the given items.
     *
     * @param items the breadcrumb items
     */
    public Breadcrumb(BreadcrumbItem... items) {
        this();
        setItems(items);
    }

    /**
     * Creates a breadcrumb component with the given items.
     *
     * @param items the breadcrumb items
     */
    public Breadcrumb(Collection<BreadcrumbItem> items) {
        this();
        setItems(items);
    }

    /**
     * Gets the breadcrumb items.
     *
     * @return the breadcrumb items
     */
    @Synchronize(property = "items", value = "items-changed")
    public List<BreadcrumbItem> getItems() {
        return new ArrayList<>(items);
    }

    /**
     * Sets the breadcrumb items.
     *
     * @param items the breadcrumb items
     */
    public void setItems(BreadcrumbItem... items) {
        setItems(Arrays.asList(items));
    }

    /**
     * Sets the breadcrumb items.
     *
     * @param items the breadcrumb items
     */
    public void setItems(Collection<BreadcrumbItem> items) {
        Objects.requireNonNull(items, "Items cannot be null");
        this.items = new ArrayList<>(items);
        getElement().setPropertyJson("items", itemsToJson(this.items));
    }

    /**
     * Adds an item to the breadcrumb.
     *
     * @param item the item to add
     */
    public void addItem(BreadcrumbItem item) {
        Objects.requireNonNull(item, "Item cannot be null");
        items.add(item);
        getElement().setPropertyJson("items", itemsToJson(items));
    }

    /**
     * Removes an item from the breadcrumb.
     *
     * @param item the item to remove
     * @return true if the item was removed, false otherwise
     */
    public boolean removeItem(BreadcrumbItem item) {
        boolean removed = items.remove(item);
        if (removed) {
            getElement().setPropertyJson("items", itemsToJson(items));
        }
        return removed;
    }

    /**
     * Removes all items from the breadcrumb.
     */
    public void removeAll() {
        items.clear();
        getElement().setPropertyJson("items", itemsToJson(items));
    }

    /**
     * Gets whether the current page is shown in the breadcrumb.
     *
     * @return true if current page is shown, false otherwise
     */
    @Synchronize(property = "showCurrentPage", value = "show-current-page-changed")
    public boolean isShowCurrentPage() {
        return getElement().getProperty("showCurrentPage", true);
    }

    /**
     * Sets whether to show the current page in the breadcrumb.
     *
     * @param showCurrentPage true to show current page, false otherwise
     */
    public void setShowCurrentPage(boolean showCurrentPage) {
        getElement().setProperty("showCurrentPage", showCurrentPage);
    }

    /**
     * Gets the ARIA label of the breadcrumb navigation.
     *
     * @return the ARIA label
     */
    public String getAriaLabel() {
        return getElement().getProperty("ariaLabel", "Breadcrumbs");
    }

    /**
     * Sets the ARIA label of the breadcrumb navigation.
     *
     * @param ariaLabel the ARIA label
     */
    public void setAriaLabel(String ariaLabel) {
        getElement().setProperty("ariaLabel", ariaLabel);
    }

    /**
     * Gets the overflow handling strategy.
     *
     * @return the overflow strategy
     */
    public OverflowMode getOverflow() {
        String value = getElement().getProperty("overflow", "wrap");
        return OverflowMode.valueOf(value.toUpperCase());
    }

    /**
     * Sets the overflow handling strategy.
     *
     * @param overflow the overflow strategy
     */
    public void setOverflow(OverflowMode overflow) {
        Objects.requireNonNull(overflow, "Overflow cannot be null");
        getElement().setProperty("overflow", overflow.name().toLowerCase());
    }

    /**
     * Sets a custom separator for the breadcrumb.
     *
     * @param separator the separator text
     */
    public void setSeparator(String separator) {
        Objects.requireNonNull(separator, "Separator cannot be null");
        getElement().setText(separator);
        getElement().setAttribute("slot", "separator");
    }

    /**
     * Sets a custom separator component for the breadcrumb.
     *
     * @param separator the separator component
     */
    public void setSeparator(Component separator) {
        Objects.requireNonNull(separator, "Separator cannot be null");
        separator.getElement().setAttribute("slot", "separator");
        getElement().appendChild(separator.getElement());
    }

    /**
     * Sets a custom renderer for breadcrumb items.
     *
     * @param renderer the renderer
     */
    public void setRenderer(BreadcrumbItemRenderer renderer) {
        this.renderer = renderer;
        if (renderer != null) {
            getElement().setProperty("renderer",
                createRendererFunction(renderer));
        } else {
            getElement().removeProperty("renderer");
        }
    }

    /**
     * Gets the custom renderer for breadcrumb items.
     *
     * @return the renderer, or null if not set
     */
    public BreadcrumbItemRenderer getRenderer() {
        return renderer;
    }

    /**
     * Adds a listener for breadcrumb item click events.
     *
     * @param listener the listener
     * @return a registration for removing the listener
     */
    public Registration addItemClickListener(
            ComponentEventListener<BreadcrumbItemClickEvent> listener) {
        return addListener(BreadcrumbItemClickEvent.class, listener);
    }

    private JsonNode itemsToJson(List<BreadcrumbItem> items) {
        // Implementation using Jackson 3
        return JsonNodeFactory.instance.arrayNode().addAll(
            items.stream()
                .map(BreadcrumbItem::toJson)
                .collect(Collectors.toList())
        );
    }

    private String createRendererFunction(BreadcrumbItemRenderer renderer) {
        // Create client-side renderer function
        return "function(item, element) { /* renderer implementation */ }";
    }

    /**
     * Overflow handling strategies for breadcrumb items.
     */
    public enum OverflowMode {
        /**
         * Wrap items to multiple lines.
         */
        WRAP,

        /**
         * Enable horizontal scrolling.
         */
        SCROLL,

        /**
         * Truncate item text with ellipsis.
         */
        ELLIPSIS,

        /**
         * Collapse middle items into a dropdown menu.
         */
        DROPDOWN
    }
}
```

##### BreadcrumbItem.java

```java
package com.vaadin.flow.component.breadcrumb;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.node.JsonNodeFactory;
import tools.jackson.databind.node.ObjectNode;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Represents an item in a breadcrumb navigation.
 */
public class BreadcrumbItem implements Serializable {

    private String label;
    private String href;
    private String path;
    private boolean disabled;
    private Map<String, Object> properties = new HashMap<>();

    /**
     * Creates an empty breadcrumb item.
     */
    public BreadcrumbItem() {
    }

    /**
     * Creates a breadcrumb item with the given label.
     *
     * @param label the item label
     */
    public BreadcrumbItem(String label) {
        this.label = Objects.requireNonNull(label, "Label cannot be null");
    }

    /**
     * Creates a breadcrumb item with the given label and href.
     *
     * @param label the item label
     * @param href the item URL
     */
    public BreadcrumbItem(String label, String href) {
        this(label);
        this.href = href;
    }

    /**
     * Gets the label of the breadcrumb item.
     *
     * @return the label
     */
    public String getLabel() {
        return label;
    }

    /**
     * Sets the label of the breadcrumb item.
     *
     * @param label the label
     */
    public void setLabel(String label) {
        this.label = Objects.requireNonNull(label, "Label cannot be null");
    }

    /**
     * Gets the href URL of the breadcrumb item.
     *
     * @return the href, or null if not set
     */
    public String getHref() {
        return href;
    }

    /**
     * Sets the href URL of the breadcrumb item.
     *
     * @param href the href
     */
    public void setHref(String href) {
        this.href = href;
    }

    /**
     * Gets the router path of the breadcrumb item.
     *
     * @return the path, or null if not set
     */
    public String getPath() {
        return path;
    }

    /**
     * Sets the router path of the breadcrumb item.
     *
     * @param path the path
     */
    public void setPath(String path) {
        this.path = path;
    }

    /**
     * Gets whether the breadcrumb item is disabled.
     *
     * @return true if disabled, false otherwise
     */
    public boolean isDisabled() {
        return disabled;
    }

    /**
     * Sets whether the breadcrumb item is disabled.
     *
     * @param disabled true to disable, false otherwise
     */
    public void setDisabled(boolean disabled) {
        this.disabled = disabled;
    }

    /**
     * Sets a custom property on the breadcrumb item.
     *
     * @param key the property key
     * @param value the property value
     */
    public void setProperty(String key, Object value) {
        Objects.requireNonNull(key, "Key cannot be null");
        properties.put(key, value);
    }

    /**
     * Gets a custom property from the breadcrumb item.
     *
     * @param key the property key
     * @return the property value, or null if not set
     */
    public Object getProperty(String key) {
        return properties.get(key);
    }

    /**
     * Gets whether the item has a custom property.
     *
     * @param key the property key
     * @return true if the property exists, false otherwise
     */
    public boolean hasProperty(String key) {
        return properties.containsKey(key);
    }

    /**
     * Converts the item to a JSON representation.
     *
     * @return the JSON node
     */
    JsonNode toJson() {
        ObjectNode node = JsonNodeFactory.instance.objectNode();
        node.put("label", label);

        if (href != null) {
            node.put("href", href);
        }
        if (path != null) {
            node.put("path", path);
        }
        if (disabled) {
            node.put("disabled", true);
        }

        properties.forEach((key, value) -> {
            if (value instanceof String) {
                node.put(key, (String) value);
            } else if (value instanceof Number) {
                node.put(key, ((Number) value).doubleValue());
            } else if (value instanceof Boolean) {
                node.put(key, (Boolean) value);
            }
        });

        return node;
    }

    /**
     * Builder for creating breadcrumb items.
     */
    public static class Builder {
        private final BreadcrumbItem item = new BreadcrumbItem();

        /**
         * Sets the label.
         *
         * @param label the label
         * @return this builder
         */
        public Builder label(String label) {
            item.setLabel(label);
            return this;
        }

        /**
         * Sets the href URL.
         *
         * @param href the href
         * @return this builder
         */
        public Builder href(String href) {
            item.setHref(href);
            return this;
        }

        /**
         * Sets the router path.
         *
         * @param path the path
         * @return this builder
         */
        public Builder path(String path) {
            item.setPath(path);
            return this;
        }

        /**
         * Sets whether the item is disabled.
         *
         * @param disabled true to disable, false otherwise
         * @return this builder
         */
        public Builder disabled(boolean disabled) {
            item.setDisabled(disabled);
            return this;
        }

        /**
         * Sets a custom property.
         *
         * @param key the property key
         * @param value the property value
         * @return this builder
         */
        public Builder property(String key, Object value) {
            item.setProperty(key, value);
            return this;
        }

        /**
         * Builds the breadcrumb item.
         *
         * @return the breadcrumb item
         */
        public BreadcrumbItem build() {
            if (item.getLabel() == null) {
                throw new IllegalStateException("Label is required");
            }
            return item;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BreadcrumbItem that = (BreadcrumbItem) o;
        return disabled == that.disabled &&
                Objects.equals(label, that.label) &&
                Objects.equals(href, that.href) &&
                Objects.equals(path, that.path) &&
                Objects.equals(properties, that.properties);
    }

    @Override
    public int hashCode() {
        return Objects.hash(label, href, path, disabled, properties);
    }

    @Override
    public String toString() {
        return "BreadcrumbItem{" +
                "label='" + label + '\'' +
                ", href='" + href + '\'' +
                ", path='" + path + '\'' +
                ", disabled=" + disabled +
                ", properties=" + properties +
                '}';
    }
}
```

##### BreadcrumbItemClickEvent.java

```java
package com.vaadin.flow.component.breadcrumb;

import com.vaadin.flow.component.ComponentEvent;
import com.vaadin.flow.component.DomEvent;
import com.vaadin.flow.component.EventData;

/**
 * Event fired when a breadcrumb item is clicked.
 */
@DomEvent("breadcrumb-item-click")
public class BreadcrumbItemClickEvent extends ComponentEvent<Breadcrumb> {

    private final BreadcrumbItem item;
    private final int index;

    /**
     * Creates a new breadcrumb item click event.
     *
     * @param source the source component
     * @param fromClient whether the event originated from the client
     * @param itemJson the clicked item as JSON
     * @param index the index of the clicked item
     */
    public BreadcrumbItemClickEvent(
            Breadcrumb source,
            boolean fromClient,
            @EventData("event.detail.item") String itemJson,
            @EventData("event.detail.index") int index) {
        super(source, fromClient);
        this.item = parseItem(itemJson);
        this.index = index;
    }

    /**
     * Gets the clicked breadcrumb item.
     *
     * @return the item
     */
    public BreadcrumbItem getItem() {
        return item;
    }

    /**
     * Gets the index of the clicked item.
     *
     * @return the index
     */
    public int getIndex() {
        return index;
    }

    private BreadcrumbItem parseItem(String json) {
        // Parse JSON to BreadcrumbItem using Jackson 3
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(json);

            BreadcrumbItem item = new BreadcrumbItem();
            item.setLabel(node.get("label").asText());

            if (node.has("href")) {
                item.setHref(node.get("href").asText());
            }
            if (node.has("path")) {
                item.setPath(node.get("path").asText());
            }
            if (node.has("disabled")) {
                item.setDisabled(node.get("disabled").asBoolean());
            }

            return item;
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to parse item", e);
        }
    }
}
```

##### BreadcrumbItemRenderer.java

```java
package com.vaadin.flow.component.breadcrumb;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.function.SerializableFunction;

/**
 * Functional interface for rendering breadcrumb items.
 */
@FunctionalInterface
public interface BreadcrumbItemRenderer
        extends SerializableFunction<BreadcrumbItem, Component> {

    /**
     * Renders the given breadcrumb item.
     *
     * @param item the item to render
     * @return the rendered component
     */
    @Override
    Component apply(BreadcrumbItem item);
}
```

##### BreadcrumbVariant.java

```java
package com.vaadin.flow.component.breadcrumb;

/**
 * Theme variants for the Breadcrumb component.
 */
public enum BreadcrumbVariant {
    /**
     * Compact variant with reduced spacing.
     */
    LUMO_COMPACT("compact"),

    /**
     * Small size variant.
     */
    LUMO_SMALL("small"),

    /**
     * Primary color variant.
     */
    LUMO_PRIMARY("primary");

    private final String variant;

    BreadcrumbVariant(String variant) {
        this.variant = variant;
    }

    /**
     * Gets the theme variant name.
     *
     * @return the variant name
     */
    public String getVariantName() {
        return variant;
    }
}
```

### Phase 2: Router Integration

**Priority: SHOULD HAVE**

Automatic breadcrumb generation from Vaadin Router.

#### Features

1. **Automatic Route Detection**
   - Generate breadcrumbs from current route
   - Use @PageTitle annotations for labels
   - Handle route parameters

2. **RouteConfiguration Integration**
   - Map routes to breadcrumb labels
   - Support for nested routes
   - Programmatic route mapping

3. **BeforeEnterObserver Support**
   - Update breadcrumbs on navigation
   - Access to route parameters
   - Integration with MainLayout

#### API Additions

```java
public class Breadcrumb extends Component {

    /**
     * Enables automatic breadcrumb generation from the current route.
     *
     * @param autoGenerate true to enable, false to disable
     */
    public void setAutoGenerateFromRoute(boolean autoGenerate) {
        // Implementation
    }

    /**
     * Gets whether automatic route generation is enabled.
     *
     * @return true if enabled, false otherwise
     */
    public boolean isAutoGenerateFromRoute() {
        // Implementation
        return false;
    }

    /**
     * Adds a route mapping for breadcrumb generation.
     *
     * @param route the route path
     * @param label the breadcrumb label
     */
    public void addRouteMapping(String route, String label) {
        // Implementation
    }

    /**
     * Removes a route mapping.
     *
     * @param route the route path
     */
    public void removeRouteMapping(String route) {
        // Implementation
    }

    /**
     * Gets all route mappings.
     *
     * @return the route mappings
     */
    public Map<String, String> getRouteMappings() {
        // Implementation
        return new HashMap<>();
    }
}
```

### Phase 3: Advanced Features

**Priority: COULD HAVE**

Additional features for complex scenarios.

#### Features

1. **Data Provider Integration**
   - Lazy loading of breadcrumb items
   - Integration with backend services
   - Caching support

2. **Localization Support**
   - I18N provider integration
   - Dynamic label translation
   - RTL support

3. **Advanced Theming**
   - Custom theme variants
   - Style API for programmatic styling

## Testing Strategy

### Unit Tests

```java
@Test
public void setItems_itemsAreSet() {
    Breadcrumb breadcrumb = new Breadcrumb();
    BreadcrumbItem item1 = new BreadcrumbItem("Home", "/");
    BreadcrumbItem item2 = new BreadcrumbItem("Products");

    breadcrumb.setItems(item1, item2);

    List<BreadcrumbItem> items = breadcrumb.getItems();
    assertEquals(2, items.size());
    assertEquals("Home", items.get(0).getLabel());
    assertEquals("/", items.get(0).getHref());
}

@Test
public void addItem_itemIsAdded() {
    Breadcrumb breadcrumb = new Breadcrumb();
    BreadcrumbItem item = new BreadcrumbItem("Home", "/");

    breadcrumb.addItem(item);

    assertEquals(1, breadcrumb.getItems().size());
}

@Test
public void removeItem_itemIsRemoved() {
    Breadcrumb breadcrumb = new Breadcrumb();
    BreadcrumbItem item = new BreadcrumbItem("Home", "/");
    breadcrumb.addItem(item);

    boolean removed = breadcrumb.removeItem(item);

    assertTrue(removed);
    assertEquals(0, breadcrumb.getItems().size());
}

@Test
public void itemClickListener_eventIsFired() {
    Breadcrumb breadcrumb = new Breadcrumb();
    AtomicReference<BreadcrumbItemClickEvent> eventRef = new AtomicReference<>();

    breadcrumb.addItemClickListener(eventRef::set);

    // Simulate client-side event
    // fireItemClickEvent(breadcrumb, 0);

    assertNotNull(eventRef.get());
}
```

### Integration Tests

```java
@Test
public void breadcrumb_rendersCorrectly() {
    Breadcrumb breadcrumb = new Breadcrumb(
        new BreadcrumbItem("Home", "/"),
        new BreadcrumbItem("Products", "/products"),
        new BreadcrumbItem("Current")
    );

    add(breadcrumb);

    // Verify rendering with TestBench
    BreadcrumbElement element = $(BreadcrumbElement.class).first();
    assertEquals(3, element.getItems().size());
}
```

## Documentation Requirements

### JavaDoc

Complete JavaDoc for all public APIs with examples and cross-references.

### Component Documentation (vaadin.com/docs)

#### Java Examples

**Basic Usage:**
```java
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.setItems(
    new BreadcrumbItem("Home", "/"),
    new BreadcrumbItem("Products", "/products"),
    new BreadcrumbItem("Laptops")
);
```

**Router Integration:**
```java
public class MainLayout extends AppLayout implements BeforeEnterObserver {
    private final Breadcrumb breadcrumb;

    public MainLayout() {
        breadcrumb = new Breadcrumb();
        addToNavbar(breadcrumb);
    }

    @Override
    public void beforeEnter(BeforeEnterEvent event) {
        breadcrumb.setAutoGenerateFromRoute(true);
    }
}
```

### API Reference

Auto-generated from JavaDoc:
- Class documentation
- Method documentation
- Example code snippets
- Related component links

## Best Practices

### 1. Use Type-Safe Builders

```java
BreadcrumbItem item = new BreadcrumbItem.Builder()
    .label("Products")
    .href("/products")
    .build();
```

### 2. Integrate with Router

```java
breadcrumb.setAutoGenerateFromRoute(true);
```

### 3. Handle Events Properly

```java
breadcrumb.addItemClickListener(event -> {
    event.preventDefault(); // Prevent default navigation
    UI.getCurrent().navigate(event.getItem().getHref());
});
```

### 4. Use Constants for Routes

```java
public static final String HOME_ROUTE = "/";
public static final String PRODUCTS_ROUTE = "/products";

breadcrumb.addRouteMapping(HOME_ROUTE, "Home");
breadcrumb.addRouteMapping(PRODUCTS_ROUTE, "Products");
```

### 5. Provide Accessible Labels

```java
breadcrumb.setAriaLabel("Main navigation breadcrumbs");
```

## Performance Considerations

1. **Item Serialization**: Use efficient JSON serialization with Jackson 3
2. **Event Handling**: Minimize server round-trips
3. **Router Integration**: Cache route mappings
4. **Memory Management**: Clean up listeners properly

## Security Considerations

1. **XSS Prevention**: Sanitize item labels if user-generated
2. **CSRF Protection**: Use Vaadin's built-in CSRF protection
3. **URL Validation**: Validate hrefs and paths

## Migration from Web Component

```java
// Before (with LitTemplate)
@Tag("vaadin-breadcrumb")
public class Breadcrumb extends LitTemplate {
    // Manual property binding
}

// After (with Flow component)
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.setItems(items);
```

## Browser Support

Same as underlying web component and Vaadin Flow:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Dependencies

```xml
<dependency>
    <groupId>com.vaadin</groupId>
    <artifactId>vaadin-breadcrumb-flow</artifactId>
    <version>25.0.0</version>
</dependency>
```

## License

Apache License 2.0 (consistent with Vaadin Flow)

## References

- [Vaadin Flow Documentation](https://vaadin.com/docs/latest/flow/overview)
- [Vaadin Router Documentation](https://vaadin.com/docs/latest/routing)
- [Web Component Specification](./Breadcrumb-web-component.md)
- [Vaadin Component Java API Guidelines](https://vaadin.com/docs/latest/contributing/components)
