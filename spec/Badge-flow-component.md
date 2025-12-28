# Badge Flow Component Integration Specification

## Overview

This document outlines the plan for integrating the `<vaadin-badge>` web component into Vaadin Flow (`com.vaadin:vaadin-badge-flow`). The Flow component will provide a Java API that wraps the web component, offering type-safe access to all features while following Vaadin Flow conventions and patterns.

## Repository Context

**Target Repository**: `https://github.com/vaadin/flow-components`

The Flow Components repository contains Java integrations for all Vaadin web components, enabling server-side Java applications built with Vaadin Flow to use web components through a type-safe Java API.

## Goals

1. **Type Safety**: Provide a fully type-safe Java API for the Badge component
2. **Flow Patterns**: Follow established Vaadin Flow patterns and conventions
3. **Ease of Use**: Simple API for common use cases
4. **Flexibility**: Support advanced customization when needed
5. **Documentation**: Comprehensive JavaDoc and usage examples
6. **Testing**: Full test coverage including unit, integration, and UI tests

## Usage Examples

### Basic Usage

```java
import com.vaadin.flow.component.badge.Badge;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.router.Route;

@Route("")
public class MainView extends VerticalLayout {

    public MainView() {
        Badge badge = new Badge("New");
        add(badge);
    }
}
```

### With Theme Variants

```java
public class StatusView extends VerticalLayout {

    public StatusView() {
        Badge newBadge = new Badge("New");
        newBadge.addThemeVariants(BadgeVariant.PRIMARY);

        Badge activeBadge = new Badge("Active");
        activeBadge.addThemeVariants(BadgeVariant.SUCCESS);

        Badge errorBadge = new Badge("Error");
        errorBadge.addThemeVariants(BadgeVariant.ERROR);

        add(newBadge, activeBadge, errorBadge);
    }
}
```

### Multiple Variants

```java
public class CompactBadges extends HorizontalLayout {

    public CompactBadges() {
        Badge smallPillBadge = new Badge("VIP");
        smallPillBadge.addThemeVariants(
            BadgeVariant.PRIMARY,
            BadgeVariant.SMALL,
            BadgeVariant.PILL
        );

        add(smallPillBadge);
    }
}
```

### With Icons

```java
public class VerifiedBadge extends Badge {

    public VerifiedBadge() {
        super("Verified");

        Icon checkIcon = VaadinIcon.CHECK.create();
        checkIcon.getElement().setAttribute("slot", "prefix");

        getElement().appendChild(checkIcon.getElement());
        addThemeVariants(BadgeVariant.SUCCESS);
    }
}
```

### Product Labels

```java
public class ProductBadges extends HorizontalLayout {

    public ProductBadges(Product product) {
        if (product.isNew()) {
            Badge newBadge = new Badge("New");
            newBadge.addThemeVariants(BadgeVariant.PRIMARY);
            add(newBadge);
        }

        if (product.isOnSale()) {
            Badge saleBadge = new Badge("Sale");
            saleBadge.addThemeVariants(BadgeVariant.ERROR);
            add(saleBadge);
        }

        if (!product.isInStock()) {
            Badge outOfStockBadge = new Badge("Out of Stock");
            outOfStockBadge.addThemeVariants(BadgeVariant.CONTRAST);
            add(outOfStockBadge);
        }
    }
}
```

### Tag List with Removal

```java
public class TagList extends HorizontalLayout {

    private final List<String> tags = new ArrayList<>();

    public TagList(String... initialTags) {
        Collections.addAll(tags, initialTags);
        refreshBadges();
    }

    private void refreshBadges() {
        removeAll();

        tags.forEach(tag -> {
            Badge badge = new Badge(tag);
            badge.addThemeVariants(BadgeVariant.PRIMARY, BadgeVariant.PILL);

            Icon closeIcon = VaadinIcon.CLOSE_SMALL.create();
            closeIcon.getElement().setAttribute("slot", "suffix");
            closeIcon.addClickListener(e -> removeTag(tag));
            closeIcon.getStyle().set("cursor", "pointer");

            badge.getElement().appendChild(closeIcon.getElement());
            add(badge);
        });
    }

    public void addTag(String tag) {
        if (!tags.contains(tag)) {
            tags.add(tag);
            refreshBadges();
        }
    }

    public void removeTag(String tag) {
        tags.remove(tag);
        refreshBadges();
    }

    public List<String> getTags() {
        return new ArrayList<>(tags);
    }
}
```

### Status Indicators

