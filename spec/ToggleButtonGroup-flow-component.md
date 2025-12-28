# ToggleButtonGroup Flow Component Specification

## Overview

The Flow integration for `ToggleButtonGroup` provides a Java API for Vaadin Flow applications, enabling server-side component usage with full type safety, form integration via Binder, and seamless data binding.

## Package Structure

```
com.vaadin.flow.component.togglebuttongroup/
├── src/main/java/com/vaadin/flow/component/togglebuttongroup/
│   ├── ToggleButtonGroup.java
│   ├── ToggleButton.java
│   ├── ToggleButtonGroupVariant.java
│   └── dataview/
│       └── ToggleButtonGroupDataView.java
├── src/main/resources/META-INF/resources/frontend/
│   └── (web component files)
└── src/test/java/com/vaadin/flow/component/togglebuttongroup/
    ├── ToggleButtonGroupTest.java
    └── testbench/
        └── ToggleButtonGroupElement.java
```

## Core API

### `ToggleButtonGroup<T>`

```java
package com.vaadin.flow.component.togglebuttongroup;

import com.vaadin.flow.component.AbstractField;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.HasSize;
import com.vaadin.flow.component.HasStyle;
import com.vaadin.flow.component.HasTheme;
import com.vaadin.flow.component.HasValidation;
import com.vaadin.flow.component.ItemLabelGenerator;
import com.vaadin.flow.data.binder.HasDataProvider;
import com.vaadin.flow.data.binder.HasItemComponents;
import com.vaadin.flow.data.provider.DataProvider;
import com.vaadin.flow.data.provider.ListDataProvider;
import com.vaadin.flow.data.renderer.ComponentRenderer;

/**
 * Server-side component for {@code <vaadin-toggle-button-group>}.
 * <p>
 * ToggleButtonGroup is a component that allows users to toggle between
 * multiple options, either selecting a single option (exclusive mode) or
 * multiple options (non-exclusive mode).
 *
 * @param <T> the type of items in the toggle button group
 */
@Tag("vaadin-toggle-button-group")
@NpmPackage(value = "@vaadin/toggle-button-group", version = "25.0.0")
@JsModule("@vaadin/toggle-button-group/vaadin-toggle-button-group.js")
public class ToggleButtonGroup<T> extends AbstractField<ToggleButtonGroup<T>, T>
        implements HasDataProvider<T>, HasItemComponents<T>, HasSize, HasStyle,
        HasTheme, HasValidation, Focusable<ToggleButtonGroup<T>> {

    /**
     * Creates an empty toggle button group with single selection mode.
     */
    public ToggleButtonGroup();

    /**
     * Creates a toggle button group with the given items and single selection.
     *
     * @param items the items to display
     */
    @SafeVarargs
    public ToggleButtonGroup(T... items);

    /**
     * Sets whether multiple buttons can be selected simultaneously.
     * <p>
     * Default is {@code false} (single selection mode).
     *
     * @param multiple {@code true} for multiple selection, {@code false} for single
     */
    public void setMultiple(boolean multiple);

    /**
     * Gets whether multiple selection is enabled.
     *
     * @return {@code true} if multiple selection is enabled
     */
    public boolean isMultiple();

    /**
     * Sets the selected value.
     * <p>
     * In single selection mode, this sets the selected item.
     * In multiple selection mode, use {@link #setSelectedItems(Set)} instead.
     *
     * @param value the item to select
     */
    @Override
    public void setValue(T value);

    /**
     * Gets the selected value.
     * <p>
     * In single selection mode, returns the selected item or {@code null}.
     * In multiple selection mode, returns the first selected item or {@code null}.
     *
     * @return the selected value
     */
    @Override
    public T getValue();

    /**
     * Sets the selected items (multiple selection mode only).
     *
     * @param items the items to select
     * @throws IllegalStateException if not in multiple selection mode
     */
    public void setSelectedItems(Set<T> items);

    /**
     * Gets the currently selected items.
     *
     * @return the selected items (empty set if none selected)
     */
    public Set<T> getSelectedItems();

    /**
     * Sets the orientation of the button group.
     *
     * @param orientation the orientation (HORIZONTAL or VERTICAL)
     */
    public void setOrientation(Orientation orientation);

    /**
     * Gets the current orientation.
     *
     * @return the orientation
     */
    public Orientation getOrientation();

    /**
     * Sets whether the component is read-only.
     *
     * @param readOnly {@code true} to make read-only
     */
    public void setReadOnly(boolean readOnly);

    /**
     * Gets whether the component is read-only.
     *
     * @return {@code true} if read-only
     */
    public boolean isReadOnly();

    /**
     * Sets the data provider for this toggle button group.
     *
     * @param dataProvider the data provider
     */
    public void setDataProvider(DataProvider<T, ?> dataProvider);

    /**
     * Sets the items of this toggle button group.
     *
     * @param items the items to display
     */
    public void setItems(Collection<T> items);

    /**
     * Sets the items of this toggle button group.
     *
     * @param items the items to display
     */
    @SafeVarargs
    public final void setItems(T... items);

    /**
     * Sets the item label generator for converting items to their string
     * representation.
     *
     * @param itemLabelGenerator the item label generator
     */
    public void setItemLabelGenerator(ItemLabelGenerator<T> itemLabelGenerator);

    /**
     * Sets the renderer for generating button content.
     *
     * @param renderer the component renderer
     */
    public void setRenderer(ComponentRenderer<? extends Component, T> renderer);

    /**
     * Sets whether at least one option must be selected.
     *
     * @param required {@code true} to require selection
     */
    public void setRequiredIndicatorVisible(boolean required);

    /**
     * Gets whether at least one option must be selected.
     *
     * @return {@code true} if selection is required
     */
    public boolean isRequiredIndicatorVisible();

    /**
     * Sets the invalid state of the component.
     *
     * @param invalid {@code true} to mark as invalid
     */
    @Override
    public void setInvalid(boolean invalid);

    /**
     * Gets whether the component is in invalid state.
     *
     * @return {@code true} if invalid
     */
    @Override
    public boolean isInvalid();

    /**
     * Sets the error message to display when validation fails.
     *
     * @param errorMessage the error message
     */
    @Override
    public void setErrorMessage(String errorMessage);

    /**
     * Gets the current error message.
     *
     * @return the error message
     */
    @Override
    public String getErrorMessage();

    /**
     * Adds a selection listener that is called when the selection changes.
     *
     * @param listener the listener
     * @return a registration for removing the listener
     */
    public Registration addValueChangeListener(
            ValueChangeListener<? super ComponentValueChangeEvent<ToggleButtonGroup<T>, T>> listener);

    /**
     * Adds a listener that is called when validation state changes.
     *
     * @param listener the listener
     * @return a registration for removing the listener
     */
    public Registration addValidationStatusChangeListener(
            ValidationStatusChangeListener<ToggleButtonGroup<T>> listener);
}
```

