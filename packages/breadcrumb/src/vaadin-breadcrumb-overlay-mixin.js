/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * `BreadcrumbOverlayMixin` carries any breadcrumb-specific overlay tweaks on
 * top of `OverlayMixin`. It mirrors the `OverlayMixin` + component-specific
 * mixin pairing used by other Vaadin overlays (`<vaadin-combo-box-overlay>`
 * pairs `OverlayMixin` with `ComboBoxOverlayMixin`, `<vaadin-menu-bar-overlay>`
 * pairs it with `MenuOverlayMixin`, and so on).
 *
 * The mixin currently has no behavior of its own — the breadcrumb overflow
 * overlay needs nothing beyond what `OverlayMixin` already provides. The mixin
 * exists as a dedicated extension point so future breadcrumb-specific overlay
 * concerns (theme-attribute propagation, position adjustments, close-behavior
 * tweaks, etc.) can be added here without changing the host element.
 *
 * @polymerMixin
 */
export const BreadcrumbOverlayMixin = (superClass) => class BreadcrumbOverlayMixinClass extends superClass {};