```java
public class UserStatus extends HorizontalLayout {

    public enum Status {
        ONLINE, AWAY, OFFLINE
    }

    public UserStatus(String userName, Status status) {
        Badge statusDot = new Badge();
        statusDot.setVariant(BadgeVariant.DOT);

        switch (status) {
            case ONLINE:
                statusDot.addThemeVariants(BadgeVariant.SUCCESS);
                statusDot.setAriaLabel("Online");
                break;
            case AWAY:
                statusDot.addThemeVariants(BadgeVariant.WARNING);
                statusDot.setAriaLabel("Away");
                break;
            case OFFLINE:
                statusDot.addThemeVariants(BadgeVariant.CONTRAST);
                statusDot.setAriaLabel("Offline");
                break;
        }

        Span nameLabel = new Span(userName);

        add(statusDot, nameLabel);
        setAlignItems(Alignment.CENTER);
    }
}
```

### Notification Badge (Phase 2)

```java
public class NotificationButton extends Button {

    private Badge notificationBadge;
    private int count = 0;

    public NotificationButton() {
        super("Notifications");

        notificationBadge = new Badge();
        notificationBadge.addThemeVariants(BadgeVariant.ERROR);
        notificationBadge.getElement().setAttribute("slot", "badge");
        notificationBadge.setMax(99);

        getElement().appendChild(notificationBadge.getElement());
        updateBadge();
    }

    public void setNotificationCount(int count) {
        this.count = count;
        updateBadge();
    }

    public void incrementCount() {
        this.count++;
        updateBadge();
    }

    public void clearNotifications() {
        this.count = 0;
        updateBadge();
    }

    private void updateBadge() {
        notificationBadge.setValue(count);
        notificationBadge.setVisible(count > 0);
    }

    public int getNotificationCount() {
        return count;
    }
}
```

### In Grid Column

```java
public class ProductGrid extends Grid<Product> {

    public ProductGrid() {
        addColumn(Product::getName).setHeader("Name");

        addComponentColumn(product -> {
            Badge statusBadge = new Badge();

            if (product.isInStock()) {
                statusBadge.setText("In Stock");
                statusBadge.addThemeVariants(BadgeVariant.SUCCESS, BadgeVariant.SMALL);
            } else {
                statusBadge.setText("Out of Stock");
                statusBadge.addThemeVariants(BadgeVariant.ERROR, BadgeVariant.SMALL);
            }

            return statusBadge;
        }).setHeader("Status");

        addComponentColumn(product -> {
            HorizontalLayout badges = new HorizontalLayout();

            if (product.isNew()) {
                Badge newBadge = new Badge("New");
                newBadge.addThemeVariants(BadgeVariant.PRIMARY, BadgeVariant.SMALL);
                badges.add(newBadge);
            }

            if (product.isOnSale()) {
                Badge saleBadge = new Badge("Sale");
                saleBadge.addThemeVariants(BadgeVariant.ERROR, BadgeVariant.SMALL);
                badges.add(saleBadge);
            }

            return badges;
        }).setHeader("Labels");
    }
}
```

### Custom Colors (Phase 2)

```java
public class ColoredBadges extends HorizontalLayout {

    public ColoredBadges() {
        for (int i = 1; i <= 7; i++) {
            Badge badge = new Badge("User " + i);
            badge.setColor(i);
            add(badge);
        }
    }
}
```

### With Pulse Animation (Phase 2)

```java
public class LiveBadge extends Badge {

    public LiveBadge() {
        super("LIVE");
        addThemeVariants(BadgeVariant.ERROR);
        setPulse(true);
    }
}
```

### Dynamic Badge Update

```java
public class DynamicBadgeView extends VerticalLayout {

    private Badge countBadge;
    private int count = 0;

    public DynamicBadgeView() {
        countBadge = new Badge();
        countBadge.addThemeVariants(BadgeVariant.PRIMARY);
        countBadge.setValue(count);
        countBadge.setMax(99);

        Button incrementButton = new Button("Increment", e -> {
            count++;
            countBadge.setValue(count);
        });

        Button resetButton = new Button("Reset", e -> {
            count = 0;
            countBadge.setValue(count);
        });

        add(countBadge, new HorizontalLayout(incrementButton, resetButton));
    }
}
```

## Component API

### Phase 1: Core Features

#### Main Class Structure