### Supporting Types

```java
/**
 * Orientation for toggle button group layout.
 */
public enum Orientation {
    HORIZONTAL,
    VERTICAL
}

/**
 * Theme variants for ToggleButtonGroup.
 */
public enum ToggleButtonGroupVariant {
    LUMO_SMALL("small"),
    LUMO_LARGE("large"),
    LUMO_PRIMARY("primary"),
    LUMO_SUCCESS("success"),
    LUMO_ERROR("error"),
    LUMO_CONTRAST("contrast");

    private final String variantName;

    ToggleButtonGroupVariant(String variantName) {
        this.variantName = variantName;
    }

    public String getVariantName() {
        return variantName;
    }
}
```

## Usage Examples

### Basic Single Selection

```java
// Simple string-based toggle button group
ToggleButtonGroup<String> alignmentGroup = new ToggleButtonGroup<>();
alignmentGroup.setItems("Left", "Center", "Right", "Justify");
alignmentGroup.setValue("Left");

alignmentGroup.addValueChangeListener(event -> {
    String selectedAlignment = event.getValue();
    System.out.println("Alignment changed to: " + selectedAlignment);
});

add(alignmentGroup);
```

### Multiple Selection with Custom Objects

```java
public class TextFormat {
    private final String id;
    private final String label;
    private final VaadinIcon icon;

    public TextFormat(String id, String label, VaadinIcon icon) {
        this.id = id;
        this.label = label;
        this.icon = icon;
    }

    // Getters...
}

// Multiple selection with custom renderer
ToggleButtonGroup<TextFormat> formatGroup = new ToggleButtonGroup<>();
formatGroup.setMultiple(true);

List<TextFormat> formats = List.of(
    new TextFormat("bold", "Bold", VaadinIcon.BOLD),
    new TextFormat("italic", "Italic", VaadinIcon.ITALIC),
    new TextFormat("underline", "Underline", VaadinIcon.UNDERLINE)
);

formatGroup.setItems(formats);
formatGroup.setItemLabelGenerator(TextFormat::getLabel);

// Custom renderer with icon
formatGroup.setRenderer(new ComponentRenderer<>(format -> {
    Icon icon = format.getIcon().create();
    return icon;
}));

formatGroup.addValueChangeListener(event -> {
    Set<TextFormat> selectedFormats = formatGroup.getSelectedItems();
    System.out.println("Selected formats: " +
        selectedFormats.stream()
            .map(TextFormat::getLabel)
            .collect(Collectors.joining(", ")));
});

add(formatGroup);
```