```java
package com.vaadin.flow.component.badge;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.HasText;
import com.vaadin.flow.component.HasTheme;
import com.vaadin.flow.component.HasStyle;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.NpmPackage;

/**
 * Server-side component for the {@code <vaadin-badge>} web component.
 * <p>
 * Badge is a small visual indicator used to draw attention, display statuses,
 * counts, or labels. It provides a clean, accessible way to highlight
 * information without cluttering the interface.
 * <p>
 * Example usage:
 * <pre>
 * Badge badge = new Badge("New");
 * badge.addThemeVariants(BadgeVariant.PRIMARY);
 * </pre>
 * <p>
 * For status indicators:
 * <pre>
 * Badge statusBadge = new Badge("Active");
 * statusBadge.addThemeVariants(BadgeVariant.SUCCESS, BadgeVariant.SMALL);
 * </pre>
 *
 * @author Vaadin Ltd
 * @since 25.0
 */
@Tag("vaadin-badge")
@NpmPackage(value = "@vaadin/badge", version = "25.0.0")
@JsModule("@vaadin/badge/src/vaadin-badge.js")
public class Badge extends Component implements HasText, HasTheme, HasStyle {

    /**
     * Constructs an empty badge.
     */
    public Badge() {
    }

    /**
     * Constructs a badge with the given text content.
     *
     * @param text the text content
     */
    public Badge(String text) {
        setText(text);
    }

    /**
     * Constructs a badge with the given text content and theme variants.
     *
     * @param text the text content
     * @param variants the theme variants to apply
     */
    public Badge(String text, BadgeVariant... variants) {
        setText(text);
        addThemeVariants(variants);
    }

    /**
     * Sets the text content of this badge.
     *
     * @param text the text content
     */
    @Override
    public void setText(String text) {
        getElement().setText(text);
    }

    /**
     * Gets the text content of this badge.
     *
     * @return the text content
     */
    @Override
    public String getText() {
        return getElement().getText();
    }

    /**
     * Adds theme variants to the badge.
     *
     * @param variants the theme variants to add
     */
    public void addThemeVariants(BadgeVariant... variants) {
        getThemeNames().addAll(
            Stream.of(variants)
                .map(BadgeVariant::getVariantName)
                .collect(Collectors.toList())
        );
    }

    /**
     * Removes theme variants from the badge.
     *
     * @param variants the theme variants to remove
     */
    public void removeThemeVariants(BadgeVariant... variants) {
        getThemeNames().removeAll(
            Stream.of(variants)
                .map(BadgeVariant::getVariantName)
                .collect(Collectors.toList())
        );
    }

    /**
     * Sets the accessible ARIA label for this badge.
     * <p>
     * Use this when the badge has no visible text content,
     * such as with dot variants or icon-only badges.
     *
     * @param ariaLabel the ARIA label
     */
    public void setAriaLabel(String ariaLabel) {
        getElement().setAttribute("aria-label", ariaLabel);
    }

    /**
     * Gets the accessible ARIA label for this badge.
     *
     * @return the ARIA label, or null if not set
     */
    public String getAriaLabel() {
        return getElement().getAttribute("aria-label");
    }

    /**
     * Sets the ID of the element that labels this badge.
     *
     * @param labelledBy the ID of the labeling element
     */
    public void setAriaLabelledBy(String labelledBy) {
        getElement().setAttribute("aria-labelledby", labelledBy);
    }

    /**
     * Gets the ID of the element that labels this badge.
     *
     * @return the ID of the labeling element, or null if not set
     */
    public String getAriaLabelledBy() {
        return getElement().getAttribute("aria-labelledby");
    }

    /**
     * Adds a component to the prefix slot.
     * <p>
     * Prefix components are displayed before the badge's main content,
     * typically used for icons or status indicators.
     *
     * @param component the component to add
     */
    public void addComponentAsFirst(Component component) {
        component.getElement().setAttribute("slot", "prefix");
        getElement().appendChild(component.getElement());
    }

    /**
     * Adds a component to the suffix slot.
     * <p>
     * Suffix components are displayed after the badge's main content,
     * typically used for icons or close buttons.
     *
     * @param component the component to add
     */
    public void addComponentAtEnd(Component component) {
        component.getElement().setAttribute("slot", "suffix");
        getElement().appendChild(component.getElement());
    }
}
```

#### BadgeVariant Enum

```java
package com.vaadin.flow.component.badge;

/**
 * Theme variants for the Badge component.
 *
 * @since 25.0
 */
public enum BadgeVariant {

    /**
     * Primary theme color background.
     */
    PRIMARY("primary"),

    /**
     * Success/positive state (green).
     */
    SUCCESS("success"),

    /**
     * Error/negative state (red).
     */
    ERROR("error"),

    /**
     * Warning state (orange).
     */
    WARNING("warning"),

    /**
     * High contrast (dark on light, light on dark).
     */
    CONTRAST("contrast"),

    /**
     * Reduced size for compact layouts.
     */
    SMALL("small"),

    /**
     * Fully rounded ends (border-radius: 999px).
     */
    PILL("pill"),

    /**
     * Info state (blue) - Phase 2.
     */
    INFO("info"),

    /**
     * Neutral/default state (gray) - Phase 2.
     */
    NEUTRAL("neutral"),

    /**
     * Dot variant (no text, just indicator) - Phase 2.
     */
    DOT("dot");

    private final String variant;

    BadgeVariant(String variant) {
        this.variant = variant;
    }

    /**
     * Gets the variant name used as theme attribute value.
     *
     * @return the variant name
     */
    public String getVariantName() {
        return variant;
    }
}
```

### Phase 2: Enhanced Features

#### Extended Badge Class

```java
/**
 * Sets the color palette index for this badge.
 * <p>
 * Colors 1-7 correspond to the avatar color palette,
 * providing consistent color coding across the application.
 *
 * @param colorIndex the color index (1-7)
 */
public void setColor(int colorIndex) {
    if (colorIndex < 1 || colorIndex > 7) {
        throw new IllegalArgumentException("Color index must be between 1 and 7");
    }
    getElement().setAttribute("color", String.valueOf(colorIndex));
}

/**
 * Gets the color palette index for this badge.
 *
 * @return the color index, or 0 if not set
 */
public int getColor() {
    String color = getElement().getAttribute("color");
    return color != null ? Integer.parseInt(color) : 0;
}

/**
 * Sets whether this badge should pulse to draw attention.
 *
 * @param pulse true to enable pulsing animation
 */
public void setPulse(boolean pulse) {
    getElement().setProperty("pulse", pulse);
}

/**
 * Gets whether this badge is pulsing.
 *
 * @return true if pulsing
 */
public boolean isPulse() {
    return getElement().getProperty("pulse", false);
}

/**
 * Sets the numeric value for this badge.
 * <p>
 * Typically used for notification counts.
 *
 * @param value the numeric value
 */
public void setValue(int value) {
    getElement().setProperty("value", value);
}

/**
 * Gets the numeric value of this badge.
 *
 * @return the numeric value
 */
public int getValue() {
    return getElement().getProperty("value", 0);
}

/**
 * Sets the maximum number to display.
 * <p>
 * When the value exceeds max, the badge will display "max+",
 * for example "99+" when max is 99 and value is 150.
 *
 * @param max the maximum number
 */
public void setMax(int max) {
    getElement().setProperty("max", max);
}

/**
 * Gets the maximum number to display.
 *
 * @return the maximum number
 */
public int getMax() {
    return getElement().getProperty("max", Integer.MAX_VALUE);
}

/**
 * Sets whether the badge is hidden.
 * <p>
 * When hidden, the badge is scaled to 0 with a transform,
 * allowing for smooth show/hide animations.
 *
 * @param hidden true to hide the badge
 */
public void setHidden(boolean hidden) {
    getElement().setProperty("hidden", hidden);
}

/**
 * Gets whether the badge is hidden.
 *
 * @return true if hidden
 */
public boolean isHidden() {
    return getElement().getProperty("hidden", false);
}

/**
 * Sets the variant of this badge.
 *
 * @param variant the variant (STANDARD or DOT)
 */
public void setVariant(BadgeVariant variant) {
    if (variant == BadgeVariant.DOT) {
        getElement().setAttribute("variant", "dot");
    } else {
        getElement().removeAttribute("variant");
    }
}
```

### Phase 3: Advanced Features

```java
/**
 * Sets whether to show the badge when value is 0.
 *
 * @param showZero true to show zero values
 */
public void setShowZero(boolean showZero) {
    getElement().setProperty("showZero", showZero);
}

/**
 * Gets whether the badge shows when value is 0.
 *
 * @return true if showing zero values
 */
public boolean isShowZero() {
    return getElement().getProperty("showZero", false);
}
```

## Implementation Plan

### File Structure