### View Switcher with Enums

```java
public enum ViewMode {
    LIST("List View", VaadinIcon.LIST),
    GRID("Grid View", VaadinIcon.GRID),
    CHART("Chart View", VaadinIcon.CHART);

    private final String label;
    private final VaadinIcon icon;

    ViewMode(String label, VaadinIcon icon) {
        this.label = label;
        this.icon = icon;
    }

    public String getLabel() { return label; }
    public VaadinIcon getIcon() { return icon; }
}

ToggleButtonGroup<ViewMode> viewSwitcher = new ToggleButtonGroup<>();
viewSwitcher.setItems(ViewMode.values());
viewSwitcher.setValue(ViewMode.GRID);

viewSwitcher.setRenderer(new ComponentRenderer<>(mode -> {
    HorizontalLayout layout = new HorizontalLayout();
    layout.add(mode.getIcon().create(), new Text(mode.getLabel()));
    return layout;
}));

viewSwitcher.addValueChangeListener(event -> {
    ViewMode newMode = event.getValue();
    switchView(newMode);
});
```

### Vertical Orientation for Filters

```java
ToggleButtonGroup<String> filterGroup = new ToggleButtonGroup<>();
filterGroup.setOrientation(Orientation.VERTICAL);
filterGroup.setMultiple(true);
filterGroup.setItems("In Stock", "Free Shipping", "On Sale", "New Arrivals");

filterGroup.addValueChangeListener(event -> {
    Set<String> activeFilters = filterGroup.getSelectedItems();
    applyFilters(activeFilters);
});

Div sidebar = new Div();
sidebar.add(new H3("Filters"), filterGroup);
add(sidebar);
```

### With Theme Variants

```java
// Small size variant
ToggleButtonGroup<String> smallGroup = new ToggleButtonGroup<>();
smallGroup.addThemeVariants(ToggleButtonGroupVariant.LUMO_SMALL);
smallGroup.setItems("Option 1", "Option 2", "Option 3");

// Primary color variant
ToggleButtonGroup<String> primaryGroup = new ToggleButtonGroup<>();
primaryGroup.addThemeVariants(ToggleButtonGroupVariant.LUMO_PRIMARY);
primaryGroup.setItems("Yes", "No", "Maybe");

// Combined variants
ToggleButtonGroup<String> priorityGroup = new ToggleButtonGroup<>();
priorityGroup.addThemeVariants(
    ToggleButtonGroupVariant.LUMO_SMALL,
    ToggleButtonGroupVariant.LUMO_ERROR
);
priorityGroup.setItems("Low", "Medium", "High");
```

### Form Integration with Binder

```java
public class EditorSettings {
    private String textAlignment;
    private Set<String> textFormats;

    // Getters and setters...
}

EditorSettings settings = new EditorSettings();
Binder<EditorSettings> binder = new Binder<>(EditorSettings.class);

// Single selection binding
ToggleButtonGroup<String> alignmentGroup = new ToggleButtonGroup<>();
alignmentGroup.setItems("Left", "Center", "Right");

binder.forField(alignmentGroup)
    .asRequired("Text alignment is required")
    .bind(EditorSettings::getTextAlignment, EditorSettings::setTextAlignment);

// Multiple selection binding (requires converter)
ToggleButtonGroup<String> formatGroup = new ToggleButtonGroup<>();
formatGroup.setMultiple(true);
formatGroup.setItems("Bold", "Italic", "Underline");

binder.forField(formatGroup)
    .withConverter(
        // Convert from single value (for compatibility) to Set
        value -> formatGroup.getSelectedItems(),
        set -> set.isEmpty() ? null : set.iterator().next()
    )
    .bind(
        EditorSettings::getTextFormats,
        EditorSettings::setTextFormats
    );

// Alternative: Direct binding with custom getter/setter
binder.bind(formatGroup,
    bean -> {
        Set<String> formats = bean.getTextFormats();
        return formats == null || formats.isEmpty() ? null : formats.iterator().next();
    },
    (bean, value) -> bean.setTextFormats(formatGroup.getSelectedItems())
);
```

### With Validation

```java
ToggleButtonGroup<String> categoryGroup = new ToggleButtonGroup<>();
categoryGroup.setItems("Electronics", "Clothing", "Books", "Home & Garden");
categoryGroup.setRequiredIndicatorVisible(true);
categoryGroup.setErrorMessage("Please select a category");

Binder<Product> binder = new Binder<>(Product.class);

binder.forField(categoryGroup)
    .asRequired("Category selection is required")
    .bind(Product::getCategory, Product::setCategory);

Button saveButton = new Button("Save", event -> {
    if (binder.validate().isOk()) {
        // Save product
        Product product = new Product();
        binder.writeBeanIfValid(product);
        saveProduct(product);
    }
});
```

### Dynamic Items with Data Provider

```java
public class Category {
    private Long id;
    private String name;
    private boolean enabled;

    // Constructor, getters, setters...
}

// Using ListDataProvider
List<Category> categories = categoryService.findAll();
ListDataProvider<Category> dataProvider =
    DataProvider.ofCollection(categories);

ToggleButtonGroup<Category> categoryGroup = new ToggleButtonGroup<>();
categoryGroup.setDataProvider(dataProvider);
categoryGroup.setItemLabelGenerator(Category::getName);

// Filter disabled categories
dataProvider.setFilter(Category::isEnabled);

// Update items dynamically
categoryService.addCategory(new Category(5L, "Sports", true));
dataProvider.refreshAll();
```

### Icon-Only Buttons

```java
ToggleButtonGroup<String> iconGroup = new ToggleButtonGroup<>();
iconGroup.setItems("list", "grid", "chart");

iconGroup.setRenderer(new ComponentRenderer<>(viewType -> {
    Icon icon = switch (viewType) {
        case "list" -> VaadinIcon.LIST.create();
        case "grid" -> VaadinIcon.GRID.create();
        case "chart" -> VaadinIcon.CHART.create();
        default -> new Icon();
    };
    icon.getElement().setAttribute("aria-label",
        viewType.substring(0, 1).toUpperCase() + viewType.substring(1) + " View");
    return icon;
}));
```

### Disabled State