```
vaadin-badge-flow-parent/
├── vaadin-badge-flow/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/vaadin/flow/component/badge/
│   │   │   │       ├── Badge.java
│   │   │   │       └── BadgeVariant.java
│   │   │   └── resources/
│   │   │       └── META-INF/
│   │   │           └── resources/
│   │   │               └── frontend/
│   │   └── test/
│   │       └── java/
│   │           └── com/vaadin/flow/component/badge/
│   │               ├── BadgeTest.java
│   │               └── BadgeIT.java
│   └── pom.xml
├── vaadin-badge-flow-demo/
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── com/vaadin/flow/component/badge/demo/
│   │               └── BadgeView.java
│   └── pom.xml
├── vaadin-badge-testbench/
│   ├── src/
│   │   ├── main/
│   │   │   └── java/
│   │   │       └── com/vaadin/flow/component/badge/testbench/
│   │   │           └── BadgeElement.java
│   │   └── test/
│   │       └── java/
│   │           └── com/vaadin/flow/component/badge/testbench/
│   │               └── BadgeElementIT.java
│   └── pom.xml
└── pom.xml
```

### TestBench Element

```java
package com.vaadin.flow.component.badge.testbench;

import com.vaadin.testbench.TestBenchElement;
import com.vaadin.testbench.elementsbase.Element;

/**
 * TestBench element for the {@code <vaadin-badge>} component.
 */
@Element("vaadin-badge")
public class BadgeElement extends TestBenchElement {

    /**
     * Gets the text content of this badge.
     *
     * @return the text content
     */
    public String getText() {
        return getPropertyString("textContent");
    }

    /**
     * Gets the theme attribute value.
     *
     * @return the theme value
     */
    public String getTheme() {
        return getAttribute("theme");
    }

    /**
     * Checks if the badge has the specified theme variant.
     *
     * @param variant the variant name
     * @return true if the variant is present
     */
    public boolean hasThemeVariant(String variant) {
        String theme = getTheme();
        return theme != null && theme.contains(variant);
    }

    /**
     * Gets the value property.
     *
     * @return the value
     */
    public int getValue() {
        return getPropertyInteger("value");
    }

    /**
     * Gets the max property.
     *
     * @return the max value
     */
    public int getMax() {
        return getPropertyInteger("max");
    }

    /**
     * Gets whether the badge is pulsing.
     *
     * @return true if pulsing
     */
    public boolean isPulsing() {
        return getPropertyBoolean("pulse");
    }

    /**
     * Gets whether the badge is hidden.
     *
     * @return true if hidden
     */
    public boolean isHidden() {
        return getPropertyBoolean("hidden");
    }

    /**
     * Gets the color index.
     *
     * @return the color index
     */
    public int getColorIndex() {
        String color = getAttribute("color");
        return color != null ? Integer.parseInt(color) : 0;
    }

    /**
     * Gets the aria-label attribute.
     *
     * @return the aria-label value
     */
    public String getAriaLabel() {
        return getAttribute("aria-label");
    }
}
```

### Testing Strategy

#### Unit Tests