```java
// Disable entire group
ToggleButtonGroup<String> group = new ToggleButtonGroup<>();
group.setItems("Option 1", "Option 2", "Option 3");
group.setEnabled(false);

// Read-only mode (shows selection but prevents changes)
ToggleButtonGroup<String> readOnlyGroup = new ToggleButtonGroup<>();
readOnlyGroup.setItems("Yes", "No");
readOnlyGroup.setValue("Yes");
readOnlyGroup.setReadOnly(true);
```

### Conditional Selection Logic

```java
ToggleButtonGroup<String> modeGroup = new ToggleButtonGroup<>();
modeGroup.setItems("Beginner", "Intermediate", "Advanced", "Expert");

modeGroup.addValueChangeListener(event -> {
    String selectedMode = event.getValue();

    if ("Expert".equals(selectedMode)) {
        ConfirmDialog dialog = new ConfirmDialog();
        dialog.setHeader("Confirm Expert Mode");
        dialog.setText("Expert mode enables advanced features. Continue?");
        dialog.setCancelable(true);
        dialog.setConfirmText("Yes");
        dialog.setCancelText("No");

        dialog.addConfirmListener(confirmEvent -> {
            enableExpertFeatures();
        });

        dialog.addCancelListener(cancelEvent -> {
            // Revert to previous value
            modeGroup.setValue(event.getOldValue());
        });

        dialog.open();
    }
});
```

## Binder Integration Patterns

### Basic Field Binding

```java
public class UserPreferences {
    private String theme;
    private Set<String> enabledFeatures;

    // Getters and setters...
}

Binder<UserPreferences> binder = new Binder<>(UserPreferences.class);

// Single selection
ToggleButtonGroup<String> themeGroup = new ToggleButtonGroup<>();
themeGroup.setItems("Light", "Dark", "Auto");
binder.forField(themeGroup)
    .bind(UserPreferences::getTheme, UserPreferences::setTheme);

// Multiple selection with custom binding
ToggleButtonGroup<String> featureGroup = new ToggleButtonGroup<>();
featureGroup.setMultiple(true);
featureGroup.setItems("Notifications", "AutoSave", "Analytics", "BetaFeatures");

binder.bind(featureGroup,
    bean -> {
        Set<String> features = bean.getEnabledFeatures();
        // Return null for empty set (Binder convention)
        return features == null || features.isEmpty() ? null : features.iterator().next();
    },
    (bean, value) -> {
        // Get actual selected items from the component
        bean.setEnabledFeatures(featureGroup.getSelectedItems());
    }
);
```

### Validation with Binder

```java
Binder<OrderFilter> binder = new Binder<>(OrderFilter.class);

ToggleButtonGroup<OrderStatus> statusGroup = new ToggleButtonGroup<>();
statusGroup.setItems(OrderStatus.values());
statusGroup.setItemLabelGenerator(OrderStatus::getDisplayName);

binder.forField(statusGroup)
    .asRequired("Please select an order status")
    .withValidator(
        status -> status != OrderStatus.CANCELLED || userHasPermission(),
        "You don't have permission to view cancelled orders"
    )
    .bind(OrderFilter::getStatus, OrderFilter::setStatus);
```

### Cross-Field Validation

```java
Binder<SearchCriteria> binder = new Binder<>(SearchCriteria.class);

ToggleButtonGroup<String> typeGroup = new ToggleButtonGroup<>();
typeGroup.setItems("Product", "Service", "Both");

ToggleButtonGroup<String> categoryGroup = new ToggleButtonGroup<>();
categoryGroup.setItems("Electronics", "Software", "Consulting");

binder.forField(typeGroup)
    .bind(SearchCriteria::getType, SearchCriteria::setType);

binder.forField(categoryGroup)
    .withValidator((category, context) -> {
        String type = typeGroup.getValue();
        if ("Service".equals(type) && "Electronics".equals(category)) {
            return ValidationResult.error("Electronics category not available for services");
        }
        return ValidationResult.ok();
    })
    .bind(SearchCriteria::getCategory, SearchCriteria::setCategory);

// Revalidate category when type changes
typeGroup.addValueChangeListener(e ->
    binder.validate()
);
```

## TestBench Integration

### TestBench Element

```java
package com.vaadin.flow.component.togglebuttongroup.testbench;

import com.vaadin.testbench.TestBenchElement;
import com.vaadin.testbench.elementsbase.Element;
import org.openqa.selenium.By;

import java.util.List;
import java.util.stream.Collectors;

/**
 * TestBench element for {@code <vaadin-toggle-button-group>}.
 */
@Element("vaadin-toggle-button-group")
public class ToggleButtonGroupElement extends TestBenchElement {

    /**
     * Gets all toggle buttons in this group.
     *
     * @return list of toggle button elements
     */
    public List<ToggleButtonElement> getButtons() {
        return $(ToggleButtonElement.class).all();
    }

    /**
     * Gets the currently selected button (single selection mode).
     *
     * @return the selected button element, or null if none selected
     */
    public ToggleButtonElement getSelectedButton() {
        return getButtons().stream()
            .filter(ToggleButtonElement::isSelected)
            .findFirst()
            .orElse(null);
    }

    /**
     * Gets all currently selected buttons (multiple selection mode).
     *
     * @return list of selected button elements
     */
    public List<ToggleButtonElement> getSelectedButtons() {
        return getButtons().stream()
            .filter(ToggleButtonElement::isSelected)
            .collect(Collectors.toList());
    }

    /**
     * Selects a button by its text content.
     *
     * @param text the button text
     */
    public void selectByText(String text) {
        getButtons().stream()
            .filter(btn -> btn.getText().equals(text))
            .findFirst()
            .ifPresent(ToggleButtonElement::click);
    }

    /**
     * Selects a button by its index.
     *
     * @param index the button index (0-based)
     */
    public void selectByIndex(int index) {
        getButtons().get(index).click();
    }

    /**
     * Gets the value of the selected button (text content).
     *
     * @return the selected value, or null if none selected
     */
    public String getSelectedValue() {
        ToggleButtonElement selected = getSelectedButton();
        return selected != null ? selected.getText() : null;
    }

    /**
     * Gets whether the group is in multiple selection mode.
     *
     * @return true if multiple selection is enabled
     */
    public boolean isMultiple() {
        return getPropertyBoolean("multiple");
    }

    /**
     * Gets the orientation of the button group.
     *
     * @return "horizontal" or "vertical"
     */
    public String getOrientation() {
        return getPropertyString("orientation");
    }

    /**
     * Gets whether the group is disabled.
     *
     * @return true if disabled
     */
    public boolean isDisabled() {
        return getPropertyBoolean("disabled");
    }

    /**
     * Gets whether the group is read-only.
     *
     * @return true if read-only
     */
    public boolean isReadOnly() {
        return getPropertyBoolean("readonly");
    }

    /**
     * Gets whether the group is in invalid state.
     *
     * @return true if invalid
     */
    public boolean isInvalid() {
        return getPropertyBoolean("invalid");
    }
}

/**
 * TestBench element for {@code <vaadin-toggle-button>}.
 */
@Element("vaadin-toggle-button")
public class ToggleButtonElement extends TestBenchElement {

    /**
     * Gets whether this button is selected.
     *
     * @return true if selected
     */
    public boolean isSelected() {
        return hasAttribute("selected");
    }

    /**
     * Gets whether this button is disabled.
     *
     * @return true if disabled
     */
    public boolean isDisabled() {
        return getPropertyBoolean("disabled");
    }

    /**
     * Gets the button's value attribute.
     *
     * @return the value
     */
    public String getValue() {
        return getPropertyString("value");
    }
}
```

### TestBench Test Examples