```java
package com.vaadin.flow.component.badge;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class BadgeTest {

    @Test
    public void defaultConstructor_emptyBadge() {
        Badge badge = new Badge();
        assertEquals("", badge.getText());
    }

    @Test
    public void constructorWithText_badgeHasText() {
        Badge badge = new Badge("Test");
        assertEquals("Test", badge.getText());
    }

    @Test
    public void constructorWithTextAndVariants_badgeHasTextAndVariants() {
        Badge badge = new Badge("Test", BadgeVariant.PRIMARY, BadgeVariant.SMALL);

        assertEquals("Test", badge.getText());
        assertTrue(badge.getThemeNames().contains("primary"));
        assertTrue(badge.getThemeNames().contains("small"));
    }

    @Test
    public void addThemeVariants_variantsAdded() {
        Badge badge = new Badge();
        badge.addThemeVariants(BadgeVariant.SUCCESS, BadgeVariant.PILL);

        assertTrue(badge.getThemeNames().contains("success"));
        assertTrue(badge.getThemeNames().contains("pill"));
    }

    @Test
    public void removeThemeVariants_variantsRemoved() {
        Badge badge = new Badge();
        badge.addThemeVariants(BadgeVariant.SUCCESS, BadgeVariant.PILL);
        badge.removeThemeVariants(BadgeVariant.SUCCESS);

        assertFalse(badge.getThemeNames().contains("success"));
        assertTrue(badge.getThemeNames().contains("pill"));
    }

    @Test
    public void setText_textIsSet() {
        Badge badge = new Badge();
        badge.setText("New Text");
        assertEquals("New Text", badge.getText());
    }

    @Test
    public void setAriaLabel_ariaLabelIsSet() {
        Badge badge = new Badge();
        badge.setAriaLabel("Status indicator");
        assertEquals("Status indicator", badge.getAriaLabel());
    }

    @Test
    public void setValue_valueIsSet() {
        Badge badge = new Badge();
        badge.setValue(5);
        assertEquals(5, badge.getValue());
    }

    @Test
    public void setMax_maxIsSet() {
        Badge badge = new Badge();
        badge.setMax(99);
        assertEquals(99, badge.getMax());
    }

    @Test
    public void setColor_validColor_colorIsSet() {
        Badge badge = new Badge();
        badge.setColor(3);
        assertEquals(3, badge.getColor());
    }

    @Test
    public void setColor_invalidColor_throwsException() {
        Badge badge = new Badge();
        assertThrows(IllegalArgumentException.class, () -> badge.setColor(0));
        assertThrows(IllegalArgumentException.class, () -> badge.setColor(8));
    }

    @Test
    public void setPulse_pulseIsSet() {
        Badge badge = new Badge();
        badge.setPulse(true);
        assertTrue(badge.isPulse());
    }

    @Test
    public void setHidden_hiddenIsSet() {
        Badge badge = new Badge();
        badge.setHidden(true);
        assertTrue(badge.isHidden());
    }

    @Test
    public void addComponentAsFirst_componentInPrefixSlot() {
        Badge badge = new Badge("Test");
        Icon icon = VaadinIcon.CHECK.create();
        badge.addComponentAsFirst(icon);

        assertEquals("prefix", icon.getElement().getAttribute("slot"));
    }

    @Test
    public void addComponentAtEnd_componentInSuffixSlot() {
        Badge badge = new Badge("Test");
        Icon icon = VaadinIcon.CLOSE_SMALL.create();
        badge.addComponentAtEnd(icon);

        assertEquals("suffix", icon.getElement().getAttribute("slot"));
    }
}
```

#### Integration Tests

```java
package com.vaadin.flow.component.badge;

import com.vaadin.flow.component.badge.testbench.BadgeElement;
import com.vaadin.testbench.parallel.BrowserTest;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class BadgeIT extends AbstractParallelTest {

    @Test
    public void badge_rendersWithText() {
        BadgeElement badge = $(BadgeElement.class).first();
        assertEquals("Test Badge", badge.getText());
    }

    @Test
    public void badge_hasThemeVariant() {
        BadgeElement badge = $(BadgeElement.class).id("primary-badge");
        assertTrue(badge.hasThemeVariant("primary"));
    }

    @Test
    public void badge_displaysValue() {
        BadgeElement badge = $(BadgeElement.class).id("count-badge");
        assertEquals(5, badge.getValue());
    }

    @Test
    public void badge_displaysMaxPlus() {
        BadgeElement badge = $(BadgeElement.class).id("max-badge");
        assertEquals(99, badge.getMax());
        assertEquals(150, badge.getValue());
        // The component should display "99+"
    }

    @Test
    public void badge_pulses() {
        BadgeElement badge = $(BadgeElement.class).id("pulse-badge");
        assertTrue(badge.isPulsing());
    }

    @Test
    public void badge_hasColor() {
        BadgeElement badge = $(BadgeElement.class).id("colored-badge");
        assertEquals(3, badge.getColorIndex());
    }

    @Test
    public void badge_hasAriaLabel() {
        BadgeElement badge = $(BadgeElement.class).id("dot-badge");
        assertEquals("Online", badge.getAriaLabel());
    }
}
```

### Demo Application