```java
import com.vaadin.flow.component.togglebuttongroup.testbench.ToggleButtonGroupElement;
import com.vaadin.testbench.unit.UIUnitTest;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ToggleButtonGroupTest extends UIUnitTest {

    @Test
    public void selectButton_buttonIsSelected() {
        ToggleButtonGroupElement group = $(ToggleButtonGroupElement.class).first();

        group.selectByText("Option 2");

        assertEquals("Option 2", group.getSelectedValue());
        assertTrue(group.getButtons().get(1).isSelected());
    }

    @Test
    public void multipleSelection_multipleButtonsSelected() {
        ToggleButtonGroupElement group = $(ToggleButtonGroupElement.class).first();
        assertTrue(group.isMultiple());

        group.selectByIndex(0);
        group.selectByIndex(2);

        List<ToggleButtonElement> selected = group.getSelectedButtons();
        assertEquals(2, selected.size());
    }

    @Test
    public void disabledGroup_cannotSelect() {
        ToggleButtonGroupElement group = $(ToggleButtonGroupElement.class).first();
        assertTrue(group.isDisabled());

        group.selectByIndex(0);

        assertNull(group.getSelectedValue());
    }

    @Test
    public void verticalOrientation_hasCorrectAttribute() {
        ToggleButtonGroupElement group = $(ToggleButtonGroupElement.class).first();

        assertEquals("vertical", group.getOrientation());
    }
}
```

## Accessibility Implementation

### ARIA Attributes

The Flow component automatically manages:
- `role="group"` on the container
- `aria-pressed` on individual buttons
- `aria-required` when required indicator is visible
- `aria-invalid` when validation fails
- `aria-disabled` when disabled

### Accessible Labels

```java
// Programmatic label
ToggleButtonGroup<String> group = new ToggleButtonGroup<>();
group.setItems("Option 1", "Option 2");
group.getElement().setAttribute("aria-label", "Selection options");

// Label association
FormLayout form = new FormLayout();
Text label = new Text("Choose alignment:");
label.setId("alignment-label");

ToggleButtonGroup<String> alignmentGroup = new ToggleButtonGroup<>();
alignmentGroup.getElement().setAttribute("aria-labelledby", "alignment-label");

form.add(label, alignmentGroup);
```

## Migration from Community Add-on

### API Differences

**Community Add-on:**
```java
// Old API (conceptual - actual add-on API may differ)
ToggleButtonGroup group = new ToggleButtonGroup();
group.setItems("Option 1", "Option 2", "Option 3");
group.setOrientation(ToggleButtonGroup.Orientation.HORIZONTAL);
group.addValueChangeListener(event -> {
    String value = event.getValue();
});
```

**Official Component:**
```java
// New API
ToggleButtonGroup<String> group = new ToggleButtonGroup<>();
group.setItems("Option 1", "Option 2", "Option 3");
group.setOrientation(Orientation.HORIZONTAL);
group.addValueChangeListener(event -> {
    String value = event.getValue();
});
```

### Key Changes

1. **Generic Type Parameter**: New API is `ToggleButtonGroup<T>` for type safety
2. **Multiple Selection**: New `setMultiple(boolean)` and `getSelectedItems()` methods
3. **Data Provider**: New support for `DataProvider<T, ?>` integration
4. **Renderer**: New `setRenderer(ComponentRenderer)` for custom button content
5. **Validation**: Built-in validation support with `HasValidation` interface
6. **Theme Variants**: Enum-based theme variants instead of string themes

### Migration Steps

1. Update imports to `com.vaadin.flow.component.togglebuttongroup`
2. Add generic type parameter: `ToggleButtonGroup<YourType>`
3. Update `Orientation` enum import
4. Convert custom label generation to `setItemLabelGenerator()`
5. Convert custom button rendering to `setRenderer()`
6. Update validation logic to use `setRequiredIndicatorVisible()` and Binder
7. Replace string-based themes with `ToggleButtonGroupVariant` enum

## Performance Considerations

### Large Item Sets

```java
// Use data provider for large item sets
DataProvider<Category, Void> dataProvider =
    DataProvider.fromCallbacks(
        query -> categoryService.fetch(query.getOffset(), query.getLimit()),
        query -> categoryService.count()
    );

ToggleButtonGroup<Category> categoryGroup = new ToggleButtonGroup<>();
categoryGroup.setDataProvider(dataProvider);
categoryGroup.setItemLabelGenerator(Category::getName);
```

### Lazy Rendering

```java
// Renderer is called only for visible items
ToggleButtonGroup<Product> productGroup = new ToggleButtonGroup<>();
productGroup.setRenderer(new ComponentRenderer<>(product -> {
    // Complex rendering logic
    HorizontalLayout layout = new HorizontalLayout();
    layout.add(
        new Image(product.getImageUrl(), product.getName()),
        new Span(product.getName()),
        new Span(product.getPrice())
    );
    return layout;
}));
```

## Testing Recommendations

### Unit Tests

```java
import com.vaadin.flow.component.togglebuttongroup.ToggleButtonGroup;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ToggleButtonGroupUnitTest {

    @Test
    public void setValue_valueIsSet() {
        ToggleButtonGroup<String> group = new ToggleButtonGroup<>();
        group.setItems("A", "B", "C");

        group.setValue("B");

        assertEquals("B", group.getValue());
    }

    @Test
    public void multipleSelection_selectedItemsReturned() {
        ToggleButtonGroup<String> group = new ToggleButtonGroup<>();
        group.setMultiple(true);
        group.setItems("A", "B", "C");

        group.setSelectedItems(Set.of("A", "C"));

        assertEquals(Set.of("A", "C"), group.getSelectedItems());
    }

    @Test
    public void valueChangeListener_eventFired() {
        ToggleButtonGroup<String> group = new ToggleButtonGroup<>();
        group.setItems("A", "B");

        AtomicReference<String> newValue = new AtomicReference<>();
        group.addValueChangeListener(event -> newValue.set(event.getValue()));

        group.setValue("A");

        assertEquals("A", newValue.get());
    }

    @Test
    public void setMultipleOnSingleMode_throwsException() {
        ToggleButtonGroup<String> group = new ToggleButtonGroup<>();
        group.setMultiple(false);
        group.setItems("A", "B");

        assertThrows(IllegalStateException.class, () ->
            group.setSelectedItems(Set.of("A", "B"))
        );
    }
}
```

## Documentation Plan

### JavaDoc Coverage

Complete JavaDoc for:
- All public classes and interfaces
- All public methods with `@param`, `@return`, `@throws`
- Usage examples in class-level JavaDoc
- `@see` references to related components
- `@since` tags for version tracking

### Component Demo

```java
@Route("toggle-button-group")
public class ToggleButtonGroupView extends Div {

    public ToggleButtonGroupView() {
        createBasicExample();
        createMultipleSelectionExample();
        createVerticalExample();
        createValidationExample();
        createThemeVariantsExample();
    }

    private void createBasicExample() {
        H3 title = new H3("Basic Usage");

        ToggleButtonGroup<String> group = new ToggleButtonGroup<>();
        group.setItems("Option 1", "Option 2", "Option 3");

        Span result = new Span("No selection");
        group.addValueChangeListener(event ->
            result.setText("Selected: " + event.getValue())
        );

        add(title, group, result);
    }

    // Additional examples...
}
```

## Related Components

- `RadioButtonGroup` - Form-based single selection with radio semantics
- `CheckboxGroup` - Form-based multiple selection
- `Button` - Standard action buttons
- `Tabs` - Navigation tabs

## References

- Web Component Specification: `ToggleButtonGroup-web-component.md`
- React Component Specification: `ToggleButtonGroup-react-component.md`
- [Vaadin Flow Components Documentation](https://vaadin.com/docs/latest/components)
- [GitHub Issue #4206](https://github.com/vaadin/web-components/issues/4206)
- [Community Add-on](https://vaadin.com/directory/component/toggle-button-group)