```java
package com.vaadin.flow.component.badge.demo;

import com.vaadin.flow.component.badge.Badge;
import com.vaadin.flow.component.badge.BadgeVariant;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route("badge")
public class BadgeView extends VerticalLayout {

    public BadgeView() {
        add(createBasicExample());
        add(createThemeVariantsExample());
        add(createSizeExample());
        add(createWithIconsExample());
        add(createNotificationExample());
        add(createTagListExample());
    }

    private Div createBasicExample() {
        Div container = new Div();
        container.add(new H3("Basic Badge"));

        HorizontalLayout badges = new HorizontalLayout();
        badges.add(new Badge("New"));
        badges.add(new Badge("Featured"));
        badges.add(new Badge("Popular"));

        container.add(badges);
        return container;
    }

    private Div createThemeVariantsExample() {
        Div container = new Div();
        container.add(new H3("Theme Variants"));

        HorizontalLayout badges = new HorizontalLayout();

        Badge primary = new Badge("Primary");
        primary.addThemeVariants(BadgeVariant.PRIMARY);

        Badge success = new Badge("Success");
        success.addThemeVariants(BadgeVariant.SUCCESS);

        Badge error = new Badge("Error");
        error.addThemeVariants(BadgeVariant.ERROR);

        Badge warning = new Badge("Warning");
        warning.addThemeVariants(BadgeVariant.WARNING);

        Badge contrast = new Badge("Contrast");
        contrast.addThemeVariants(BadgeVariant.CONTRAST);

        badges.add(primary, success, error, warning, contrast);

        container.add(badges);
        return container;
    }

    private Div createSizeExample() {
        Div container = new Div();
        container.add(new H3("Sizes"));

        HorizontalLayout badges = new HorizontalLayout();
        badges.setAlignItems(Alignment.CENTER);

        Badge defaultBadge = new Badge("Default");
        defaultBadge.addThemeVariants(BadgeVariant.PRIMARY);

        Badge smallBadge = new Badge("Small");
        smallBadge.addThemeVariants(BadgeVariant.PRIMARY, BadgeVariant.SMALL);

        Badge pillBadge = new Badge("Pill");
        pillBadge.addThemeVariants(BadgeVariant.PRIMARY, BadgeVariant.PILL);

        badges.add(defaultBadge, smallBadge, pillBadge);

        container.add(badges);
        return container;
    }

    private Div createWithIconsExample() {
        Div container = new Div();
        container.add(new H3("With Icons"));

        Badge verifiedBadge = new Badge("Verified");
        verifiedBadge.addThemeVariants(BadgeVariant.SUCCESS);
        Icon checkIcon = VaadinIcon.CHECK.create();
        verifiedBadge.addComponentAsFirst(checkIcon);

        Badge errorBadge = new Badge("Error");
        errorBadge.addThemeVariants(BadgeVariant.ERROR);
        Icon exclamationIcon = VaadinIcon.EXCLAMATION.create();
        errorBadge.addComponentAtEnd(exclamationIcon);

        container.add(new HorizontalLayout(verifiedBadge, errorBadge));
        return container;
    }

    private Div createNotificationExample() {
        Div container = new Div();
        container.add(new H3("Notification Badge"));

        NotificationButton notificationButton = new NotificationButton();
        notificationButton.setNotificationCount(5);

        Button incrementButton = new Button("Add Notification",
            e -> notificationButton.incrementCount());

        Button clearButton = new Button("Clear",
            e -> notificationButton.clearNotifications());

        container.add(new HorizontalLayout(
            notificationButton,
            incrementButton,
            clearButton
        ));

        return container;
    }

    private Div createTagListExample() {
        Div container = new Div();
        container.add(new H3("Tag List"));

        TagList tagList = new TagList("JavaScript", "TypeScript", "Java");

        TextField newTagField = new TextField();
        newTagField.setPlaceholder("Enter tag name");

        Button addButton = new Button("Add Tag", e -> {
            String tag = newTagField.getValue();
            if (!tag.isEmpty()) {
                tagList.addTag(tag);
                newTagField.clear();
            }
        });

        container.add(tagList);
        container.add(new HorizontalLayout(newTagField, addButton));

        return container;
    }
}
```

## Documentation Plan

### JavaDoc Documentation

All public APIs will have comprehensive JavaDoc:

```java
/**
 * Server-side component for the {@code <vaadin-badge>} web component.
 * <p>
 * Badge is a small visual indicator used to draw attention, display statuses,
 * counts, or labels. It provides a clean, accessible way to highlight
 * information without cluttering the interface.
 *
 * <h3>Basic Usage</h3>
 * <pre>
 * Badge badge = new Badge("New");
 * badge.addThemeVariants(BadgeVariant.PRIMARY);
 * </pre>
 *
 * <h3>Status Indicators</h3>
 * <pre>
 * Badge activeBadge = new Badge("Active");
 * activeBadge.addThemeVariants(BadgeVariant.SUCCESS, BadgeVariant.SMALL);
 * </pre>
 *
 * <h3>With Icons</h3>
 * <pre>
 * Badge verifiedBadge = new Badge("Verified");
 * Icon checkIcon = VaadinIcon.CHECK.create();
 * verifiedBadge.addComponentAsFirst(checkIcon);
 * </pre>
 *
 * <h3>Notification Counts</h3>
 * <pre>
 * Badge notificationBadge = new Badge();
 * notificationBadge.setValue(5);
 * notificationBadge.setMax(99);
 * notificationBadge.addThemeVariants(BadgeVariant.ERROR);
 * </pre>
 *
 * @see BadgeVariant
 * @see HasTheme
 * @author Vaadin Ltd
 * @since 25.0
 */
```

### User Documentation

**Location**: `vaadin.com/docs/latest/components/badge`

#### Overview Page

Content:
- What is a Badge component
- When to use Badge
- Comparison with existing badge styles
- Basic usage examples
- Live demo
- Accessibility considerations

#### Usage Guide

Content sections:
1. **Basic Usage** - Simple text badges
2. **Theme Variants** - Color and style variants
3. **Size and Shape** - Small and pill variants
4. **With Icons** - Adding icons before/after text
5. **Tags and Labels** - Category tags and removable tags
6. **Status Indicators** - Online/offline status, dot variant
7. **Notification Badges** - Count badges on buttons/icons
8. **In Grid Columns** - Using badges in data displays

#### Styling Guide

Content:
- Theme variants
- Custom CSS properties
- Styling examples

#### API Reference

Generated from JavaDoc with additional examples.

#### Best Practices

Content:
- When to use Badge
- Label guidelines
- Accessibility tips
- Performance considerations

## Comparison with Existing Lumo Badge Styles

| Aspect | Current (Span with theme) | New Component |
|--------|--------------------------|---------------|
| **Usage** | `Span span = new Span("Text");`<br/>`span.getElement().getThemeList().add("badge");` | `Badge badge = new Badge("Text");` |
| **Type Safety** | Manual theme string management | Type-safe enum variants |
| **API** | Generic span methods | Badge-specific API |
| **Icon Support** | Manual element manipulation | Built-in prefix/suffix methods |
| **Notification Badge** | Not supported | Supported (Phase 2) |
| **Documentation** | Limited | Comprehensive |

## Migration from Lumo Badge Styles

Users currently using theme-based badges can migrate easily:

**Before**:
```java
Span badge = new Span("New");
badge.getElement().getThemeList().add("badge");
badge.getElement().getThemeList().add("primary");
```

**After**:
```java
Badge badge = new Badge("New");
badge.addThemeVariants(BadgeVariant.PRIMARY);
```

Or even simpler:
```java
Badge badge = new Badge("New", BadgeVariant.PRIMARY);
```

## Release Strategy

### Phase 1: Core Features (v1.0.0)

**Target**: Initial stable release aligned with web component v1.0.0

**Features**:
- Basic Badge component
- Text content
- Theme variants (primary, success, error, warning, contrast, small, pill)
- Icon slots (prefix, suffix)
- ARIA attributes
- TestBench element
- JavaDoc documentation
- Demo application

### Phase 2: Enhanced Features (v1.1.0)

**Target**: 2-3 months after v1.0.0

**Features**:
- Value and max properties
- Color palette support
- Pulse animation
- Hidden state
- Dot variant
- Info and neutral variants

### Phase 3: Advanced Features (v1.2.0)

**Target**: 4-6 months after v1.1.0

**Features**:
- ShowZero support
- Advanced notification badge features

## Dependencies

### Maven Dependencies

```xml
<dependency>
    <groupId>com.vaadin</groupId>
    <artifactId>vaadin-badge-flow</artifactId>
    <version>25.0.0</version>
</dependency>
```

### Build Configuration

```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>com.vaadin</groupId>
        <artifactId>flow-server</artifactId>
        <version>${flow.version}</version>
    </dependency>

    <!-- Test dependencies -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>com.vaadin</groupId>
        <artifactId>vaadin-testbench</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## Success Criteria

The Flow integration will be considered successful when:

1. ✅ Full feature parity with web component
2. ✅ Type-safe Java API
3. ✅ Comprehensive JavaDoc coverage
4. ✅ Unit test coverage > 90%
5. ✅ Integration tests covering all features
6. ✅ Demo application showcasing all features
7. ✅ Documentation published on vaadin.com
8. ✅ Positive developer feedback
9. ✅ Easy migration path from theme-based badges
10. ✅ No critical bugs in first 3 months

## Conclusion

This specification provides a comprehensive plan for integrating the Badge web component into Vaadin Flow. The Java API will provide a type-safe, idiomatic way to use the Badge component in server-side Vaadin applications, with a clear improvement over the current theme-based approach. The phased approach ensures a solid foundation while allowing for future enhancements.
